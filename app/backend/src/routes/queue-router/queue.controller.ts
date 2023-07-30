import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { QueueService } from './queue.service'

export class QueueController {
  service: QueueService

  constructor(service: QueueService) {
    this.service = service
  }

  create = async (req: Request, res: Response) => {
    const queue = await this.service.create(req.body)

    return res.status(StatusCodes.CREATED).json(queue)
  }

  getToday = async (_req: Request, res: Response) => {
    const customersToday = await this.service.getToday()

    return res.status(StatusCodes.OK).json(customersToday)
  }
}
