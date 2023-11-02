import { Request, Response } from 'express'
import Sinon from 'sinon'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Queue from '@/entities/queue.entity'
import { OpenRepositoryInMemory } from '@/repositories/open-repository/open-in-memory.repository'
import { QueueRepositoryInMemory } from '@/repositories/queue-repository/queue-in-memory.repository'

import { CreateQueueSchema } from '../routes/queue-router/schemas/queue-create.schema'
import { QueueService } from '../services/queue.service'

import { QueueController } from './queue.controller'

describe('QueueController', () => {
  const queueRepository = new QueueRepositoryInMemory()
  const openRepository = new OpenRepositoryInMemory()
  const queueService = new QueueService(queueRepository, openRepository)
  const queueController = new QueueController(queueService)

  const req = {
    body: {},
    query: {},
    params: {},
  } as Request

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response

  beforeEach(() => {
    Sinon.restore()
  })

  describe('create', () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('should create a queue', async () => {
      const queueCreateInput: CreateQueueSchema = {
        name: 'Any Name',
        phoneNumber: '99999999999',
      }

      const queueCreateOutput: Queue = {
        id: 1,
        ...queueCreateInput,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'WAITING',
      }

      Sinon.stub(openRepository, 'getById').resolves({
        id: 1,
        isOpen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      Sinon.stub(queueService, 'create').resolves(queueCreateOutput)

      await queueController.create(req, res)

      expect(res.status).toBeCalled()
      expect(res.status).toBeCalledWith(201)

      expect(res.json).toBeCalled()
      expect(res.json).toBeCalledWith(queueCreateOutput)
    })
  })

  describe('getToday', () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('should return all current day customers', async () => {
      const serviceGetTodayMock: Queue[] = [
        {
          id: 1,
          name: 'Any Name',
          phoneNumber: '99999999999',
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'WAITING',
        },
      ]

      Sinon.stub(queueService, 'getToday').resolves(serviceGetTodayMock)

      await queueController.getToday(req, res)

      expect(res.status).toBeCalled()
      expect(res.status).toBeCalledWith(201)

      expect(res.json).toBeCalled()
      expect(res.json).toBeCalledWith(serviceGetTodayMock)
    })
  })

  describe('updateStatus', () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('should update a queue status', async () => {
      const serviceUpdateStatusMock: Queue = {
        id: 1,
        name: 'Any Name',
        phoneNumber: '99999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'DONE',
      }

      Sinon.stub(queueService, 'updateStatus').resolves(serviceUpdateStatusMock)

      await queueController.updateStatus(req, res)

      expect(res.status).toBeCalled()
      expect(res.status).toBeCalledWith(201)

      expect(res.json).toBeCalled()
      expect(res.json).toBeCalledWith(serviceUpdateStatusMock)
    })
  })
})
