import { ApolloClient, ApolloLink, from, InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-link-http';
import keycloak from './keycloakConfig';

const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_GRAPHQL_HTTP_ROOT}/graphql`,
});

const authLink = new ApolloLink((operation, forward) => {
  let token = keycloak.token
  keycloak.updateToken(5)
    .then((isRefreshed) => token = keycloak.token)
    .catch(() => keycloak.logout())
    
  operation.setContext(({ headers }: Record<string, any>) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }));
  return forward(operation);
});

// @ts-ignore
const apolloLink = from([authLink, httpLink])

export const apolloClient = new ApolloClient({
  // @ts-ignore
  link: apolloLink,
  cache: new InMemoryCache(),
});
