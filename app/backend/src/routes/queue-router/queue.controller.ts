import { Request, Response } from 'express'

import { QueueService } from './queue.service'

export class QueueController {
  service: QueueService

  constructor(service: QueueService) {
    this.service = service
  }

  create = async (req: Request, res: Response) => {
    const queue = await this.service.create(req.body)

    return res.status(201).json(queue)
  }
}
