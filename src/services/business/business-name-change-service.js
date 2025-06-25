/**
 * Orchestrate fetching and presenting the data needed for the `/business-name-change` page
 * @module businessNameChangeService
 */

const businessNameChangeService = async (state) => {
  // Incorrect at the moment need to sort the state out
  const data = request.param

  const pageData = businessNameChangePresenter(data)

  return {
    pageData
  }
}

export {
  businessNameChangeService
}
