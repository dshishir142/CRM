import React, { useEffect, useState } from "react";
import styles from "../style/editUser.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

function EditUser() {
    const navigate = useNavigate();
    const passed_user = useLocation().state;

    const [preview, setPreview] = useState();
    const [image, setImage] = useState();
    const [error, setError] = useState();

    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [formData, setFormData] = useState({
        name: passed_user.name,
        email: passed_user.email,
        image: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.confirmPassword !== formData.password) {
            setError("Passwords do not match");
            return;
        } else {
            setError("");
        }

        try {

            let formDataToSend = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            }

            let imgUrl = formData.image;

            if (image) {
                const imageDataToSend = new FormData();
                imageDataToSend.append('image', image);

                const uploadResponse = await axios.post('http://localhost:8001/upload', imageDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })

                imgUrl = uploadResponse.data.imgUrl;
                formDataToSend.image = imgUrl;
            }

            const upload = await axios.post('http://localhost:8000/user/edituser', formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if(upload){
                alert(upload.data.message);
                navigate('/users');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }
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
                        value={formData.name}
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
                        value={passed_user.email}
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
                                defaultValue={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                defaultValue={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        {error && <p className={styles.errorMessage}>{error}</p>}
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
