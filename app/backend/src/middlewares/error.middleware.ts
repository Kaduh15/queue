import { HttpError } from '@/utils/http-errors'
import { Request, Response } from 'express'

export default function errorMiddleware(
  err: HttpError,
  req: Request,
  res: Response,
) {
  const status = err.status || 500
  res.status(status).send(err.message)
}
