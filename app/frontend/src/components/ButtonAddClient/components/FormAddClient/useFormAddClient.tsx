import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { handleAddClient } from '@/actions/handleAddClient'
import { zodResolver } from '@hookform/resolvers/zod'

export function formAddClient(hasToken: boolean) {
  return z.object({
    name: z.string().min(3),
    phoneNumber: hasToken
      ? z
          .string({
            description: 'Whatsapp deve ter 11 números',
          })
          .optional()
          .refine((data) => {
            if (!data) return true
            return data.length === 11
          })
      : z
          .string()
          .min(11, 'Whatsapp deva ter no mínimo 11 números')
          .max(11, 'Whatsapp deva ter no máximo 11 números'),
  })
}

type FormAddClientProps = {
  hasToken: boolean
  onSuccessForm: (data: {
    qr_code_base64: string
    qr_code: string
    url_payment: string
  }) => void
}

export default function useFormAddClient(props: FormAddClientProps) {
  const { hasToken, onSuccessForm } = props
  const formAddClientSchema = formAddClient(hasToken)

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
      onSuccessForm(data)
    })
  })

  return {
    onSubmit,
    register,
    errors,
  }
}
