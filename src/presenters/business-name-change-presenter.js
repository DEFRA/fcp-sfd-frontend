/**
 * Formats data ready for presenting in the `/business-name-change` page
 * @module businessNameChange
 */

const businessNameChangePresenter = (data, payload) => {
    return {
        backLink: '/business-details',
        pageTitle: 'What is your business name?',
        metaDescription: 'Update the name for your business.',
        businessName: data.businessName ?? null,
        sbi: data.sbi ?? null,
        userName: data.userName ?? null
    }
}

export {
    businessNameChangePresenter
}