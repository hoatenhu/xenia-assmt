// DisplayData.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DataForm from "../DataForm/DataForm";
import { styles } from "./styles";

const DisplayData = () => {
  const [data, setData] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUploadDone = async () => {
    await fetchData();
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      // Make the API call to delete data
      await axios.delete(`http://localhost:3001/data/${id}`);
      // Fetch new data after successful delete
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DataForm onUploadDone={handleUploadDone} />
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Avatar</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>
                  <img src={item.avatar} alt="Avatar" style={styles.avatar} />
                </td>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.email}</td>
                <td style={styles.td}>
                  <button
                    style={{
                      color: "#d01616",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleDelete(item.id)}
                  >
                    {/* You can use an icon here */}
                    {deleting ? "Deleting" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DisplayData;
