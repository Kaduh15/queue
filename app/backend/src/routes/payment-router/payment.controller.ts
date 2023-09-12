import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { PaymentService } from './payment.service'

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

  healthCheck = async (_req: Request, res: Response, next: NextFunction) => {
    const isHealth = await this.service.healthCheck()

    if (isHealth) {
      return next()
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Payment service is down',
    })
  }

  webhook = async (req: Request, res: Response) => {
    const { hmac } = req.query

    if (typeof hmac !== 'string') {
      return res.sendStatus(StatusCodes.UNAUTHORIZED)
    }

    const [hash, event] = hmac.split('/')

    if (hash !== process.env.EFI_HMAC_KEY) {
      return res.sendStatus(StatusCodes.UNAUTHORIZED)
    }

    if (event === 'pix') {
      const { body } = req
      const txid = body?.pix[0]?.txid

      if (!txid) {
        return res.sendStatus(StatusCodes.BAD_REQUEST)
      }

      await this.service.confirmPayment(txid)

      return res.sendStatus(StatusCodes.CREATED)
    }

    return res.sendStatus(StatusCodes.OK)
  }
}
