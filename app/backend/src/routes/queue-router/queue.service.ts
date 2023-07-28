import { QueueRepository } from '@/repositories/queue-repository/queue.repository'

import { CreateQueueSchema } from './schemas/queue-create.schema'

export class QueueService {
  model: QueueRepository

  constructor(model: QueueRepository) {
    this.model = model
  }

  async create(data: CreateQueueSchema) {
    return await this.model.create(data)
  }
}
