import { dalConnector } from '../dal/connector.js'
import { permissionsQuery } from '../dal/queries/permissions-query.js'
import { mapPermissions } from '../mappers/permissions-mapper.js'
import { config } from '../../src/config/index.js'
import { mappedData } from '../mock-data/mock-permissions.js'

async function getPermissions (sbi, crn, email, tokenCache) {
  const permission = config.get('featureToggle.dalConnection') ? await getFromDal(sbi, crn, email, tokenCache) : mappedData

  return permission
}

const getFromDal = async (sbi, crn, email, tokenCache) => {
  const variables = { sbi, crn }

  const dalResponse = await dalConnector(permissionsQuery, variables, email, tokenCache)

  if (dalResponse.data) {
    const mappedResponse = mapPermissions(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export { getPermissions }
