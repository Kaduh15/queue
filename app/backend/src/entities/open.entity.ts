import { BaseEntity } from './base.entity'

export type Status = 'WAITING' | 'ABSENT' | 'DONE'

export default class Queue extends BaseEntity {
  isOpen: boolean

  constructor({ id, createdAt, updatedAt, isOpen }: Queue) {
    super({
      id,
      createdAt,
      updatedAt,
    })

    this.isOpen = isOpen
  }
}
