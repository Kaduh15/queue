import { BaseEntity } from './base.entity'

export default class Queue extends BaseEntity {
  name: string
  phoneNumber: string

  constructor({ id, name, createdAt, updatedAt, phoneNumber }: Queue) {
    super({
      id,
      createdAt,
      updatedAt,
    })
    this.name = name
    this.phoneNumber = phoneNumber
  }
}
