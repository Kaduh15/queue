import Open from '@/entities/open.entity'
import prisma from '@/prisma/prisma-client'

import { OpenRepository } from './open.repository'

export class OpenPrismaRepository implements OpenRepository {
  async create(
    data: Omit<Open, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Open> {
    const open = await prisma.open.create({
      data,
    })

    return new Open(open)
  }

  getAll(): Promise<Open[]> {
    throw new Error('Method not implemented.')
  }

  async getById(id: number): Promise<Open | undefined> {
    const open = await prisma.open.findUnique({
      where: { id },
    })

    if (!open) return undefined

    return new Open(open)
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

  async deleteAll(): Promise<void> {
    await prisma.open.deleteMany()
  }
}
