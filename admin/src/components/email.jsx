import { useEffect, useState } from "react";
import NavBar from "./navBar";
import styles from "../style/email.module.css";
import axios from "axios";

export default function Email() {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);

    const fetchEmails = async () => {
        try {
            const response = await axios.get("http://localhost:8000/mail/all");
            setEmails(response.data.data);
        } catch (error) {
            console.error("Failed to fetch emails:", error);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div className={styles.container}>
            <NavBar />
            <h2>Emails Sent</h2>
            <div className={styles.table}>
                <div className={`${styles.tableHeader} ${styles.tableRow}`}>
                    <div>To</div>
                    <div>Subject</div>
                    <div>Status</div>
                    <div>Date</div>
                </div>
                {emails.map((email) => (
                    <div
                        key={email.email_id}
                        className={styles.tableRow}
                        onClick={() => setSelectedEmail(email)}
                    >
                        <div>{email.to}</div>
                        <div>{email.subject}</div>
                        <div>{email.status}</div>
                        <div>{new Date(email.created_at).toLocaleDateString()}</div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedEmail && (
                <div className={`${styles.modalOverlay} ${selectedEmail ? styles.active : ""}`}>
                    <div className={styles.emailDetails}>
                        <button
                            className={styles.closeButton}
                            onClick={() => setSelectedEmail(null)}
                        >
                            Close
                        </button>
                        <h3>{selectedEmail.subject}</h3>
                        <p><strong>From:</strong> {selectedEmail.agent?.name || "N/A"}</p>
                        <p><strong>To:</strong> {selectedEmail.to}</p>
                        <p><strong>Status:</strong> {selectedEmail.status}</p>
                        <p className={styles.emailContent}><strong>Content:</strong><br />{selectedEmail.body}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
