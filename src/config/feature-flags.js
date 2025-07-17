/**
 * Config values used to enable feature flags
 * @module featureFlagsConfig
 */

// We require dotenv directly in each config file to support unit tests that depend on this this subset of config.
// Requiring dotenv in multiple places has no effect on the app when running for real.
import 'dotenv/config'

export const featureFlagsConfig = {
  dalConnection: String(process.env.DAL_CONNECTION) === 'true' || false,
  allowErrorViews: String(process.env.ALLOW_ERROR_VIEWS) === 'true' || false
}
