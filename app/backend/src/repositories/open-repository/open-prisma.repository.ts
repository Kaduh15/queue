import Open from '@/entities/open.entity'
import prisma from '@/prisma/prisma-client'

import { OpenRepository } from './open.repository'

export class OpenPrismaRepository implements OpenRepository {
  create(_data: Omit<Open, 'id' | 'createdAt' | 'updatedAt'>): Promise<Open> {
    throw new Error('Method not implemented.')
  }

  getAll(): Promise<Open[]> {
    throw new Error('Method not implemented.')
  }

  getById(_id: number): Promise<Open | undefined> {
    throw new Error('Method not implemented.')
  }

  async update(id: number, data: Partial<Open>): Promise<Open> {
    const openUpdated = await prisma.open.update({
      where: { id },
      data,
    })

    return new Open(openUpdated)
  }

  delete(_id: number): Promise<void> {
    throw new Error('Method not implemented.')
  }

  deleteAll(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
