import { Router } from 'express'

import bodyValidation from '@/middlewares/body-validation.middleware'
import { UserPrismaRepository } from '@/repositories/user-repository/user-prisma.repository'

import { AuthController } from '../../controllers/auth.controller'
import { authLoginSchema } from '../../schemas/auth-login.schema'
import { AuthService } from '../../services/auth.service'

const userRepository = new UserPrismaRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

const authRouter = Router()

authRouter.post('/', bodyValidation(authLoginSchema), authController.login)

export { authRouter }
