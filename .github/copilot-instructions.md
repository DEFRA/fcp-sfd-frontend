# Copilot Instructions for fcp-sfd-frontend

This document provides essential information to help Copilot assist effectively in this repository.

## Build, Test, and Lint Commands

### Build
- **Production build:** `npm run build` - Uses Webpack to build client assets (JS/CSS) and bundles for production
- **Watch mode:** `npm run frontend:watch` - Runs Webpack in watch mode for development (rebuilds on file changes)

### Development Server
- **Start dev server:** `npm run dev` - Runs both frontend watch and server in parallel (requires `npm run postinstall` or `npm run build` first)
- **Debug mode:** `npm run dev:debug` - Starts with Node debugger enabled (port 9229)
- **Server only (watch):** `npm run server:watch` - Runs server with nodemon, watching for JS and NJK file changes

### Testing
- **Full test suite:** `npm run test` - Runs Vitest with coverage reporting (outputs to `coverage/` directory in LCOV format)
- **Watch mode:** `npm run test:watch` - Runs Vitest in watch mode, re-runs tests on file changes
- **Single test file:** `npx vitest run test/path/to/test.test.js` - Run one test file
- **Docker testing:** `npm run docker:test` - Full test suite in Docker container
- **Docker watch:** `npm run docker:test:watch` - Test watch mode in Docker

### Linting
- **Run all lints:** `npm run lint` - Runs both JavaScript and SCSS linting
- **JavaScript linting:** `npm run test:lint` - Uses StandardJS for linting
- **JavaScript fix:** `npm run lint:fix` - Auto-fixes JavaScript linting issues
- **SCSS linting:** `npm run lint:scss` - Uses stylelint with GDS config

### Docker
- **Development:** `npm run docker:dev` - Runs the full Docker stack (frontend + DAL services)
- **Debug:** `npm run docker:debug` - Docker stack with debug configuration

### Local Testing Note
Vitest tests run locally without Docker. Docker tests (`npm run docker:test`) require the full Docker Compose stack (includes DAL API and kits-mock services) because the code integrates with the Data Access Layer (DAL).

---

## High-Level Architecture

### Tech Stack
- **Server:** Node.js (v22 LTS) with Hapi framework
- **Client:** Webpack-bundled JavaScript and SCSS (GOV.UK Frontend library)
- **Template engine:** Nunjucks for server-side rendering
- **Testing:** Vitest for unit/integration tests, jsdom for browser simulation
- **Auth:** OIDC with Defra ID, session management via Catbox (Redis or memory)
- **DAL integration:** GraphQL queries to fcp-dal-api service

### Core Directory Structure
```
src/
├── auth/                 # Authentication (OIDC, permissions, tokens)
├── client/              # Client-side assets (JS, CSS)
├── config/              # Configuration management (convict-based)
├── constants/           # Shared constants
├── dal/                 # GraphQL queries and DAL connector
├── mappers/             # Transform DAL responses to frontend format
├── mock-data/           # OS Places stub addresses only (`os-places-stub`)
├── plugins/             # Hapi plugins (security, logging, routing, etc.)
├── presenters/          # Prepare data for Nunjucks templates
├── routes/              # HTTP route handlers
├── schemas/             # Joi validation schemas
├── services/            # Business logic (fetch/update operations)
├── utils/               # Utilities (logging, caching, errors, proxy setup)
└── views/               # Nunjucks templates

test/
├── unit/                # Unit tests (fast, mocked dependencies)
├── integration/         # Integration tests (real DAL calls in Docker)
├── mocks/               # Test doubles and mock factories
└── helpers/             # Test utilities
```

### Request Flow
1. **Route handler** (`src/routes/`) receives HTTP request
2. **Service layer** (`src/services/`) handles business logic:
   - Checks cache (session)
   - Optionally calls DAL via GraphQL
   - Maps response using mappers
3. **Presenter** (`src/presenters/`) prepares data for view
4. **Nunjucks template** (`src/views/`) renders HTML response

**Example:** Business details fetch:
- `routes/business/business-routes.js` → `services/business/fetch-business-details-service.js` → `dalConnector.query()` (GraphQL) → `mapBusinessDetails()` → template

### Authentication & Session
- Uses **OIDC** with Defra ID for sign-in
- Session cached in **Catbox** (Redis in production, memory in dev)
- Session ID passed to DAL in GraphQL requests to provide user context
- Defra ID token is read from `server.app.cache` when no explicit token is provided to DAL connector

### DAL Integration (GraphQL)
- `src/dal/connector.js` handles all GraphQL requests to DAL
- Passes `sessionId` parameter so DAL can authenticate with user context
- Queries stored in `src/dal/queries/` (e.g., `business-details.js`)
- Responses mapped to frontend format in `src/mappers/`
- Tests use `test/mocks/` (and similar) for stubbed DAL responses where needed

### Feature Toggles
- Controlled via environment variables (e.g., `CPH_ENABLED`)
- Enable/disable optional product features or fields

---

## Key Conventions

