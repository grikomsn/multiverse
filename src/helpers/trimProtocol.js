const trimProtocol = url => {
  return url.replace(/^https?:\/\//i, '')
}

export default trimProtocol
