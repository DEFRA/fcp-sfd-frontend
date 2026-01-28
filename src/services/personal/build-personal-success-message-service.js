/**
 * Builds a success notification message based on which personal details
 * were updated by the user.
 *
 * Returns either plain text (for a single change) or HTML (for multiple changes)
 * suitable for rendering inside a GOV.UK notification banner.
 * @module buildPersonalSuccessMessageService
 */

const buildPersonalSuccessMessage = (personalDetails) => {
  const changes = []

  if (personalDetails.changePersonalName) {
    changes.push('full name')
  }

  if (personalDetails.changePersonalEmail) {
    changes.push('personal email address')
  }

  if (personalDetails.changePersonalPhoneNumbers) {
    changes.push('personal phone numbers')
  }

  if (personalDetails.changePersonalDob) {
    changes.push('date of birth')
  }

  if (personalDetails.changePersonalAddress) {
    changes.push('personal address')
  }

  if (changes.length === 1) {
    return {
      type: 'text',
      value: `You have updated your ${changes[0]}`
    }
  }

  return {
    type: 'html',
    value: `
      <h3 class="govuk-notification-banner__heading">
        You have updated your:
      </h3>
      <ul class="govuk-list govuk-list--bullet">
        ${changes.map(change => `<li>${change}</li>`).join('')}
      </ul>
    `
  }
}

export {
  buildPersonalSuccessMessage
}
