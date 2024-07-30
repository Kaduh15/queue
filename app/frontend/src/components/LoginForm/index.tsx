'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { handleSingIn } from '@/actions/handleSingIn'
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'

const loginFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type LoginForm = z.infer<typeof loginFormSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = handleSubmit((data) =>
    handleSingIn(JSON.stringify(data)).catch(() => {
      setError('password', {
        type: 'manual',
        message: 'Email ou senha inválidos',
      })
    }),
  )

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Label className="flex flex-col gap-4 text-xl" htmlFor="email">
        Email
        <Input {...register('email')} type="email" />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </Label>
      <Label className="flex flex-col gap-4 text-xl" htmlFor="password">
        Senha
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </Label>
      <Label className="flex gap-4" htmlFor="showPassword">
        <Checkbox
          value={showPassword ? '1' : '0'}
          onClick={() => setShowPassword((prev) => !prev)}
          id="showPassword"
        />
        Mostrar senha
      </Label>
      <Button type="submit">Entrar</Button>
    </form>
  )
}
