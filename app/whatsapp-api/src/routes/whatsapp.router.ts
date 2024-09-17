import { Router, Request, Response } from 'express'

import { eventServer } from '../helps/events'

const whatsappRouter: Router = Router()

whatsappRouter.get('/event/login', async (req: Request, res: Response) => {
  const event = 'login'
  eventServer.initEvent(res)

  try {
    if (req.client.isConnected()) {
      eventServer.sendEvent(event, { connected: true }, res)
    }

    const qrCode = await req.client.getQRCode()
    eventServer.sendEvent(event, qrCode, res)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get QR code' })
  } finally {
    eventServer.finishEvent(res)
  }
})

whatsappRouter.get('/is-connected', (req: Request, res: Response) => {
  return res.status(200).json({ connected: req.client.isConnected() })
})

whatsappRouter.get('/send', async (req: Request, res: Response) => {
  const phone = req.query.phone as string
  const text = req.query.text as string

  if (!phone || !text) {
    return res.status(400).json({ error: 'Missing parameters: phone or text' })
  }

  if (!req.client.isConnected()) {
    return res.status(500).json({ error: 'Client not connected' })
  }

  try {
    const msg = await req.client.sendMessage(phone, text)
    return res.status(200).json({
      success: true,
      message: msg?.message,
    })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' })
  }
})

export { whatsappRouter }
