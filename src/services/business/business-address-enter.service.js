/**
 * Orchestrate fetching and presenting the data needed for the `/business-address-enter` page
 * @module businessAddressEnterService
 */

const businessAddressEnterService = async (state) => {
  // Incorrect at the moment need to sort the state out
  const data = request.param

  const pageData = businessAddressEnterPresenter(data)

  return {
    pageData
  }
}

export {
  businessAddressEnterService
}
