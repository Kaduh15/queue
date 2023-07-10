import { z } from 'zod'

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type AuthLoginSchema = z.infer<typeof authLoginSchema>
