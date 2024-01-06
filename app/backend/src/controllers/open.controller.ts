import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { OpenService } from '../services/open.service'

export class OpenController {
  private service: OpenService

  constructor(service: OpenService) {
    this.service = service
  }

  toggle = async (req: Request, res: Response) => {
    const isOpen = await this.service.toggle()

    return res.status(StatusCodes.OK).json(isOpen)
  }

  get = async (req: Request, res: Response) => {
    const isOpen = await this.service.get()

    return res.status(StatusCodes.OK).json(isOpen)
  }
}
