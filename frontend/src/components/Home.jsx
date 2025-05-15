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

const Home = () => {
    const [clientData, setClientData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [followups, setFollowups] = useState([]);

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('user'));
        const agentId = localData.user_id;

        fetch(`http://localhost:8000/data/${agentId}`)
            .then(res => res.json())
            .then(data => setClientData(data))
            .catch(err => console.error('Error fetching client data:', err));

        fetch(`http://localhost:8000/data/productrate/${agentId}`)
            .then(res => res.json())
            .then(data => setProductData(data.data))
            .catch(err => console.error('Error fetching product data:', err));

        fetch(`http://localhost:8000/data/tasks/${agentId}`)
            .then(res => res.json())
            .then(data => setTasks(data.data))
            .catch(err => console.error('Error fetching tasks:', err));

        fetch(`http://localhost:8000/data/followups/${agentId}`)
            .then(res => res.json())
            .then(data => setFollowups(data.data))
            .catch(err => console.error('Error fetching follow-ups:', err));
    }, []);

    const markTaskDone = (taskId) => {
        fetch(`http://localhost:8000/data/tasks/${taskId}/complete`, {
            method: 'POST',
        })
            .then(() => {
                setTasks(prev =>
                    prev.map(task =>
                        task.task_id === taskId ? { ...task, status: 'COMPLETED' } : task
                    )
                );
            })
            .catch(err => console.error('Error marking task done:', err));
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
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: context => context[0].label,
                            label: context => `Score: ${context.parsed.y}`,
                            afterLabel: context => `Reason: ${reasons[context.dataIndex]}`,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: 'white' },
                        grid: { color: '#444' },
                    },
                    y: {
                        min: 0,
                        max: 10,
                        ticks: {
                            color: 'white',
                            stepSize: 5,
                            callback: (value) => [0, 5, 10].includes(value) ? value : null,
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

    const renderProductChart = () => {
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
                x: {
                    ticks: { color: 'white' },
                    grid: { color: '#444' },
                },
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

    const renderTasks = () => {
        return tasks.length === 0 ? (
            <p className={styles.loading}>No tasks assigned.</p>
        ) : (
            tasks.map(task => (
                <div key={task.task_id} className={styles.taskCard}>
                    <div>
                        <p className={styles.taskDescription}>{task.description}</p>
                        {task.due_date && (
                            <p className={styles.taskDueDate}>
                                Due: {new Date(task.due_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    {task.status !== 'COMPLETED' ? (
                        <button
                            className={styles.markDoneButton}
                            onClick={() => markTaskDone(task.task_id)}
                        >
                            Mark Done
                        </button>
                    ) : (
                        <span style={{ color: '#4caf50', fontSize: '14px' }}>
                            Completed
                        </span>
                    )}
                </div>
            ))
        );
    };

    const renderFollowups = () => {
        if (followups.length === 0) return <p className={styles.loading}>No upcoming follow-ups.</p>;

        return followups.map((item) => (
            <div key={item.interaction_id} className={styles.followupCard}>
                <p className={styles.followupDate}>
                    FOLLOW-UP DATE: {new Date(item.next_followup_date).toLocaleDateString()}
                </p>
                <p className={styles.followupType}>
                    TYPE: {item.interaction_type}
                </p>
                {item.notes && (
                    <p className={styles.followupNotes}>NOTES: {item.notes}</p>
                )}
            </div>
        ));
    };

    return (
        <div className={styles.container}>
            <div className={styles.graphSection}>
                <h2>Client Journeys</h2>
                {clientData.length > 0 ? (
                    renderClientCharts()
                ) : (
                    <p className={styles.loading}>Loading charts...</p>
                )}
                <h2>Product Interest Overview</h2>
                {renderProductChart()}
            </div>

            <div className={styles.taskSection}>
                <h2>Tasks</h2>
                {renderTasks()}

                <h2 style={{ marginTop: '2rem' }}>Upcoming Follow-Ups</h2>
                {renderFollowups()}
            </div>
        </div>
    );
};

export default Home;
