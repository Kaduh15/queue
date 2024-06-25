import { Status } from '@/entities/queue.entity'
import { OpenRepository } from '@/repositories/open-repository/open.repository'
import { QueueRepository } from '@/repositories/queue-repository/queue.repository'
import { BadRequestError, NotFoundError } from '@/utils/http-errors'
import { TWhatsappApi } from '@/utils/whatsapp-api'

import { CreateQueueSchema } from '../../schemas/queue-create.schema'

export class QueueService {
  model: QueueRepository
  openRepository: OpenRepository
  whatsappApi: TWhatsappApi

  constructor(
    model: QueueRepository,
    openRepository: OpenRepository,
    whatsappApi: TWhatsappApi,
  ) {
    this.model = model
    this.openRepository = openRepository
    this.whatsappApi = whatsappApi
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
      this.whatsappApi.sendMessage(
        data.phoneNumber,
        `Olá ${data.name}, você está na fila!\nSua posição é: ${
          (await this.getToday()).length
        }`,
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

    await Promise.all(
      waitingList.map(async (customer, index) => {
        if (!customer.phoneNumber) return

        if (index === 0)
          return this.whatsappApi.sendMessage(
            customer.phoneNumber,
            `${customer.name}, Você é o próximo!`,
          )

        return this.whatsappApi.sendMessage(
          customer.phoneNumber,
          `${customer.name} falta Apenas ${index + 1} para sua vez!`,
        )
      }),
    )

    return updateCustomer
  }

  async next(status: Status) {
    const customers = await this.model.getToday()

    const currentCustomer = customers.find((customer) => {
      return customer.status === 'IN_SERVICE'
    })

    const nextCustomer = customers.find((customer) => {
      return customer.status === 'WAITING'
    })

    if (currentCustomer) {
      this.model.update(currentCustomer.id, {
        status,
      })
      currentCustomer.status = status
    }

    if (nextCustomer) {
      this.model.update(nextCustomer.id, {
        status: 'IN_SERVICE',
      })
      nextCustomer.status = 'IN_SERVICE'
    }

    const queue = customers.filter((customer) => {
      return customer.status === 'WAITING'
    })

    await Promise.all(
      queue.map(async (customer, index) => {
        if (!customer.phoneNumber) return

        if (index === 0)
          return this.whatsappApi.sendMessage(
            customer.phoneNumber,
            `${customer.name}, Você é o próximo!`,
          )

        return this.whatsappApi.sendMessage(
          customer.phoneNumber,
          `${customer.name} falta Apenas ${index} para sua vez!${
            index <= 3
              ? `\nPara não perder sua vez, venha para a Barbearia!`
              : ''
          }`,
        )
      }),
    )

    return nextCustomer
  }
}
