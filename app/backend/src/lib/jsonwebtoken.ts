import dotenv from 'dotenv'
import jwt, { Secret } from 'jsonwebtoken'

dotenv.config()

export class auth {
  private static readonly secret = process.env.JWT_SECRET as Secret
  private static readonly expiresIn = process.env.JWT_EXPIRES_IN as string
  private static jwt = jwt

  static sign(payload: object | string, expiresIn?: string | number) {
    return this.jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
  }

  static verify(token: string) {
    return this.jwt.verify(token, this.secret)
  }
}
