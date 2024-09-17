import WhatsappInstance from './lib/whatsapp' // Substitua pelo caminho correto

declare global {
  namespace Express {
    interface Request {
      client: WhatsappInstance
    }
  }
}
