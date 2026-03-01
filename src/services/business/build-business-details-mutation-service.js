/**
 * Builds a dynamic business details GraphQL mutation
 * based on the sections that actually need updating
 *
 * @module buildBusinessDetailsMutationService
 */

import { businessMutationSectionMap, businessVariableTypeMap } from '../../dal/mutations/business/update-business-details.js'

const buildBusinessDetailsMutationService = (sectionsNeedingUpdate) => {
  if (!sectionsNeedingUpdate || sectionsNeedingUpdate.length === 0) {
    return null
  }

  const variableDefinitions = buildVariableDefinitions(sectionsNeedingUpdate)
  const mutationBody = buildMutationBody(sectionsNeedingUpdate)

  return `
    mutation Mutation (${variableDefinitions}) {
      ${mutationBody}
    }
  `
}

/**
 * Builds the GraphQL variable definition string for the mutation.
 *
 * Example:
 * If sections = ['name', 'email']
 *
 * 1. We look up each section in variableTypeMap
 *    → 'name'   becomes '$updateBusinessNameInput: UpdateBusinessNameInput!'
 *    → 'email'  becomes '$updateBusinessEmailInput: UpdateBusinessEmailInput!'
 *
 * 2. We remove any undefined values (in case an invalid section was passed in).
 *
 * 3. We join them into a comma-separated string so it can be inserted into:
 *
 *    mutation Mutation ($var1: Type!, $var2: Type!) { ... }
 *
 * Final output:
 * '$updateBusinessNameInput: UpdateBusinessNameInput!, $updateBusinessEmailInput: UpdateBusinessEmailInput!'
 */
const buildVariableDefinitions = (sections) => {
  return sections
    .map((section) => businessVariableTypeMap[section])
    .filter(Boolean)
    .join(', ')
}

/**
 * Builds the body of the GraphQL mutation based on which sections need updating.
 *
 * Example:
 * If sections = ['name', 'email']
 *
 * 1. We look up each section in businessMutationSectionMap.
 *    → 'name'  becomes the updateBusinessName mutation block
 *    → 'email' becomes the updateBusinessEmail mutation block
 *
 * 2. We remove any undefined values (in case an invalid section was passed in).
 *
 * 3. We join the mutation blocks together with line breaks so they form
 *    the body of the final mutation:
 *
 *    mutation Mutation (...) {
 *      updateBusinessName(...)
 *      updateBusinessEmail(...)
 *    }
 *
 * The result is a correctly structured mutation body containing
 * only the sections that actually need updating.
 */
const buildMutationBody = (sections) => {
  return sections
    .map((section) => businessMutationSectionMap[section])
    .filter(Boolean)
    .join('\n')
}

export {
  buildBusinessDetailsMutationService
}
