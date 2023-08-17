import { app } from './app'

import 'dotenv/config'
const PORT = process.env.PORT

if (!PORT) {
  throw new Error('PORT is not defined!')
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}!`))
