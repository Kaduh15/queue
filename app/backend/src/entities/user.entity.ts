import { BaseEntity } from './base.entity'

export type Role = 'ADMIN' | 'USER'

export default class User extends BaseEntity {
  email: string
  name: string
  password: string
  role: Role

  constructor(data: User) {
    super(data)
    this.email = data.email
    this.name = data.name
    this.password = data.password
    this.role = data.role
  }
}
