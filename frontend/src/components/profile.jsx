import NavBar from "./dashboardComponents/navBar";
import styles from "../style/profile.module.css";
import { Link } from "react-router-dom";

export default function Profile() {

    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = user !== null;


    return (
        <div>
            <NavBar />

            {isLoggedIn ? (<div>
                <div className={styles.profilePic}>
                    
                </div>

                <div className={styles.profileContainer}>
                    <h1>{user.name}</h1>
                </div>
            </div>) : (
                <div>
                    <Link to="/userlogin">Login</Link>
                </div>
            )}

        </div>
    )
}