import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { apiQueue } from '@/api/queue'
import { apiWhatsapp } from '@/api/whatsapp'

import { ModeToggle } from '@/components/mode-toggle'
import SheetAddCustomer, { FormSchema } from '@/components/SheetAddCustomer'
import SheetLogin, { LoginFormSchema } from '@/components/SheetLogin'
import TableQueue, { Customer } from '@/components/TableQueue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'

import useAuthStore from '@/store/authStore'

type Open = {
  isOpen: boolean
}

export default function Home() {
  const { data: queue } = useQuery({
    queryKey: ['queue'],
    queryFn: async () => {
      const { data } = await apiQueue.get<Customer[]>('/queue/today')
      return data
    },
    initialData: () => [],
  })

  const { data: open, refetch } = useQuery({
    queryKey: ['open'],
    queryFn: async () => {
      const { data } = await apiQueue.get<Open>('/open')
      return data
    },
    initialData: () => ({ isOpen: false }),
  })

  const mutationToggleOpen = useMutation({
    mutationFn: async () => {
      const { data: response } = await apiQueue.post<Open>(
        '/open',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response
    },

    onSuccess: () => {
      toast({
        title: `${isOpen ? 'Fechado' : 'Aberto'} com sucesso`,
        variant: 'default',
        duration: 2000,
      })
      refetch()
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        console.log(err)
        toast({
          title: `Erro ao ${isOpen ? 'fechar' : 'abrir'} o atendimento`,
          variant: 'destructive',
          duration: 2000,
        })
      }
    },
  })

  const [token, setToken] = useAuthStore((store) => [
    store.store.token,
    store.actions().setToken,
  ])

  const { toast } = useToast()

  const isOpen = open.isOpen

  const nextCustomer = queue?.find((customer) => customer.status === 'WAITING')

  const handleSendMessages = async (phone: string, text: string) => {
    try {
      const { data } = await apiWhatsapp.get(`/is-connected`)

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
      await apiQueue.post<Customer>('/queue', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
      const { data: response } = await apiQueue.post('/login', data)
      setToken(response.token)

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

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const { data } = await apiQueue.post(
        `/queue/${id}?status=${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      let next = -1

      const newCustomers = queue?.map((customer, index) => {
        if (customer.id === id) {
          next = index + 1

          return {
            ...customer,
            status: data.status,
          }
        }
        return customer
      })

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
        {token && (
          <Switch
            onClick={() => mutationToggleOpen.mutate()}
            checked={isOpen}
          />
        )}
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

      {/* {!token && (
        <>
          <Button onClick={refreshData}>Atualizar</Button>
        </>
      )} */}

      <TableQueue customers={queue} onStatusChange={handleUpdateStatus} />
      <Toaster />
    </main>
  )
}
