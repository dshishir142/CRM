import NavBar from "./dashboardComponents/navBar";
import EmailSetup from "./emailSetup";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../style/email.module.css";

export default function Email() {
    const [emailConfig, setEmailConfig] = useState(() => {
        const storedConfig = localStorage.getItem("emailConfig");
        return storedConfig ? JSON.parse(storedConfig) : null;
    });

    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedConfig = localStorage.getItem("emailConfig");
            setEmailConfig(updatedConfig ? JSON.parse(updatedConfig) : null);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        if (!emailConfig || !emailConfig.email || !emailConfig.appPassword) return;

        async function getEmails() {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get("http://localhost:8000/mail", {
                    params: {
                        appPassword: emailConfig.appPassword,
                        email: emailConfig.email,
                    },
                });
                setEmails(response.data);
            } catch (error) {
                setError("Failed to fetch emails.");
            } finally {
                setLoading(false);
            }
        }

        getEmails();
    }, [emailConfig]);

    return (
        <div className={styles.container}>
            <NavBar />
            {!emailConfig || !emailConfig.email || !emailConfig.appPassword ? (
                <EmailSetup />
            ) : selectedEmail ? (
                <div className={styles.emailDetails}>
                    <button onClick={() => setSelectedEmail(null)} className={styles.backButton}>Back</button>
                    <h2 className={styles.emailSubject}>{selectedEmail.subject || "No Subject"}</h2>
                    <p className={styles.emailFrom}><strong>From:</strong> {selectedEmail.from || "Unknown"}</p>
                    <p className={styles.emailDate}>{selectedEmail.date ? new Date(selectedEmail.date).toLocaleString() : "No Date"}</p>
                    <p className={styles.emailText}>{selectedEmail.text || "No Content"}</p>
                </div>
            ) : (
                <div className={styles.emailSection}>
                    <h2 className={styles.title}>📩 Your Emails</h2>

                    {loading && <p className={styles.loading}>Loading emails...</p>}
                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.emailList}>
                        {emails.length > 0 ? (
                            emails.map((email, index) => (
                                <div 
                                    key={index} 
                                    className={styles.emailCard}
                                    onClick={() => setSelectedEmail(email)}
                                >
                                    <h3 className={styles.emailSubject}>{email.subject || "No Subject"}</h3>
                                    <p className={styles.emailFrom}><strong>From:</strong> {email.from || "Unknown"}</p>
                                    <p className={styles.emailDate}>{email.date ? new Date(email.date).toLocaleString() : "No Date"}</p>
                                    <p className={styles.emailText}>
                                        {email.text ? email.text.slice(0, 100) + "..." : "No Content"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noEmails}>No emails found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
