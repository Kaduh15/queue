import { App } from './app'
import { env } from './config/env'

const PORT = env.PORT

if (PORT) {
  new App().start(PORT)
} else {
  console.log('APP_PORT is not defined')
}
