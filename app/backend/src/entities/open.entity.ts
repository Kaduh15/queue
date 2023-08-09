import { BaseEntity } from './base.entity'

export default class Open extends BaseEntity {
  isOpen: boolean

  constructor({ id, createdAt, updatedAt, isOpen }: Open) {
    super({
      id,
      createdAt,
      updatedAt,
    })

    this.isOpen = isOpen
  }
}
