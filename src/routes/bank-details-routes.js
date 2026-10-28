import {
  checkBankDetailsServiceHealth,
  getBankDetails
} from '../services/bank-details/bank-details-client.js'

// Diagnostic routes to prove connectivity to fcp-sfd-bank-details; not for use in production.
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
  },
  {
    method: 'GET',
    path: '/bank-details-check/{sbi}',
    options: {
      auth: false
    },
    handler: async (request, h) => {
      const { params: { sbi }, sts } = request
      const bankDetails = await getBankDetails(sbi, sts)

      if (!bankDetails) {
        return h.response({ message: 'failure' }).code(502)
      }

      return h.response(bankDetails)
    }
  }
]
