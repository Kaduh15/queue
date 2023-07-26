import { describe, expect, it } from 'vitest'

import { UserRepositoryInMemory } from './user-in-memory.repository'

describe('UserRepositoryInMemory', () => {
  const userRepositoryInMemory = new UserRepositoryInMemory()

  it('should be defined', () => {
    expect(userRepositoryInMemory).toBeDefined()
  })

  it('should be an instance of UserRepositoryInMemory', () => {
    expect(userRepositoryInMemory).toBeInstanceOf(UserRepositoryInMemory)
  })

  describe('update', () => {
    it('should update a user with success', async () => {
      await userRepositoryInMemory.create({
        email: 'any_email',
        name: 'any name',
        password: 'any_password',
      })

      const user = await userRepositoryInMemory.update(1, {
        email: 'new_email',
      })

      expect(user.email).toBe('new_email')
    })
  })
})
