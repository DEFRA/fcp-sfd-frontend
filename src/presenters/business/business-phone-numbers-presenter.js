const businessPhoneNumberPresenter = (data) => {
  return {
    businessTelephone: data.businessTelephone ?? '',
    businessMobile: data.businessMobile ?? '',
  }
}

export { businessPhoneNumberPresenter }
