import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/composeMail.module.css"; 
import axios from "axios";

export default function ComposeMail() {

    const localData = JSON.parse(localStorage.getItem('emailConfig'));
    const userData = JSON.parse(localStorage.getItem('user'));

    const [emailData, setEmailData] = useState({
        user_id: userData.user_id,
        user: localData.email, 
        to: "", 
        subject: "",
        text: "", 
        pass: localData.appPassword,
    });

    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmailData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/mail", emailData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response){
                alert("Mail sent successfully");
                navigate('/email');
            }
        } catch (error) {
            console.error("Failed to send email:", error); 
        }
    };

    return (
        <div className={styles.container}>
            <button onClick={() => navigate("/email")} className={styles.backButton}>Back</button>
            <h2 className={styles.title}>Compose Email</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="from">From</label>
                    <input
                        type="email"
                        id="from"
                        name="user"  
                        value={emailData.user}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="to">To</label>
                    <input
                        type="email"
                        id="to"
                        name="to"
                        value={emailData.to}
                        onChange={handleChange}
                        placeholder="Recipient's Email"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={emailData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="text">Body</label> 
                    <textarea
                        id="text"
                        name="text"
                        value={emailData.text}
                        onChange={handleChange}
                        placeholder="Write your email..."
                        required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>Send</button>
            </form>
        </div>
    );
}
