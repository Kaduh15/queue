import EfiPay from 'sdk-api-efi'

import {
  CERTIFICADO,
  EFI_CLIENT_ID,
  EFI_CLIENT_SECRET,
  EFI_HMAC_KEY,
  EFI_KEY_PIX,
  PROD,
  THIS_URL,
} from './env'

type Body = {
  calendario: {
    expiracao: number
  }
  valor: {
    original: string
  }
  chave: string
  infoAdicionais: {
    nome: string
    valor: string
  }[]
}

type ConsultPixReturn = {
  calendario: {
    criacao: string
    expiracao: number
  }
  txid: string
  revisao: number
  loc: {
    id: number
    location: string
    tipoCob: string
    criacao: string
  }
  location: string
  status: string
  valor: {
    original: string
  }
  chave: string
  infoAdicionais: Array<{
    nome: string
    valor: string
  }>
  pix: Array<{
    endToEndId: string
    txid: string
    valor: string
    chave: string
    horario: string
    infoPagador: string
  }>
}

class Payment {
  #payment: EfiPay

  constructor() {
    this.#payment = new EfiPay({
      client_id: EFI_CLIENT_ID,
      client_secret: EFI_CLIENT_SECRET,
      sandbox: !PROD,
      validateMtls: true,
      certificate: CERTIFICADO,
      cert_base64: true,
    })
  }

  async createPixCharge(body: Partial<Body>) {
    const newBody = {
      calendario: {
        expiracao: 3600,
      },
      valor: {
        original: '1.00',
      },
      chave: EFI_KEY_PIX,
      ...body,
    }
    const response = await this.#payment.pixCreateImmediateCharge({}, newBody)

    return response
  }

  async generateQrCode(body: Partial<Body> = {}) {
    const {
      loc: { id },
    } = await this.createPixCharge(body)

    const response = await this.#payment.pixGenerateQRCode({ id }, {})

    return response
  }

  async listWebhook() {
    const initialDate = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 30 * 365 * 10,
    ).toISOString()
    const finishDate = new Date(
      new Date().setHours(23, 59, 59, 999),
    ).toISOString()

    const params = {
      inicio: initialDate,
      fim: finishDate,
    }

    const response = await this.#payment.pixListWebhook(params)

    return response
  }

  async getWebhook(key: string = EFI_KEY_PIX) {
    try {
      const webhook = await this.#payment.pixDetailWebhook({
        chave: key,
      })

      return webhook
    } catch {}
  }

  async configWebhook(key: string = EFI_KEY_PIX) {
    const webhook = await this.getWebhook()

    if (webhook) {
      return
    }

    const response = await this.#payment.pixConfigWebhook(
      { chave: key },
      {
        webhookUrl: `${THIS_URL}/payment/webhook?hmac=${EFI_HMAC_KEY}`,
      },
    )

    return response
  }

  async removeWebhook(key: string) {
    const response = await this.#payment.pixDeleteWebhook({ chave: key })

    return response
  }

  async consultPix(txid: string) {
    const response = await this.#payment.pixDetailCharge({
      txid,
    })

    return response as ConsultPixReturn
  }

  async createKeyPix() {
    const key = await this.#payment.pixCreateEvp()

    return key
  }
}

const paymentApi = new Payment()

export default paymentApi
