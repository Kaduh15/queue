'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { handleSingIn } from '@/actions/handlerSingIn'
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginForm = z.infer<typeof loginFormSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = handleSubmit((data) => handleSingIn(JSON.stringify(data)))

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Label className="flex flex-col gap-4 text-xl" htmlFor="email">
        Email
        <Input {...register('email')} type="email" />
      </Label>
      <Label className="flex flex-col gap-4 text-xl" htmlFor="password">
        Senha
        <Input
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
        />
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
