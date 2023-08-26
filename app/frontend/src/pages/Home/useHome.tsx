import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { apiQueue } from '@/api/queue'
import { apiWhatsapp } from '@/api/whatsapp'

import { FormSchema } from '@/components/SheetAddCustomer'
import { LoginFormSchema } from '@/components/SheetLogin'
import { Customer } from '@/components/TableQueue'
import { useToast } from '@/components/ui/use-toast'

import useAuthStore from '@/store/authStore'

type Open = {
  isOpen: boolean
}

export default function useHome() {
  const { data: queue, refetch: refetchQueue } = useQuery({
    queryKey: ['queue'],
    queryFn: async () => {
      const { data } = await apiQueue.get<Customer[]>('/queue/today')
      return data
    },
    initialData: () => [],
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 2000,
  })

  const { data: open, refetch: refetchOpen } = useQuery({
    queryKey: ['open'],
    queryFn: async () => {
      const { data } = await apiQueue.get<Open>('/open')
      return data
    },
    initialData: () => ({ isOpen: false }),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: 2000,
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
      refetchOpen()
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

      refetchQueue()
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

      refetchQueue()

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

  return {
    handleLogin,
    handleSubmit,
    handleUpdateStatus,
    isOpen,
    mutationToggleOpen,
    nextCustomer,
    queue,
    refetchOpen,
    refetchQueue,
    token,
  }
}
