import { AxiosError } from 'axios'
import { useState } from 'react'

import { ModeToggle } from './components/mode-toggle'
import SheetAddCustomer, { FormSchema } from './components/SheetAddCustomer'
import SheetLogin, { LoginFormSchema } from './components/SheetLogin'
import TableQueue, { Customer } from './components/TableQueue'
import * as Card from './components/ui/card'
import { Switch } from './components/ui/switch'
import { Toaster } from './components/ui/toaster'
import { useToast } from './components/ui/use-toast'
import useFetch from './hooks/useFetch'
import { api } from './lib/api'

function App() {
  const { data: customers, refreshData } = useFetch<Customer[]>({
    url: '/queue/today',
  })
  const { data: open, refreshData: refreshOpen } = useFetch<{
    isOpen: boolean
  }>({
    url: '/open',
  })

  const isOpen = open?.isOpen || false

  const [token, setToken] = useState<string>(
    localStorage.getItem('token') || '',
  )

  const { toast } = useToast()

  const nextCustomer = customers?.find(
    (customer) => customer.status === 'WAITING',
  )

  const handleSubmit = async (data: FormSchema) => {
    try {
      await api.post('/queue', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast({
        title: 'Cliente adicionado com sucesso',
        variant: 'default',
        duration: 2000,
      })
      refreshData()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao adicionar cliente',
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  const handleLogin = async (data: LoginFormSchema) => {
    try {
      const { data: response } = await api.post('/login', data)
      localStorage.setItem('token', response.token)
      setToken(response.token)

      toast({
        title: 'Cliente adicionado com sucesso',
        variant: 'default',
        duration: 2000,
      })
      refreshData()
      refreshOpen()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao adicionar cliente',
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  const handleOpen = async () => {
    try {
      const { data: response } = await api.post(
        '/open',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log('🚀 ~ file: App.tsx:98 ~ handleOpen ~ response:', response)

      toast({
        title: `${response.isOpen.isOpen ? 'Aberto' : 'Fechado'} com sucesso`,
        variant: 'default',
        duration: 2000,
      })
      refreshOpen()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao adicionar cliente',
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.post(
        `/queue/${id}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      refreshData()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao adicionar cliente',
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  return (
    <main className="flex flex-col h-screen p-5 items-center gap-4">
      <div className="flex flex-row-reverse justify-between items-center w-full">
        <ModeToggle />
        {token && <Switch onClick={handleOpen} checked={isOpen} />}
        {!token && <SheetLogin onSubmit={handleLogin} isOpen={isOpen} />}
        <SheetAddCustomer onSubmit={handleSubmit} />
      </div>

      {nextCustomer && (
        <Card.Card className="flex justify-center items-center p-4 gap-3">
          <Card.CardHeader className="p-0">
            <Card.CardTitle>Proximo:</Card.CardTitle>
          </Card.CardHeader>
          <Card.CardContent className="p-0">
            <p> {nextCustomer.name}</p>
          </Card.CardContent>
        </Card.Card>
      )}

      <TableQueue customers={customers} onStatusChange={handleUpdateStatus} />
      <Toaster />
    </main>
  )
}

export default App
