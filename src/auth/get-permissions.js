import { dalConnector } from '../dal/connector.js'
import { permissionsQuery } from '../dal/queries/permissions-query.js'
import { mapPermissions } from '../mappers/permissions-mapper.js'

async function getPermissions (sbi, crn, email) {

  const variables = { sbi, crn }

  const dalResponse = await dalConnector(permissionsQuery, variables, email)

  if (dalResponse.data) {
    const mappedPermission = mapPermissions(dalResponse.data)
    return mappedPermission
  }
  
  return dalResponse

}
export { getPermissions }
