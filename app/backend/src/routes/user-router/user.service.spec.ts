import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import User from '@/entities/user.entity'
import { UserRepositoryInMemory } from '@/repositories/user-repository/user-in-memory.repository'

import { CreateUserSchema } from './schemas/user-create.schema'
import { UserService } from './user.service'

describe('UserService', () => {
  const userRepository = new UserRepositoryInMemory()

  const userService = new UserService(userRepository)

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  it('should be an instance of UserService', () => {
    expect(userService).toBeInstanceOf(UserService)
  })

  describe('create', async () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should create a user with success', async () => {
      const userInput: CreateUserSchema = {
        email: 'any@email.com',
        name: 'any name',
        password: 'any password',
        role: 'USER',
      }

      vi.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))

      const userOutput: Omit<User, 'password'> = {
        id: 1,
        email: userInput.email,
        name: userInput.name,
        role: userInput.role,
        createdAt: new Date('2021-01-01T00:00:00.000Z'),
        updatedAt: new Date('2021-01-01T00:00:00.000Z'),
      }

      const user = await userService.create(userInput)

      expect(user).toBeDefined()
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('role')
      expect(user).not.toHaveProperty('password')

      expect(user).to.be.deep.equal(userOutput)
    })

    it('should throw an error if email is already in use', async () => {
      const userInput: CreateUserSchema = {
        email: 'any_email',
        name: 'any name',
        password: 'any password',
        role: 'USER',
      }

      await userService.create({
        ...userInput,
      })

      await expect(userService.create(userInput)).rejects.toThrow(
        'User already exists',
      )
    })
  })
})
