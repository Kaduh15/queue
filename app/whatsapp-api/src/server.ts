import 'dotenv/config'
import { App } from './app'
import WhatsappInstance from './lib/whatsapp'

const PORT = process.env.PORT

const client = new WhatsappInstance()

export { client }

async function main() {
  if (PORT) {
    new App().start(PORT)
  } else {
    console.log('PORT is not defined')
  }
}

main()
