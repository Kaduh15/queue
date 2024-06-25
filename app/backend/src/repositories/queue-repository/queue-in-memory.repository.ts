import Queue, { Status } from '@/entities/queue.entity'
import { NotFoundError } from '@/utils/http-errors'

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

  create(
    data: Omit<Queue, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<Queue> {
    const queueInService = this.queues.some(
      (queue) => queue.status === 'IN_SERVICE',
    )

    let status: Status = 'WAITING'
    if (!queueInService) {
      status = 'IN_SERVICE'
    }

    const nowDate = new Date()

    const newQueue = new Queue({
      ...data,
      id: this.index,
      createdAt: nowDate,
      updatedAt: nowDate,
      status,
    })

    this.queues.push(newQueue)

    this.index++

    return Promise.resolve(newQueue)
  }

  getAll(): Promise<Queue[]> {
    return Promise.resolve(this.queues)
  }

  getById(id: number): Promise<Queue | undefined> {
    const queue = this.queues.find((queue) => queue.id === id)

    return Promise.resolve(queue)
  }

  update(id: number, data: Partial<Queue>): Promise<Queue> {
    const queue = this.queues.find((queue) => queue.id === id)

    if (!queue) {
      return Promise.reject(new NotFoundError('Queue not found'))
    }

    queue.name = data.name ?? queue.name
    queue.phoneNumber = data.phoneNumber ?? queue.phoneNumber
    queue.status = data.status ?? queue.status
    queue.updatedAt = new Date()

    return Promise.resolve(queue)
  }

  delete(id: number): Promise<void> {
    const index = this.queues.findIndex((queue) => queue.id === id)

    if (index === -1) {
      return Promise.reject(new NotFoundError('Queue not found'))
    }

    this.queues.splice(index, 1)

    return Promise.resolve()
  }

  deleteAll(): Promise<void> {
    this.queues = []

    return Promise.resolve()
  }
}
