import { SCOPE } from '../constants/scope/business-details.js'

export const home = {
  method: 'GET',
  path: '/home',
  options: {
    auth: { scope: SCOPE }
  },
  handler: (_request, h) => {
    return h.view('home')
  }
}
