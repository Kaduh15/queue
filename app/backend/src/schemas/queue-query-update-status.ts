import { z } from 'zod'

export const updateStatusQuerySchema = z.object({
  status: z.enum(['WAITING', 'ABSENT', 'DONE']),
})

export type updateStatusQuery = z.infer<typeof updateStatusQuerySchema>
