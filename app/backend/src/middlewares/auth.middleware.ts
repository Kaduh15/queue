import { NextFunction } from 'express'

import { Auth } from '@/lib/jsonwebtoken'
import { NotFoundError, UnauthorizedError } from '@/utils/http-errors'

export default function authMiddleware(role?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.get('Authorization')?.split(' ').at(-1)
    if (!token) throw new NotFoundError('token not found')

    const payload = Auth.verify(token)

    if (role && payload.role !== role) {
      throw new UnauthorizedError('unauthorized')
    }

    return next()
  }
}
