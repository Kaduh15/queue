import { PrismaClient } from '@prisma/client'

import { CreateUserSchema } from '@/routes/user-router/schemas/user-create.schema'
import { ConflictError } from '@/utils/http-errors'

export class UserService {
  private service: PrismaClient

  constructor(service: PrismaClient) {
    this.service = service
  }

  async create(data: CreateUserSchema) {
    const hasUser = await this.service.user.findUnique({
      where: { email: data.email },
    })

    if (hasUser) {
      throw new ConflictError('User already exists')
    }

    const user = await this.service.user.create({ data })

    return user
  }
}
