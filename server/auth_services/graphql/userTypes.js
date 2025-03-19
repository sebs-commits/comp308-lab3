const userTypes = `#graphql
  type User {
    username: String!
  }

  type Query {
    currentUser: User
  }
  type Mutation {
    login(username: String!, password: String!): Boolean
    register(username: String!, password: String!): Boolean
    logout: Boolean
  }
`;

module.exports = userTypes;
