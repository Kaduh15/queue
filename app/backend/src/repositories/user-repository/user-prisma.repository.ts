import User from '@/entities/user.entity'
import prisma from '@/prisma/prisma-client'

import { UserRepository } from './user.repository'

export class UserPrismaRepository implements UserRepository {
  async getByEmail(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return undefined
    }

    return new User(user)
  }

  async create(data: User): Promise<User> {
    const userCreated = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        role: data.role,
      },
    })

    return new User(userCreated)
  }

  async getAll(): Promise<User[]> {
    const users = await prisma.user.findMany()

    return users.map((user) => new User(user))
  }

  getById(_id: number): Promise<User> {
    throw new Error('Method not implemented.')
  }

  update(_id: number, _data: User): Promise<User> {
    throw new Error('Method not implemented.')
  }

  delete(_id: number): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteAll(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
