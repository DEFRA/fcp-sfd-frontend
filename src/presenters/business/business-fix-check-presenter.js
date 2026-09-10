/**
 * Formats data ready for presenting in the `/business-fix-check` page
 * @module businessFixCheckPresenter
 */

const businessFixCheckPresenter = (data) => {
  const {
    orderedSectionsToFix,
    changeBusinessName,
    changeBusinessEmail,
    changeBusinessAddress,
    changeBusinessPhoneNumbers,
    changeBusinessVat
  } = data

  return {
    backLink: { href: '/business-fix-list' },
    pageTitle: 'Check your details are correct before submitting',
    metaDescription: 'Check your details are correct before submitting',
    changeLink: '/business-fix-list',
    sections: orderedSectionsToFix,
    businessName: data.businessName ?? null,
    changeBusinessName: changeBusinessName?.businessName ?? null,
    sbi: data.sbi ?? null,
    userName: data.customer?.userName ?? null,
    businessEmail: changeBusinessEmail?.businessEmail ?? null,
    address: formatAddress(changeBusinessAddress),
    vatNumber: changeBusinessVat?.vatNumber ?? null,
    businessTelephone: {
      telephone: changeBusinessPhoneNumbers?.businessTelephone ?? null,
      mobile: changeBusinessPhoneNumbers?.businessMobile ?? null
    }
  }
}

const formatAddress = (businessAddress) => {
  if (businessAddress) {
    return Object.values(businessAddress).filter(Boolean)
  }

  return null
}

export {
  businessFixCheckPresenter
}
