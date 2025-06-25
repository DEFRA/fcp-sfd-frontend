/**
 * Orchestrate fetching and presenting the data needed for the `/business-name-check` page
 * @module businessNameCheckService
 */

const businessNameCheckService = async (state) => {
  // Incorrect at the moment need to sort the state out
  const data = request.param

  const pageData = businessNameCheckPresenter(data)

  return {
    pageData
  }
}

export {
  businessNameCheckService
}
