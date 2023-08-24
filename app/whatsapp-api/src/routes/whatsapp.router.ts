import { Router } from 'express'

import { client } from '../server'

const whatsappRouter = Router()

whatsappRouter.get('/login', async (req, res) => {
  if (!client) {
    return res.status(500).json({ error: 'Client not initialized' })
  }

  const result = await client.getQRCode()

  return res.status(200).json(result)
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
