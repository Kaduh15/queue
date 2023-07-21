import { HandlerFunction } from '@/types/handler-function'

import { AuthService } from './auth.service'

export class AuthController {
  private service: AuthService

  constructor(service: AuthService) {
    this.service = service
  }

  login: HandlerFunction = async (req, res) => {
    const { email, password } = req.body
    const token = await this.service.login({ email, password })

    return res.json(token)
  }
}
