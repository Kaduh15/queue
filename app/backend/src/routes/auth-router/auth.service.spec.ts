import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Encrypt } from '@/lib/bcryptjs'
import { Auth } from '@/lib/jsonwebtoken'
import { UserRepositoryInMemory } from '@/repositories/user-repository/user-in-memory.repository'
import { NotFoundError, UnauthorizedError } from '@/utils/http-errors'

import { AuthService } from './auth.service'
import { AuthLoginSchema } from './schemas/auth-login.schema'

describe('AuthService', () => {
  const userRepository = new UserRepositoryInMemory()

  const authService = new AuthService(userRepository)

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should be an instance of authService', () => {
    expect(authService).toBeInstanceOf(AuthService)
  })

  describe('login', async () => {
    beforeEach(() => {
      vi.fn().mockClear()
    })

    it('should return a token if email and password are correct', async () => {
      const loginInput: AuthLoginSchema = {
        email: 'any_email',
        password: 'any_password',
      }
      userRepository.create({
        email: loginInput.email,
        name: 'any name',
        password: loginInput.password,
      })

      Encrypt.compare = vi.fn().mockReturnValue(true)
      Auth.sign = vi.fn().mockReturnValue('token')

      const token = await authService.login(loginInput)

      expect(token).toBeDefined()
      expect(token).toHaveProperty('token')

      expect(token).to.be.deep.equal({ token: 'token' })
    })

    it('should throw an error if email is not found', async () => {
      const promise = authService.login({
        email: 'any_email_invalid',
        password: 'any_password',
      })

      await expect(promise).rejects.toThrowError(NotFoundError)
    })

    it('should throw an error if password is invalid', async () => {
      Encrypt.compare = vi.fn().mockReturnValue(false)

      const promise = authService.login({
        email: 'any_email',
        password: 'any_password',
      })

      await expect(promise).rejects.toThrowError(UnauthorizedError)
    })
  })
})
