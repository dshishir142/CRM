import { useState, useEffect } from "react";
import { saveEmailConfig } from "./localStorageUtils";
import styles from "../style/emailSetup.module.css";
import { useNavigate } from "react-router-dom";

export default function EmailSetup() {
    const navigate = useNavigate();
    const userData = localStorage.getItem('user');
    const localEmail = userData ? JSON.parse(userData).email : null;

    const [email, setEmail] = useState(localEmail || "");
    const [password, setPassword] = useState("");
    const [appPassword, setAppPassword] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        saveEmailConfig({ email, password, appPassword });
        setIsSaved(true); 
        alert("Email saved");
        window.location.reload();
    };

    useEffect(() => {
        if (isSaved) {
            navigate('/email'); 
        }
    }, [isSaved, navigate]);

    return (
        <div className={styles.emailSetupContainer}>
            {!localEmail ? (
                <div style={{ textAlign: "center", color: "red" }}>
                    <h2>Not Logged In</h2>
                    <p>Please log in to set up your email.</p>
                </div>
            ) : (
                <>
                    <h2>Setup Email</h2>
                    <form className={styles.emailSetupForm}>
                        <div className={styles.emailSetupFormGroup}>
                            <label>Email:</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div className={styles.emailSetupFormGroup}>
                            <label>Password:</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>

                        <div className={styles.emailSetupFormGroup}>
                            <label>App Password:</label>
                            <input 
                                type="password" 
                                value={appPassword} 
                                onChange={(e) => setAppPassword(e.target.value)} 
                            />
                        </div>

                        <button type="button" onClick={handleSave}>Save</button>
                    </form>
                </>
            )}
        </div>
    );
}
