
import React, { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { color: '#e9edef' }
        },
        title: { display: false },
    },
    scales: {
        x: {
            ticks: { color: '#8696a0' },
            grid: { color: 'rgba(134, 150, 160, 0.1)' }
        },
        y: {
            ticks: { color: '#8696a0' },
            grid: { color: 'rgba(134, 150, 160, 0.1)' }
        }
    }
};

const emojiRegex = /\p{Emoji_Presentation}/gu;

const Dashboard = ({ messages, fileName }) => {
    // Compute initial range
    const { minDate, maxDate } = useMemo(() => {
        if (!messages || messages.length === 0) return { minDate: '', maxDate: '' };
        const start = messages[0].timestamp ? messages[0].timestamp.toISOString().split('T')[0] : '';
        const end = messages[messages.length - 1].timestamp ? messages[messages.length - 1].timestamp.toISOString().split('T')[0] : '';
        return { minDate: start, maxDate: end };
    }, [messages]);

    const [dateStart, setDateStart] = useState(minDate);
    const [dateEnd, setDateEnd] = useState(maxDate);
    const [selectedParticipant, setSelectedParticipant] = useState('all');

    // Get all unique authors from the full dataset for the filter dropdown
    const allAuthors = useMemo(() => {
        if (!messages) return [];
        const authors = new Set();
        messages.forEach(msg => {
            if (msg.author) authors.add(msg.author);
        });
        return Array.from(authors).sort();
    }, [messages]);

    // Generate dynamic title
    const chatTitle = useMemo(() => {
        if (allAuthors.length === 0) return `Analítica: ${fileName}`;
        if (allAuthors.length === 1) return `Analítica de chat con ${allAuthors[0]}`;
        if (allAuthors.length === 2) return `Analítica de chat entre ${allAuthors[0]} y ${allAuthors[1]}`;
        if (allAuthors.length === 3) return `Analítica de chat entre ${allAuthors[0]}, ${allAuthors[1]} y ${allAuthors[2]}`;
        return `Analítica de chat entre ${allAuthors[0]}, ${allAuthors[1]} y ${allAuthors.length - 2} más`;
    }, [allAuthors, fileName]);

    const filteredMessages = useMemo(() => {
        if (!messages) return [];
        const start = dateStart ? new Date(dateStart) : new Date('1970-01-01');
        // Set end of day for the end date to include messages on that day
        const end = dateEnd ? new Date(dateEnd) : new Date('2100-01-01');
        end.setHours(23, 59, 59, 999);

        return messages.filter(msg => {
            if (!msg.timestamp) return false;
            // Date Filter
            const inDateRange = msg.timestamp >= start && msg.timestamp <= end;
            // Participant Filter
            const inParticipant = selectedParticipant === 'all' || msg.author === selectedParticipant;

            return inDateRange && inParticipant;
        });
    }, [messages, dateStart, dateEnd, selectedParticipant]);

    const stats = useMemo(() => {
        if (filteredMessages.length === 0) return null;

        const totalMessages = filteredMessages.length;
        const authorCounts = {};
        const dateCounts = {};
        const hourCounts = Array(24).fill(0);
        const dayOfWeekCounts = Array(7).fill(0); // 0=Sun, 6=Sat
        const emojiCounts = {};

        // Helper to extract emojis
        const extractEmojis = (text) => {
            const matches = text.match(emojiRegex);
            if (matches) {
                matches.forEach(e => {
                    emojiCounts[e] = (emojiCounts[e] || 0) + 1;
                });
            }
        };

        filteredMessages.forEach(msg => {
            // Author
            const author = msg.author || "Unknown";
            authorCounts[author] = (authorCounts[author] || 0) + 1;

            if (msg.timestamp) {
                const d = msg.timestamp;
                const key = d.toISOString().split('T')[0];
                dateCounts[key] = (dateCounts[key] || 0) + 1;

                hourCounts[d.getHours()]++;
                dayOfWeekCounts[d.getDay()]++;
            }

            extractEmojis(msg.content);
        });

        // Sort Data
        const sortedAuthors = Object.entries(authorCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const sortedEmojis = Object.entries(emojiCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        // Timeline
        const timelineLabels = Object.keys(dateCounts).sort();
        const timelineData = timelineLabels.map(d => dateCounts[d]);

        return {
            totalMessages,
            uniqueAuthors: Object.keys(authorCounts).length,
            daysActive: Object.keys(dateCounts).length,
            authorChartData: {
                labels: sortedAuthors.map(a => a[0]),
                datasets: [{
                    label: 'Mensajes',
                    data: sortedAuthors.map(a => a[1]),
                    backgroundColor: 'rgba(0, 168, 132, 0.7)',
                    borderColor: '#00a884',
                    borderWidth: 1
                }]
            },
            timelineChartData: {
                labels: timelineLabels,
                datasets: [{
                    label: 'Actividad',
                    data: timelineData,
                    borderColor: '#53bdeb',
                    backgroundColor: 'rgba(83, 189, 235, 0.5)',
                    tension: 0.2,
                    fill: true,
                    pointRadius: 2
                }]
            },
            hourlyChartData: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'Mensajes por Hora',
                    data: hourCounts,
                    backgroundColor: 'rgba(255, 206, 86, 0.7)',
                    borderColor: '#FFCE56',
                    borderWidth: 1
                }]
            },
            dayOfWeekChartData: {
                labels: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                datasets: [{
                    label: 'Mensajes por Día',
                    data: dayOfWeekCounts,
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: '#ef4444',
                    borderWidth: 1
                }]
            },
            emojiChartData: {
                labels: sortedEmojis.map(e => e[0]),
                datasets: [{
                    data: sortedEmojis.map(e => e[1]),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                    ],
                    borderWidth: 0
                }]
            }
        };
    }, [filteredMessages]);


    return (
        <div className="dashboard">
            <div className="dashboard-header-row">
                <div className="title-group">
                    <h2>{chatTitle}</h2>
                    <p className="subtitle">
                        {stats ? `${stats.totalMessages.toLocaleString()} mensajes mostrados` : 'Sin mensajes en el rango'}
                    </p>
                </div>

                <div className="filters">
                    <div className="date-input-group">
                        <label>Participante</label>
                        <select
                            value={selectedParticipant}
                            onChange={(e) => setSelectedParticipant(e.target.value)}
                            className="date-input"
                        >
                            <option value="all">Todos</option>
                            {allAuthors.map(author => (
                                <option key={author} value={author}>{author}</option>
                            ))}
                        </select>
                    </div>
                    <div className="date-input-group">
                        <label>Desde</label>
                        <input
                            type="date"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                            className="date-input"
                        />
                    </div>
                    <div className="date-input-group">
                        <label>Hasta</label>
                        <input
                            type="date"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                            className="date-input"
                        />
                    </div>
                </div>
            </div>

            {!stats ? (
                <div className="dashboard-empty">
                    <div className="empty-state-content">
                        <h3>No se encontraron mensajes en este rango de fechas</h3>
                        <p>Intenta ajustar los filtros para incluir un rango más amplio.</p>
                    </div>
                </div>
            ) : (
                <div className="dashboard-grid">
                    {/* KPIs */}
                    <div className="card">
                        <h3>Mensajes Totales</h3>
                        <div className="kpi-value">{stats.totalMessages.toLocaleString()}</div>
                    </div>
                    <div className="card">
                        <h3>Días Activos</h3>
                        <div className="kpi-value">{stats.daysActive.toLocaleString()}</div>
                    </div>
                    <div className="card">
                        <h3>Participantes</h3>
                        <div className="kpi-value">{stats.uniqueAuthors}</div>
                    </div>

                    {/* Charts */}
                    <div className="card full-width">
                        <h3>Actividad en el Tiempo</h3>
                        <div style={{ height: '300px' }}>
                            <Line data={stats.timelineChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="card">
                        <h3>Más Participativos</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={stats.authorChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>

                    <div className="card">
                        <h3>Emojis Más Usados</h3>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                            {/* Doughnut needs aspect ratio handled carefully */}
                            <Doughnut data={stats.emojiChartData} options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'right', labels: { color: '#e9edef' } } }
                            }} />
                        </div>
                    </div>

                    <div className="card">
                        <h3>Actividad por Hora del Día</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={stats.hourlyChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="card">
                        <h3>Actividad por Día de la Semana</h3>
                        <div style={{ height: '300px' }}>
                            <Radar data={stats.dayOfWeekChartData} options={{
                                maintainAspectRatio: false,
                                scales: {
                                    r: {
                                        grid: { color: 'rgba(134, 150, 160, 0.2)' },
                                        pointLabels: { color: '#e9edef' },
                                        ticks: { display: false }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
