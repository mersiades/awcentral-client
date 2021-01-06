### About

### Running locally

To run this app locally, for development purposes, you'll need to take the following steps:

- In the `.env` file, make sure that the variables for the development environment are UNcommented out, and the variables for the production environment ARE commented out.
- Launch a Keycloak authorisation server locally // TODO: Bundle the Keycloak server in this app, add commands to run server
- Launch an instance of the graphql.aw-central.com server locally
- Run `npm start` from the command line.

### Running tests

`yarn test -- --coverage --watchAll=false`

### Production deployment
