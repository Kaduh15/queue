import { Router } from 'express'

import bodyValidation from '@/middlewares/body-validation.middleware'
import { QueuePrismaRepository } from '@/repositories/queue-repository/queue-prisma.repository'

import { QueueController } from './queue.controller'
import { QueueService } from './queue.service'
import { createQueueSchema } from './schemas/queue-create.schema'

const queueRepository = new QueuePrismaRepository()

const queueService = new QueueService(queueRepository)

const queueController = new QueueController(queueService)

const queueRouter = Router()

queueRouter.post('/', bodyValidation(createQueueSchema), queueController.create)
queueRouter.get('/', queueController.getToday)

export { queueRouter }
