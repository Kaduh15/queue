import 'dotenv/config'
import { App } from './app'
import WhatsappInstance from './lib/whatsapp'

const PORT = process.env.PORT

new WhatsappInstance().init().then((client) => {
  if (PORT) {
    new App(client).start(PORT)
  } else {
    console.log('PORT is not defined')
  }
})
