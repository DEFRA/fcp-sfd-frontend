import { rawPersonalDetailsSchema } from '../schemas/dal/personal-details-schema.js'
import { createLogger } from '../utils/logger.js'

/**
 * Takes the raw data and maps it to a more usable format
 *
 * @param {Object} raw - The raw response payload from the DAL
 *
 * @returns {Object} Formatted personal details data
 */

export const mapPersonalDetails = (raw) => {
    const logger = createLogger()

    const { error, value } = rawPersonalDetailsSchema.validate(raw)

    if (error) {
        logger.error(`Validation fail for DAL response: ${error.message}`)
        throw new Error(`Validation fail for DAL response: ${error.message}`)
    }

    return {
        crn: value.customer.crn,
        info: {
            dateOfBirth: value.customer.info.dateOfBirth,
            name: `${value.customer.info.name.title} ${value.customer.info.name.first} ${value.customer.info.name.middle} ${value.customer.info.name.last}`
        },
        address: {
            lookup: {
                buildingNumberRange: value.customer.info.address.buildingNumberRange,
                flatName: value.customer.info.address.flatName,
                buildingName: value.customer.info.address.buildingName,
                street: value.customer.info.address.street,
                city: value.customer.info.address.city,
                county: value.customer.info.address.county
            },
            manual: {
                line1: value.customer.info.address.line1,
                line2: value.customer.info.address.line2,
                line3: value.customer.info.address.line3,
                line4: value.customer.info.address.line4,
                line5: value.customer.info.address.line5
            },
            postcode: value.customer.info.address.postalCode,
            country: value.customer.info.address.country
        },
        phone: {
            email: value.customer.info.email.address,
            landline: value.customer.info.phone.landline,
            mobile: value.customer.info.phone.mobile
        }
    }
}