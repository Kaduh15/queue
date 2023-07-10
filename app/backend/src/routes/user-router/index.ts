import { Router } from 'express'

import bodyValidation from '@/middlewares/body-validation.middleware'
import prisma from '@/prisma/prisma-client'

import { createUserSchema } from './schemas/user-create.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'

const userService = new UserService(prisma)

const userController = new UserController(userService)

const usersRouter = Router()

usersRouter.post('/', bodyValidation(createUserSchema), userController.create)

export { usersRouter }
