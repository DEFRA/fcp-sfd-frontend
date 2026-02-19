/**
 * Builds a success notification message based on which business details
 * were updated by the user.
 *
 * Returns either plain text (for a single change) or HTML (for multiple changes)
 * suitable for rendering inside a GOV.UK notification banner.
 * @module buildBusinessSuccessMessageService
 */

const buildBusinessSuccessMessage = (businessDetails) => {
  const changes = []

  if (businessDetails.changeBusinessName) {
    changes.push('business name')
  }

  if (businessDetails.changeBusinessEmail) {
    changes.push('business email address')
  }

  if (businessDetails.changeBusinessPhoneNumbers) {
    changes.push('business phone numbers')
  }

  if (businessDetails.changeBusinessVat) {
    changes.push('business vat number')
  }

  if (businessDetails.changeBusinessAddress) {
    changes.push('business address')
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
  buildBusinessSuccessMessage
}
