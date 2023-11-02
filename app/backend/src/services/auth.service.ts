import { Encrypt } from '@/lib/bcryptjs'
import { Auth } from '@/lib/jsonwebtoken'
import { UserRepository } from '@/repositories/user-repository/user.repository'
import { NotFoundError, UnauthorizedError } from '@/utils/http-errors'

import { AuthLoginSchema } from '../routes/auth-router/schemas/auth-login.schema'

export class AuthService {
  private auth = Auth
  private model: UserRepository

  constructor(model: UserRepository) {
    this.model = model
  }

  async login(data: AuthLoginSchema) {
    const user = await this.model.getByEmail(data.email)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const isPasswordValid = await Encrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid password')
    }

    const token = this.auth.sign({ sub: user.id, role: user.role })

    return { token }
  }
}
