import { PrismaClient } from '@prisma/client'

import { Encrypt } from '@/lib/bcryptjs'
import { CreateUserSchema } from '@/routes/user-router/schemas/user-create.schema'
import { ConflictError } from '@/utils/http-errors'

export class UserService {
  private service: PrismaClient
  private encrypt = Encrypt

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

    const hashedPassword = await this.encrypt.hash(data.password)

    const user = await this.service.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
      },
    })

    return user
  }
}
