import { NextFunction } from 'express'

import { Auth } from '@/lib/jsonwebtoken'
import { HttpError } from '@/utils/http-errors'

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) throw new HttpError('token not found', 404)

  Auth.verify(token)

  return next()
}
