import { Router } from 'express'

import authMiddleware from '@/middlewares/auth.middleware'
import prisma from '@/prisma/prisma-client'

import { OpenController } from './open.controller'
import { OpenService } from './open.service'

const openService = new OpenService({ prisma })
const openController = new OpenController(openService)

const openRouter = Router()

openRouter.post('/', authMiddleware('ADMIN'), openController.toggle)

openRouter.get('/', openController.get)

export { openRouter }
