import { Axios } from 'axios'
import Sinon from 'sinon'
import { beforeEach, describe, expect, it, test } from 'vitest'

import Queue, { Status } from '@/entities/queue.entity'
import { OpenRepositoryInMemory } from '@/repositories/open-repository/open-in-memory.repository'
import { QueueRepositoryInMemory } from '@/repositories/queue-repository/queue-in-memory.repository'
import { TWhatsappApi } from '@/utils/whatsapp-api'

import { CreateQueueSchema } from '../../schemas/queue-create.schema'

import { QueueService } from './queue.service'

describe('QueueService', () => {
  const queueRepository = new QueueRepositoryInMemory()
  const openRepository = new OpenRepositoryInMemory()
  const whatsappApiMock: TWhatsappApi = {
    request: new Axios(),
    sendMessage: async function (
      _phoneNumber: string,
      _message: string,
    ): Promise<unknown> {
      return {}
    },
  }
  const queueService = new QueueService(
    queueRepository,
    openRepository,
    whatsappApiMock,
  )

  it('Should be defined', () => {
    expect(queueService).toBeDefined()
  })

  it('Should is instance of QueueService', () => {
    expect(queueService).toBeInstanceOf(QueueService)
  })

  describe('create', () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('Should create a queue', async () => {
      const queueInput: CreateQueueSchema = {
        name: 'Any Name',
        phoneNumber: '99999999999',
      }

      const queueOutput: Queue = {
        id: 1,
        ...queueInput,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'WAITING',
      }

      Sinon.stub(queueRepository, 'create').resolves(queueOutput)
      Sinon.stub(openRepository, 'getById').resolves({
        id: 1,
        isOpen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

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

  describe('updateStatus', () => {
    beforeEach(() => {
      Sinon.restore()
    })

    test.each<[Status, Status]>([
      ['DONE', 'DONE'],
      ['ABSENT', 'ABSENT'],
    ])('should update status to %s', async (_chave, params) => {
      const queueInput: Queue = {
        id: 1,
        name: 'Any Name',
        phoneNumber: '99999999999',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'WAITING',
      }

      Sinon.stub(queueRepository, 'getById').resolves(queueInput)

      Sinon.stub(queueRepository, 'update').resolves({
        ...queueInput,
        status: params,
      })

      const queueUpdate = await queueService.updateStatus(1, params)

      expect(queueUpdate.status).to.equal(params)
    })
  })

  describe('next', () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('should update status to IN_SERVICE', async () => {
      for (let i = 0; i < 10; i++) {
        let status: Status = 'WAITING'
        if (i === 0) {
          status = 'IN_SERVICE'
        }

        await queueRepository.create({
          name: `Any Name ${i + 1}`,
          phoneNumber: '99999999999',
          status,
          createdAt: new Date(new Date().setSeconds(i)),
          updatedAt: new Date(),
        })
      }

      let customer = await queueService.next('DONE')
      let lastCustomerService = await queueRepository.getById(1)
      let nextCustomer = await queueRepository.getById(3)
      expect(customer?.id).to.equal(2)
      expect(customer?.status).to.equal('IN_SERVICE')
      expect(lastCustomerService?.status).to.equal('DONE')
      expect(nextCustomer?.status).to.equal('WAITING')

      customer = await queueService.next('DONE')
      lastCustomerService = await queueRepository.getById(2)
      nextCustomer = await queueRepository.getById(4)
      expect(customer?.id).to.equal(3)
      expect(customer?.status).to.equal('IN_SERVICE')
      expect(lastCustomerService?.status).to.equal('DONE')
      expect(nextCustomer?.status).to.equal('WAITING')

      customer = await queueService.next('DONE')
      lastCustomerService = await queueRepository.getById(3)
      nextCustomer = await queueRepository.getById(5)
      expect(customer?.id).to.equal(4)
      expect(customer?.status).to.equal('IN_SERVICE')
      expect(lastCustomerService?.status).to.equal('DONE')
      expect(nextCustomer?.status).to.equal('WAITING')
    })
  })
})
