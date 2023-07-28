import Queue from '@/entities/queue.entity'

import { BaseRepository } from '../base.repository'

export interface QueueRepository extends BaseRepository<Queue> {
  getToday(): Promise<Queue[]>
}
