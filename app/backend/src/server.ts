import { App } from './app'
import 'dotenv/config'

const PORT = process.env.PORT

if (PORT) {
  new App().start(PORT)
} else {
  console.log('APP_PORT is not defined')
}
