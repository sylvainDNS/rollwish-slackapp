import env from 'common-env'
import dotenv from 'dotenv'

dotenv.config()

export const config = env().getOrElseAll({
  hapi: {
    host: 'localhost',
    port: 4444,
  },
  node: {
    env: 'development',
  },
  puppeeter: {
    wish: { email: 'mail@mail.com', password: 'P@ssword' },
  },
  sqlite: {
    path: './dist/rollwish.db',
  },
})
