import { StatusCodes } from 'http-status-codes'

import { HandlerFunction } from '@/types/handler-function'

import { UserService } from './user.service'

export class UserController {
  private service: UserService

  constructor(service: UserService) {
    this.service = service
  }

  create: HandlerFunction = async (req, res) => {
    const { email, name, password, role } = req.body
    const user = await this.service.create({ email, name, password, role })
    return res.status(StatusCodes.CREATED).json(user)
  }

  getAll: HandlerFunction = async (req, res) => {
    const users = await this.service.getAll()
    return res.status(StatusCodes.OK).json(users)
  }
}
