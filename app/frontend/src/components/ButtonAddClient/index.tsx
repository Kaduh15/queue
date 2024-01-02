'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { handleAddClient } from '@/actions/handleAddClient'
import Image from 'next/image'

export function formAddClient(hasToken: boolean) {
  return z.object({
    name: z.string().min(3),
    phoneNumber: hasToken ? z.string().optional() : z.string().min(11).max(11),
  })
}

type ButtonAddClientProps = {
  hasToken: boolean
}

export default function ButtonAddClient({
  hasToken: token,
}: ButtonAddClientProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [qrCode64, setQrCode64] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [urlPayment, setUrlPayment] = useState<string | null>(null)

  const formAddClientSchema = formAddClient(token)

  type FormAddClient = z.infer<typeof formAddClientSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormAddClient>({
    resolver: zodResolver(formAddClientSchema),
  })

  const onSubmit = handleSubmit((data) => {
    handleAddClient(
      JSON.stringify({
        name: data.name,
        phoneNumber: data.phoneNumber ? data.phoneNumber : undefined,
      }),
    ).then((data) => {
      if (data.qr_code_base64 && data.url_payment) {
        setQrCode64(data.qr_code_base64)
        setUrlPayment(data.url_payment)
        setQrCode(data.qr_code)
        return
      }
      setShowDialog(false)
    })
  })

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger>
        {token ? 'Adicionar Cliente' : 'Entrar na Fila'}
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center gap-5">
        <DialogHeader>
          {token ? 'Adicionar Cliente' : 'Entrar na Fila'}
        </DialogHeader>
        {qrCode64 && (
          <>
            <Image
              src={`data:image/png;charset=utf-8;base64,${qrCode64}`}
              alt="imagem do qr code de pagamento"
              width={200}
              height={200}
              className="mx-auto aspect-square w-3/4"
            />
            <a href={urlPayment as string}>link de pagamento</a>
            ou
            <Button
              onClick={() => navigator.clipboard.writeText(qrCode as string)}
            >
              Copiar QR Code
            </Button>
          </>
        )}
        {!qrCode64 && (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Label className="flex flex-col gap-4 text-xl" htmlFor="Name">
              <p>
                Nome <span className="text-red-500">*</span>
              </p>
              <Input {...register('name')} type="text" />
            </Label>
            {errors.name && (
              <span className="text-red-500">Nome é obrigatório</span>
            )}
            <Label
              className="flex flex-col gap-4 text-xl"
              htmlFor="phoneNumber"
            >
              <p>
                Whatsapp {!token && <span className="text-red-500">*</span>}
              </p>
              <Input {...register('phoneNumber')} type="text" />
            </Label>
            {errors.phoneNumber && (
              <span className="text-red-500">Telefone é obrigatório</span>
            )}
            <Button type="submit">Entrar</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
