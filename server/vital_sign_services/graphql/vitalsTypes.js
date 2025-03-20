
const typeDefs = `#graphql
  type Vitals {
    id: ID!
    patientId: String!
    bodyTemperature: Float!
    heartRate: Float!
    respirationRate: Float!
    bloodPressure: Float!
  }

  type Query {
    getAllVitals: [Vitals]!
    getVitalsByPatientId(patientId: String!): [Vitals]!
  }

  type Mutation {
    addVitals(
      patientId: String!
      bodyTemperature: Float!
      heartRate: Float!
      respirationRate: Float!
      bloodPressure: Float!
    ): Vitals!

    updateVitals(
      id: ID!
      bodyTemperature: Float!
      heartRate: Float!
      respirationRate: Float!
      bloodPressure: Float!
    ): Vitals!
  }
`;

module.exports = typeDefs;
