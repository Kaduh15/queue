import { Request, Response, Router } from 'express'

import { client } from '@/server'

const whatsappRouter = Router()

whatsappRouter.get('/', async (_req: Request, res: Response) => {
  console.log('/')
  const isLogin = await client.hasLogged()
  if (isLogin) {
    return res.json({ logger: true })
  }

  const qrCode = await client.getQrCode(true)

  return res.json({ qrCode })
})

whatsappRouter.get('/send', async (req: Request, res: Response) => {
  console.log('send')
  const { text, phone } = req.query

  const message = (text as string) || 'Hello World!'
  if (!phone || typeof phone !== 'string') {
    return res.json({ status: 'error', message: 'Phone is required' })
  }

  if (await client.hasLogged()) {
    await client.sendMessage({ message, phone })
    return res.json({ status: 'ok', message, to: phone })
  }

  return res.json({ status: 'error', message: 'Not logger' })
})

whatsappRouter.get('/has-logged', async (_req: Request, res: Response) => {
  const isLogin = await client.hasLogged()
  return res.json({ isLogin })
})

export { whatsappRouter }
