import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { app } from '@/app'
import { userRepository } from '@/routes'

chai.use(chaiHttp)

const { request } = chai

describe('User', async () => {
  describe('POST /user', () => {
    afterEach(async () => {
      vi.resetAllMocks()
    })

    it('Should create an user', async () => {
      const userInput = {
        name: 'Any Name',
        email: 'any@email.com',
        password: 'any_password',
      }

      const { password: _, ...userOutput } = {
        id: 1,
        ...userInput,
        role: 'USER',
      }

      userRepository.getByEmail = vi.fn().mockResolvedValue(null)
      userRepository.create = vi.fn().mockResolvedValue(userOutput)

      const { status, body } = await request(app).post('/user').send(userInput)

      expect(status).to.be.equal(StatusCodes.CREATED)
      expect(body).to.be.deep.equal(userOutput)
    })
  })
  describe('GET /user', () => {
    it('Should get all users', async () => {
      const users = [
        {
          id: 1,
          name: 'Any Name',
          email: 'any@email.com',
          role: 'USER',
        },
      ]

      userRepository.getAll = sinon.stub().resolves(users)

      const { status, body } = await request(app).get('/user')

      expect(status).to.be.equal(StatusCodes.OK)
      expect(body).to.be.deep.equal(users)
    })
  })
})
