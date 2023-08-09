import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import 'express-async-errors'

import errorMiddleware from './middlewares/error.middleware'
import { authRouter, openRouter, queueRouter, userRouter } from './routes'

import 'dotenv/config'

class App {
  public app: express.Express

  constructor() {
    this.app = express()

    this.config()
    this.routes()
  }

  private config(): void {
    this.app.use(
      morgan(
        ':method :url :status :res[content-length] - :response-time ms | :remote-addr',
      ),
    )

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
      }),
    )
    this.app.use(express.json())
  }

  private routes(): void {
    this.app.get('/', (_req, res) => {
      res.status(200).json({ Hello: 'world!' })
    })

    this.app.use('/user', userRouter)
    this.app.use('/login', authRouter)
    this.app.use('/open', openRouter)
    this.app.use('/queue', queueRouter)

    this.app.use(errorMiddleware)
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`))
  }
}

export { App }

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App()
