import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-link-http';

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/graphql',
});

export const apolloClient = new ApolloClient({
  // @ts-ignore
  link: httpLink,
  cache: new InMemoryCache(),
});
