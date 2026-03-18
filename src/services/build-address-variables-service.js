/**
 * Service to build address variables for DAL mutations
 *
 * Supports both postcode lookup (with UPRN) and manually entered addresses.
 * Handles normalization of optional fields, city, county, PO BOX, dependentLocality,
 * and doubleDependentLocality. Returns an address object ready for the DAL mutation.
 *
 * @module buildAddressVariablesService
 */

/**
 * Builds address variables for an address chosen via postcode lookup (with UPRN).
 * When a UPRN is present, it is the only required field. The rest of the address
 * data is included but the DAL/v1 does not apply further validation.
 *
 * Optional fields are normalized using nullIfUndefined to ensure they are
 * explicitly set to `null` rather than being left `undefined`.
 *
 * @param {Object} change - The address change object containing UPRN and address fields
 * @returns {Object} Address object formatted for DAL/v1 with UPRN
 * @private
 */
const buildUprnAddress = (change) => {
  return {
    pafOrganisationName: nullIfUndefined(change.pafOrganisationName),
    buildingNumberRange: nullIfUndefined(change.buildingNumberRange),
    buildingName: nullIfUndefined(change.buildingName),
    flatName: nullIfUndefined(change.flatName),
    street: nullIfUndefined(change.street),
    city: nullIfUndefined(change.city),
    county: nullIfUndefined(change.county),
    postalCode: nullIfUndefined(change.postcode),
    country: nullIfUndefined(change.country),
    dependentLocality: nullIfUndefined(change.dependentLocality),
    doubleDependentLocality: nullIfUndefined(change.doubleDependentLocality),
    line1: null,
    line2: null,
    line3: null,
    line4: null,
    line5: null,
    uprn: change.uprn // required for DAL/v1
  }
}

/**
 * Builds address variables for a manually entered address (without UPRN).
 *
 * When there is no UPRN, the DAL/v1 applies stricter validation and requires
 * the following fields:
 * - `line1`
 * - `city`
 * - `postalCode`
 * - `country`
 *
 * The manually entered address fields are mapped into the DAL structure as follows:
 *
 * | User input field | DAL field |
 * |------------------|-----------|
 * | address1         | line1     |
 * | address2         | line2     |
 * | address3         | line3     |
 * | county           | line4     |
 * | city             | city      |
 *
 * `line5` is not used for manual addresses and is explicitly set to `null`.
 *
 * Optional fields are normalized using `nullIfUndefined` so that `undefined`
 * values are converted to `null`, ensuring consistent data sent to the DAL.
 *
 * @param {Object} change - The address change object containing manually entered address fields
 * @returns {Object} Address object formatted for DAL/v1 without UPRN
 * @private
 */
const buildManualAddress = (change) => {
  return {
    pafOrganisationName: null,
    buildingNumberRange: null,
    buildingName: null,
    flatName: null,
    street: null,
    dependentLocality: null,
    doubleDependentLocality: null,
    county: null,
    uprn: null,
    line1: change.address1, // required for DAL/v1
    line2: nullIfUndefined(change.address2),
    line3: nullIfUndefined(change.address3),
    line4: nullIfUndefined(change.county), // manual city mapped for validation
    line5: null,
    city: change.city, // required for DAL/v1
    postalCode: change.postcode, // required for DAL/v1
    country: change.country // required for DAL/v1
  }
}

/**
 * Normalizes a value to null if it is undefined.
 * @param {*} value - The value to normalize
 * @returns {*|null} The value if defined, otherwise null
 * @private
 */
const nullIfUndefined = (value) => {
  return value ?? null
}

export {
  buildUprnAddress,
  buildManualAddress
}
