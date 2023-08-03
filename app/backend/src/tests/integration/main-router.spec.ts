import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { expect, it } from 'vitest'

import { app } from '@/app'

chai.use(chaiHttp)

const { request } = chai

it('Should return hello world', async () => {
  const { status, body } = await request(app).get('/')

  expect(status).toBe(StatusCodes.OK)
  expect(body).to.be.deep.equal({
    Hello: 'world!',
  })
})
