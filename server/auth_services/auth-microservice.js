require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer } = require("@apollo/server");
const userTypes = require("./graphql/userTypes");
const userResolvers = require("./graphql/userResolvers");
const cookieParser = require("cookie-parser");
const { expressMiddleware } = require("@apollo/server/express4");
const { connectDb } = require("./config/db");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const startServer = async () => {
  // Connect to mongodb
  await connectDb();
  const server = new ApolloServer({
    typeDefs: userTypes,
    resolvers: userResolvers,
    context: ({ req, res }) => ({ req, res }),
  });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );
  
  const PORT = process.env.AUTH_SERVICE_PORT || 4001;
  app.listen(PORT, () => {
    console.log(`Auth service running at http://localhost:${PORT}/graphql`);
  });
};

startServer();
