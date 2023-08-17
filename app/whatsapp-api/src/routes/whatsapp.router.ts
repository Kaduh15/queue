import { Request, Response, Router } from 'express'

import { getQrCode, isLogger, sendMessage } from '@/browser'

const whatsappRouter = Router()

whatsappRouter.get('/', async (_req: Request, res: Response) => {
  console.log('/')
  const isLogin = await isLogger()
  if (isLogin) {
    return res.json({ logger: true })
  }

  const qrCode = await getQrCode()

  return res.json({ qrCode })
})

whatsappRouter.get('/send/:phone', async (req: Request, res: Response) => {
  console.log('send')
  const { phone } = req.params
  const { text } = req.query

  const message = (text as string) || 'Hello World!'

  if (await isLogger()) {
    await sendMessage({ message, phone })
    return res.json({ status: 'ok', message, to: phone })
  }

  return res.json({ status: 'error', message: 'Not logger' })
})

export { whatsappRouter }
