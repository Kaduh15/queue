import Queue from '@/entities/queue.entity'
import prisma from '@/prisma/prisma-client'
import { ConflictError } from '@/utils/http-errors'

import { QueueRepository } from './queue.repository'

export class QueuePrismaRepository implements QueueRepository {
  async getToday(): Promise<Queue[]> {
    const queueToday = await prisma.queue.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    })

    return queueToday.map((queue) => new Queue(queue))
  }

  async create(
    data: Omit<Queue, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<Queue> {
    const hasQueue = await prisma.queue.findFirst({
      where: {
        name: data.name,
      },
    })

    if (hasQueue) {
      throw new ConflictError('Queue already exists')
    }

    const queue = await prisma.queue.create({
      data,
    })

    return new Queue(queue)
  }

  async getAll(): Promise<Queue[]> {
    const customers = await prisma.queue.findMany()

    return customers.map((customer) => new Queue(customer))
  }

  async getById(id: number): Promise<Queue | undefined> {
    const customer = await prisma.queue.findUnique({
      where: {
        id,
      },
    })

    if (!customer) return undefined

    return new Queue(customer)
  }

  async update(id: number, data: Partial<Queue>): Promise<Queue> {
    const customer = await prisma.queue.update({
      where: {
        id,
      },
      data,
    })

    return new Queue(customer)
  }

  async delete(id: number): Promise<void> {
    await prisma.queue.delete({
      where: {
        id,
      },
    })
  }

  async deleteAll(): Promise<void> {
    await prisma.queue.deleteMany()
  }
}
