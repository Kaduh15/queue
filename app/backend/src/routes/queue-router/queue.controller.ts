import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Status } from '@/entities/queue.entity'

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

  updateStatus = async (req: Request, res: Response) => {
    const { query, params } = req

    const { status } = query

    const customerUpdate = await this.service.updateStatus(
      Number(params.id),
      status as Status,
    )

    res.status(StatusCodes.OK).json(customerUpdate)
  }

  next = async (req: Request, res: Response) => {
    const { status } = req.query

    const nextCustomer = await this.service.next(status as Status)

    res.status(StatusCodes.OK).json(nextCustomer)
  }
}
