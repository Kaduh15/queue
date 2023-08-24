import { AxiosError } from 'axios'

import { ModeToggle } from '@/components/mode-toggle'
import SheetAddCustomer, { FormSchema } from '@/components/SheetAddCustomer'
import SheetLogin, { LoginFormSchema } from '@/components/SheetLogin'
import TableQueue, { Customer } from '@/components/TableQueue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import useFetch from '@/hooks/useFetch'
import { api, apiWhatsapp } from '@/lib/api'
import useAuthStore from '@/store/authStore'

type Open = {
  isOpen: boolean
}

export default function Home() {
  const {
    data: customers,
    refreshData,
    optimistic,
  } = useFetch<Customer[]>({
    url: '/queue/today',
    initialData: [],
  })
  const {
    data: open,
    refreshData: refreshOpen,
    optimistic: optimisticOpen,
  } = useFetch<Open>({
    url: '/open',
    initialData: {
      isOpen: false,
    },
  })

  const isOpen = open.isOpen || false

  const [token, setToken] = useAuthStore((store) => [
    store.store.token,
    store.actions().setToken,
  ])

  const { toast } = useToast()

  const nextCustomer = customers?.find(
    (customer) => customer.status === 'WAITING',
  )

  const handleSendMessages = async (phone: string, text: string) => {
    try {
      const { data } = await apiWhatsapp.get(`/login`)

      if (!data.connected) {
        toast({
          title: 'Whatsapp não está conectado',
          variant: 'destructive',
          duration: 2000,
        })
        return
      }
      await apiWhatsapp.get(`/send?phone=${phone}&text=${text}`)
      toast({
        title: 'Mensagem enviada com sucesso',
        variant: 'default',
        duration: 2000,
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao enviar mensagem para o cliente',
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  const handleSubmit = async (data: FormSchema) => {
    try {
      const response = await api.post<Customer>('/queue', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const newCustomers = [...(customers || []), response.data]
      optimistic(newCustomers)

      toast({
        title: 'Cliente adicionado com sucesso',
        variant: 'default',
        duration: 2000,
      })
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
    const response = isOpen ? 'fechar' : 'abrir'

    try {
      const { data: response } = await api.post<Open>(
        '/open',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      optimisticOpen(response)

      toast({
        title: `${response.isOpen ? 'Aberto' : 'Fechado'} com sucesso`,
        variant: 'default',
        duration: 2000,
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: `Erro ao ${response} cliente`,
          variant: 'destructive',
          duration: 2000,
        })
      }
    }
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const { data } = await api.post(
        `/queue/${id}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      let next = -1

      const newCustomers = customers?.map((customer, index) => {
        if (customer.id === id) {
          next = index + 1

          return {
            ...customer,
            status: data.status,
          }
        }
        return customer
      })
      optimistic(newCustomers)

      const nextCustomer = newCustomers[next]
      if (!nextCustomer) return

      if (nextCustomer && nextCustomer.phoneNumber && status === 'DONE') {
        await handleSendMessages(
          nextCustomer.phoneNumber,
          `${nextCustomer.name} você é o próximo!`,
        )
        return
      }

      if (nextCustomer && !nextCustomer.phoneNumber) {
        toast({
          title: 'Cliente não possui telefone',
          variant: 'default',
          duration: 2000,
        })
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: 'Erro ao atualizar o status do cliente',
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
        {token && <SheetAddCustomer onSubmit={handleSubmit} />}
      </div>

      {nextCustomer && (
        <Card className="flex justify-center items-center p-4 gap-3">
          <CardHeader className="p-0">
            <CardTitle>Proximo:</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p> {nextCustomer.name}</p>
          </CardContent>
        </Card>
      )}

      {!token && (
        <>
          <Button onClick={refreshData}>Atualizar</Button>
        </>
      )}

      <TableQueue customers={customers} onStatusChange={handleUpdateStatus} />
      <Toaster />
    </main>
  )
}
