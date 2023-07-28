import Queue from '@/entities/queue.entity'

import { QueueRepository } from './queue.repository'

export class QueuePrismaRepository implements QueueRepository {
  create(_data: Omit<Queue, 'id'>): Promise<Queue> {
    throw new Error('Method not implemented.')
  }

  getAll(): Promise<Queue[]> {
    throw new Error('Method not implemented.')
  }

  getById(_id: number): Promise<Queue | undefined> {
    throw new Error('Method not implemented.')
  }

  update(_id: number, _data: Partial<Queue>): Promise<Queue> {
    throw new Error('Method not implemented.')
  }

  delete(_id: number): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteAll(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
