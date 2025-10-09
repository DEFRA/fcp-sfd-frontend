/**
 * Transforms raw gov.uk dateinput validation errors for date of birth from Joi into a format suitable for form display
 *
 * @param {Array<Object>} errors - Array of validation error objects for date of birth from Joi
 *
 * @returns {Object} Formatted errors object with display style classes
 */

export const formatDateValidationErrors = (errors) => {
  const datePartList = errors.map(e => e.path[0])

  if (datePartList.includes('year') && datePartList.includes('month') && datePartList.includes('day')) {
    return {
      dateError: 'Date of birth must be a real date',
      dayClass: 'govuk-input--width-2  govuk-input--error',
      monthClass: 'govuk-input--width-2  govuk-input--error',
      yearClass: 'govuk-input--width-4  govuk-input--error'
    }
  }
  if (errors.some(e => e.message === 'Date of birth must be a date in the past')) {
    return {
      dateError: 'Date of birth must be a date in the past',
      dayClass: 'govuk-input--width-2  govuk-input--error',
      monthClass: 'govuk-input--width-2  govuk-input--error',
      yearClass: 'govuk-input--width-4  govuk-input--error'
    }
  }
  if (datePartList.includes('month') && datePartList.includes('day')) {
    return {
      dateError: 'Date of birth must include valid day and month',
      dayClass: 'govuk-input--width-2  govuk-input--error',
      monthClass: 'govuk-input--width-2  govuk-input--error'
    }
  }
  if (datePartList.includes('month') && datePartList.includes('year')) {
    return {
      dateError: 'Date of birth must include valid month and year',
      monthClass: 'govuk-input--width-2  govuk-input--error',
      yearClass: 'govuk-input--width-4  govuk-input--error'
    }
  }
  if (datePartList.includes('day') && datePartList.includes('year')) {
    return {
      dateError: 'Date of birth must include valid day and year',
      dayClass: 'govuk-input--width-2  govuk-input--error',
      yearClass: 'govuk-input--width-4  govuk-input--error'
    }
  }
  if (datePartList.includes('day')) {
    return {
      dateError: 'Date of birth must include valid day',
      dayClass: 'govuk-input--width-2  govuk-input--error'
    }
  }
  if (datePartList.includes('month')) {
    return {
      dateError: 'Date of birth must include valid month',
      monthClass: 'govuk-input--width-2  govuk-input--error'
    }
  }
  if (datePartList.includes('year')) {
    return {
      dateError: 'Date of birth must include valid year',
      yearClass: 'govuk-input--width-4  govuk-input--error'
    }
  }
  return {
    dateError: 'Invalid date'
  }
}
