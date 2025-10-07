import Joi from 'joi'

const currentDate = new Date()
const maxYear = currentDate.getFullYear()
const maxCurrentMonth = currentDate.getMonth()
const MAX_MONTH = 12
const MAX_MONTH_30 = 30
const MAX_MONTH_31 = 31

export const personalDobSchema = Joi.object({
  year: Joi.number().required().integer().min(1900).max(maxYear).messages({
    'number.integer': 'year must be valid',
    'any.required': 'year is required'
  }),
  month: Joi.when('year', { is: maxYear, then: Joi.number().required().integer().max(maxCurrentMonth), otherwise: Joi.number().required().integer().max(MAX_MONTH) }).messages({
    'number.integer': 'month must be valid',
    'any.required': 'month is required'
  }),
  day: Joi.alternatives()
    .conditional('month', [
      { is: 1, then: Joi.number().required().integer().max(29) },
      { is: 3, then: Joi.number().required().integer().max(MAX_MONTH_30) },
      { is: 5, then: Joi.number().required().integer().max(MAX_MONTH_30) },
      { is: 8, then: Joi.number().required().integer().max(MAX_MONTH_30) },
      { is: 10, then: Joi.number().required().integer().max(MAX_MONTH_30), otherwise: Joi.number().required().integer().max(MAX_MONTH_31) }
    ]).messages({
      'number.integer': 'month must be valid',
      'any.required': 'month is required'
    })
})
