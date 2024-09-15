import 'dotenv/config'
import { z } from 'zod'

const envSchema = z
  .object({
    PORT: z.string().default('3000'),
    JWT_SECRET: z.string().default('SENHACECRETA'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    POSTGRES_USER: z.string().default('admin'),
    POSTGRES_PASSWORD: z.string().default('admin'),
    POSTGRES_DB: z.string().default('queue'),
    POSTGRES_HOST: z.string().default('localhost'),
    POSTGRES_PORT: z.string().default('5432'),
    DATABASE_URL: z.string().optional(),
    DEPLOY_URL: z.string().default('http://locahost:3000'),
    MP_ACCESS_TOKEN: z.string().optional(),
    WHATSAPP_API_URL: z.string().optional(),
  })
  .transform((env) => {
    return {
      ...env,
      DATABASE_URL:
        env.DATABASE_URL ||
        `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`,
    }
  })

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
