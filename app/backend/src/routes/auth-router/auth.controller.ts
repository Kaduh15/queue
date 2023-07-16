import { Request, Response } from 'express'

import { AuthService } from './auth.service'

type RequestFunction = (req: Request, res: Response) => Promise<Response>

export class AuthController {
  private service: AuthService

  constructor(service: AuthService) {
    this.service = service
  }

  login: RequestFunction = async (req, res) => {
    const { email, password } = req.body
    const token = await this.service.login({ email, password })

    return res.json(token)
  }
}
