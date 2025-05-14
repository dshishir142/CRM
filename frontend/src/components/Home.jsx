import React, { useEffect, useState } from 'react';
import styles from '../style/home.module.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Home = () => {
    const [clientData, setClientData] = useState([]);

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('user'));
        const agentId = localData.user_id;

        fetch(`http://localhost:8000/data/${agentId}`)
            .then(res => res.json())
            .then(data => setClientData(data))
            .catch(err => console.error('Error fetching data:', err));
    }, []);

    const renderClientCharts = () => {
        return clientData.map((client, idx) => {
            const labels = client.history.map(point =>
                new Date(point.x).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
            );
            const scores = client.history.map(point => point.y);

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
                    tooltip: { mode: 'index', intersect: false },
                },
                scales: {
                    x: {
                        ticks: { color: 'white' },
                        grid: { color: '#444' }
                    },
                    y: {
                        min: 0,
                        max: 10,
                        ticks: {
                            color: 'white',
                            stepSize: 5,
                            callback: (value) => [0, 5, 10].includes(value) ? value : null
                        },
                        grid: { color: '#444' }
                    }
                }
            };

            return (
                <div key={client.clientId} className={styles.chartCard}>
                    <h3>{client.clientName}</h3>
                    <Line data={data} options={options} height={100} />
                </div>
            );
        });
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
            </div>
            <div className={styles.taskSection}>
                <h2>Tasks (Coming Soon)</h2>
            </div>
        </div>
    );
};

export default Home;
