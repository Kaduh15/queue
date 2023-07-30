import Queue from '@/entities/queue.entity'

import { BaseRepository } from '../base.repository'

export interface QueueRepository extends BaseRepository<Queue> {
  create(
    data: Omit<Queue, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<Queue>
  getToday(): Promise<Queue[]>
}
