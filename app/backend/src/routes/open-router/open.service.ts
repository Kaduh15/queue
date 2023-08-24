import { OpenRepository } from '@/repositories/open-repository/open.repository'

export class OpenService {
  private model: OpenRepository

  constructor(model: OpenRepository) {
    this.model = model
  }

  async create() {
    const isOpen = await this.model.create({
      isOpen: false,
    })

    return { isOpen }
  }

  async toggle() {
    const isOpen = await this.model.getById(1)

    if (!isOpen) {
      const createOpen = await this.model.create({
        isOpen: false,
      })

      return createOpen
    }

    const updatedOpen = await this.model.update(1, {
      isOpen: !isOpen.isOpen,
    })

    return updatedOpen
  }

  async get() {
    const isOpen = await this.model.getById(1)

    if (!isOpen) {
      const createOpen = await this.model.create({
        isOpen: false,
      })
      return createOpen
    }

    return isOpen
  }
}