### Service Layer Pattern
**All business logic lives in services**, not routes. Routes are thin:
```javascript
// Route handler (thin)
const getHandler = async (request, h) => {
  const data = await myService(request.auth.credentials)
  return h.view('template', { data })
}

// Service (where logic goes)
const myService = async (credentials) => {
  const { sbi, crn, sessionId } = credentials
  const response = await dalConnector.query(query, variables, { sessionId })
  return mapResponse(response)
}
```

### Credentials Pattern
- `credentials` object passed through the stack contains: `sbi`, `crn`, `sessionId` (and sometimes `email`, `token`)
- Extract in services: `const { sbi, crn, sessionId } = credentials`
- Always pass `{ sessionId }` to `dalConnector.query()` for authenticated DAL calls

### DAL Connector Usage
```javascript
import { getDalConnector } from '../../dal/connector.js'

const dalConnector = getDalConnector()

// Fetch query
const response = await dalConnector.query(query, variables, { sessionId })

// Update mutation
const response = await dalConnector.query(mutation, variables, { sessionId })

// During OIDC sign-in (before session cache populated)
const response = await dalConnector.query(query, variables, { forwardedUserToken })
```

### Mappers
Transform DAL responses to frontend format. Located in `src/mappers/`:
```javascript
// mapper receives raw DAL response, returns frontend shape
export const mapBusinessDetails = (dalData) => {
  return {
    name: dalData.business.info.name,
    sbi: dalData.business.sbi,
    // ... transform fields as needed
  }
}
```

### Templates (Nunjucks)
- Located in `src/views/`
- Use GOV.UK Frontend components
- Passed data via presenter: `h.view('template-name', { presentedData })`

### Cache Strategy
- Session cache stores user token and business details
- Use `request.server.app.cache.get(sessionId)` to retrieve
- Set via `request.server.app.cache.set(sessionId, data, ttl)`
- Fallback: if not cached, re-fetch from DAL

### Testing Patterns
- **Unit tests:** Mock DAL calls and services in `test/unit/`
- **Integration tests:** Real DAL calls in Docker in `test/integration/narrow/`
- **Mock data:** Use `test/mocks/` for unit-test fixtures; `src/mock-data/` only for OS Places stub data
- Test utilities in `test/helpers/`, test doubles in `test/mocks/`

### Error Handling
- Global error handler in `src/utils/errors.js`
- Routes throw Boom errors (HTTP-friendly): `Boom.badRequest()`, `Boom.notFound()`
- DAL errors bubble up; services log and re-throw or return error response

### Linting & Code Style
- **JavaScript:** StandardJS (very strict; auto-fixable with `npm run lint:fix`)
- **SCSS:** stylelint with GDS config
- No semicolons, double quotes only in JSDoc/templates
- Consistent spacing and naming (camelCase for variables, kebab-case for file names)

### Configuration
- Environment-driven via convict in `src/config/`
- Read with `config.get('path.to.value')`
- See `.env.example` for all available variables
- Feature toggles: `config.get('featureToggle.featureName')`

### Module System
- Uses ES modules (`import`/`export`)
- File extensions required in imports: `import { x } from './file.js'`

---

## Common Development Tasks

### Adding a New Service
1. Create `src/services/{domain}/my-service.js`
2. Import `getDalConnector` and mappers
3. Accept `credentials` parameter
4. Extract `sessionId` and other needed fields
5. Call DAL via `const dalConnector = getDalConnector()` and `dalConnector.query(...)`; map response
6. Export the service function

### Adding a New Route
1. Create `src/routes/{domain}/routes.js`
2. Define route handler (thin; delegate to service)
3. Add Joi validation schema in `src/schemas/`
4. Register route in `src/routes/routes.js`

### Implementing Business Selection/Switching
When users need to switch between multiple enrollments/businesses:
1. **Presenter** - Add conditional property based on `enrolmentCount`:
   - Only include link/backLink if `enrolmentCount > 1`
   - Pass data from `auth.credentials.enrolmentCount`
2. **Route Handler** - Pass `enrolmentCount` from credentials to presenter:
   - `homePresenter(data, auth.credentials.scope, auth.credentials.enrolmentCount)`
3. **Template** - Make navigation conditional on property existence:
   - `{% if backLink %}...{% endif %}`
   - Link target should trigger Defra ID reselection (e.g., `/auth/reselect-business`)
4. **Auth Plugin** - Configure `forceReselection` for the route path:
   - Add route path to `providerParams` check for `forceReselection = true`
   - This triggers Defra ID business/organisation selection screen

### Adding a DAL Query
1. Create `src/dal/queries/my-query.js`
2. Export GraphQL query string
3. Import in service: `import { myQuery } from '../../dal/queries/my-query.js'`
4. Pass to `dalConnector.query(myQuery, variables, { sessionId })`

### Testing a Single Feature
```bash
# Run one test file
npx vitest run test/unit/services/my-service.test.js

# Run in watch mode
npx vitest watch test/unit/services/my-service.test.js --ui

# Run with specific pattern
npx vitest run -t "should fetch business details"
```

---

## Useful References
- **Environment Config:** `.env.example` — All configurable settings
- **Hapi Documentation:** https://hapi.dev/ — Framework docs
- **GOV.UK Frontend:** https://design-system.service.gov.uk/ — Component library
