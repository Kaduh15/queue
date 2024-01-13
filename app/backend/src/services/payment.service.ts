import { OpenRepository } from '@/repositories/open-repository/open.repository'
import { QueueRepository } from '@/repositories/queue-repository/queue.repository'
import { BadRequestError } from '@/utils/http-errors'
import PaymentApi from '@/utils/payment'

import { CreatePaymentSchema } from '../schemas/create-payment.schema'

const isDev = process.env.NODE_ENV !== 'production'

export class PaymentService {
  #queue: QueueRepository
  #open: OpenRepository
  #paymentApi: PaymentApi

  constructor(
    queue: QueueRepository,
    open: OpenRepository,
    paymentApi: PaymentApi,
  ) {
    this.#queue = queue
    this.#open = open
    this.#paymentApi = paymentApi
  }

  async create({ name, phoneNumber, valor }: CreatePaymentSchema) {
    const isOpen = await this.#open.getById(1)

    if (!isOpen?.isOpen) {
      throw new BadRequestError("it's closed")
    }

    const hasCustomer = (await this.#queue.getToday()).some((customer) => {
      return customer.name === name
    })

    if (hasCustomer) {
      throw new BadRequestError('Customer already paid')
    }

    const response = await this.#paymentApi.createPayment({
      transaction_amount: Number(valor),
      metadata: {
        name,
        phone_number: phoneNumber,
      },
    })

    return response
  }

  async confirmPayment(paymentId: string) {
    const {
      status,
      client: { name, phone_number: phoneNumber },
    } = await this.#paymentApi.consultPix(paymentId)

    if (status !== 'approved' && !isDev) {
      throw new BadRequestError('Pix payment not completed')
    }

    await this.#queue.create({
      name,
      phoneNumber,
    })
  }
}
