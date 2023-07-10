import { Request, Response } from 'express'

import { UserService } from '@/services'

type RequestFunction = (req: Request, res: Response) => Promise<Response>

export class UserController {
  private service: UserService

  constructor(service: UserService) {
    this.service = service
  }

  create: RequestFunction = async (req, res) => {
    const { email, name, password, role } = req.body
    const user = await this.service.create({ email, name, password, role })
    return res.json(user)
  }
}
