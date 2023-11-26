// DisplayData.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DataForm from "../DataForm/DataForm";
import { styles } from "./styles";
import { baseUrl } from "../../api";

interface DataType {
  id: number;
  name: string;
  email: string;
  avatar: RequestInfo | URL;
}

const DisplayData = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/data`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUploadDone = async () => {
    await fetchData();
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      // Make the API call to delete data
      await axios.delete(`${baseUrl}/data/${id}`);
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
        <table style={styles.table as React.CSSProperties}>
          <thead>
            <tr>
              <th style={styles.th as React.CSSProperties}>Avatar</th>
              <th style={styles.th as React.CSSProperties}>Name</th>
              <th style={styles.th as React.CSSProperties}>Email</th>
              <th style={styles.th as React.CSSProperties}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: DataType) => (
              <tr key={item.id}>
                <td style={styles.td as React.CSSProperties}>
                  <img
                    src={item.avatar as string | undefined}
                    alt="Avatar"
                    style={styles.avatar}
                  />
                </td>
                <td style={styles.td as React.CSSProperties}>{item.name}</td>
                <td style={styles.td as React.CSSProperties}>{item.email}</td>
                <td style={styles.td as React.CSSProperties}>
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
