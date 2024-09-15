import cors from 'cors'
import express from 'express'

import 'express-async-errors'

import errorMiddleware from './middlewares/error.middleware'
import {
  authRouter,
  openRouter,
  paymentRouter,
  queueRouter,
  userRouter,
} from './routes'

class App {
  public app: express.Express

  constructor() {
    this.app = express()

    this.config()
    this.routes()
  }

  private config(): void {
    this.app.use(cors())
    this.app.use(express.json())
    // logger middleware request
    this.app.use((req, _res, next) => {
      console.log(req.method, req.url)
      next()
    })
  }

  private routes(): void {
    this.app.get('/', (_req, res) => {
      res.status(200).json({ Hello: 'world!' })
    })

    this.app.use('/user', userRouter)
    this.app.use('/login', authRouter)
    this.app.use('/open', openRouter)
    this.app.use('/queue', queueRouter)
    this.app.use('/payment', paymentRouter)

    this.app.use('*', (_req, res) => {
      res.status(404).json({ message: 'Not found' })
    })
    this.app.use(errorMiddleware)
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`))
  }
}

export { App }

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App()
