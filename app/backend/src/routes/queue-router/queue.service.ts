import { QueueRepository } from '@/repositories/queue-repository/queue.repository'

import { CreateQueueSchema } from './schemas/queue-create.schema'

export class QueueService {
  model: QueueRepository

  constructor(model: QueueRepository) {
    this.model = model
  }

  async getToday() {
    const queues = await this.model.getToday()

    return queues
  }

  async create(data: CreateQueueSchema) {
    const customer = await this.model.create(data)

    return customer
  }
}
