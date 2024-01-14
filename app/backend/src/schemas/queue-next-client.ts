import { z } from 'zod'

export const queueNextClientQuerySchema = z.object({
  status: z.enum(['ABSENT', 'DONE']),
})

export type queueNextClientQuery = z.infer<typeof queueNextClientQuerySchema>
