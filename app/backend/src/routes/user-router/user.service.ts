import { PrismaClient } from '@prisma/client'

import { Encrypt } from '@/lib/bcryptjs'
import { CreateUserSchema } from '@/routes/user-router/schemas/user-create.schema'
import { ConflictError } from '@/utils/http-errors'

export class UserService {
  private model: PrismaClient
  private encrypt = Encrypt

  constructor(service: PrismaClient) {
    this.model = service
  }

  async create(data: CreateUserSchema) {
    const hasUser = await this.model.user.findUnique({
      where: { email: data.email },
    })

    if (hasUser) {
      throw new ConflictError('User already exists')
    }

    const hashedPassword = await this.encrypt.hash(data.password)

    const user = await this.model.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return user
  }

  async getAll() {
    const users = await this.model.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return users
  }
}
