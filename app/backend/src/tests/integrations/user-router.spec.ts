import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import sinon from 'sinon'
import { afterEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import prisma from '@/prisma/prisma-client'

chai.use(chaiHttp)

const { request } = chai

describe('User', async () => {
  afterEach(async () => {
    sinon.restore()
  })
  describe('POST /user', () => {
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

      prisma.user.findUnique = sinon.stub().resolves(null)
      prisma.user.create = sinon.stub().resolves(userOutput)

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

      prisma.user.findMany = sinon.stub().resolves(users)

      const { status, body } = await request(app).get('/user')

      expect(status).to.be.equal(StatusCodes.OK)
      expect(body).to.be.deep.equal(users)
    })
  })
})
