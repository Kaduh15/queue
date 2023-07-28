import Queue from '@/entities/queue.entity'
import prisma from '@/prisma/prisma-client'

import { QueueRepository } from './queue.repository'

export class QueuePrismaRepository implements QueueRepository {
  async create(data: Omit<Queue, 'id'>): Promise<Queue> {
    const queue = await prisma.queue.create({
      data,
    })

    return new Queue(queue)
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
