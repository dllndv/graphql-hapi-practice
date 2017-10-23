const hapi = require('hapi');
const mongoose = require('mongoose');
const { apolloHapi, graphiqlHapi } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const User = require('./models/User');

const graphqlSchema = require('./graphql/schema');
const createResolvers = require('./graphql/resolvers');

const server = new hapi.Server();
const HOST = 'localhost';
const PORT = 8080

server.connection({
  host: HOST,
  port: PORT,
});

mongoose.connect('mongodb://localhost:27017/test_db');

const executableSchema = makeExecutableSchema({
  typeDefs: [graphqlSchema],
  resolvers: createResolvers({ User }),
});

server.register({
  register: apolloHapi,
  options: {
    path: '/graphql',
    apolloOptions: () => ({
      pretty: true,
      schema: executableSchema,
    }),
  },
});

server.register({
  register: graphiqlHapi,
  options: {
    path: '/graphiql',
    graphiqlOptions: {
      endpointURL: '/graphql',
    },
  },
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
