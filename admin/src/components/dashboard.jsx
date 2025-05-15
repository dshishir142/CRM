import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from '../style/home.module.css';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, BarElement, Title);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [productData, setProductData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/data/alltasks')
      .then(res => res.json())
      .then(data => setTasks(data.data))
      .catch(err => console.error('Error fetching tasks:', err));

    fetch('http://localhost:8000/data/allproductrate')
      .then(res => res.json())
      .then(data => setProductData(data.data))
      .catch(err => console.error('Error fetching product data:', err));

    fetch('http://localhost:8000/data/all')
      .then(res => res.json())
      .then(data => setClientData(data.data))
      .catch(err => console.error('Error fetching client data:', err));

    fetch('http://localhost:8000/user/')
      .then(res => res.json())
      .then(data => setClients(data.data))
      .catch(err => console.error('Error fetching clients:', err));
  }, []);

  const handleEdit = (task) => {
    setEditTask({ ...task });
  };

  const handleEditChange = (field, value) => {
    setEditTask(prev => ({ ...prev, [field]: value }));
  };

  const saveEditedTask = () => {
    fetch(`http://localhost:8000/data/tasks/${editTask.task_id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editTask),
    })
      .then(() => {
        setTasks(prev =>
          prev.map(t => (t.task_id === editTask.task_id ? editTask : t))
        );
        setEditTask(null);
      })
      .catch(err => console.error('Error updating task:', err));
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`http://localhost:8000/data/tasks/${taskId}/delete`, {
        method: 'DELETE',
      })
        .then(() => {
          setTasks(prev => prev.filter(t => t.task_id !== taskId));
        })
        .catch(err => console.error('Error deleting task:', err));
    }
  };

  const renderBarChart = () => {
    if (!productData.length) return null;
    const labels = productData.map(item => item.productName);
    const counts = productData.map(item => item.count);

    const data = {
      labels,
      datasets: [
        {
          label: 'Client Interest Count',
          data: counts,
          backgroundColor: 'rgba(0, 123, 255, 0.7)',
          borderRadius: 6,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: { labels: { color: 'white' } },
        title: {
          display: true,
          text: 'Top Products by Interest',
          color: 'white',
          font: { size: 16 },
        },
      },
      scales: {
        x: { ticks: { color: 'white' }, grid: { color: '#444' } },
        y: {
          beginAtZero: true,
          ticks: { color: 'white' },
          grid: { color: '#444' },
        },
      },
    };

    return (
      <div className={styles.barChartCard}>
        <Bar data={data} options={options} height={200} />
      </div>
    );
  };

  const renderClientCharts = () => {
    return clientData.map((client, idx) => {
      const labels = client.history.map(point =>
        new Date(point.x).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      );
      const scores = client.history.map(point => point.y);
      const reasons = client.history.map(point => point.reason);

      const data = {
        labels,
        datasets: [
          {
            label: client.clientName,
            data: scores,
            borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
            backgroundColor: 'transparent',
            tension: 0.4,
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'white' } },
          tooltip: {
            callbacks: {
              label: context => `Score: ${context.parsed.y}`,
              afterLabel: context => `Reason: ${reasons[context.dataIndex]}`,
            },
          },
        },
        scales: {
          x: { ticks: { color: 'white' }, grid: { color: '#444' } },
          y: {
            min: 0,
            max: 10,
            ticks: {
              color: 'white',
              stepSize: 5,
              callback: value => [0, 5, 10].includes(value) ? value : null,
            },
            grid: { color: '#444' },
          },
        },
      };

      return (
        <div key={client.clientId} className={styles.chartCard}>
          <h3>{client.clientName}</h3>
          <Line data={data} options={options} height={100} />
        </div>
      );
    });
  };

  const renderTasks = () => {
    return tasks.length === 0 ? (
      <p className={styles.loading}>No tasks assigned.</p>
    ) : (
      tasks.map(task => (
        <div key={task.task_id} className={styles.taskCard}>
          <div>
            <p className={styles.taskDescription}>{task.description}</p>
            <p className={styles.taskDueDate}>
              Status: {task.status} | Due:{' '}
              {task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div className={styles.taskButtons}>
            <button className={styles.markDoneButton} onClick={() => handleEdit(task)}>
              Edit
            </button>
            <button className={styles.deleteButton} onClick={() => handleDelete(task.task_id)}>
              Delete
            </button>
          </div>
        </div>
      ))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.graphSection}>
        <h2 className={styles.sectionTitle}>Product Interest Overview</h2>
        {renderBarChart()}
        <h2 className={styles.sectionTitle}>Client Journeys</h2>
        {clientData.length > 0 ? renderClientCharts() : <p className={styles.loading}>Loading charts...</p>}
      </div>

      <div className={styles.taskSection}>
        <div className={styles.taskHeader}>
          <h2 className={styles.sectionTitle}>Tasks</h2>
          <Link to="/assigntask">
            <button className={styles.assignButton}>+ Assign Task</button>
          </Link>
        </div>
        {renderTasks()}
      </div>


      {editTask && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Edit Task</h3>
            <label>Description:</label>
            <input
              type="text"
              value={editTask.description}
              onChange={(e) => handleEditChange('description', e.target.value)}
              className={styles.modalInput}
            />
            <label>Status:</label>
            <select
              value={editTask.status}
              onChange={(e) => handleEditChange('status', e.target.value)}
              className={styles.modalInput}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <label>Due Date:</label>
            <input
              type="date"
              value={editTask.due_date ? editTask.due_date.substring(0, 10) : ''}
              onChange={(e) => handleEditChange('due_date', e.target.value)}
              className={styles.modalInput}
            />
            <label>Agent:</label>
            <select
              value={editTask.user_id}
              onChange={(e) => handleEditChange('user_id', parseInt(e.target.value))}
              className={styles.modalInput}
            >
              {clients.map(client => (
                <option key={client.user_id} value={client.user_id}>{client.name}</option>
              ))}
            </select>
            <div className={styles.modalButtons}>
              <button onClick={saveEditedTask} className={styles.saveButton}>Save</button>
              <button onClick={() => setEditTask(null)} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
