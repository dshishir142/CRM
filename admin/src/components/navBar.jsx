import React from "react";
import { Link } from "react-router-dom";
import styles from "../style/nav.module.css";

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
          <Link to="/users" className={styles.navItem}>
            <img src="/image/profile.png" alt="User" className={styles.profileIcon} />Users
          </Link>
        </li>
        <li>
          <Link to="/product" className={styles.navItem}>
            <img src="/image/enrichment.png" alt="product" className={styles.profileIcon} />Product
          </Link>
        </li>
      </ul>
    </nav>
  );
}
