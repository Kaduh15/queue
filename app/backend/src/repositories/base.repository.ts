import { BaseEntity } from '@/entities/base.entity'

export type Id = number

export interface BaseRepository<T = object & BaseEntity> {
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  getAll(): Promise<T[]>
  getById(id: Id): Promise<T | undefined>
  update(id: Id, data: Partial<T>): Promise<T>
  delete(id: Id): Promise<void>
  deleteAll(): Promise<void>
}
