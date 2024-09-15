import MercadoPagoConfig, { Payment } from 'mercadopago'
import { z } from 'zod'

import { env } from '@/config/env'

type Body = {
  payment_method_id?: string
  transaction_amount?: number
  description?: string
  payer?: {
    email: string
  }
  metadata: {
    name: string
    phone_number: string
  }
  notification_url?: string
}

const paymentSchema = z
  .object({
    id: z.number(),
    status: z.enum([
      'approved',
      'pending',
      'in_process',
      'rejected',
      'cancelled',
    ]),
    metadata: z.object({
      name: z.string(),
      phone_number: z.string(),
    }),
    point_of_interaction: z.object({
      transaction_data: z.object({
        ticket_url: z.string(),
        qr_code: z.string(),
        qr_code_base64: z.string(),
      }),
    }),
  })
  .transform((data) => ({
    id: data.id,
    status: data.status,
    client: data.metadata,
    url_payment: data.point_of_interaction.transaction_data.ticket_url,
    qr_code: data.point_of_interaction.transaction_data.qr_code,
    qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
  }))

export default class PaymentApi {
  #payment: Payment

  constructor() {
    const client = new MercadoPagoConfig({
      accessToken: env.MP_ACCESS_TOKEN || '',
    })
    this.#payment = new Payment(client)
  }

  async createPayment(body?: Partial<Body>) {
    const defaultBody: Body = {
      payment_method_id: 'pix',
      transaction_amount: 0.01,
      description: 'Teste',
      payer: {
        email: 'test@email.com',
      },
      metadata: {
        name: '',
        phone_number: '',
      },
      notification_url: `${env.DEPLOY_URL}/payment/webhook`,
      ...body,
    }

    const payment = await this.#payment.create({
      body: defaultBody,
    })

    const paymentValid = paymentSchema.parse(payment)

    return paymentValid
  }

  async consultPix(paymentId: string) {
    const payment = await this.#payment.get({ id: paymentId })

    const paymentValid = paymentSchema.parse(payment)

    return paymentValid
  }
}
