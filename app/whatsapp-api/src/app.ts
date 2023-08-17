import cors from 'cors'
import express, { Request, Response } from 'express'

import 'dotenv/config'
import 'express-async-errors'

import errorMiddleware from './middlewares/error.middleware'
import { whatsappRouter } from './routes/whatsapp.router'

export const ONE_SECOND = 1000
export const ONE_MINUTE = ONE_SECOND * 60

const app = express()

app.use(cors())

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
