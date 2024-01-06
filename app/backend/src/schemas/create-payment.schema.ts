import { z } from 'zod'

export const createPaymentSchema = z.object({
  name: z.string().min(3),
  phoneNumber: z.string().min(6),
  valor: z
    .string()
    .regex(/^(?!0\.00$)(?:[1-9]\d*|0)\.\d{2}$/)
    .optional()
    .default('10.00'),
})

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>
