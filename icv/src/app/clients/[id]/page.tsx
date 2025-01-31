"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClientById, updateClient } from "@/api/make-cases/make-case"; // assuming you have an updateClient function
import { Client } from "@/types/c-types";
import { Timestamp } from "firebase/firestore";

const ClientDetailPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [clientData, setClientData] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClientById(id);
        setClient(clientData);
        setClientData(clientData);
      } catch (err) {
        setError("Failed to load client details");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientData(prevData => ({
      ...prevData!,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateClient(id, clientData); // Update Firebase client document
      setEditMode(false);

      // Fetch updated client data after the submit
      const updatedClientData = await getClientById(id);
      setClient(updatedClientData); // Update the displayed client data
    } catch (err) {
      setError("Failed to update client details");
    }
  };

  const formatTimestamp = (timestamp?: Timestamp) => {
    return timestamp ? new Date(timestamp.seconds * 1000).toLocaleDateString() : "N/A";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!client) return <div>No client data found.</div>;

  return (
    <div>
      <h1>
        {editMode ? (
          <input
            type="text"
            name="firstName"
            value={clientData?.firstName || ""}
            onChange={handleInputChange}
          />
        ) : (
          `${client.firstName} ${client.middleInitial ? client.middleInitial + "." : ""} ${client.lastName}`
        )}
      </h1>

      <p>
        <strong>Email:</strong>{" "}
        {editMode ? (
          <input
            type="email"
            name="email"
            value={clientData?.email || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.email || "N/A"
        )}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="phoneNumber"
            value={clientData?.phoneNumber || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.phoneNumber || "N/A"
        )}
      </p>

      <p>
        <strong>Gender:</strong>{" "}
        {editMode ? (
          <select
            name="gender"
            value={clientData?.gender || ""}
            onChange={handleInputChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          client.gender
        )}
      </p>

      {client.gender === "Other" && (
        <p>
          <strong>Other Gender:</strong>{" "}
          {editMode ? (
            <input
              type="text"
              name="otherGender"
              value={clientData?.otherGender || ""}
              onChange={handleInputChange}
            />
          ) : (
            client.otherGender
          )}
        </p>
      )}

      <p>
        <strong>Age:</strong>{" "}
        {editMode ? (
          <input
            type="number"
            name="age"
            value={clientData?.age || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.age
        )}
      </p>

      <p>
        <strong>Date of Birth:</strong>{" "}
        {editMode ? (
          <input
            type="date"
            name="dateOfBirth"
            value={clientData?.dateOfBirth ? formatTimestamp(clientData.dateOfBirth) : ""}
            onChange={handleInputChange}
          />
        ) : (
          formatTimestamp(client.dateOfBirth)
        )}
      </p>

      <p>
        <strong>Address:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="address"
            value={clientData?.address || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.address || "N/A"
        )}
      </p>

      <p>
        <strong>City:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="city"
            value={clientData?.city || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.city
        )}
      </p>

      <p>
        <strong>ZIP Code:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="zipCode"
            value={clientData?.zipCode || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.zipCode
        )}
      </p>

      <p>
        <strong>Program:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="program"
            value={clientData?.program || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.program
        )}
      </p>

      <p>
        <strong>Primary Language:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="primaryLanguage"
            value={clientData?.primaryLanguage || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.primaryLanguage || "N/A"
        )}
      </p>

      <p>
        <strong>Client Code:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="clientCode"
            value={clientData?.clientCode || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.clientCode
        )}
      </p>

      <h2>Family Information</h2>

      <p>
        <strong>Spouse Name:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="spouseName"
            value={clientData?.spouseName || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.spouseName || "N/A"
        )}
      </p>

      <p>
        <strong>Spouse Age:</strong>{" "}
        {editMode ? (
          <input
            type="number"
            name="spouseAge"
            value={clientData?.spouseAge || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.spouseAge || "N/A"
        )}
      </p>

      <p>
        <strong>Spouse Gender:</strong>{" "}
        {editMode ? (
          <select
            name="spouseGender"
            value={clientData?.spouseGender || ""}
            onChange={handleInputChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          client.spouseGender
        )}
      </p>

      {client.spouseGender === "Other" && (
        <p>
          <strong>Spouse Other Gender:</strong>{" "}
          {editMode ? (
            <input
              type="text"
              name="spouseOtherGender"
              value={clientData?.spouseOtherGender || ""}
              onChange={handleInputChange}
            />
          ) : (
            client.spouseOtherGender
          )}
        </p>
      )}

      <p>
        <strong>Family Size:</strong>{" "}
        {editMode ? (
          <input
            type="number"
            name="familySize"
            value={clientData?.familySize || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.familySize
        )}
      </p>

      <p>
        <strong>Number of Children:</strong>{" "}
        {editMode ? (
          <input
            type="number"
            name="numberOfChildren"
            value={clientData?.numberOfChildren || ""}
            onChange={handleInputChange}
          />
        ) : (
          client.numberOfChildren
        )}
      </p>

      {client.childrenDetails?.length ? (
        <div>
          <h3>Children Details:</h3>
          <ul>
            {client.childrenDetails?.map((child, index) => (
              <li key={index}>
                {child.name} - {child.age} years old
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No children details available.</p>
      )}

      <h2>Demographics & Employment</h2>

      <p>
        <strong>Ethnicity:</strong>{" "}
        {editMode ? (
          <select
            name="ethnicity"
            value={clientData?.ethnicity || ""}
            onChange={handleInputChange}
          >
            <option value="African American">African American</option>
            <option value="Asian">Asian</option>
            <option value="Latino/Hispanic">Latino/Hispanic</option>
            <option value="Native American">Native American</option>
            <option value="White/Caucasian">White/Caucasian</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          client.ethnicity
        )}
      </p>

      <p>
        <strong>Employment Status:</strong>{" "}
        {editMode ? (
          <select
            name="employmentStatus"
            value={clientData?.employmentStatus || ""}
            onChange={handleInputChange}
          >
            <option value="No">No</option>
            <option value="Yes, Part-Time">Yes, Part-Time</option>
            <option value="Yes, Full-Time">Yes, Full-Time</option>
          </select>
        ) : (
          client.employmentStatus
        )}
      </p>

      <p>
        <strong>Foster Youth Status:</strong>{" "}
        {editMode ? (
          <select
            name="fosterYouthStatus"
            value={clientData?.education?.fosterYouthStatus || ""}
            onChange={handleInputChange}
          >
            <option value="Yes, Currently">Yes, Currently</option>
            <option value="Yes, Previously">Yes, Previously</option>
            <option value="No">No</option>
          </select>
        ) : (
          client?.education?.fosterYouthStatus
        )}
      </p>

      <h2>Assessment and Client Details</h2>

      <p>
        <strong>Probation Status:</strong>{" "}
        {editMode ? (
          <select
            name="probationStatus"
            value={clientData?.probationStatus || ""}
            onChange={handleInputChange}
          >
            <option value="No">No</option>
            <option value="Yes, Previously">Yes, Previously</option>
            <option value="Yes, Currently">Yes, Currently</option>
          </select>
        ) : (
          client.probationStatus
        )}
      </p>

      <p>
        <strong>Client Status:</strong>{" "}
        {editMode ? (
          <select
            name="status"
            value={clientData?.status || ""}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        ) : (
          client.status
        )}
      </p>

      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel Edit" : "Edit"}
      </button>
      {editMode && <button onClick={handleSubmit}>Submit Changes</button>}
    </div>
  );
};

export default ClientDetailPage;
