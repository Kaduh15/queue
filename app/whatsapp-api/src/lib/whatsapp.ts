import Boom from 'boom'
import qrCodeTerminal from 'qrcode-terminal'
import { Client, LocalAuth } from 'whatsapp-web.js'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class WhatsappInstance {
  #client: Client
  connected = false
  qrCode: string | undefined

  constructor(pathAuthFile = 'auth') {
    this.#client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      authStrategy: new LocalAuth({
        dataPath: `tokens/${pathAuthFile}`,
      }),
    })

    this.#client.on('qr', async (qr) => {
      this.qrCode = qr
    })

    this.#client.on('ready', () => {
      console.log('Whatsapp client ready')
      this.qrCode = undefined
      this.connected = true
    })

    this.#client.initialize()
  }

  async logout() {
    await this.#client.logout()
    this.connected = false
  }

  async getQRCode(wait = true) {
    if (this.connected) return this.qrCode

    while (wait && !this.qrCode) {
      if (this.qrCode) wait = false
      await sleep(1000)
    }

    return this.qrCode
  }

  isConnected() {
    return this.connected
  }

  async sendMessage(phone: string, text: string) {
    try {
      const numberId = await this.#client.getNumberId(phone)
      if (!numberId) {
        throw Boom.badRequest('Invalid phone number')
      }

      const msg = await this.#client.sendMessage(numberId._serialized, text)
      return msg
    } catch (error) {
      console.error(error)
      throw Boom.badRequest('Invalid phone number')
    }
  }

  async awaitConnection() {
    while (!this.isConnected()) {
      await sleep(1000)
    }
  }
}

if (require.main === module) {
  async function main() {
    const client = new WhatsappInstance('test')

    let qr = await client.getQRCode()

    while (!qr) {
      qr = await client.getQRCode()
      await sleep(1000)
    }

    qrCodeTerminal.generate(qr, { small: true })

    await client.awaitConnection()

    await client.sendMessage('87996252178', 'Hello World')
  }

  main()
}
