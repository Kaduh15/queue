import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Status } from '@/entities/queue.entity'
import { BadRequestError } from '@/utils/http-errors'
import { includes } from '@/utils/includes'

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
    const validStatus: Status[] = ['ABSENT', 'DONE', 'WAITING']

    if (!status || typeof status !== 'string')
      throw new BadRequestError('Query param "url" has to be of type string')

    if (includes(validStatus, status))
      throw new BadRequestError('Invalid status')

    const customerUpdate = await this.service.updateStatus(
      Number(params.id),
      status as Status,
    )

    res.status(StatusCodes.CREATED).json(customerUpdate)
  }
}
