import User from '@/entities/user.entity'

import { BaseRepository } from '../base.repository'

export interface UserRepository extends BaseRepository<User> {
  getByEmail(email: string): Promise<User | undefined>
}
