import { useState } from 'react';
import styles from '../style/userLogin.module.css';
import { Link, useNavigate } from 'react-router-dom';
import  setUserInLocalStorage  from './localStorageUtils';
import { nav } from 'framer-motion/client';

export default function UserLogin() {
    
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name] : value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();


        try{

            const response = await fetch('http://localhost:8000/user/login', {
                method: "POST",
                headers: {
                    'content-type' : 'application/json',
                },
                body : JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(`${data.message}`);
            }
            
            setUserInLocalStorage.setUserInLocalStorage(data.data.email);
            alert(data.message);
            navigate('/');


        }catch(error){
            alert("Login failed: " + error.message);
        }
    }

    return (
        <div className={styles.container}>
            <h2>Sign In</h2>
            <form onSubmit={handleLogin}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" onChange={handleChange} required />
                </div>
                <button type="submit" >Log In</button>
            </form>
            <p className={styles.registerText}>
                Don't have an account? <Link to="/usersignin">Register here</Link>
            </p>
        </div>
    );
}
