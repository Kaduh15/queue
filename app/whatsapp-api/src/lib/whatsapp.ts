import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WAConnectionState,
  WASocket,
} from '@whiskeysockets/baileys'
import Boom from 'boom'
import fs from 'fs/promises'
import path from 'path'
import pino from 'pino'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class WhatsappInstance {
  private sock?: WASocket
  private qrCode?: string
  private connected: WAConnectionState = 'close'

  public async init(pathAuthFile = 'auth') {
    const { state, saveCreds } = await useMultiFileAuthState(
      `tokens/${pathAuthFile}`,
    )

    this.sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
    })

    this.setupEventHandlers(saveCreds)

    await sleep(5000)
    return this
  }

  public async logout(): Promise<void> {
    await this.sock?.logout()
  }

  public async getQRCode(): Promise<{ qrCode?: string; connected?: boolean }> {
    if (this.isConnected()) {
      return { connected: true }
    }

    if (this.qrCode) {
      return { qrCode: this.qrCode }
    }

    await this.waitForQRCode()
    return { qrCode: this.qrCode }
  }

  public isConnected(): boolean {
    return this.connected === 'open'
  }

  public async sendMessage(phone: string, text: string) {
    await this.waitConnectionOpen()

    const exist = await this.sock?.onWhatsApp(`${phone}@s.whatsapp.net`)
    if (!exist || !exist[0]?.exists) {
      throw new Error('Phone not found or invalid')
    }

    const result = await this.sock?.sendMessage(exist[0].jid, { text })
    if (result?.key?.id) {
      await this.sock?.waitForMessage(result.key.id, 5000)
    }

    return result
  }

  private async waitConnectionOpen(timeoutMs = 1000) {
    try {
      if (!this.sock) {
        throw new Error('Client not initialized')
      }
      await this.sock.waitForConnectionUpdate(
        (update) => update.connection === 'open',
        timeoutMs,
      )
      this.qrCode = undefined
      return true
    } catch (error) {
      return false
    }
  }

  private setupEventHandlers(saveCreds: () => Promise<void>) {
    this.sock?.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      if (connection) {
        this.connected = connection
      }

      if (qr) {
        this.qrCode = qr
      }

      if (connection === 'close') {
        await this.handleConnectionClose(lastDisconnect?.error)
        return
      }

      if (connection === 'open') {
        this.qrCode = undefined
        await this.handleConnectionOpen()
      }
    })

    this.sock?.ev.on('creds.update', saveCreds)
  }

  private async handleConnectionClose(error?: Error) {
    const shouldReconnect =
      new Boom(error).output.statusCode !== DisconnectReason.loggedOut

    if (shouldReconnect) {
      await this.init()
    } else {
      await this.cleanupAuthFiles()
      console.log('Whatsapp API closed')
    }
  }

  private async handleConnectionOpen() {
    if (!this.sock?.user) return
    await this.sock.sendMessage(this.sock.user.id, {
      text: 'Whatsapp API OPEN',
    })
  }

  private async cleanupAuthFiles() {
    try {
      await fs.rm(path.join(__dirname, '..', '..', 'tokens'), {
        recursive: true,
        maxRetries: 5,
        retryDelay: 1000,
      })
      await sleep(1000)
    } catch (error) {
      console.error('Failed to remove auth files:', error)
    }
  }

  private async waitForQRCode() {
    await this.sock?.waitForConnectionUpdate((update) => {
      const { qr } = update
      this.qrCode = qr || this.qrCode
      return !!qr
    })
  }
}
