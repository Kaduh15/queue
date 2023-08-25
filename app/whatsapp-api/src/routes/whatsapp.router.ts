import { Router } from 'express'

import { eventServer } from '../helps/events'
import { client } from '../server'

const whatsappRouter = Router()

whatsappRouter.get('/event/login', async (req, res) => {
  const event = 'login'
  eventServer.initEvent(res)

  if (client.isConnected()) {
    eventServer.sendEvent(event, { connected: true }, res)
  }

  const { qrCode } = await client.getQRCode()

  eventServer.sendEvent(event, { qrCode }, res)
  return eventServer.finishEvent(res)
})

whatsappRouter.get('/is-connected', async (req, res) => {
  return res.status(200).json({ connected: client.isConnected() })
})

whatsappRouter.get('/send', async (req, res) => {
  const { phone, text } = req.query

  if (!phone || !text) {
    return res.status(400).json({ error: 'Missing parameters' })
  }

  if (!client.isConnected()) {
    return res.status(500).json({ error: 'Client not connected' })
  }

  const msg = await client.sendMessage(phone as string, text as string)

  return res.status(200).json(msg)
})

export { whatsappRouter }
