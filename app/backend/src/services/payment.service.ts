import { OpenRepository } from '@/repositories/open-repository/open.repository'
import { QueueRepository } from '@/repositories/queue-repository/queue.repository'
import { BadRequestError } from '@/utils/http-errors'
import PaymentApi from '@/utils/payment'

import { CreatePaymentSchema } from '../routes/payment-router/schemas/create-payment.schema'

export class PaymentService {
  #queue: QueueRepository
  #open: OpenRepository
  #paymentApi: PaymentApi

  constructor(queue: QueueRepository, open: OpenRepository) {
    this.#queue = queue
    this.#open = open
    this.#paymentApi = new PaymentApi()
  }

  async create({ name, phoneNumber, valor }: CreatePaymentSchema) {
    const hasCustomer = (await this.#queue.getToday()).some((customer) => {
      return customer.name === name
    })

    const isOpen = await this.#open.getById(1)

    if (!isOpen?.isOpen) {
      throw new BadRequestError("it's closed")
    }

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
    const response = await this.#paymentApi.consultPix(paymentId)

    if (response?.status !== 'approved') {
      throw new BadRequestError('Pix payment not completed')
    }

    const {
      client: { name, phone_number: phoneNumber },
    } = response

    await this.#queue.create({
      name,
      phoneNumber,
    })
  }
}
