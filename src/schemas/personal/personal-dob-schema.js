import Joi from 'joi'

export const personalDobSchema = Joi.object({
  day: Joi.string().allow(''),
  month: Joi.string().allow(''),
  year: Joi.string().allow('')
}).custom((value, helpers) => {
  const { day, month, year } = value

  // Create an error and manually set its path to allow the input boxes to highlight
  const makeError = (code, fields) => {
    const error = helpers.error(code)
    error.path = fields

    return error
  }

  // Nothing entered
  if (!day && !month && !year) {
    return makeError('dob.missingAll', ['day', 'month', 'year'])
  }

  // Missing combinations
  if (!day && month && year) {
    return makeError('dob.missingDay', ['day'])
  }
  if (day && !month && year) {
    return makeError('dob.missingMonth', ['month'])
  }
  if (day && month && !year) {
    return makeError('dob.missingYear', ['year'])
  }
  if (!day && !month && year) {
    return makeError('dob.missingDayMonth', ['day', 'month'])
  }
  if (!day && month && !year) {
    return makeError('dob.missingDayYear', ['day', 'year'])
  }
  if (day && !month && !year) {
    return makeError('dob.missingMonthYear', ['month', 'year'])
  }

  // Year not 4 digits
  if (year && year.length !== 4) {
    return makeError('dob.yearLength', ['year'])
  }

  // Validate the actual date
  const d = Number.parseInt(day, 10)
  const m = Number.parseInt(month, 10)
  const y = Number.parseInt(year, 10)
  const date = new Date(y, m - 1, d)

  if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d) {
    return makeError('dob.invalid', ['day', 'month', 'year'])
  }

  // Future date check
  if (date > new Date()) {
    return makeError('dob.future', ['day', 'month', 'year'])
  }

  return value
}).messages({
  'dob.missingAll': 'Enter your date of birth',
  'dob.missingDay': 'Date of birth must include a day',
  'dob.missingMonth': 'Date of birth must include a month',
  'dob.missingYear': 'Date of birth must include a year',
  'dob.missingDayMonth': 'Date of birth must include a day and month',
  'dob.missingDayYear': 'Date of birth must include a day and year',
  'dob.missingMonthYear': 'Date of birth must include a month and year',
  'dob.yearLength': 'Enter a year with 4 numbers, like 1975',
  'dob.invalid': 'Date of birth must be a real date',
  'dob.future': 'Date of birth must be in the past'
})
