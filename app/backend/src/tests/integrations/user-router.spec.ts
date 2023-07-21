import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import sinon from 'sinon'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

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
      prisma.user.create = sinon.stub().resolves({
        id: 1,
        name: 'Any Name',
        email: 'any@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'USER',
        password: 'any_password',
      })

      const { status, body } = await request(app).post('/user').send({
        name: 'Any Name',
        email: 'any@email.com',
        password: 'any_password',
      })

      expect(status).to.be.equal(StatusCodes.CREATED)
    })
  })
})
