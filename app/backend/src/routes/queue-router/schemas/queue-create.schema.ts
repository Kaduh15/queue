import { z } from 'zod'

export const createQueueSchema = z.object({
  name: z.string().min(3).max(255),
  phoneNumber: z.string().length(9),
})

export type CreateQueueSchema = z.infer<typeof createQueueSchema>
