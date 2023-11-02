import Sinon from 'sinon'
import { beforeEach, describe, expect, it } from 'vitest'

import User from '@/entities/user.entity'
import { UserRepositoryInMemory } from '@/repositories/user-repository/user-in-memory.repository'

import { CreateUserSchema } from '../routes/user-router/schemas/user-create.schema'

import { UserService } from './user.service'

describe('UserService', () => {
  const userRepository = new UserRepositoryInMemory()

  const userService = new UserService(userRepository)

  beforeEach(() => {
    Sinon.restore()
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  it('should be an instance of UserService', () => {
    expect(userService).toBeInstanceOf(UserService)
  })

  describe('create', async () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('should create a user with success', async () => {
      const userInput: CreateUserSchema = {
        email: 'any@email.com',
        name: 'any name',
        password: 'any password',
        role: 'USER',
      }

      const userOutput: Omit<User, 'password'> = {
        id: 1,
        email: userInput.email,
        name: userInput.name,
        role: userInput.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      Sinon.stub(userRepository, 'getByEmail').resolves(undefined)
      Sinon.stub(userRepository, 'create').resolves({
        ...userOutput,
        password: 'hashedPassword',
      })

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

      Sinon.stub(userRepository, 'getByEmail').resolves({
        id: 1,
        ...userInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const userPromise = userService.create(userInput)

      await expect(userPromise).rejects.toThrow('Email already exists')
    })
  })
})
