import { Request, Response } from 'express'
import Sinon from 'sinon'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserRepositoryInMemory } from '@/repositories/user-repository/user-in-memory.repository'

import { AuthLoginSchema } from '../../schemas/auth-login.schema'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  const userRepository = new UserRepositoryInMemory()

  const authService = new AuthService(userRepository)

  const authController = new AuthController(authService)

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  it('should be an instance of authController', () => {
    expect(authController).toBeInstanceOf(AuthController)
  })

  describe('Method - login', async () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('should return token', async () => {
      const loginInput: AuthLoginSchema = {
        email: 'any_email',
        password: 'any_password',
      }

      userRepository.create({
        email: loginInput.email,
        name: 'any name',
        password: loginInput.password,
      })

      const req = {
        body: loginInput,
      } as Request

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response

      Sinon.stub(authService, 'login').resolves({
        token: 'token',
      })

      await authController.login(req, res)

      expect(res.json).toBeCalled()
      expect(res.json).toBeCalledWith({ token: 'token' })

      expect(res.status).toBeCalled()
      expect(res.status).toBeCalledWith(200)
    })
  })
})
