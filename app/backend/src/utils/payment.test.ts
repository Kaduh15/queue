import { Payment } from 'mercadopago'
import { describe, expect, it, vi } from 'vitest'

import PaymentApi from './payment'

describe('Payment - Method createPayment', () => {
  it('should be able to create a payment', async () => {
    const mock = vi.spyOn(Payment.prototype, 'create')
    mock.mockResolvedValue({
      api_response: {
        status: 201,
        headers: ['', []],
      },
      id: 123,
      status: 'approved',
      metadata: {
        name: 'John Doe',
        phone_number: '31999999999',
      },
      point_of_interaction: {
        transaction_data: {
          ticket_url: 'https://www.mercadopago.com.br',
          qr_code: 'https://www.mercadopago.com.br',
          qr_code_base64: 'https://www.mercadopago.com.br',
        },
      },
    })

    const pixPayment = new PaymentApi()

    const payment = await pixPayment.createPayment({
      metadata: {
        name: 'John Doe',
        phone_number: '31999999991',
      },
    })

    expect(payment).toEqual({
      id: 123,
      qr_code: 'https://www.mercadopago.com.br',
      qr_code_base64: 'https://www.mercadopago.com.br',
      status: 'approved',
      url_payment: 'https://www.mercadopago.com.br',
      client: {
        name: 'John Doe',
        phone_number: '31999999999',
      },
    })
  })
})

describe('Payment - Method consultPix', () => {
  it('should be able to get a payment', async () => {
    const mock = vi.spyOn(Payment.prototype, 'get')
    mock.mockResolvedValue({
      api_response: {
        status: 200,
        headers: ['', []],
      },
      id: 123,
      status: 'pending',
      metadata: {
        name: 'John Doe',
        phone_number: '31999999999',
      },
      point_of_interaction: {
        transaction_data: {
          ticket_url: 'https://www.mercadopago.com.br',
          qr_code: 'https://www.mercadopago.com.br',
          qr_code_base64: 'https://www.mercadopago.com.br',
        },
      },
    })

    const pixPayment = new PaymentApi()

    const payment = await pixPayment.consultPix('123')

    expect(payment).toEqual({
      id: 123,
      qr_code: 'https://www.mercadopago.com.br',
      qr_code_base64: 'https://www.mercadopago.com.br',
      status: 'pending',
      url_payment: 'https://www.mercadopago.com.br',
      client: {
        name: 'John Doe',
        phone_number: '31999999999',
      },
    })
  })
})
