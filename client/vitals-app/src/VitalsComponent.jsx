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

function VitalsComponent({ onLogout }) {
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

  const handleLogout = () => {
    onLogout();
  };

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

  if (loading) return <div className="flex justify-center p-4">Loading vitals data...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Patient Vitals Management</h2>
        <button onClick={handleLogout} className="btn btn-sm btn-outline">Logout</button>
      </div>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="bg-base-200 border border-base-300 p-4 rounded-box mb-6">
        <h3 className="font-semibold mb-2">Add New Vitals</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patientId" className="block mb-1">Patient ID:</label>
              <input
                type="text"
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label htmlFor="bodyTemperature" className="block mb-1">Body Temperature:</label>
              <input
                type="number"
                id="bodyTemperature"
                step="0.1"
                value={bodyTemperature}
                onChange={(e) => setBodyTemperature(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label htmlFor="heartRate" className="block mb-1">Heart Rate:</label>
              <input
                type="number"
                id="heartRate"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label htmlFor="respirationRate" className="block mb-1">Respiration Rate:</label>
              <input
                type="number"
                id="respirationRate"
                value={respirationRate}
                onChange={(e) => setRespirationRate(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            
            <div>
              <label htmlFor="bloodPressure" className="block mb-1">Blood Pressure:</label>
              <input
                type="number"
                id="bloodPressure"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-neutral">Add Vitals</button>
        </form>
      </div>

      <div className="bg-base-200 border border-base-300 p-4 rounded-box">
        <h3 className="font-semibold mb-2">Vitals Records</h3>
        <div className="overflow-x-auto">
          {data?.getAllVitals?.length > 0 ? (
            <table className="table table-zebra w-full">
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
            <p className="text-center py-4">No vitals records found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VitalsComponent;
