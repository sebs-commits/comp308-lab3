const vitals = require("../models/Vitals");

const resolvers = {
  Query: {
    // Get all vitals
    getAllVitals: async () => {
      try {
        return await vitals.find();
      } catch (error) {
        throw new Error(`Error fetching vitals: ${error.message}`);
      }
    },

    // Get vitals by patient ID
    getVitalsByPatientId: async (_, { patientId }) => {
      try {
        return await vitals.find({ patientId });
      } catch (error) {
        throw new Error(`Error fetching vitals for patient: ${error.message}`);
      }
    },
  },

  Mutation: {
    // Add new vitals
    addVitals: async (
      _,
      { patientId, bodyTemperature, heartRate, respirationRate, bloodPressure }
    ) => {
      try {
        const newVitals = new vitals({
          patientId,
          bodyTemperature,
          heartRate,
          respirationRate,
          bloodPressure,
        });
        return await newVitals.save();
      } catch (error) {
        throw new Error(`Error adding vitals: ${error.message}`);
      }
    },

    // Update vitals
    updateVitals: async (
      _,
      { id, bodyTemperature, heartRate, respirationRate, bloodPressure }
    ) => {
      try {
        return await vitals.findByIdAndUpdate(
          id,
          {
            bodyTemperature,
            heartRate,
            respirationRate,
            bloodPressure,
          },
          { new: true }
        );
      } catch (error) {
        throw new Error(`Error updating vitals: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
