import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

import { apiQueue } from '@/api/queue'

import useFetchOpen from '@/hooks/useFetchOpen'
import useFetchQueue from '@/hooks/useFetchQueue'
import { Open } from '@/pages/Home/useHome'
import useAuthStore from '@/store/authStore'

import { ModeToggle } from '../mode-toggle'
import OpenElement from '../Open'
import SheetAddCustomer, { FormSchema } from '../SheetAddCustomer'
import SheetLogin, { LoginFormSchema } from '../SheetLogin'
import { Customer } from '../TableQueue'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Switch } from '../ui/switch'
import { useToast } from '../ui/use-toast'

export function Header() {
  const { refetch: refetchQueue } = useFetchQueue()
  const { data: open, refetch: refetchOpen } = useFetchOpen()

  const isOpen = open?.isOpen || false

  const [token, setToken, removeToken] = useAuthStore((store) => [
    store.store.token,
    store.actions().setToken,
    store.actions().removeToken,
  ])

  const { toast } = useToast()

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

  const handleLogout = () => {
    removeToken()
  }

  const navigate = useNavigate()

  return (
    <div className="flex flex-row-reverse justify-between items-center w-full">
      <Sheet>
        <SheetTrigger>
          <HamburgerMenuIcon />
        </SheetTrigger>
        <SheetContent className="flex justify-start items-center flex-col gap-4">
          {
            <>
              {!token && <SheetLogin onSubmit={handleLogin} />}
              {token && (
                <Button onClick={() => navigate('/config')}>Config</Button>
              )}
            </>
          }
          {token && (
            <>
              <div className="flex gap-4 justify-center items-center">
                <Switch
                  onClick={() => mutationToggleOpen.mutate()}
                  checked={isOpen}
                />
                <span>{isOpen ? 'Aberto' : 'fechado'}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </>
          )}
          <span className="flex-1 items-end flex">
            <ModeToggle />
          </span>
        </SheetContent>
      </Sheet>
      {!token && <OpenElement isOpen={isOpen} />}
      {token && <SheetAddCustomer onSubmit={handleSubmit} />}
    </div>
  )
}
