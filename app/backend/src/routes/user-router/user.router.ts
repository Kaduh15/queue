import { Router } from 'express'

import bodyValidation from '@/middlewares/body-validation.middleware'
import { UserPrismaRepository } from '@/repositories/user-repository/user-prisma.repository'
import { createUserSchema } from '@/schemas/user-create.schema'

import { UserController } from './user.controller'
import { UserService } from './user.service'

export const userRepository = new UserPrismaRepository()

const userService = new UserService(userRepository)

const userController = new UserController(userService)

const userRouter = Router()

userRouter.get('/', userController.getAll)
userRouter.post('/', bodyValidation(createUserSchema), userController.create)

export { userRouter }
