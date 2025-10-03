import Joi from 'joi'

export const businessAddressLookupSchema = Joi.object({
  properties: Joi.object({
    UPRN: Joi.string().required(),
    ADDRESS: Joi.string().required(),
    ORGANISATION_NAME: Joi.string().allow(null),
    DEPARTMENT_NAME: Joi.string().allow(null),
    SUB_BUILDING_NAME: Joi.string().allow(null),
    BUILDING_NAME: Joi.string().allow(null),
    BUILDING_NUMBER: Joi.string().allow(null),
    DEPENDENT_THOROUGHFARE_NAME: Joi.string().allow(null),
    THOROUGHFARE_NAME: Joi.string().allow(null),
    DOUBLE_DEPENDENT_LOCALITY: Joi.string().allow(null),
    DEPENDENT_LOCALITY: Joi.string().allow(null),
    POST_TOWN: Joi.string().required(),
    POSTCODE: Joi.string().required(),
    LOCAL_CUSTODIAN_CODE_DESCRIPTION: Joi.string().required(),
    COUNTRY_CODE: Joi.string().required()
  }).unknown(true).required()
}).unknown(true)
