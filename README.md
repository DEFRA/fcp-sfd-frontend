# fcp-sfd-frontend

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_fcp-sfd-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=DEFRA_fcp-sfd-frontend)

Frontend service for the Land and farm service. This service provides the user interface for customers to interact with the SFD service.

## Prerequisites

- Docker
- Docker Compose
- Node.js (v22 LTS)

## Environment Variables

| Name | Default Value | Required | Description |
| --- | --- | --- | --- |
| ALLOW_ERROR_VIEWS | `false` | No | Enable error route views in local development to inspect error pages |
| DAL_CONNECTION | `false` | No | Get user data from C_DAL if set to true, else, get user data from local mock-data |
| DAL_ENDPOINT | `http://fcp-dal-api:3005/graphql`| No | Data access layer (DAL) endpoint |
| DEFRA_ID_WELL_KNOWN_URL | null | No | The Defra Identity well known URL - Readable endpoint for DefraId |
| DEFRA_ID_POLICY | null | No | The Defra Identity policy - Enables multiple microservices to share same DefraId active token (Must be the same for all FCP microservices) |
| DEFRA_ID_CLIENT_ID | null | No | The Defra Identity client ID - Unique code for identifying fcp-sfd-frontend |
| DEFRA_ID_CLIENT_SECRET | null | No | The Defra Identity client secret - client secret for fcp-sfd-frontend |
| DEFRA_ID_SERVICE_ID | null | No |The Defra Identity service ID - Service ID for SFD |
| DEFRA_ID_REDIRECT_URL | null | No | The Defra Identity redirect URl - URL of the page to be redirected immediately after the user has successfully signed in |
| DEFRA_ID_SIGN_OUT_REDIRECT_URL | null | No | The Defra Identity sign out redirect URL - URL of the page to be redirected after the user has successfully signed out |
| DEFRA_ID_REFRESH_TOKENS | `true` | No | Defra Identity refresh tokens - Set to true to enable auto refresh of Defra Identity tokens |

## Setup

Clone the repository and install dependencies:
```
git clone https://github.com/DEFRA/fcp-sfd-frontend.git
cd fcp-sfd-frontend
npm install
```

## Environment variables

Create a `.env` file in the root of the project with the required environment variables.
The following DEFRA_ID variables are need to be added onto the `.env` file, values for the variables are [here](https://defra.sharepoint.com/teams/Team1974/FCP%20Front%20Door%20team/Forms/AllItems.aspx?id=%2Fteams%2FTeam1974%2FFCP%20Front%20Door%20team%2FTechnology%2FProtected%5FData&viewid=9296ac29%2D76a0%2D4373%2Db652%2Dd876b3b8e35f)
```bash
DEFRA_ID_WELL_KNOWN_URL
DEFRA_ID_CLIENT_ID
DEFRA_ID_CLIENT_SECRET
DEFRA_ID_SERVICE
DEFRA_ID_POLICY
```

For working with the Data Access Layer, you will need to add the following environment variable to your `.env` file. The value can be found in the table above.
```bash
DAL_ENDPOINT
```

## Running the application

You can either run this service independently or alternatively run the [fcp-sfd-core](https://github.com/DEFRA/fcp-sfd-core) repository for local development if you need to run more services simultaneously.

### Building the Docker image

Container images are built using Docker Compose. It's important to note that in order to successfully run the [fcp-dal-api](https://github.com/defra/fcp-dal-api) and its [upstream-mock](https://github.com/defra/fcp-dal-upstream-mock) to interact with the Data Access Layer (DAL), you _must_ run this service as a Docker container. This is because the [Docker Compose configuration](./compose.yaml) for this repository pulls and runs the Docker images for the `fcp-dal-api` and `fcp-dal-upstream-mock` (a.k.a. the `kits-mock`) from the Docker registry.

First, build the Docker image:
```
docker compose build
```

### Starting the Docker container

After building the image, run the service locally in a container alongside `fcp-dal-api` and `fcp-dal-upstream-mock`:
```
docker compose up
```
Use the `-d` at the end of the above command to run in detached mode e.g. if you wish to view logs in another application such as Docker Desktop.

You can find further information on how SFD integrates with the DAL on [Confluence](https://eaflood.atlassian.net/wiki/spaces/SFD/pages/5712838853/Single+Front+Door+Integration+with+Data+Access+Layer).

## Tests

### Running tests

Run the tests with:

```
npm run docker:test
```
Or to run the tests in watch mode:
```
npm run docker:test:watch
```

## Server-side Caching

We use Catbox for server-side caching. By default, the service will use CatboxRedis when deployed and CatboxMemory for local development. You can override the default behavior by setting the `SESSION_CACHE_ENGINE` environment variable to either `redis` or `memory`.

Please note: CatboxMemory (`memory`) is _not_ suitable for production use! The cache will not be shared between each instance of the service and it will not persist between restarts.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of His Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
