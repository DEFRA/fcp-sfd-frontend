const getUserSessionToken = async (request) => {
  const session = await request.server.xapp.cache.get(request.auth.credentials.sessionId)
  return session.token
}

export {
  getUserSessionToken
}
