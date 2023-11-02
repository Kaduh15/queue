import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Sinon from 'sinon'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OpenRepositoryInMemory } from '@/repositories/open-repository/open-in-memory.repository'

import { OpenService } from '../../services/open.service'
import { OpenController } from './open.controller'

describe('OpenController', () => {
  const openRepository = new OpenRepositoryInMemory()

  const openService = new OpenService(openRepository)

  const openController = new OpenController(openService)

  it('should be defined', () => {
    expect(openController).toBeDefined()
  })

  it('should be an instance of openController', () => {
    expect(openController).toBeInstanceOf(OpenController)
  })

  describe('Method - get', async () => {
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

      const req = {} as Request

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response

      Sinon.stub(openService, 'get').resolves(openOutput)

      await openController.get(req, res)

      expect(res.json).toBeCalled()
      expect(res.json).toBeCalledWith(openOutput)

      expect(res.status).toBeCalled()
      expect(res.status).toBeCalledWith(StatusCodes.OK)
    })
  })

  describe('Method - toggle', async () => {
    beforeEach(() => {
      Sinon.restore()
    })

    it('should change state from open to closed', async () => {
      const dateNow = new Date()

      const openOutput = {
        createdAt: dateNow,
        id: 1,
        isOpen: true,
        updatedAt: dateNow,
      }

      const req = {} as Request

      const res = {
        json: vi.fn(),
        status: vi.fn().mockReturnThis(),
      } as unknown as Response

      Sinon.stub(openService, 'toggle').resolves({
        ...openOutput,
      })

      await openController.toggle(req, res)

      expect(res.status).toBeCalled()
      expect(res.status).toBeCalledWith(StatusCodes.OK)

      expect(res.json).toBeCalled()
      expect(res.json).toBeCalledWith(openOutput)

      Sinon.restore()
      Sinon.stub(openService, 'toggle').resolves({
        ...openOutput,
        isOpen: false,
      })

      await openController.toggle(req, res)

      expect(res.status).toBeCalled()
      expect(res.status).toBeCalledWith(StatusCodes.OK)

      expect(res.json).toBeCalled()
      expect(res.json).toBeCalledWith(openOutput)
    })
  })
})
