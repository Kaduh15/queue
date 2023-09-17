import { BaseEntity } from './base.entity'

export type Status = 'WAITING' | 'ABSENT' | 'DONE' | 'IN_SERVICE'

export default class Queue extends BaseEntity {
  name: string
  phoneNumber?: string | null
  status: Status

  constructor({ id, name, createdAt, updatedAt, phoneNumber, status }: Queue) {
    super({
      id,
      createdAt,
      updatedAt,
    })
    this.name = name
    this.phoneNumber = phoneNumber
    this.status = status
  }
}
