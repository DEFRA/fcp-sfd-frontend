const getUserSessionToken = async (request) => {
    const session = await request.server.app.cache.get(request.auth.credentials.sessionId);
    return session.token;
};
