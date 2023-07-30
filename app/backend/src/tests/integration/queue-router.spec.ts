import chai from 'chai'
import chaiHttp from 'chai-http'
import { StatusCodes } from 'http-status-codes'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { app } from '@/app'
import Queue from '@/entities/queue.entity'
import { Auth } from '@/lib/jsonwebtoken'
import { queueRepository } from '@/routes'
import { CreateQueueSchema } from '@/routes/queue-router/schemas/queue-create.schema'

chai.use(chaiHttp)

const { request } = chai

describe('Queue', async () => {
  describe('POST /queue', () => {
    afterEach(async () => {
      vi.resetAllMocks()
    })

    it('Should create an queue', async () => {
      const queueInput: CreateQueueSchema = {
        name: 'Any Name',
        phoneNumber: '12345678910',
      }

      const now = new Date()

      const queueOutput: Queue = {
        id: 1,
        ...queueInput,
        status: 'WAITING',
        createdAt: now,
        updatedAt: now,
      }

      queueRepository.create = vi.fn().mockResolvedValue(queueOutput)

      Auth.verify = vi.fn().mockReturnValue({
        role: 'ADMIN',
      })

      const { status, body } = await request(app)
        .post('/queue')
        .set('Authorization', 'Bearer token')
        .send(queueInput)

      expect(status).to.be.equal(StatusCodes.CREATED)
      expect(body).to.be.deep.equal({
        ...queueOutput,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      })
    })
  })

  describe('GET /queue/today', () => {
    it('should get all current day customers', async () => {
      queueRepository.getToday = vi.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Any Name 1',
          phoneNumber: '123456789',
        },
      ])

      const { status, body } = await request(app).get('/queue/today')

      expect(status).to.be.equal(StatusCodes.OK)
      expect(body).toHaveProperty('length', 1)
    })
  })
})
