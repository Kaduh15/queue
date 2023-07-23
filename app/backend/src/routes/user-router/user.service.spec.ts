import { describe, it, expect, vi } from 'vitest'

import prisma from '@/prisma/prisma-client'

import { CreateUserSchema } from './schemas/user-create.schema'
import { UserService } from './user.service'

describe('UserService', () => {
  const userService = new UserService(prisma)

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  it('should be an instance of UserService', () => {
    expect(userService).toBeInstanceOf(UserService)
  })

  describe('create', async () => {
    it('should create a user with success', async () => {
      const userInput: CreateUserSchema = {
        email: 'any@email.com',
        name: 'any name',
        password: 'any password',
        role: 'USER',
      }

      const userOutput = {
        id: 'any id',
        email: userInput.email,
        name: userInput.name,
        role: userInput.role,
      }

      prisma.user.findUnique = vi.fn().mockResolvedValue(null)
      prisma.user.create = vi.fn().mockResolvedValue(userOutput)

      const user = await userService.create(userInput)

      expect(user).toBeDefined()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('role')
      expect(user).not.toHaveProperty('password')

      expect(user).to.be.deep.equal(userOutput)
    })
  })
})
