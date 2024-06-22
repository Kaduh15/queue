import { Router } from 'express'

import authMiddleware from '@/middlewares/auth.middleware'
import { OpenPrismaRepository } from '@/repositories/open-repository/open-prisma.repository'

import { OpenController } from './open.controller'
import { OpenService } from './open.service'

export const openRepository = new OpenPrismaRepository()
const openService = new OpenService(openRepository)
const openController = new OpenController(openService)

const openRouter = Router()

openRouter.post('/', authMiddleware('ADMIN'), openController.toggle)

openRouter.get('/', openController.get)

export { openRouter }
