import Open from '@/entities/open.entity'
import { NotFoundError } from '@/utils/http-errors'

import { OpenRepository } from './open.repository'

export class OpenRepositoryInMemory implements OpenRepository {
  opens: Open[] = []
  index = 0

  create({
    isOpen = false,
  }: Omit<Open, 'id' | 'createdAt' | 'updatedAt'>): Promise<Open> {
    const date = new Date()

    const open = new Open({
      id: this.index + 1,
      isOpen,
      createdAt: date,
      updatedAt: date,
    })

    this.opens.push(open)
    this.index++

    return Promise.resolve(open)
  }

  getAll(): Promise<Open[]> {
    return Promise.resolve(this.opens)
  }

  getById(id: number): Promise<Open | undefined> {
    const open = this.opens.find((open) => open.id === id)

    return Promise.resolve(open)
  }

  update(id: number, data: Partial<Open>): Promise<Open> {
    const open = this.opens.find((open) => open.id === id)

    if (!open) {
      return Promise.reject(NotFoundError)
    }
    open.isOpen = data.isOpen ?? open.isOpen

    open.updatedAt = new Date()

    return Promise.resolve(new Open(open))
  }

  delete(id: number): Promise<void> {
    const index = this.opens.findIndex((open) => open.id === id)

    if (!index) {
      return Promise.reject(NotFoundError)
    }

    this.opens.splice(index, 1)

    return Promise.resolve()
  }

  deleteAll(): Promise<void> {
    this.opens = []

    return Promise.resolve()
  }
}
