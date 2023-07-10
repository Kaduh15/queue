import { PrismaClient } from '@prisma/client'

import { Auth } from '@/lib/jsonwebtoken'
import { NotFoundError, UnauthorizedError } from '@/utils/http-errors'

import { AuthLoginSchema } from './schemas/auth-login.schema'

type AuthServiceProps = {
  prisma: PrismaClient
}

export class AuthService {
  private auth = Auth
  private prisma: PrismaClient

  constructor({ prisma }: AuthServiceProps) {
    this.prisma = prisma
  }

  async login(data: AuthLoginSchema) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const isPasswordValid = data.password === user.password

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid password')
    }

    const token = this.auth.sign({ sub: user.id, role: user.role })

    return { token }
  }
}
