const homePresenter = (data, yar) => {
  return {
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    businessName: data.info.businessName,
    sbi: data.info.sbi,
    userName: data.customer.fullName
  }
}
export {
  homePresenter
}
