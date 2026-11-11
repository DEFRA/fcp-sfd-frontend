import { nunjucksEnvironment } from '../../src/plugins/template-renderer/vision.js'

const defaultTestContext = {
  getAssetPath: (input) => input
}

export const renderTemplate = (templateString, context = {}) => {
  const mergedContext = {
    ...defaultTestContext,
    ...context
  }

  return nunjucksEnvironment.renderString(templateString, mergedContext)
}
