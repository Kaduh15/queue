import makeWASocket, {
  WASocket,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import { pino } from 'pino'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class WhatsappInstance {
  sock?: WASocket
  qrCode = ''
  hasInit = false

  async init() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')

    this.sock = makeWASocket({
      auth: state,
      defaultQueryTimeoutMs: undefined,
      logger: pino({
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
      mobile: true,
    })

    this.sock.ev.on('connection.update', async (update) => {
      const { connection, qr } = update
      if (qr) {
        this.qrCode = qr
        console.log(
          '🚀 ~ file: whatsapp.ts:33 ~ WhatsappInstance ~ this.sock.ev.on ~ qr:',
          qr,
        )
      }

      if (connection === 'close') {
        await this.init()
      }

      if (connection === 'open') {
        this.qrCode = ''
      }
    })

    this.sock.ev.on('creds.update', saveCreds)

    await sleep(3000)
    this.hasInit = true
  }

  async logout() {
    await this.sock?.logout()
  }

  async getQRCode() {
    if (this.isConnected()) {
      console.log('already connected')
      return {
        connected: true,
      }
    }

    console.log('not connected')
    await this.sock?.waitForConnectionUpdate((update) => {
      return !!update.qr
    })

    console.log('got qr code')
    return {
      qrCode: this.qrCode,
    }
  }

  isConnected() {
    return !!this.sock?.user
  }

  async sendMessage(phone: string, text: string) {
    if (!this.sock) {
      throw new Error('Client not initialized')
    }

    if (!this.isConnected()) {
      throw new Error('Client not connected')
    }

    const [exist] = await this.sock.onWhatsApp(phone + '@s.whasatpp.net')
    console.log(
      '🚀 ~ file: whatsapp.ts:92 ~ WhatsappInstance ~ sendMessage ~ exist:',
      exist,
    )

    if (!exist.exists) {
      throw new Error('Phone not found')
    }

    const result = await this.sock.sendMessage(exist.jid, { text })

    if (result?.key?.id) {
      await this.sock.waitForMessage(result.key.id)
    }

    return result
  }
}
