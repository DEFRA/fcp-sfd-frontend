const viewLand = {
  method: 'GET',
  path: '/view-land',
  handler: (_request, h) => {
    return h.view('view-land', {
      pageTitle: 'View land',
      backLink: {
        text: 'Back',
        href: '/home'
      }
    })
  }
}

export const viewLandRoutes = [
  viewLand
]
