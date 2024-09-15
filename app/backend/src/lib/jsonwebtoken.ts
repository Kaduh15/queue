import jwt, { JwtPayload } from 'jsonwebtoken'

import { env } from '@/config/env'

type AuthPayload<PayloadType = Record<string, unknown>> = PayloadType &
  JwtPayload

export class Auth {
  private static readonly secret = env.JWT_SECRET
  private static readonly expiresIn = env.JWT_EXPIRES_IN
  private static jwt = jwt

  static sign(payload: object | string, expiresIn: string | number = '1d') {
    return this.jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn || expiresIn,
    })
  }

  static verify<PayloadType = object>(token: string): AuthPayload<PayloadType> {
    return this.jwt.verify(token, this.secret) as AuthPayload<PayloadType>
  }
}
