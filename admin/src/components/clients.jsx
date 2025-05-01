import { useEffect, useState } from "react";
import styles from "../style/clients.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:8000/client/all");
      setClients(res.data.data);
    } catch (error) {
      console.log("Error fetching clients:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/client/${id}`);
      fetchClients();
    } catch (error) {
      console.log("Error deleting client:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Client List</h2>

      <div className={`${styles.tableRow} ${styles.tableHeader}`}>
        <div>Name</div>
        <div>Email</div>
        <div>Phone</div>
        <div>Address</div>
        <div>Interest</div>
        <div>Agent</div>
        <div>Actions</div>
      </div>

      {clients.map((client) => (
        <div className={styles.tableRow} key={client.client_id}>
          <div>{client.name}</div>
          <div>{client.email}</div>
          <div>{client.phone}</div>
          <div>{client.address}</div>
          <div>{client.interest_score ?? "-"}</div>
          <div>{client.agent?.name ?? "-"}</div>
          <div className={styles.actionButtons}>
            <button
              className={styles.editBtn}
              onClick={() => navigate(`/editclient/${client.client_id}`)}
            >
              Edit
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(client.client_id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
