// @ts-ignore
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Set up Apollo Client
const client = new ApolloClient({
  uri: 'https://www.wamia.tn/graphql', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;