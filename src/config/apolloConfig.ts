import { ApolloClient, ApolloLink, from, InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-link-http';
import keycloak from './keycloakConfig';

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = keycloak.token
  console.log('token', token)
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
