/**
 * Builds a dynamic personal details GraphQL mutation
 * based on the sections that actually need updating
 *
 * @module buildPersonalDetailsMutationService
 */

import { personalMutationSectionMap, personalVariableTypeMap } from '../../dal/mutations/personal/update-personal-details.js'

const buildPersonalDetailsMutationService = (sectionsNeedingUpdate) => {
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
 * → 'name'   becomes '$updateCustomerNameInput: UpdateCustomerNameInput!'
 * → 'email'  becomes '$updateCustomerEmailInput: UpdateCustomerEmailInput!'
 *
 * Then they are joined with commas for the mutation header.
 */
const buildVariableDefinitions = (sections) => {
  return sections
    .map((section) => personalVariableTypeMap[section])
    .filter(Boolean)
    .join(', ')
}

/**
 * Builds the body of the GraphQL mutation based on which sections need updating.
 *
 * Example:
 * If sections = ['name', 'email']
 *
 * → 'name'  becomes the updateCustomerName mutation block
 * → 'email' becomes the updateCustomerEmail mutation block
 *
 * Then they are joined together with line breaks for the mutation body.
 */
const buildMutationBody = (sections) => {
  return sections
    .map((section) => personalMutationSectionMap[section])
    .filter(Boolean)
    .join('\n')
}

export {
  buildPersonalDetailsMutationService
}
