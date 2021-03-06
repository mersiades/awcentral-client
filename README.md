[![<mersiades>](https://circleci.com/gh/mersiades/app-awcentral.svg?style=svg&circle-token=61d94b4d3bb809cac96f5d3ef1e49ec758d40e2a)](https://app.circleci.com/pipelines/github/mersiades/app-awcentral)

### About

### Running locally

To run this app locally, for development purposes, you'll need to take the following steps:

- Launch a Keycloak authorisation server locally
- Launch an instance of the graphql.aw-central.com server locally
- Run `yarn start:dev` from the command line.

### Running tests

`yarn test --coverage --watchAll=false`

### Production deployment

Builds for production, staging and demo environments can be built using:

- `yarn run build:prod`
- `yarn run build:staging`
- `yarn run build:demo`
