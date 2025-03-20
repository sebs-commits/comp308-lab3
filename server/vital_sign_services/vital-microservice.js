require("dotenv").config();
const express = require("express");
const { connectDb } = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServer } = require("@apollo/server");
const vitalsTypes = require("./graphql/vitalsTypes");
const vitalsResolvers = require("./graphql/vitalsResolvers");


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const startServer = async () => {
  // Connect to mongodb
  await connectDb();

  const server = new ApolloServer({
    typeDefs: vitalsTypes,
    resolvers: vitalsResolvers,
    context: ({ req, res }) => ({ req, res }),
  });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
      cors: {
        origin: ["http://localhost:4002", "https://studio.apollographql.com"],
        credentials: true,
      },
    })
  );

  const PORT = process.env.VITAL_SERVICE_PORT || 4002;
  app.listen(PORT, () => {
    console.log(`Auth service running at http://localhost:${PORT}/graphql`);
  });
}

startServer();