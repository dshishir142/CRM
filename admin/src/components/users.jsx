import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../style/users.module.css";
import { Link } from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8000/user", {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:8000/user/${id}`)
        .then(() => fetchUsers())
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.usersPage}>
      <div className={styles.header}>
        <h2>Users</h2>
        <Link to='/adduser' >
          <button className={styles.addBtn}>+ Add User</button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div>Image</div>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>

        {filteredUsers.map((user) => (
          <div key={user.user_id} className={styles.tableRow}>
            <div>
              <img src={user.image} alt={user.name} className={styles.userImage} />
            </div>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.role_id === 1 ? "Agent" : "Admin"}</div>
            <div className={styles.actionButtons}>
              <Link to='/edituser' state={user}> 
                  <button className={styles.editBtn}>Edit</button>
              </Link>
              <button onClick={() => handleDelete(user.user_id)} className={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
