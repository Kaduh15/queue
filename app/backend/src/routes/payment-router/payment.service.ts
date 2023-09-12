import { OpenRepository } from '@/repositories/open-repository/open.repository'
import { QueueRepository } from '@/repositories/queue-repository/queue.repository'
import { BadRequestError } from '@/utils/http-errors'
import paymentApi from '@/utils/payment'

import { CreatePaymentSchema } from './schemas/create-payment.schema'

export class PaymentService {
  #queue: QueueRepository
  #open: OpenRepository
  constructor(queue: QueueRepository, open: OpenRepository) {
    this.#queue = queue
    this.#open = open
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

    const response = await paymentApi.generateQrCode({
      valor: {
        original: valor,
      },
      infoAdicionais: [
        {
          nome: 'name',
          valor: name,
        },
        {
          nome: 'phoneNumber',
          valor: phoneNumber,
        },
      ],
    })

    return response
  }

  async healthCheck() {
    try {
      await paymentApi.configWebhook()
      return true
    } catch (err) {
      return false
    }
  }

  async confirmPayment(txid: string) {
    const response = await paymentApi.consultPix(txid)

    if (response?.status !== 'CONCLUIDA') {
      throw new BadRequestError('Pix payment not completed')
    }

    const { infoAdicionais } = response

    const customer = infoAdicionais.reduce((acc, curr) => {
      if (curr.nome === 'name') {
        acc.name = curr.valor
      }
      if (curr.nome === 'phoneNumber') {
        acc.phoneNumber = curr.valor
      }
      return acc
    }, {} as { name: string; phoneNumber: string })

    await this.#queue.create({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
    })
  }
}
