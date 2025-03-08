import React, { useState, useEffect } from "react";
import styles from "../style/clients.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Clients = () => {
    const localData = JSON.parse(localStorage.getItem("user"));
    const [searchTerm, setSearchTerm] = useState("");
    const [clients, setClients] = useState([]);
    const [editingClient, setEditingClient] = useState(null);
    const [newInterestScore, setNewInterestScore] = useState(0);
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/client/${localData.user_id}`,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            setClients(response.data.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const openEditPopup = (client) => {
        setEditingClient(client);
        setNewInterestScore(client.interest_score);
        setReason("");
        setError("");
    };

    const handleSave = async () => {
        if (!reason.trim()) {
            setError("Reason is required.");
            return;
        }
        setError("");

        if (!editingClient) return;

        const updatedClients = clients.map((client) =>
            client.client_id === editingClient.client_id
                ? { ...client, interest_score: newInterestScore }
                : client
        );
        setClients(updatedClients);
        setEditingClient(null);

        try {
            await axios.put(
                `http://localhost:8000/client/interestscore/${editingClient.client_id}`,
                { interest_score: newInterestScore, reason },
                { headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            console.error("Error updating interest score:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Clients</h2>
            <input
                type="text"
                placeholder="Search clients..."
                className={styles.searchBar}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link to="/addclient">
                <button className={styles.addClientButton}>+ Add Client</button>
            </Link>

            <div className={styles.clientList}>
                {clients.length > 0 ? (
                    clients
                        .filter((client) =>
                            client.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((client) => (
                            <div key={client.client_id} className={styles.clientCard}>
                                <div className={styles.clientInfo}>
                                    <h3>{client.name}</h3>
                                    <p>Email: {client.email}</p>
                                    <p>Phone: {client.phone}</p>
                                </div>

                                <div
                                    className={styles.interestScore}
                                    onClick={() => openEditPopup(client)}
                                >
                                    Interest: {client.interest_score} ✏️
                                </div>
                            </div>
                        ))
                ) : (
                    <p>No clients found.</p>
                )}
            </div>

            {editingClient && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h3>Edit Interest Score</h3>
                        <label>Interest Score:</label>
                        <input
                            type="number"
                            min="0"
                            max="10"
                            value={newInterestScore}
                            onChange={(e) => {
                                let value = parseInt(e.target.value, 10);
                                if (isNaN(value)) value = 0;
                                if (value < 0) value = 0;
                                if (value > 10) value = 10;
                                setNewInterestScore(value);
                            }}
                        />

                        <label>Reason (Required):</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for update..."
                        ></textarea>
                        {error && <p className={styles.errorMessage}>{error}</p>}

                        <div className={styles.popupButtons}>
                            <button onClick={handleSave} disabled={!reason.trim()}>
                                Save
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setEditingClient(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
