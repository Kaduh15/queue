import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { apiQueue } from '@/api/queue'

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import useFetchOpen from '@/hooks/useFetchOpen'
import useFetchQueue from '@/hooks/useFetchQueue'
import { Open } from '@/pages/Home/useHome'
import useAuthStore from '@/store/authStore'

import { ModeToggle } from '../mode-toggle'
import OpenElement from '../Open'
import SheetAddCustomer, {
  FormSchema as FormLoginSchema,
} from '../SheetAddCustomer'
import SheetLogin, { LoginFormSchema } from '../SheetLogin'
import { Customer } from '../TableQueue'
import AutoForm, { AutoFormSubmit } from '../ui/auto-form'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Switch } from '../ui/switch'
import { useToast } from '../ui/use-toast'

const formSchema = z.object({
  name: z.string().nonempty(),
  phoneNumber: z.string().nonempty(),
})

export type FormSchema = z.infer<typeof formSchema>

export function Header() {
  const [paymentStatus, setPaymentStatus] = useState(false)
  const [qrCode64, setQrCode64] = useState('')
  const [qrCodeCopy, setQrCodeCopy] = useState('')
  const [, copy] = useCopyToClipboard()
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

  const handleSubmitLogin = async (data: FormLoginSchema) => {
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

  const handleSubmit = async (data: FormSchema) => {
    try {
      const response = await apiQueue.post('/payment', data)
      setQrCode64(response.data?.imagemQrcode)
      setQrCodeCopy(response.data?.qrcode)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response)
      }
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    apiQueue
      .get('/payment/health')
      .then(() => setPaymentStatus(true))
      .catch(() => setPaymentStatus(false))
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (qrCode64) {
      timeoutId = setTimeout(() => {
        setQrCode64('')
        clearTimeout(timeoutId)
      }, 1000 * 60)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [qrCode64])

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
      {!token && paymentStatus && open.isOpen && (
        <>
          <Dialog>
            <DialogTrigger>
              <Button className="text-white">Entrar na Fila</Button>
            </DialogTrigger>
            <DialogContent className="flex justify-center items-center">
              {qrCode64 && (
                <div className="w-[90vw] flex flex-col p-3 justify-center items-center gap-4">
                  <img src={qrCode64} alt="qrcode" className="w-3/4" />
                  <p className="break-words w-full border p-2">{qrCodeCopy}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      copy(qrCodeCopy)
                      toast({
                        title: 'QrCode Copiado com Sucesso!',
                        variant: 'default',
                        duration: 1000,
                      })
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              )}
              {!qrCode64 && (
                <AutoForm formSchema={formSchema} onSubmit={handleSubmit}>
                  <AutoFormSubmit />
                </AutoForm>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
      {!token && <OpenElement isOpen={isOpen} />}
      {token && <SheetAddCustomer onSubmit={handleSubmitLogin} />}
    </div>
  )
}
