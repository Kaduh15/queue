import express, { NextFunction, Request, Response } from 'express'

import 'express-async-errors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (_req: Request, res: Response) => {
  return res.json({ message: 'Hello World!' })
})

// Error handling
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
})

export { app }
