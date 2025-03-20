require("dotenv").config();
const express = require("express");
const { connectDb } = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServer } = require("@apollo/server");
const vitalsTypes = require("./graphql/vitalsTypes");
const vitalsResolvers = require("./graphql/vitalsResolvers");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Add a pre-flight route handler
app.options('/graphql', cors());

const startServer = async () => {
  // Connect to mongodb
  await connectDb();

  const server = new ApolloServer({
    typeDefs: vitalsTypes,
    resolvers: vitalsResolvers,
    context: ({ req }) => {
      const token = req.cookies["token"];
      if (token) {
        try {
          const user = jwt.verify(token, process.env.JWT_SECRET);
          return { user };
        } catch (e) {
          throw new Error("Your session expired. Sign in again.");
        }
      }
      return { user: null };
    },
  });
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  const PORT = process.env.VITAL_SERVICE_PORT || 4002;
  app.listen(PORT, () => {
    console.log(`Auth service running at http://localhost:${PORT}/graphql`);
  });
}

startServer();