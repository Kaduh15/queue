import { Request, Response, Router } from 'express'

import { page } from '@/app'
import browser from '@/browser'
import { getQrCode, isLogger } from '@/browser/browser'

const whatsappRouter = Router()

whatsappRouter.get('/', async (_req: Request, res: Response) => {
  console.log('/')
  if (await isLogger(await page)) {
    return res.json({ logger: true })
  }

  const qrCode = await getQrCode(await page)

  return res.json({ qrCode })
})

whatsappRouter.get('/send/:phone', async (req: Request, res: Response) => {
  console.log('send')
  const { phone } = req.params
  const { text } = req.query

  const message = (text as string) || 'Hello World!'

  if (await isLogger(await page)) {
    await browser.sendMessage({ page: await page, message, phone })

    return res.json({ status: 'ok', message, to: phone })
  }

  return res.json({ status: 'error', message: 'Not logger' })
})

export { whatsappRouter }
