export const home = {
  method: 'GET',
  path: '/home',
  options: {
    auth: { scope: ['BUSINESS_DETAILS:FULL_PERMISSION'] }
  },
  handler: (_request, h) => {
    return h.view('home')
  }
}
