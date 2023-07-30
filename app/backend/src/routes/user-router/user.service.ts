import { Encrypt } from '@/lib/bcryptjs'
import { UserRepository } from '@/repositories/user-repository/user.repository'
import { CreateUserSchema } from '@/routes/user-router/schemas/user-create.schema'
import { ConflictError } from '@/utils/http-errors'

export class UserService {
  private model: UserRepository
  private encrypt = Encrypt

  constructor(model: UserRepository) {
    this.model = model
  }

  async create(data: CreateUserSchema) {
    const hasUser = await this.model.getByEmail(data.email)

    if (hasUser) {
      throw new ConflictError('User already exists')
    }

    const hashedPassword = await this.encrypt.hash(data.password)

    const user = await this.model.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
    })

    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  async getAll() {
    const users = await this.model.getAll()

    return users
  }
}
