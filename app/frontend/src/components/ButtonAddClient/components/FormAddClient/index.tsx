'use client'

import { Input } from '../../../ui/input'
import { Label } from '../../../ui/label'
import { Button } from '../../../ui/button'
import useFormAddClient from './useFormAddClient'

type FormAddClientProps = {
  hasToken: boolean
  onSuccessForm: (data: {
    qr_code_base64: string
    qr_code: string
    url_payment: string
  }) => void
}

export default function FormAddClient(props: FormAddClientProps) {
  const { hasToken, onSuccessForm } = props
  const { errors, onSubmit, register } = useFormAddClient({
    hasToken,
    onSuccessForm,
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Label className="flex flex-col gap-4 text-xl" htmlFor="Name">
        <p>
          Nome <span className="text-red-500">*</span>
        </p>
        <Input {...register('name')} type="text" />
      </Label>
      {errors.name && <span className="text-red-500">Nome é obrigatório</span>}
      <Label className="flex flex-col gap-4 text-xl" htmlFor="phoneNumber">
        <p>Whatsapp {!hasToken && <span className="text-red-500">*</span>}</p>
        <Input {...register('phoneNumber')} type="text" />
      </Label>
      {errors.phoneNumber && (
        <span className="text-red-500">Telefone é obrigatório</span>
      )}
      <Button type="submit">Entrar</Button>
    </form>
  )
}
