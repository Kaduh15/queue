import cors from 'cors'
import express from 'express'

import 'express-async-errors'

import WhatsappInstance from './lib/whatsapp'
import errorMiddleware from './middlewares/error.middleware'
import { whatsappRouter } from './routes/whatsapp.router'

import 'dotenv/config'

class App {
  public app: express.Express

  constructor(private readonly client: WhatsappInstance) {
    this.app = express()

    this.config()
    this.routes()
  }

  private config(): void {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use((req, res, next) => {
      if (!this.client) {
        return res.status(500).json({ error: 'Client not initialized' })
      }
      req.client = this.client
      next()
    })
  }

  private routes(): void {
    this.app.get('/', (_req, res) => {
      res.status(200).json({ Hello: 'world!' })
    })

    this.app.use(whatsappRouter)

    this.app.use(errorMiddleware)
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`))
  }
}

export { App }
