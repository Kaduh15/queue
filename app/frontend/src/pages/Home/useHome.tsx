import { AxiosError } from 'axios'

import { apiQueue } from '@/api/queue'
import { apiWhatsapp } from '@/api/whatsapp'

import { useToast } from '@/components/ui/use-toast'

import useFetchOpen from '@/hooks/useFetchOpen'
import useFetchQueue from '@/hooks/useFetchQueue'
import useAuthStore from '@/store/authStore'

export type Open = {
  isOpen: boolean
}

export default function useHome() {
  const { data: queue, refetch: refetchQueue } = useFetchQueue()
  const { data: open, refetch: refetchOpen } = useFetchOpen()
  const [token] = useAuthStore((store) => [store.store.token])

  const { toast } = useToast()

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
      let sendIndex = -1

      refetchQueue()

      const newCustomers = queue?.map((customer, index) => {
        if (customer.id === id) {
          next = index + 1

          return {
            ...customer,
            status: data.status,
          }
        }

        if (index === next) {
          sendIndex = index + 1
          next = -1

          return {
            ...customer,
            status: 'IN_SERVICE',
          }
        }
        return customer
      })

      const nextCustomer = newCustomers[sendIndex]
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
    handleUpdateStatus,
    nextCustomer,
    open,
    queue,
    refetchOpen,
    refetchQueue,
    token,
  }
}
