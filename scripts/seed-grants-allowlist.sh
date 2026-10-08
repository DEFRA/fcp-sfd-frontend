#!/usr/bin/env bash
#
# Seeds the local grants-ui-backend MongoDB so a given CRN + SBI is on the
# Woodland Management allow list.
#
# Why this exists: in real environments allow lists are published by the Grants
# Config Broker and ingested via SQS. That pipeline is not practical to drive by
# hand locally, so for the prototype we insert the two things the Grants API
# needs directly:
#   1. an *active* form definition, so the grant exists at all
#   2. a CRN entry and an SBI entry, which must BOTH match for access to be granted
#
# This only writes to grants-ui-backend's local Mongo data. It does not modify
# the grants-ui-backend repository.
#
# Usage:
#   ./scripts/seed-grants-allowlist.sh [CRN] [SBI]
#
# Defaults match the first user in defra-id.data.json, i.e. the user you get by
# signing in through the Defra ID stub without changing anything.

set -euo pipefail

CRN="${1:-3000000000}"
SBI="${2:-300145801}"

GRANT_CODE='woodland'
GRANT_TITLE='Woodland Management Plan'
MONGO_DATABASE='grants-ui-backend'

# grants-ui-backend runs in a separate compose project on its own network, so we
# locate its mongo container by compose labels rather than assuming a container name.
COMPOSE_PROJECT="${GRANTS_COMPOSE_PROJECT:-grants-ui-backend}"

MONGO_CONTAINER="$(docker ps --quiet \
  --filter "label=com.docker.compose.project=${COMPOSE_PROJECT}" \
  --filter "label=com.docker.compose.service=mongodb")"

if [[ -z "${MONGO_CONTAINER}" ]]; then
  echo "Could not find a running mongodb container for compose project '${COMPOSE_PROJECT}'." >&2
  echo "Start grants-ui-backend first with 'docker compose up' in that repo." >&2
  echo "If your compose project is named differently, set GRANTS_COMPOSE_PROJECT." >&2
  exit 1
fi

echo "Seeding '${GRANT_CODE}' allow list for CRN ${CRN} / SBI ${SBI}..."

docker exec -i "${MONGO_CONTAINER}" mongosh --quiet "${MONGO_DATABASE}" --eval "
  const grantCode = '${GRANT_CODE}'
  const crn = '${CRN}'
  const sbi = '${SBI}'
  const updatedAt = new Date()

  // Upserted on the same (grantCode, major, minor, patch) key the real ingest uses,
  // so re-running this script updates rather than duplicates the definition.
  db.config__form_definitions.updateOne(
    { grantCode, major: 1, minor: 0, patch: 0 },
    {
      \$set: {
        id: grantCode,
        title: '${GRANT_TITLE}',
        description: 'Seeded locally by fcp-sfd-frontend for the Grants API prototype',
        status: 'active',
        definition: {},
        updatedAt
      }
    },
    { upsert: true }
  )

  // The real ingest replaces every entry for a grant atomically, so mirror that
  // here to keep this script idempotent.
  db.config__allowlist_entries.deleteMany({ grantCode })
  db.config__allowlist_entries.insertMany([
    { grantCode, type: 'crn', value: crn, updatedAt },
    { grantCode, type: 'sbi', value: sbi, updatedAt }
  ])

  print('Seeded ' + db.config__allowlist_entries.countDocuments({ grantCode }) + ' allow list entries')
"

echo
echo "Done. Note the Grants API caches allow list results in memory for 2 minutes,"
echo "so a previously signed in user may take up to that long to see the change."
