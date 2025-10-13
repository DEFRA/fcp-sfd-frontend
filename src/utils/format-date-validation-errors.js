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
const dateError = 'Date of birth must be a real date'
const dayErrorRef = '#dobDay'
const monthErrorRef = '#dobMonth'
const yearErrorRef = '#dobYear'

export const formatDateValidationErrors = (errors) => {
  const datePartList = errors.map(e => e.path[0])
  const allInputErrorClass = {
    dayClass,
    monthClass,
    yearClass,
    dateErrorRef: dayErrorRef
  }
  if (datePartList.includes('year') && datePartList.includes('month') && datePartList.includes('day')) {
    if (isDateInputEmpty(errors, 'year') && isDateInputEmpty(errors, 'month') && isDateInputEmpty(errors, 'day')) {
      return {
        dateError: 'Enter your date of birth',
        ...allInputErrorClass
      }
    }
    return {
      dateError: 'Date of birth must be a real date',
      ...allInputErrorClass
    }
  }
  if (errors.some(e => e.message === 'Date of birth must be a date in the past')) {
    return {
      dateError: 'Date of birth must be a date in the past',
      ...allInputErrorClass
    }
  }
  return getInputConbinationMessage(errors, datePartList)
}

const getInputConbinationMessage = (errors, datePartList) => {
  if (datePartList.includes('month') && datePartList.includes('day')) {
    const dayMonthInputErrorClass = {
      dayClass,
      monthClass,
      dateErrorRef: dayErrorRef
    }

    if (isDateInputEmpty(errors, 'month') && isDateInputEmpty(errors, 'day')) {
      return {
        dateError: 'Date of birth must include a day and month',
        ...dayMonthInputErrorClass
      }
    }

    return {
      dateError,
      ...dayMonthInputErrorClass
    }
  }

  if (datePartList.includes('month') && datePartList.includes('year')) {
    const monthYearInputErrorClass = {
      yearClass,
      monthClass,
      dateErrorRef: monthErrorRef
    }
    if (isDateInputEmpty(errors, 'month') && isDateInputEmpty(errors, 'year')) {
      return {
        dateError: 'Date of birth must include a month and year',
        ...monthYearInputErrorClass
      }
    }
    return {
      dateError,
      ...monthYearInputErrorClass
    }
  }

  if (datePartList.includes('day') && datePartList.includes('year')) {
    const dayYearInputErrorClass = {
      yearClass,
      dayClass,
      dateErrorRef: dayErrorRef
    }
    if (isDateInputEmpty(errors, 'day') && isDateInputEmpty(errors, 'year')) {
      return {
        dateError: 'Date of birth must include a day and year',
        ...dayYearInputErrorClass
      }
    }
    return {
      dateError,
      ...dayYearInputErrorClass
    }
  }

  return getInputMessage(errors, datePartList)
}

const getInputMessage = (errors, datePartList) => {
  if (datePartList.includes('day')) {
    if (isDateInputEmpty(errors, 'day')) {
      return {
        dateError: 'Date of birth must include a day',
        dayClass,
        dateErrorRef: dayErrorRef
      }
    }
    return {
      dateError,
      dayClass,
      dateErrorRef: dayErrorRef
    }
  }

  if (datePartList.includes('month')) {
    if (isDateInputEmpty(errors, 'month')) {
      return {
        dateError: 'Date of birth must include a month',
        monthClass,
        dateErrorRef: monthErrorRef
      }
    }
    return {
      dateError,
      monthClass,
      dateErrorRef: monthErrorRef
    }
  }
  if (datePartList.includes('year')) {
    if (isDateInputEmpty(errors, 'year')) {
      return {
        dateError: 'Date of birth must include a year',
        yearClass,
        dateErrorRef: yearErrorRef
      }
    }
    if (errors.some(e => e.message === 'year must be 4 digits and greater than 1000' && e.path[0] === 'year')) {
      return {
        dateError: 'Enter a year with 4 numbers, like 1975',
        yearClass,
        dateErrorRef: yearErrorRef
      }
    }
    return {
      dateError,
      yearClass,
      dateErrorRef: yearErrorRef
    }
  }
  return {
    dateError,
    dayClass,
    monthClass,
    yearClass,
    dateErrorRef: dayErrorRef
  }
}

const isDateInputEmpty = (errors, datePart) => {
  if (errors.some(e => e.path[0] === datePart && e.context.value === '')) {
    return true
  }
  return false
}
