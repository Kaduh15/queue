import { z } from 'zod'

export const createQueueSchema = z.object({
  name: z.string().min(3).max(255),
  phoneNumber: z.string().length(11).optional(),
})

export type CreateQueueSchema = z.infer<typeof createQueueSchema>
