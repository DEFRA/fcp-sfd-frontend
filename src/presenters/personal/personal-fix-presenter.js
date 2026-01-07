/**
 * Formats data ready for presenting in the `/personal-fix` page
 * @module personalFixPresenter
 */

const personalFixPresenter = (personalDetails) => {
  console.log('🚀 ~ personalDetails in fix presenter:', personalDetails)
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'Update your personal details',
    metaDescription: 'Update your personal details.',
    updateText: updateText(personalDetails.source),
    listOfErrors: listOfErrors(personalDetails.validationErrors, personalDetails.source)
  }
}

const listOfErrors = (validationErrors, source) => {
  // The order in which fields should be listed
  const orderedFields = ['name', 'dob', 'address', 'phone', 'email']

  const errorLabels = {
    name: 'personal name',
    dob: 'personal date of birth',
    address: 'personal address',
    phone: 'personal phone number',
    email: 'personal email address'
  }

  const result = []
  for (const field of orderedFields) {
    if (validationErrors.includes(field) && field !== source) {
      result.push(errorLabels[field])
    }
  }

  return result
}

const updateText = (source) => {
  const startOfText = 'We will ask you to update these details as well as your'
  if (source === 'address') {
    return `${startOfText} personal address:`
  }

  if (source === 'name') {
    return `${startOfText} personal name:`
  }

  if (source === 'phone') {
    return `${startOfText} personal phone number:`
  }

  if (source === 'email') {
    return `${startOfText} personal email address:`
  }

  if (source === 'dob') {
    return `${startOfText} personal date of birth:`
  }
}

export {
  personalFixPresenter
}
