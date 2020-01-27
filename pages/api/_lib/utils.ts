import { NowRequest } from '@now/node'

export const isDev =
  process.env.NOW_REGION === 'dev1' || process.env.NODE_ENV === 'development'

export function getRedirectUri(req: NowRequest) {
  return isDev
    ? `http://localhost:3000/api/now-playing`
    : `${req.headers['x-forwarded-proto']}://${req.headers.host}/api/now-playing`
}
