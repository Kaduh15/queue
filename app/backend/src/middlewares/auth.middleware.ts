import { NextFunction, Request, Response } from 'express'

import { Role } from '@/entities/user.entity'
import { Auth } from '@/lib/jsonwebtoken'
import { NotFoundError, UnauthorizedError } from '@/utils/http-errors'

type AuthPayload = {
  role: Role
}

export default function authMiddleware(role?: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ').at(-1)
    if (!token) throw new NotFoundError('token not found')

    const payload = Auth.verify<AuthPayload>(token)

    if (role && payload.role !== role) {
      throw new UnauthorizedError('unauthorized')
    }

    return next()
  }
}
