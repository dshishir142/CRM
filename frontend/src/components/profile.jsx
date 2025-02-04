import NavBar from "./dashboardComponents/navBar";
import styles from "../style/profile.module.css";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {

    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = user !== null;
   

    const navigate = useNavigate();
    console.log(user.image);

    function handleLogout() {

        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div>
            <NavBar />

            {isLoggedIn ? (<div>
                <div>
                    <img src={user.image} alt="Profile" className={styles.profilePic}></img>
                </div>

                <div className={styles.profileContainer}>
                    <h1>{user.name}</h1>
                    <br></br>
                    <h3>{user.email}</h3>
                    <h3>{user.role_id === 1 ? "Agent" : "Admin"}</h3>
                    <Link to='/edituser' className={styles.editButton}>
                    Edit
                    </Link>
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