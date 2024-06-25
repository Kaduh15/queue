import { Router } from 'express'

import authMiddleware from '@/middlewares/auth.middleware'
import bodyValidation from '@/middlewares/body-validation.middleware'
import queryValidationMiddleware from '@/middlewares/query-validation.middleware copy'
import { QueuePrismaRepository } from '@/repositories/queue-repository/queue-prisma.repository'
import { queueNextClientQuerySchema } from '@/schemas/queue-next-client'
import { whatsappApi } from '@/utils/whatsapp-api'

import { createQueueSchema } from '../../schemas/queue-create.schema'
import { updateStatusQuerySchema } from '../../schemas/queue-query-update-status'
import { openRepository } from '../open-router'

import { QueueController } from './queue.controller'
import { QueueService } from './queue.service'

export const queueRepository = new QueuePrismaRepository()

const queueService = new QueueService(
  queueRepository,
  openRepository,
  whatsappApi,
)

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
  queryValidationMiddleware(updateStatusQuerySchema),
  authMiddleware('ADMIN'),
  queueController.updateStatus,
)

queueRouter.put(
  '/next',
  queryValidationMiddleware(queueNextClientQuerySchema),
  authMiddleware('ADMIN'),
  queueController.next,
)

queueRouter.get('/today', queueController.getToday)

export { queueRouter }
