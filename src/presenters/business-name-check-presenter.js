/**
 * Formats data ready for presenting in the `/business-name-check` page
 * @module businessNameCheck
 */

const businessNameCheckPresenter = (data) => {
    // Sort back link
    // Deal with error messages
    return {
        backLink: '/business-details',
        businessName: 'Agile Farm Ltd',
        sbi: '12345678',
        userName: 'Andrew Farmer',
        pageTitle: 'What is your business name?',
        metaDescription: 'Update the name for your business.',
    }
}

export {
    businessNameCheckPresenter
}