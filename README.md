# fcp-sfd-frontend

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend)

Frontend service for the Single Front Door (SFD) service. This service provides the user interface for customers to interact with the SFD service.

## Prerequisites

- Docker
- Docker Compose
- Node.js (v22 LTS)

## Environment Variables

| Name | Default Value | Required | Description |
| --- | --- | --- | --- |
| ALLOW_ERROR_VIEWS | false | No | Enable error route views in local development to inspect error pages |

## Setup

Clone the repository and install dependencies:
git clone https://github.com/DEFRA/fcp-sfd-frontend.git
cd fcp-sfd-frontend
npm install

Create a `.env` file in the root of the project with the required environment variables:
ALLOW_ERROR_VIEWS=true/false

## Running the application

We recommend using the [fcp-sfd-core](https://github.com/DEFRA/fcp-sfd-core) repository for local development. You can howerver run this service independently by following the instructions below.

### Local development

To run the application in development mode with hot reloading without container:
```
npm run dev
```
This will start the server and watch for changes to both server and client files.

### Build container image

Container images are built using Docker Compose

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the CSS files that were generated during the Docker build.  For the site to render correctly locally `npm run build` must be run on the host system.


By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:
```
# Build container images
docker-compose build
```

### Start

Use Docker Compose to run service locally.

```
docker-compose up --build
```

## Tests

### Test structure

The tests have been structured into subfolders:

- `test/unit` - Unit tests for individual modules
- `test/integration` - Integration tests for API endpoints and server functionality

### Running tests

Run the tests with:
npm test

## Project Structure

- `src/` - Application source code
  - `client/` - Frontend assets (JavaScript, SCSS)
  - `config/` - Configuration files
  - `constants/` - Application constants
  - `plugins/` - Hapi server plugins
  - `routes/` - API routes and handlers
  - `schemas/` - Validation schemas
  - `utils/` - Utility functions
  - `views/` - Nunjucks templates
- `test/` - Test files

## Server-side Caching

We use Catbox for server-side caching. By default, the service will use CatboxRedis when deployed and CatboxMemory for local development. You can override the default behavior by setting the `SESSION_CACHE_ENGINE` environment variable to either `redis` or `memory`.

Please note: CatboxMemory (`memory`) is _not_ suitable for production use! The cache will not be shared between each instance of the service and it will not persist between restarts.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Maviy's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.