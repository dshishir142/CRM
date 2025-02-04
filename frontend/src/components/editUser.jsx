import React, { useState} from "react";
import styles from "../style/userSignin.module.css";
import { useNavigate } from "react-router-dom";

function EditUser() {
    const navigate = useNavigate();

    const [ preview, setPreview ] = useState();
    
    const user = JSON.parse(localStorage.getItem("user"));

    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        image: user.image,
        password: user.password,
        confirmPassword: user.password,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file.path);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        alert(JSON.stringify(formData));
    };

    const togglePasswordFields = () => {
        setShowPasswordFields((prev) => !prev);
    };

    return (
        <div className={styles.container}>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || user.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || user.email}
                        onChange={handleChange}
                        required
                        disabled
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="image">Profile Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>
                <div className={styles.profilePreviewContainer}>
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className={styles.profilePreview} 
                    />
                </div>



                <button type="button" className={styles.changePasswordButton} onClick={togglePasswordFields}>
                    Change Password
                </button>

                {showPasswordFields && (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                <button className={styles.submitButton} type="submit">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditUser;
