/**
 * Returns the config value for the given config path, for example `featureToggle.viewLand`.
 *
 * Wraps `config.get()` so consumers (such as presenters) can mock a single service call in unit tests rather than
 * stubbing the config module.
 *
 * @module getConfigService
 */

import { config } from '../config/index.js'

const getConfigService = (configPath) => {
  return config.get(configPath)
}

export {
  getConfigService
}
