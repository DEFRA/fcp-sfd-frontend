import path from 'node:path'

export const staticAssetRoutes = [
  {
    options: {
      auth: false,
      cache: {
        privacy: 'private'
      }
    },
    method: 'GET',
    path: '/assets/{path*}',
    handler: {
      directory: {
        path: [
          path.join(process.cwd(), '.public'),
          path.join(process.cwd(), 'node_modules/govuk-frontend/dist/govuk/assets')
        ],
        redirectToSlash: true
      }
    }
  }
]
