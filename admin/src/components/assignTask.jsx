import React, { useState, useEffect } from 'react';
import styles from '../style/assignTask.module.css';
import { nav } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';

const AssignTask = () => {
    const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [dueDate, setDueDate] = useState('');
  const [userId, setUserId] = useState('');
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/user/')
      .then(res => res.json())
      .then(data => setClients(data.data))
      .catch(err => console.error('Error fetching clients:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      description,
      status,
      due_date: dueDate,
      user_id: parseInt(userId),
    };

    fetch('http://localhost:8000/data/tasks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then(res => res.json())
      .then(data => {
        setMessage('Task assigned successfully!');
        setDescription('');
        setStatus('PENDING');
        setDueDate('');
        setUserId('');
        navigate('/');
      })
      .catch(err => {
        console.error('Error creating task:', err);
        setMessage('Error assigning task.');
      });
  };

  return (
    <div className={styles.container}>
      <h2>Assign New Task</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <label>Status:</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
        />

        <label>Assign to Agent:</label>
        <select value={userId} onChange={e => setUserId(e.target.value)} required>
          <option value="">-- Select Agent --</option>
          {clients.map(user => (
            <option key={user.user_id} value={user.user_id}>
              {user.name}
            </option>
          ))}
        </select>

        <button type="submit">Assign Task</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default AssignTask;
