import {
  checkBankDetailsServiceHealth
} from '../services/bank-details/bank-details-client.js'

// Diagnostic routes to prove connectivity to fcp-sfd-bank-details; not for use in production.
// Removal before real bank details are served is tracked by FLS2-474.
export const bankDetailsRoutes = [
  {
    method: 'GET',
    path: '/bank-details-check',
    options: {
      auth: false
    },
    handler: async (request, h) => {
      const { sts } = request
      const isHealthy = await checkBankDetailsServiceHealth(sts)

      return h.response({ message: isHealthy ? 'success' : 'failure' })
    }
  }
]
