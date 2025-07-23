export const home = {
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessDetailsService(request.yar)
    const pageData = homePresenter(request.yar)

    return h.view('home.njk', pageData)
  }
}


