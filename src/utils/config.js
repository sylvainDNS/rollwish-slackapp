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
  slack: {
    channel:
      'https://hooks.slack.com/services/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',
  },
  sqlite: {
    path: './dist/rollwish.db',
  },
})
