const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const resolvers = {
  Query: {
    currentUser: (_, __, { req }) => {
      // Assuming the JWT token is sent via an HTTP-only cookie named 'token'
      const token = req.cookies["token"];
      if (!token) {
        return null; // No user is logged in
      }
      try {
        // Verify and decode the JWT
        const decoded = jwt.verify(token, "your_secret_key");
        return { username: decoded.username };
      } catch (error) {
        // Token verification failed
        return null;
      }
    },
  },
  Mutation: {
    login: async (_, { username, password }, { res }) => {
      // Validate username and password against database
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error("Invalid password");
      }
      
      // Token generation
      const token = jwt.sign({ username }, "your_secret_key", {
        expiresIn: "1d",
      });
      
      res.cookie("token", token, {
        httpOnly: true,
        // sameSite: 'None',  // Enable for cross-site requests
        // secure: true,      // Enable for HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      
      return true;
    },
    register: async (_, { username, password }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("Username is already taken");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      return true;
    },
  },
};

module.exports = resolvers;