import { HandlerFunction } from '@/types/handler-function'

import { OpenService } from './open.service'

export class OpenController {
  private service: OpenService

  constructor(service: OpenService) {
    this.service = service
  }

  toggle: HandlerFunction = async (req, res) => {
    const isOpen = await this.service.toggle()

    return res.json(isOpen)
  }

  get: HandlerFunction = async (req, res) => {
    const isOpen = await this.service.get()

    return res.json(isOpen)
  }
}
