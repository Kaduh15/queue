import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { QueueRepositoryInMemory } from '@/repositories/queue-repository/queue-in-memory.repository'

import { QueueService } from './queue.service'
import { CreateQueueSchema } from './schemas/queue-create.schema'

describe('QueueService', () => {
  const queueRepository = new QueueRepositoryInMemory()

  const queueService = new QueueService(queueRepository)

  it('Should be defined', () => {
    expect(queueService).toBeDefined()
  })

  it('Should is instance of QueueService', () => {
    expect(queueService).toBeInstanceOf(QueueService)
  })

  describe('create', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('Should create a queue', () => {
      const queueInput: CreateQueueSchema = {
        name: 'Any Name',
        phoneNumber: '99999999999',
      }

      vi.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))

      const queueOutput = {
        id: 1,
        ...queueInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const queue = queueService.create(queueInput)

      expect(queue).resolves.toEqual(queueOutput)
    })
  })
})
