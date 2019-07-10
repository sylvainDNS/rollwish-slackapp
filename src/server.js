import { Server } from '@hapi/hapi'

import { config } from './utils/config'
import { rollRoute } from './route/rollRoute'

export const start = () => {
  const server = Server({
    host: config.hapi.host,
    port: config.hapi.port,
  })

  server.start().then(
    () => console.log('Server listening on', server.info.uri),
    err => {
      console.error(err)
    }
  )

  rollRoute(server)
}
