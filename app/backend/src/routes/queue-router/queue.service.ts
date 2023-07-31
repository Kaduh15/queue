import { OpenRepository } from '@/repositories/open-repository/open.repository'
import { QueueRepository } from '@/repositories/queue-repository/queue.repository'
import { BadRequestError } from '@/utils/http-errors'

import { CreateQueueSchema } from './schemas/queue-create.schema'

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

    return customer
  }
}
