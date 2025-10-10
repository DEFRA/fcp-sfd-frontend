/**
 * Transforms raw gov.uk dateinput validation errors for date of birth from Joi into a format suitable for form display
 *
 * @param {Array<Object>} errors - Array of validation error objects for date of birth from Joi
 *
 * @returns {Object} Formatted errors object with display style classes
 */

const dayClass = 'govuk-input--width-2  govuk-input--error'
const monthClass = 'govuk-input--width-2  govuk-input--error'
const yearClass = 'govuk-input--width-4  govuk-input--error'

export const formatDateValidationErrors = (errors) => {
  const datePartList = errors.map(e => e.path[0])
  if (datePartList.includes('year') && datePartList.includes('month') && datePartList.includes('day')) {
    return {
      dateError: 'Date of birth must be a real date',
      dayClass,
      monthClass,
      yearClass
    }
  }
  if (errors.some(e => e.message === 'Date of birth must be a date in the past')) {
    return {
      dateError: 'Date of birth must be a date in the past',
      dayClass,
      monthClass,
      yearClass
    }
  }
  return getInputConbinationMessage(datePartList)
}

const getInputConbinationMessage = (datePartList) => {
  if (datePartList.includes('month') && datePartList.includes('day')) {
    return {
      dateError: 'Date of birth must include valid day and month',
      dayClass,
      monthClass
    }
  }
  if (datePartList.includes('month') && datePartList.includes('year')) {
    return {
      dateError: 'Date of birth must include valid month and year',
      monthClass,
      yearClass
    }
  }
  if (datePartList.includes('day') && datePartList.includes('year')) {
    return {
      dateError: 'Date of birth must include valid day and year',
      dayClass,
      yearClass
    }
  }
  if (datePartList.includes('day')) {
    return {
      dateError: 'Date of birth must include valid day',
      dayClass
    }
  }
  if (datePartList.includes('month')) {
    return {
      dateError: 'Date of birth must include valid month',
      monthClass
    }
  }
  if (datePartList.includes('year')) {
    return {
      dateError: 'Date of birth must include valid year',
      yearClass
    }
  }
  return {
    dateError: 'Invalid date'
  }
}
