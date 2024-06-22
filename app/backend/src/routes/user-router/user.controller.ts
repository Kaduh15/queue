import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { UserService } from './user.service'

export class UserController {
  private service: UserService

  constructor(service: UserService) {
    this.service = service
  }

  create = async (req: Request, res: Response) => {
    const { email, name, password, role } = req.body
    const user = await this.service.create({ email, name, password, role })
    return res.status(StatusCodes.CREATED).json(user)
  }

  getAll = async (req: Request, res: Response) => {
    const users = await this.service.getAll()
    return res.status(StatusCodes.OK).json(users)
  }
}
