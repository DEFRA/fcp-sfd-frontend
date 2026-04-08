import { getDalConnector } from '../dal/connector.js'
import { permissionsQuery } from '../dal/queries/permissions-query.js'
import { mapPermissions } from '../mappers/permissions-mapper.js'

const getPermissions = async (sbi, crn, forwardedUserToken) => {
  const variables = { sbi, crn }

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.query(
    permissionsQuery,
    variables,
    null,
    forwardedUserToken
  )

  if (dalResponse.data) {
    const mappedResponse = mapPermissions(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export { getPermissions }
