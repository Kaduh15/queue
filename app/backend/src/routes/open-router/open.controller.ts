import { Request, Response } from 'express'

import { OpenService } from './open.service'

type RequestFunction = (req: Request, res: Response) => Promise<Response>

export class OpenController {
  private service: OpenService

  constructor(service: OpenService) {
    this.service = service
  }

  toggle: RequestFunction = async (req, res) => {
    const isOpen = await this.service.toggle()

    return res.json(isOpen)
  }

  get: RequestFunction = async (req, res) => {
    const isOpen = await this.service.get()

    return res.json(isOpen)
  }
}
