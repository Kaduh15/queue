import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { PaymentService } from '../../services/payment.service'

export class PaymentController {
  private service: PaymentService

  constructor(service: PaymentService) {
    this.service = service
  }

  create = async (req: Request, res: Response) => {
    const { name, phoneNumber, valor } = req.body

    const response = await this.service.create({
      name,
      phoneNumber,
      valor,
    })

    return res.status(200).json(response)
  }

  webhook = async (req: Request, res: Response) => {
    const { body } = req

    const {
      data: { id },
      action,
    } = body

    if (!id && action !== 'payment.created') {
      return res.sendStatus(StatusCodes.BAD_REQUEST)
    }

    await this.service.confirmPayment(id)

    return res.sendStatus(StatusCodes.CREATED)
  }
}
