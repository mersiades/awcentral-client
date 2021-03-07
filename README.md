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

However, CircleCI is configured to deploy to S3 buckets whenever there is a commit (including merges) to the master branch. It takes the following steps:

- Automatically build and deploy the `staging` version
- Build the `demo` version
- Wait for manual approval before deploying `demo` version
  - this gives you the opportunity to visit the `staging` version at https://app-staging.aw-central.com and check that everything is working as it should.
  - note that you made need to do a CloudFront invalidation before you can see changes at app-staging.aw-central.com
- Deploy `demo` version upon manual approval (via CircleCI web interface)
- Automatically build and deploy `production` version.

Therefore, the preferred deployment procedure is:

- Do you work on a wriking branch (not `master`)
- When finished, issue pull request
- If good, merge pull request into `master`
- Check staging environment for problems
- If all good, approve deployment of `demo` version (and subsequently `prod` version) at CircleCI web interface (app.circleci.com)
