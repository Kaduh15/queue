import { BaseEntity } from './base.entity'

export type Role = 'ADMIN' | 'USER'

export default class User extends BaseEntity {
  email: string
  name: string
  password: string
  role?: Role

  constructor({ email, id, name, password, role, createdAt, updatedAt }: User) {
    super({
      id,
      createdAt,
      updatedAt,
    })
    this.email = email
    this.name = name
    this.password = password
    this.role = role ?? 'USER'
  }
}
