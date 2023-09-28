import Sinon from 'sinon'
import { beforeEach, describe, expect, it } from 'vitest'

import { OpenRepositoryInMemory } from '@/repositories/open-repository/open-in-memory.repository'

import { OpenService } from './open.service'

describe('OpenService', () => {
  const openRepository = new OpenRepositoryInMemory()

  const openService = new OpenService(openRepository)

  it('should be defined', () => {
    expect(openService).toBeDefined()
  })

  it('should be an instance of openService', () => {
    expect(openService).toBeInstanceOf(OpenService)
  })

  describe('Method - login', async () => {
    describe('METHOD - create', () => {
      beforeEach(() => {
        Sinon.restore()
      })

      it('should create a new entity of the open table', async () => {
        const dateNow = new Date(Date.now().toString())
        const openOutput = {
          createdAt: dateNow,
          id: 1,
          isOpen: false,
          updatedAt: dateNow,
        }

        Sinon.stub(openRepository, 'create').resolves(openOutput)

        const open = await openService.create()

        expect(open).toEqual(openOutput)
      })
    })

    describe('METHOD - toggle', () => {
      beforeEach(() => {
        Sinon.restore()
      })

      it('should change state from open to closed', async () => {
        const dateNow = new Date(Date.now().toString())
        const openOutput = {
          createdAt: dateNow,
          id: 1,
          isOpen: true,
          updatedAt: dateNow,
        }

        Sinon.stub(openRepository, 'getById').resolves(openOutput)
        Sinon.stub(openRepository, 'update').resolves(openOutput)

        const open = await openService.toggle()

        expect(open).toEqual(openOutput)
      })
    })

    describe('METHOD - get', () => {
      beforeEach(() => {
        Sinon.restore()
      })

      it('should return the entity of the open table', async () => {
        const dateNow = new Date(Date.now().toString())
        const openOutput = {
          createdAt: dateNow,
          id: 1,
          isOpen: true,
          updatedAt: dateNow,
        }

        Sinon.stub(openRepository, 'getById').resolves(openOutput)

        const open = await openService.get()

        expect(open).toEqual(openOutput)
      })
    })
  })
})
