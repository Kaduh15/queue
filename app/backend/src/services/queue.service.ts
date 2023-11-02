import { Status } from '@/entities/queue.entity'
import { OpenRepository } from '@/repositories/open-repository/open.repository'
import { QueueRepository } from '@/repositories/queue-repository/queue.repository'
import { BadRequestError, NotFoundError } from '@/utils/http-errors'
import { whatsappApi } from '@/utils/whatsapp-api'

import { CreateQueueSchema } from '../schemas/queue-create.schema'

export class QueueService {
  model: QueueRepository
  openRepository: OpenRepository

  constructor(model: QueueRepository, openRepository: OpenRepository) {
    this.model = model
    this.openRepository = openRepository
  }

  async getToday() {
    const queues = await this.model.getToday()

    return queues
  }

  async create(data: CreateQueueSchema) {
    const isOpen = await this.openRepository.getById(1)

    if (!isOpen?.isOpen) throw new BadRequestError('It is not open')

    const customer = await this.model.create(data)

    if (data.phoneNumber) {
      whatsappApi.sendMessage(
        '87996252178',
        `Olá ${data.name}, você está na fila!\n Sua posição é: ${
          (await this.getToday()).length
        }\n${customer.id}`,
      )
    }

    return customer
  }

  async updateStatus(id: number, status: Status) {
    const hasCustomer = await this.model.getById(id)

    if (!hasCustomer) throw new NotFoundError('customer not found')

    const updateCustomer = await this.model.update(id, {
      status,
    })

    const next = (await this.model.getToday()).find((customer) => {
      return customer.status === 'WAITING'
    })

    if (next?.id) {
      await this.model.update(next.id, {
        status: 'IN_SERVICE',
      })
    }

    const waitingList = (await this.model.getToday()).filter((customer) => {
      return customer.status === 'WAITING'
    })

    const responses = await Promise.all(
      waitingList.map(async (customer, index) => {
        if (!customer.phoneNumber) return

        if (index === 0)
          return whatsappApi.sendMessage(
            customer.phoneNumber,
            `${customer.name}, Você é o próximo!`,
          )

        return whatsappApi.sendMessage(
          customer.phoneNumber,
          `${customer.name} falta Apenas ${index + 1} para sua vez!`,
        )
      }),
    )
    console.log(
      '🚀 ~ file: queue.service.ts:76 ~ QueueService ~ updateStatus ~ responses:',
      responses,
    )

    return updateCustomer
  }
}
