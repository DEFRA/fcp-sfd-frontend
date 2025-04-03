export const businessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: (_request, h) => {
    return h.view('business-details/business-name-change', {
      pageTitle: 'What is your business name?',
      heading: 'Update the name for your business.'
    })
  }
}
