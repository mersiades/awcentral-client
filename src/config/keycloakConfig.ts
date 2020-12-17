import Keycloak from 'keycloak-js'

const KEYCLOAK_REALM = 'awc-realm'
const KEYCLOAK_CLIENT = 'awc-client'
const url = process.env.REACT_APP_KEYCLOAK_AUTH_SERVER

const keycloakConfigOptions: Keycloak.KeycloakConfig = {
  url,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT
}

// @ts-ignore
const keycloak = new Keycloak(keycloakConfigOptions)

export default keycloak

