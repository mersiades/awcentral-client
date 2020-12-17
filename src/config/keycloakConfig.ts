import Keycloak from 'keycloak-js'

const keycloakConfigOptions: Keycloak.KeycloakConfig = {
  url: 'https://keycloak.aw-central.com/auth',
  // url: 'http://localhost:8180/auth',
  realm: 'awc-realm',
  clientId: 'awc-client'
}

// @ts-ignore
const keycloak = new Keycloak(keycloakConfigOptions)

export default keycloak

