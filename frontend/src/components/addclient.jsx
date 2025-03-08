import React, { useState } from "react";
import styles from "../style/addClient.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AddClientForm() {

    const navigate = useNavigate();

    const localData = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        interest_score: "",
        agent: localData.user_id, 
    });

    const requiredFields = ["name", "email", 'phone', 'address'];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "interest_score") {
            setFormData({ ...formData, [name]: value ? parseInt(value, 10) : "" });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/client', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if(response.status === 201){
                alert("Client created successfully");
                navigate('/clients');
            }
        } catch (error) {
            console.log("Something went wrong: ", error);
        }
    };

    return (
        <div className={styles.addClientContainer}>
            <h2 className={styles.addClientTitle}>Add Client</h2>
            <form className={styles.addClientForm} onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, value]) => (
                    key !== "agent" && (  
                        <div key={key} className={styles.addClientFormGroup}>
                            <label className={styles.addClientLabel} htmlFor={key}>
                                {key.replace("_", " ").toUpperCase()}
                            </label>
                            <input
                                className={styles.addClientInput}
                                type={key === "interest_score" ? "number" : "text"} 
                                id={key}
                                name={key}
                                value={value}
                                onChange={handleChange}
                                required={requiredFields.includes(key)}
                            />
                        </div>
                    )
                ))}
                <input type="hidden" name="agent" value={formData.agent} />

                <button className={styles.addClientSubmitButton} type="submit">
                    Add Client
                </button>
            </form>
        </div>
    );
}

export default AddClientForm;
