import { useEffect, useState } from "react";
import NavBar from "./navBar";
import styles from "../style/interaction.module.css";
import axios from "axios";

export default function Interactions() {
    const [searchTerm, setSearchTerm] = useState("");
    const [interactions, setInteractions] = useState([]);
    const [selectedInteraction, setSelectedInteraction] = useState(null);

    const getInteraction = async () => {
        try {
            const response = await axios.get("http://localhost:8000/interaction");
            setInteractions(response.data.data);
        } catch (error) {
            console.error("Error fetching interactions:", error);
        }
    };

    useEffect(() => {
        getInteraction();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this interaction?")) {
            try {
                await axios.delete(`http://localhost:8000/interaction/${id}`);
                getInteraction();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    const filteredInteractions = interactions.filter(interaction =>
        interaction.interaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <NavBar />
            <h2>All Interactions</h2>
            <input
                type="text"
                placeholder="Search Interactions..."
                className={styles.searchBar}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.interactionsGrid}>
                {filteredInteractions.map((interaction) => (
                    <div
                        key={interaction.interaction_id}
                        className={styles.interactionCard}
                        onClick={() => setSelectedInteraction(interaction)}
                    >
                        <h3>{interaction.interaction_type}</h3>
                        <p>Date: {new Date(interaction.interaction_date).toLocaleDateString()}</p>
                        <p>Client: {interaction.client.name}</p>
                        <button
                            className={styles.deleteButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(interaction.interaction_id);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {selectedInteraction && (
                <div className={`${styles.modalOverlay} ${styles.active}`}>
                    <div className={styles.interactionDetails}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedInteraction(null)}
                        >
                            Close
                        </button>
                        <h3>Interaction Details</h3>
                        <p><strong>Type:</strong> {selectedInteraction.interaction_type}</p>
                        <p><strong>Date:</strong> {new Date(selectedInteraction.interaction_date).toLocaleDateString()}</p>
                        <p><strong>Client:</strong> {selectedInteraction.client.name}</p>
                        <p><strong>Email:</strong> {selectedInteraction.client.email}</p>
                        <p><strong>Summary:</strong> {selectedInteraction.summary}</p>
                        {selectedInteraction.next_followup_date && (
                            <p><strong>Follow-up Date:</strong> {new Date(selectedInteraction.next_followup_date).toLocaleDateString()}</p>
                        )}
                        {selectedInteraction.notes && (
                            <p><strong>Notes:</strong> {selectedInteraction.notes}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}