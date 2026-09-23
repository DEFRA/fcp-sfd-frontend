import { checkBankDetailsServiceHealth } from '../services/bank-details/bank-details-client.js'

// Diagnostic route to prove connectivity to fcp-sfd-bank-details; not for use in production.
export const bankDetailsCheck = {
  method: 'GET',
  path: '/bank-details-check',
  options: {
    auth: false
  },
  handler: async (_request, h) => {
    const isHealthy = await checkBankDetailsServiceHealth()

    return h.response({ message: isHealthy ? 'success' : 'failure' })
  }
}
