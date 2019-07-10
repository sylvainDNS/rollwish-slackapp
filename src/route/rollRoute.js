import { rollHandler } from '../handler/rollHandler'

export const rollRoute = server => {
  server.route({
    method: 'POST',
    path: '/roll',
    handler: request => {
      console.log('Request from: ', request.payload.user_name)
      console.log('Text command: ', request.payload.text)
      if (request.payload.text !== '') return rollHandler.add(request)
      else return rollHandler.get()
    },
  })
}
