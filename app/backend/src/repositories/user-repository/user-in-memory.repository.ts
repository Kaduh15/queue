import User from '@/entities/user.entity'
import { ConflictError, NotFoundError } from '@/utils/http-errors'

import { UserRepository } from './user.repository'

export class UserRepositoryInMemory implements UserRepository {
  users: User[] = []
  index = 0

  findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email)

    return Promise.resolve(user)
  }

  create(data: Omit<User, 'id'>): Promise<User> {
    const hasEmail = this.users.find((user) => user.email === data.email)

    if (hasEmail) {
      throw new ConflictError('Email already in use')
    }

    const date = new Date()

    const user = new User({
      id: this.index + 1,
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role,
      createdAt: date,
      updatedAt: date,
    })

    this.users.push(user)
    this.index++

    return Promise.resolve(user)
  }

  getAll(): Promise<User[]> {
    return Promise.resolve(this.users)
  }

  getById(id: number): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id)

    return Promise.resolve(user)
  }

  update(_id: number, _data: User): Promise<User> {
    throw new Error('Method not implemented.')
  }

  delete(id: number): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id)

    if (!index) {
      return Promise.reject(NotFoundError)
    }

    this.users.splice(index, 1)

    return Promise.resolve()
  }

  deleteAll(): Promise<void> {
    this.users = []

    return Promise.resolve()
  }
}
