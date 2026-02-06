export const PERSONAL_SECTION_FIELD_ORDER = {
  name: ['first', 'middle', 'last'],
  dob: ['day', 'month', 'year'],
  address: ['address1', 'address2', 'address3', 'city', 'county', 'postcode', 'country'],
  phone: ['personalTelephone', 'personalMobile'],
  email: ['personalEmail']
}

export const BUSINESS_SECTION_FIELD_ORDER = {
  name: ['businessName'],
  address: ['address1', 'address2', 'address3', 'city', 'county', 'postcode', 'country'],
  phone: ['businessTelephone', 'businessMobile'],
  email: ['businessEmail'],
  vat: ['vatNumber']
}

export const PERSONAL_SECTION_ORDER = ['name', 'dob', 'address', 'phone', 'email']
export const BUSINESS_SECTION_ORDER = ['name', 'address', 'phone', 'email', 'vat-add', 'vat-change', 'vat-remove']

export const PERSONAL_SECTION_LABELS = {
  name: 'personal name',
  dob: 'personal date of birth',
  address: 'personal address',
  phone: 'personal phone number',
  email: 'personal email address'
}

const VAT_LABEL= 'business VAT number'

export const BUSINESS_SECTION_LABELS = {
  name: 'business name',
  address: 'business address',
  phone: 'at least one business phone number',
  email: 'business email address',
  'vat-add': VAT_LABEL,
  'vat-change': VAT_LABEL,
  'vat-remove': VAT_LABEL
}

export const PERSONAL_UPDATE_TEXT_LABELS = {
  name: 'your personal name',
  dob: 'your date of birth',
  address: 'your personal address',
  phone: 'at least one personal phone number',
  email: 'your personal email address'
}

const VAT_UPDATE_TEXT_LABELS = 'your business VAT number'

export const BUSINESS_UPDATE_TEXT_LABELS = {
  name: 'your business name',
  address: 'your business address',
  phone: 'at least one business phone number',
  email: 'your business email address',
  'vat-add': VAT_UPDATE_TEXT_LABELS,
  'vat-change': VAT_UPDATE_TEXT_LABELS,
  'vat-remove': VAT_UPDATE_TEXT_LABELS
}
