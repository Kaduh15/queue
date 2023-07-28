import { BaseEntity } from './base.entity'

export default class Queue extends BaseEntity {
  name: string
  phone: string

  constructor({ id, name, createdAt, updatedAt, phone }: Queue) {
    super({
      id,
      createdAt,
      updatedAt,
    })
    this.name = name
    this.phone = phone
  }
}
