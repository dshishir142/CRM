import React from "react";
import { Link } from "react-router-dom";
import styles from "../../style/navBar.module.css";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <Link to="/" className={styles.navItem}>
            <img src="/image/home.png" alt="Home" className={styles.homeIcon} />Home
          </Link>
        </li>
        <li>
          <Link to="/email" className={styles.navItem}>
            <img src="/image/email.png" alt="Email" className={styles.homeIcon} />Email
          </Link>
        </li>
        <li>
          <Link to="/interactions" className={styles.navItem}>
            <img src="/image/interaction.png" alt="Interaction" className={styles.homeIcon} />Interactions
          </Link>
        </li>
        <li>
          <Link to="/clients" className={styles.navItem}>
            <img src="/image/client.png" alt="CLient" className={styles.clientIcon} />Clients
          </Link>
        </li>
        <li>
          <Link to="/profile" className={styles.navItem}>
            <img src="/image/profile.png" alt="Profile" className={styles.profileIcon} />Profile
          </Link>
        </li>
        <li>
          <Link to="/enrichment" className={styles.navItem}>
            <img src="/image/enrichment.png" alt="enrichment" className={styles.profileIcon} />Enrichment
          </Link>
        </li>
      </ul>
    </nav>
  );
}
