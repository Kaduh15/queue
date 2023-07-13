import { PrismaClient } from '@prisma/client'
import { get } from 'http'

type OpenServiceProps = {
  prisma: PrismaClient
}

export class OpenService {
  private prisma: PrismaClient

  constructor({ prisma }: OpenServiceProps) {
    this.prisma = prisma
  }

  async create() {
    const isOpen = await this.prisma.open.create({
      data: { isOpen: false },
    })

    return { isOpen }
  }

  async toggle() {
    const isOpen = await this.prisma.open.findUnique({ where: { id: 1 } })

    if (!isOpen) {
      const createOpen = await this.prisma.open.create({
        data: { isOpen: false },
      })
      return { isOpen: createOpen }
    }

    const updatedOpen = await this.prisma.open.update({
      where: { id: 1 },
      data: { isOpen: !isOpen.isOpen },
    })

    return { isOpen: updatedOpen }
  }

  async get() {
    const isOpen = await this.prisma.open.findUnique({ where: { id: 1 } })

    if (!isOpen) {
      const createOpen = await this.prisma.open.create({
        data: { isOpen: false },
      })
      return { isOpen: createOpen }
    }

    return { isOpen }
  }
}
