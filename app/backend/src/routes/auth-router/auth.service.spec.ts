import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Encrypt } from '@/lib/bcryptjs'
import { Auth } from '@/lib/jsonwebtoken'
import { UserRepositoryInMemory } from '@/repositories/user-repository/user-in-memory.repository'

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

      Encrypt.compare = vi.fn().mockReturnValue(true)
      Auth.sign = vi.fn().mockReturnValue('token')

      const token = await authService.login(loginInput)

      expect(token).toBeDefined()
      expect(token).toHaveProperty('token')

      expect(token).to.be.deep.equal({ token: 'token' })
    })
  })
})
