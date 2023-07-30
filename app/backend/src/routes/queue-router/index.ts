import { Router } from 'express'

import authMiddleware from '@/middlewares/auth.middleware'
import bodyValidation from '@/middlewares/body-validation.middleware'
import { QueuePrismaRepository } from '@/repositories/queue-repository/queue-prisma.repository'

import { QueueController } from './queue.controller'
import { QueueService } from './queue.service'
import { createQueueSchema } from './schemas/queue-create.schema'

export const queueRepository = new QueuePrismaRepository()

const queueService = new QueueService(queueRepository)

const queueController = new QueueController(queueService)

const queueRouter = Router()

queueRouter.post(
  '/',
  authMiddleware('ADMIN'),
  bodyValidation(createQueueSchema),
  queueController.create,
)
queueRouter.get('/today', queueController.getToday)

export { queueRouter }
