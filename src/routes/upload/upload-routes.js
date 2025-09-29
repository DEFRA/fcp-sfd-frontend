import { uploadFilesRoutes } from './upload-files-route.js'
import { uploadStatusRoutes } from './upload-files-status-route.js'

export const uploadRoutes = [
  ...uploadFilesRoutes,
  ...uploadStatusRoutes
]
