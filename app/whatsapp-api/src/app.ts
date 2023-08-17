import express, { Request, Response } from 'express'

import 'dotenv/config'
import 'express-async-errors'

import browser from './browser'
import errorMiddleware from './middlewares/error.middleware'
import { whatsappRouter } from './routes/whatsapp.router'

export const ONE_SECOND = 1000
export const ONE_MINUTE = ONE_SECOND * 60

const app = express()
const newBrowser = browser.createBrowser()
export const page = newBrowser.then(async (browser) => {
  const p = await browser.newPage()

  p.on('dialog', async (dialog) => {
    console.log(dialog.message())
    await dialog.dismiss()
  })

  p.on('popup', async (popup) => {
    await popup.close()
  })

  return p
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (_req: Request, res: Response) => {
  return res.json({ message: 'Hello World!' })
})

app.use('/whatsapp', whatsappRouter)

// Error handling
app.use(errorMiddleware)

export { app }
