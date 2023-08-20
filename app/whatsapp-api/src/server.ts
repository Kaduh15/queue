import { app } from './app'
import WAClient from './browser'

import 'dotenv/config'

const PORT = process.env.PORT
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

if (!PORT) {
  throw new Error('PORT is not defined!')
}

export const client = new WAClient()

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}!`)
  await client.init({
    headless: IS_PRODUCTION,
  })
  console.log('Client initialized!')
})
