import Sinon from 'sinon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Queue from '@/entities/queue.entity'
import { OpenRepositoryInMemory } from '@/repositories/open-repository/open-in-memory.repository'
import { QueueRepositoryInMemory } from '@/repositories/queue-repository/queue-in-memory.repository'

import { QueueService } from './queue.service'
import { CreateQueueSchema } from './schemas/queue-create.schema'

describe('QueueService', () => {
  const queueRepository = new QueueRepositoryInMemory()
  const openRepository = new OpenRepositoryInMemory()
  const queueService = new QueueService(queueRepository, openRepository)

  openRepository.create({ isOpen: false })

  beforeEach(() => {
    vi.resetAllMocks()
    vi.useRealTimers()

    openRepository.update(1, {
      isOpen: false,
    })

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

      openRepository.update(1, {
        isOpen: true,
      })

      vi.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))

      const queueOutput = {
        id: 1,
        ...queueInput,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'WAITING',
      }

      const queue = await queueService.create(queueInput)

      expect(queue).toEqual(queueOutput)
    })
  })

  describe('getToday', () => {
    it('should get all current day customers', async () => {
      const queueInput: Omit<Queue, 'id'> = {
        name: 'Any Name',
        phoneNumber: '99999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'WAITING',
      }

      Sinon.stub(queueRepository, 'getToday').resolves([
        {
          id: 1,
          ...queueInput,
        },
        {
          id: 2,
          ...queueInput,
        },
      ])

      const queues = await queueService.getToday()

      expect(queues).toHaveLength(2)
      expect(queues[0]).toHaveProperty('id', 1)
    })
  })
})
