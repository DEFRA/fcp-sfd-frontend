import config from '../config/index.js'

const getConfigService = async (key) => {
  return config.get(key)
}

export {
  getConfigService
}
