import { Router } from 'express'

import { UserController } from '@/controllers'
import bodyValidation from '@/middlewares/body-validation.middleware'
import prisma from '@/prisma/prisma-client'
import { UserService } from '@/services/user.service'

import { createUserSchema } from './schemas/user-create.schema'

const userService = new UserService(prisma)

const userController = new UserController(userService)

const usersRouter = Router()

usersRouter.post('/', bodyValidation(createUserSchema), userController.create)

export { usersRouter }
