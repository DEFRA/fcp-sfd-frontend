import { dalConnector } from '../dal/connector.js'
import { permissionsQuery } from '../dal/queries/permissions-query.js'
import { mapPermissions } from '../mappers/permissions-mapper.js'
import { config } from '../../src/config/index.js'
import { mappedData } from '../mock-data/mock-permissions.js'

async function getPermissions(sbi, crn) {
  const permission = config.get('featureToggle.dalConnection') ? await getFromDal(sbi, crn) : mappedData

  return permission
}

const getFromDal = async (sbi, crn) => {
  const variables = { sbi, crn }

  const dalResponse = await dalConnector(permissionsQuery, variables, request)

  if (dalResponse.data) {
    const mappedResponse = mapPermissions(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export { getPermissions }
