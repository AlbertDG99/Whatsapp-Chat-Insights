
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
    RadialLinearScale,
    PieController,
    PolarAreaController,
    Filler
} from 'chart.js';

// Sub-components
import KPIGrid from './dashboard/KPIGrid';
import TemporalAnalysis from './dashboard/TemporalAnalysis';
import ContentAnalysis from './dashboard/ContentAnalysis';
import SocialAnalysis from './dashboard/SocialAnalysis';
import MultiSelect from './common/MultiSelect';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    PieController,
    PolarAreaController,
    Title,
    Tooltip,
    Legend,
    Filler
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
    const [selectedParticipants, setSelectedParticipants] = useState([]);

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
            // Participant Filter (empty array = all participants)
            const inParticipant = selectedParticipants.length === 0 || selectedParticipants.includes(msg.author);

            return inDateRange && inParticipant;
        });
    }, [messages, dateStart, dateEnd, selectedParticipants]);

    const stats = useMemo(() => {
        try {
            if (filteredMessages.length === 0) return null;

            const totalMessages = filteredMessages.length;
            const authorCounts = {};
            const dateCounts = {};
            const hourCounts = Array(24).fill(0);
            const dayOfWeekCounts = Array(7).fill(0); // 0=Sun, 6=Sat
            const emojiCounts = {};

            // New Metrics Initialization
            const mediaCounts = {};
            const laughterCounts = {};
            const starterCounts = {};
            const msgLengthSum = {};
            const msgCountByAuthor = {};

            const weekendVsWeekday = { 'Semana': 0, 'Finde': 0 };
            const linkCounts = {};
            const questionCounts = {};
            const wordCounts = {};
            const monthlyCounts = Array(12).fill(0);

            // Historic Streak Logic - Extended with messages and timestamps
            let historicStreak = {
                author: null,
                count: 0,
                startTimestamp: null,
                endTimestamp: null,
                startMessage: null,
                endMessage: null
            };
            let currentStreak = {
                author: null,
                count: 0,
                startTimestamp: null,
                endTimestamp: null,
                startMessage: null,
                endMessage: null
            };

            // Helper to extract emojis
            const extractEmojis = (text) => {
                const matches = text.match(emojiRegex);
                if (matches) {
                    matches.forEach(e => {
                        emojiCounts[e] = (emojiCounts[e] || 0) + 1;
                    });
                }
            };

            let lastMsgTime = null;

            filteredMessages.forEach(msg => {
                // Author
                const author = msg.author || "Unknown";
                const content = msg.content || "";

                // Streak Calculation
                if (author === currentStreak.author) {
                    currentStreak.count++;
                    currentStreak.endTimestamp = msg.timestamp;
                    currentStreak.endMessage = content;
                } else {
                    if (currentStreak.count > historicStreak.count) {
                        historicStreak = { ...currentStreak };
                    }
                    currentStreak = {
                        author: author,
                        count: 1,
                        startTimestamp: msg.timestamp,
                        endTimestamp: msg.timestamp,
                        startMessage: content,
                        endMessage: content
                    };
                }

                authorCounts[author] = (authorCounts[author] || 0) + 1;
                msgCountByAuthor[author] = (msgCountByAuthor[author] || 0) + 1;

                if (msg.timestamp) {
                    const d = msg.timestamp;
                    const h = d.getHours();

                    // Group by Quarter: YYYY-Q#
                    const year = d.getFullYear();
                    const quarter = Math.floor(d.getMonth() / 3) + 1;
                    const key = `${year}-Q${quarter}`;
                    dateCounts[key] = (dateCounts[key] || 0) + 1;

                    hourCounts[h]++;
                    // Day of week: Convert to Mon=0, Sun=6 format
                    const dayIndex = (d.getDay() + 6) % 7;
                    dayOfWeekCounts[dayIndex]++;

                    // 5. Time Period - REMOVED

                    // 10. Seasonality
                    monthlyCounts[d.getMonth()]++;

                    // 6. Weekend vs Weekday
                    const day = d.getDay();
                    if (day === 0 || day === 6) weekendVsWeekday['Finde']++;
                    else weekendVsWeekday['Semana']++;
                }

                // 1. Media
                if (content.includes("<Multimedia omitido>") || content.includes("image omitted") || content.includes("video omitted") || content.includes("sticker omitted")) {
                    mediaCounts[author] = (mediaCounts[author] || 0) + 1;
                }

                // 2. Laughter - Algorithmic detection
                // Logic: strict "all together", collapse duplicates, check pattern of J/H + Vowels, count > 2 J/H
                const words = content.toLowerCase().split(/[\s,.;!?]+/);
                const isLaugh = words.some(word => {
                    if (['lol', 'lmao', 'xd'].includes(word)) return true; // Keep classic acronyms

                    // 1. Collapse duplicates (e.g., "jajajjaja" -> "jajajaja", "haaaa" -> "ha")
                    const cleanWord = word.replace(/(.)\1+/g, '$1');

                    // 2. Must contain ONLY j, h, or vowels to be a candidate for this logic
                    if (/^[jhaeiou]+$/.test(cleanWord)) {
                        // 3. Count J's or H's
                        const jhCount = (cleanWord.match(/[jh]/g) || []).length;
                        // 4. Threshold: 2 or more (allows "jaja", "haha", but might capture "hijo")
                        return jhCount >= 2;
                    }
                    return false;
                });

                if (isLaugh) {
                    laughterCounts[author] = (laughterCounts[author] || 0) + 1;
                }

                // 3. Conversation Starters (> 6h gap)
                if (lastMsgTime) {
                    const diffMs = msg.timestamp - lastMsgTime;
                    const diffHours = diffMs / (1000 * 60 * 60);
                    if (diffHours > 6) {
                        starterCounts[author] = (starterCounts[author] || 0) + 1;
                    }
                }
                lastMsgTime = msg.timestamp;

                // 4. Msg Length & 9. Words
                msgLengthSum[author] = (msgLengthSum[author] || 0) + content.length;
                wordCounts[author] = (wordCounts[author] || 0) + content.split(/\s+/).length;

                // 7. Links
                if (content.includes('http://') || content.includes('https://')) {
                    linkCounts[author] = (linkCounts[author] || 0) + 1;
                }

                // 8. Questions
                if (content.includes('?')) {
                    questionCounts[author] = (questionCounts[author] || 0) + 1;
                }

                extractEmojis(content);
            });

            // Final streak check
            if (currentStreak.count > historicStreak.count) {
                historicStreak = { ...currentStreak };
            }

            // Sort Data
            const getTop = (obj, limit = 10) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, limit);
            const sortedAuthors = getTop(authorCounts);
            const sortedEmojis = getTop(emojiCounts, 5);

            // Timeline (Quarters)
            const timelineKeys = Object.keys(dateCounts).sort();
            const timelineLabels = timelineKeys.map(k => {
                const [y, q] = k.split('-');
                return `${q} ${y}`;
            });
            const timelineData = timelineKeys.map(k => dateCounts[k]);

            // Chart Data Helpers
            const createBarData = (sourceObj, label, color) => ({
                labels: sortedAuthors.map(a => a[0]),
                datasets: [{
                    label,
                    data: sortedAuthors.map(a => sourceObj[a[0]] || 0),
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1
                }]
            });

            return {
                totalMessages,
                uniqueAuthors: Object.keys(authorCounts).length,
                daysActive: Object.keys(dateCounts).length,
                historicStreak,
                authorChartData: createBarData(authorCounts, 'Mensajes', 'rgba(0, 168, 132, 0.7)'),
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
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{
                        label: 'Mensajes por Día',
                        data: dayOfWeekCounts,
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: '#FF6384',
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
                },
                // New Charts Data
                mediaChartData: createBarData(mediaCounts, 'Multimedia Enviado', '#FF9F40'),
                laughterChartData: createBarData(laughterCounts, 'Risas', '#FF6384'),
                starterChartData: createBarData(starterCounts, 'Inicios de Conversación', '#36A2EB'),
                avgLengthChartData: {
                    labels: sortedAuthors.map(a => a[0]),
                    datasets: [{
                        label: 'Longitud Promedio',
                        data: sortedAuthors.map(a => {
                            const sum = msgLengthSum[a[0]] || 0;
                            const count = msgCountByAuthor[a[0]] || 1;
                            return Math.round(sum / count);
                        }),
                        backgroundColor: '#4BC0C0',
                        borderColor: '#4BC0C0',
                        borderWidth: 1
                    }]
                },
                weekendChartData: {
                    labels: ['Semana', 'Finde'],
                    datasets: [{
                        data: [weekendVsWeekday['Semana'], weekendVsWeekday['Finde']],
                        backgroundColor: ['#59a14f', '#edc948'],
                        borderWidth: 1
                    }]
                },
                linkChartData: createBarData(linkCounts, 'Links Compartidos', '#B07AA1'),
                questionChartData: createBarData(questionCounts, 'Preguntas Realizadas', '#FF9DA7'),
                wordChartData: createBarData(wordCounts, 'Palabras Totales', '#9C755F'),
                seasonalityChartData: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [{
                        label: 'Actividad Mensual',
                        data: monthlyCounts,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: '#9966FF',
                        borderWidth: 1
                    }]
                }
            };
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
            return null;
        }
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
                        <label>Participantes</label>
                        <MultiSelect
                            options={allAuthors}
                            selected={selectedParticipants}
                            onChange={setSelectedParticipants}
                        />
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
                <>
                    {/* 1. Summary KPIs */}
                    <KPIGrid stats={stats} />

                    {/* 2. Temporal Analysis */}
                    <TemporalAnalysis stats={stats} chartOptions={chartOptions} />

                    {/* 3. Content Analysis */}
                    <ContentAnalysis stats={stats} chartOptions={chartOptions} />

                    {/* 4. Social Dynamics */}
                    <SocialAnalysis stats={stats} chartOptions={chartOptions} />
                </>
            )}
        </div>
    );
};

export default Dashboard;
