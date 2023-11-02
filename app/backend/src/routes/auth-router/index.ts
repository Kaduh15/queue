import { Router } from 'express'

import bodyValidation from '@/middlewares/body-validation.middleware'
import { UserPrismaRepository } from '@/repositories/user-repository/user-prisma.repository'

import { AuthService } from '../../services/auth.service'

import { AuthController } from './auth.controller'
import { authLoginSchema } from './schemas/auth-login.schema'

const userRepository = new UserPrismaRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

const authRouter = Router()

authRouter.post('/', bodyValidation(authLoginSchema), authController.login)

export { authRouter }
