import { NextFunction, Request, Response } from 'express'

import { HttpError } from '@/utils/http-errors'

function errorMiddleware(
  error: HttpError,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'

  response.status(status).send({
    message,
  })
}

export default errorMiddleware
