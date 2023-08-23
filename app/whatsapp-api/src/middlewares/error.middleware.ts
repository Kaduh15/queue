import { NextFunction, Request, Response } from 'express'

export default function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err)
  return res.status(500).json({ error: err.message })
}
