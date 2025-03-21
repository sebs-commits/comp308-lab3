// product-app/src/ProductComponent.jsx
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

// GraphQL queries and mutations for vitals
const GET_ALL_VITALS = gql`
  query GetAllVitals {
    getAllVitals {
      id
      patientId
      bodyTemperature
      heartRate
      respirationRate
      bloodPressure
    }
  }
`;

const ADD_VITALS = gql`
  mutation AddVitals(
    $patientId: String!
    $bodyTemperature: Float!
    $heartRate: Float!
    $respirationRate: Float!
    $bloodPressure: Float!
  ) {
    addVitals(
      patientId: $patientId
      bodyTemperature: $bodyTemperature
      heartRate: $heartRate
      respirationRate: $respirationRate
      bloodPressure: $bloodPressure
    ) {
      id
      patientId
      bodyTemperature
      heartRate
      respirationRate
      bloodPressure
    }
  }
`;

function VitalsComponent() {
  // State for form inputs
  const [patientId, setPatientId] = useState("");
  const [bodyTemperature, setBodyTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respirationRate, setRespirationRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [error, setError] = useState("");

  // Query to fetch vitals
  const { loading, data, refetch } = useQuery(GET_ALL_VITALS, {
    onError: (error) => {
      setError(`Error fetching vitals: ${error.message}`);
    },
  });

  // Mutation to add vitals
  const [addVitals] = useMutation(ADD_VITALS, {
    onCompleted: () => {
      // Reset form
      setPatientId("");
      setBodyTemperature("");
      setHeartRate("");
      setRespirationRate("");
      setBloodPressure("");
      refetch();
    },
    onError: (error) => {
      setError(`Error adding vitals: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!patientId || !bodyTemperature || !heartRate || !respirationRate || !bloodPressure) {
      setError("All fields are required");
      return;
    }

    // Convert string inputs to numbers
    const vitalsData = {
      patientId,
      bodyTemperature: parseFloat(bodyTemperature),
      heartRate: parseFloat(heartRate),
      respirationRate: parseFloat(respirationRate),
      bloodPressure: parseFloat(bloodPressure),
    };

    addVitals({ variables: vitalsData });
  };

  if (loading) return <div>Loading vitals data...</div>;

  return (
    <div>
      <h2>Patient Vitals Management</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patientId">Patient ID:</label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="bodyTemperature">Body Temperature:</label>
          <input
            type="number"
            id="bodyTemperature"
            step="0.1"
            value={bodyTemperature}
            onChange={(e) => setBodyTemperature(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="heartRate">Heart Rate:</label>
          <input
            type="number"
            id="heartRate"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="respirationRate">Respiration Rate:</label>
          <input
            type="number"
            id="respirationRate"
            value={respirationRate}
            onChange={(e) => setRespirationRate(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="bloodPressure">Blood Pressure:</label>
          <input
            type="number"
            id="bloodPressure"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
          />
        </div>
        
        <button type="submit">Add Vitals</button>
      </form>

      <h3>Vitals Records</h3>
      <div>
        {data?.getAllVitals?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Body Temp</th>
                <th>Heart Rate</th>
                <th>Respiration Rate</th>
                <th>Blood Pressure</th>
              </tr>
            </thead>
            <tbody>
              {data.getAllVitals.map((vital) => (
                <tr key={vital.id}>
                  <td>{vital.patientId}</td>
                  <td>{vital.bodyTemperature}</td>
                  <td>{vital.heartRate}</td>
                  <td>{vital.respirationRate}</td>
                  <td>{vital.bloodPressure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No vitals records found.</p>
        )}
      </div>
    </div>
  );
}

export default VitalsComponent;
