import { getDalConnector } from '../dal/connector.js'
import { permissionsQuery } from '../dal/queries/permissions-query.js'
import { mapPermissions } from '../mappers/permissions-mapper.js'

const getPermissions = async (sbi, crn, defraIdToken) => {
  const variables = { sbi, crn }

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.executeDalQuery(
    permissionsQuery,
    variables,
    null,
    defraIdToken
  )

  if (dalResponse.data) {
    const mappedResponse = mapPermissions(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export { getPermissions }
