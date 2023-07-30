import User from '@/entities/user.entity'
import { ConflictError, NotFoundError } from '@/utils/http-errors'

import { UserRepository } from './user.repository'

export class UserRepositoryInMemory implements UserRepository {
  users: User[] = []
  index = 0

  getByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email)

    return Promise.resolve(user)
  }

  create({
    email,
    name,
    password,
    role = 'USER',
  }: Omit<User, 'id'>): Promise<User> {
    const hasEmail = this.users.find((user) => user.email === email)

    if (hasEmail) {
      throw new ConflictError('Email already in use')
    }

    const date = new Date()

    const user = new User({
      id: this.index + 1,
      email,
      name,
      password,
      role,
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

  update(id: number, data: Partial<User>): Promise<User> {
    const user = this.users.find((user) => user.id === id)

    if (!user) {
      return Promise.reject(NotFoundError)
    }
    user.email = data.email ?? user.email
    user.name = data.name ?? user.name
    user.password = data.password ?? user.password
    user.role = data.role ?? user.role

    user.updatedAt = new Date()

    return Promise.resolve(new User(user))
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
