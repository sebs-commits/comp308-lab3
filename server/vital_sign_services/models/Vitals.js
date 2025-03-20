const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  bodyTemperature: {
    type: Number,
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
  },
  respirationRate: {
    type: Number,
    required: true,
  },
  bloodPressure: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Vitals", vitalsSchema);
