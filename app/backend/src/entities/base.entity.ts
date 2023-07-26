import { Id } from '@/repositories/base.repository'

class IBaseEntity {
  id: Id
  createdAt?: Date
  updatedAt?: Date

  constructor(data: BaseEntity) {
    this.id = data.id
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}

export class BaseEntity implements IBaseEntity {
  id: Id
  createdAt?: Date
  updatedAt?: Date

  constructor(data: BaseEntity) {
    this.id = data.id
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
