import Joi from 'joi'

import {
  checkBankDetailsServiceHealth,
  getBankDetails
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
  },
  {
    method: 'GET',
    path: '/bank-details-check/{sbi}',
    options: {
      auth: false,
      // Hapi decodes %2F in path params, so without this an encoded traversal
      // such as `..%2Fhealth` would reach other paths on fcp-sfd-bank-details
      validate: {
        params: Joi.object({
          sbi: Joi.string().pattern(/^\d{9}$/).required()
        })
      }
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
