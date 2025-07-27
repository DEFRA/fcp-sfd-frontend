import { dalConnector } from '../dal/connector.js'
import { permissionsQuery } from '../dal/queries/permissions-query.js'
import { mapPermissions } from '../mappers/permissions-mapper.js'
import { config } from '../../src/config/index.js'
import { mappedData } from '../mock-data/mock-permissions.js'

async function getPermissions (sbi, crn, email) {
  return config.get('featureToggle.dalConnection') ? await getFromDal(sbi, crn, email) : mappedData
}

const getFromDal = async (sbi, crn, email) => {
  const variables = { sbi, crn }

  const dalResponse = await dalConnector(permissionsQuery, variables, email)

  if (dalResponse.data) {
    const mappedResponse = mapPermissions(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}
export { getPermissions }
