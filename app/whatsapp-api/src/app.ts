import cors from 'cors'
import express from 'express'

import 'express-async-errors'

import errorMiddleware from './middlewares/error.middleware'
import { whatsappRouter } from './routes/whatsapp.router'

import 'dotenv/config'

class App {
  public app: express.Express

  constructor() {
    this.app = express()

    this.config()
    this.routes()
  }

  private config(): void {
    // const logger = pino({
    //   level: 'info',
    //   transport: {
    //     target: 'pino-pretty',
    //     options: {
    //       colorize: true,
    //     },
    //   }
    // })

    // this.app.use(logger)

    this.app.use(cors())
    this.app.use(express.json())
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

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App()
