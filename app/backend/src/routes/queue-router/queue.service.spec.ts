import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { QueueRepositoryInMemory } from '@/repositories/queue-repository/queue-in-memory.repository'

import { QueueService } from './queue.service'
import { CreateQueueSchema } from './schemas/queue-create.schema'

describe('QueueService', () => {
  const queueRepository = new QueueRepositoryInMemory()

  const queueService = new QueueService(queueRepository)

  beforeEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()

    queueRepository.deleteAll()
  })

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

    it('Should create a queue', async () => {
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

      const queue = await queueService.create(queueInput)

      expect(queue).toEqual(queueOutput)
    })
  })

  describe('getToday', () => {
    it('should get all current day customers', async () => {
      const queueInput: CreateQueueSchema = {
        name: 'Any Name',
        phoneNumber: '99999999999',
      }

      vi.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))
      await queueService.create(queueInput)

      vi.setSystemTime(new Date('2021-01-02T00:00:00.000Z'))
      await queueService.create(queueInput)
      await queueService.create(queueInput)

      const queues = await queueService.getToday()

      expect(queues).toHaveLength(2)
      expect(queues[0]).toHaveProperty('id', 3)
    })
  })
})
