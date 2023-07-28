import express from 'express'

import 'express-async-errors'

import errorMiddleware from './middlewares/error.middleware'
import { authRouter, openRouter, queueRouter, userRouter } from './routes'

class App {
  public app: express.Express

  constructor() {
    this.app = express()

    this.config()
    this.routes()
  }

  private config(): void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,DELETE,OPTIONS,PUT,PATCH',
      )
      res.header('Access-Control-Allow-Headers', '*')
      next()
    }

    this.app.use(express.json())
    this.app.use(accessControl)
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
