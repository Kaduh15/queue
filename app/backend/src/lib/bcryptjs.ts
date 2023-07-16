import { compare, hash } from 'bcryptjs'

export class Encrypt {
  static async hash(value: string) {
    return hash(value, 10)
  }

  static async compare(value: string, hash: string) {
    return compare(value, hash)
  }
}
