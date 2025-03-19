require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");
// const { ApolloServer } = require("@apollo/server");
// const { startStandaloneServer } = require("@apollo/server/standalone");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to mongodb
mongoose
  .connect(process.env.MONGODB_AUTH_URI)
  .then(() => {
    console.log("Connected to MongoDB auth service");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
