// /**
//  * Fetches the business details data along with the updated data from the key provided
//  * @module fetchUpdatedBusinessDetailsService
//  */

// import { fetchBusinessDetailsService } from '../../../services/business/fetch-business-details-service.js'

// const fetchUpdatedBusinessDetailsService = async (yar, key) => {
//   const businessDetails = await fetchBusinessDetailsService(yar)

//   if (businessDetails[`change${key}`]) {
//     const updatedBusinessDetails = { ...businessDetails, [`change${key}`]:businessDetails[`change${key}`] }

//     yar.set('businessDetails', updatedBusinessDetails)

//     return updatedBusinessDetails
//   }

//   return businessDetails
// }

// export {
//   fetchUpdatedBusinessDetailsService
// }
