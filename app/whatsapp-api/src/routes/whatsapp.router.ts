import { Router } from 'express'

import { sleep } from '../lib/whatsapp'
import { client } from '../server'

const whatsappRouter = Router()

whatsappRouter.get('/login', async (req, res) => {
  if (!client) {
    return res.status(500).json({ error: 'Client not initialized' })
  }

  if (client.hasInit) {
    await sleep(3000)
    const result = await client.getQRCode()
    console.log(
      '🚀 ~ file: whatsapp.router.ts:16 ~ whatsappRouter.get ~ result:',
      result,
    )

    return res.status(200).json(result)
  }

  await client.init()
  await sleep(3000)

  return res.status(200).json({ qrCode: client.qrCode })
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
