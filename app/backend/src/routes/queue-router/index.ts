import { Router } from 'express'

import authMiddleware from '@/middlewares/auth.middleware'
import bodyValidation from '@/middlewares/body-validation.middleware'
import queryValidationMiddleware from '@/middlewares/query-validation.middleware copy'
import { QueuePrismaRepository } from '@/repositories/queue-repository/queue-prisma.repository'

import { QueueController } from '../../controllers/queue.controller'
import { createQueueSchema } from '../../schemas/queue-create.schema'
import { updateStatusQuerySchema } from '../../schemas/queue-query-update-status'
import { QueueService } from '../../services/queue.service'
import { openRepository } from '../open-router'

export const queueRepository = new QueuePrismaRepository()

const queueService = new QueueService(queueRepository, openRepository)

const queueController = new QueueController(queueService)

const queueRouter = Router()

queueRouter.post(
  '/',
  authMiddleware('ADMIN'),
  bodyValidation(createQueueSchema),
  queueController.create,
)
queueRouter.post(
  '/:id',
  authMiddleware('ADMIN'),
  queryValidationMiddleware(updateStatusQuerySchema),
  queueController.updateStatus,
)
queueRouter.get('/today', queueController.getToday)

export { queueRouter }
