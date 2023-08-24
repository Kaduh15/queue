import makeWASocket, {
  DisconnectReason,
  WASocket,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import Boom from 'boom'
import { pino } from 'pino'
import qrCodeTerminal from 'qrcode-terminal'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class WhatsappInstance {
  sock?: WASocket
  qrCode: string | undefined

  async init(pathAuthFile = 'auth') {
    const { state, saveCreds } = await useMultiFileAuthState(
      `auth/${pathAuthFile}`,
    )

    this.sock = makeWASocket({
      auth: state,
      defaultQueryTimeoutMs: undefined,
      logger: pino({
        level: 'silent',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }),
    })

    this.sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        this.qrCode = qr
      }

      if (connection === 'close') {
        const shouldReconnect =
          new Boom(lastDisconnect?.error).output.statusCode !==
          DisconnectReason.loggedOut

        if (shouldReconnect) {
          this.init(pathAuthFile)
        }
        return
      }

      if (connection === 'open') {
        this.qrCode = undefined
      }
    })

    this.sock.ev.on('creds.update', saveCreds)

    await sleep(2000)
    return this
  }

  async logout() {
    await this.sock?.logout()
  }

  async getQRCode() {
    if (this.isConnected()) {
      return {
        connected: true,
      }
    }
    if (this.qrCode) {
      return {
        qrCode: this.qrCode,
      }
    }

    await this.sock?.waitForConnectionUpdate((update) => {
      const { qr } = update

      this.qrCode = qr || this.qrCode
      return !!qr
    })

    return {
      qrCode: this.qrCode,
    }
  }

  isConnected() {
    return !!this.sock?.user
  }

  async sendMessage(phone: string, text: string) {
    await this.waitConnectionOpen()

    const exist = await this.sock?.onWhatsApp(phone + '@s.whatsapp.net')

    if (!exist || !exist[0].exists) {
      throw new Error('Phone not found or invalid')
    }

    const result = await this.sock?.sendMessage(exist[0].jid, { text })

    if (result?.key?.id) {
      await this.sock?.waitForMessage(result.key.id, 5000)
    }

    return result
  }

  async waitConnectionOpen(timeoutMs: number | undefined = 1000) {
    try {
      if (!this.sock) {
        throw new Error('Client not initialized1')
      }
      await this.sock.waitForConnectionUpdate((update) => {
        const { connection } = update
        return connection === 'open'
      }, timeoutMs)

      this.qrCode = undefined
      return true
    } catch (error) {
      return false
    }
  }
}

if (require.main === module) {
  async function main() {
    const client = await new WhatsappInstance().init('test')

    const qr = await client.getQRCode()
    if (qr.qrCode) {
      qrCodeTerminal.generate(qr.qrCode, { small: true })
    }
    await client.waitConnectionOpen(60000)

    await client.sendMessage('5587996252178', 'Hello World')
  }

  main()
}
