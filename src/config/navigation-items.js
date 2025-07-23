export const getNavigationItems = (request) => {
  return [
    {
      text: '{{businessName}}',
      url: '/',
      isActive: request?.path === '/'
    }
  ]
}
