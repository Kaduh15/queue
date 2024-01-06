import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import bodyValidationMiddleware from '@/middlewares/body-validation.middleware'
import { OpenPrismaRepository } from '@/repositories/open-repository/open-prisma.repository'
import { QueuePrismaRepository } from '@/repositories/queue-repository/queue-prisma.repository'
import PaymentApi from '@/utils/payment'

import { PaymentController } from '../../controllers/payment.controller'
import { createPaymentSchema } from '../../schemas/create-payment.schema'
import { PaymentService } from '../../services/payment.service'

const queueRepository = new QueuePrismaRepository()
const openRepository = new OpenPrismaRepository()
const paymentApi = new PaymentApi()
const paymentService = new PaymentService(
  queueRepository,
  openRepository,
  paymentApi,
)
const paymentController = new PaymentController(paymentService)

const paymentRouter = Router()

paymentRouter.get('/health', (_req, res) => {
  return res.sendStatus(StatusCodes.OK)
})

paymentRouter.post(
  '/',
  bodyValidationMiddleware(createPaymentSchema),
  paymentController.create,
)

paymentRouter.post('/webhook', paymentController.webhook)

export { paymentRouter }
