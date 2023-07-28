import Queue from '@/entities/queue.entity'

import { QueueRepository } from './queue.repository'

export class QueueRepositoryInMemory implements QueueRepository {
  private queues: Queue[] = []
  private index = 1

  getToday(): Promise<Queue[]> {
    const queueToday = this.queues.filter((queue) => {
      const today = new Date()
      const queueDate = new Date(queue.createdAt)

      return (
        queueDate.getDate() === today.getDate() &&
        queueDate.getMonth() === today.getMonth() &&
        queueDate.getFullYear() === today.getFullYear()
      )
    })

    return Promise.resolve(queueToday)
  }

  create(data: Omit<Queue, 'id'>): Promise<Queue> {
    const nowDate = new Date()

    const newQueue = new Queue({
      ...data,
      id: this.index,
      createdAt: nowDate,
      updatedAt: nowDate,
      status: 'WAITING',
    })

    this.queues.push(newQueue)

    this.index++

    return Promise.resolve(newQueue)
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
    this.queues = []

    return Promise.resolve()
  }
}
