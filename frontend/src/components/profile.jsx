import NavBar from "./dashboardComponents/navBar";
import styles from "../style/profile.module.css";
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";

export default function Profile() {

    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = user !== null;
    let imgUrl;
    if (isLoggedIn) {
        if (user.image) {
            imgUrl = `/image/${user.image}`;
        } else {
            imgUrl = '/image/default.jpg';
        }
    }

    const navigate = useNavigate();

    function handleLogout() {

        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div>
            <NavBar />

            {isLoggedIn ? (<div>
                <div>
                    <img src={imgUrl} alt="Profile" className={styles.profilePic}></img>
                </div>

                <div className={styles.profileContainer}>
                    <h1>{user.name}</h1>
                    <button className={styles.logoutButton} onClick={handleLogout}>Log out</button>
                </div>


            </div>) : (
                <div className={styles.notLoggedInContainer}>
                    <p className={styles.notLoggedInText}>You are not logged in</p>
                    <div className={styles.buttonContainer}>
                        <Link to="/userlogin" className={styles.loginButton}>Login</Link>
                    </div>
                </div>

            )}

        </div>
    )
}