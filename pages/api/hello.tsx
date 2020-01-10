import { IncomingMessage, ServerResponse } from 'http'

export default (_req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ hello: 'world' }))
}
