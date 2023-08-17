import { app } from './app'

import 'dotenv/config'

import 'express-async-errors'

const PORT = process.env.PORT

if (!PORT) {
  throw new Error('PORT is not defined!')
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))
