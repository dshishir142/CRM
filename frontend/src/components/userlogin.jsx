import styles from '../style/userLogin.module.css';
import { Link } from 'react-router-dom';

export default function UserLogin() {
    return (
        <div className={styles.container}>
            <h2>Sign In</h2>
            <form action="/signin" method="POST">
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Log In</button>
            </form>
            <p className={styles.registerText}>
                Don't have an account? <Link to="/usersignin">Register here</Link>
            </p>
        </div>
    );
}
