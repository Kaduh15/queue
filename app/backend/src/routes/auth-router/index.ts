import { Router } from 'express'

import { Auth } from '@/lib/jsonwebtoken'
import bodyValidation from '@/middlewares/body-validation.middleware'
import prisma from '@/prisma/prisma-client'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { authLoginSchema } from './schemas/auth-login.schema'

const authService = new AuthService({ prisma })
const authController = new AuthController(authService)

const authRouter = Router()

authRouter.post('/', bodyValidation(authLoginSchema), authController.login)

export { authRouter }
