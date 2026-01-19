import React, { useMemo } from 'react';
import {
    MessageCircle, Type, Smile, Image, Link as LinkIcon,
    HelpCircle, Zap, Calendar
} from 'lucide-react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import HistoricStreak from './HistoricStreak';
import MiniStatCard from './MiniStatCard';
import FadeInSection from '../common/FadeInSection';
import { EMOJI_REGEX, LAUGHTER_REGEX, URL_REGEX, DELETED_MESSAGE_REGEX, DEFAULT_CHART_OPTIONS } from '../../utils/constants';

/**
 * SingleUserStats Component
 * 
 * Displays statistics for a single user with a scalable, data-driven layout.
 * 
 * Layout Rules:
 * 1. Top KPIs (Mensajes, Días Activos) always stay at the top
 * 2. Section content alternates: Chart → StatGroup(4) → Chart → StatGroup(4)...
 * 3. Remaining stats (< 4) go at the end of the section
 * 4. StatGroups display as 2x2 grids occupying the same space as a chart
 */
const SingleUserStats = ({ messages, allMessages, author }) => {
    const chartOptions = DEFAULT_CHART_OPTIONS;
    const pieChartOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right', labels: { color: '#e9edef' } } }
    };

    const stats = useMemo(() => {
        const userMessages = messages.filter(m => m.author === author);
        const textMessages = userMessages.filter(m => !m.isMultimedia);
        const totalMessages = userMessages.length;

        if (totalMessages === 0) return null;

        const timestamps = userMessages.map(m => m.timestamp);
        const dates = timestamps.map(t => t.toISOString().split('T')[0]);
        const uniqueDates = new Set(dates);
        const daysActive = uniqueDates.size;

        const totalWords = textMessages.reduce((acc, curr) => acc + curr.content.split(/\s+/).length, 0);
        const totalMedia = userMessages.filter(m => m.isMultimedia).length;

        const emojiCounts = {};
        textMessages.forEach(m => {
            const match = m.content.match(EMOJI_REGEX);
            if (match) match.forEach(e => emojiCounts[e] = (emojiCounts[e] || 0) + 1);
        });
        const top5Emojis = Object.entries(emojiCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        const laughterCount = textMessages.filter(m => LAUGHTER_REGEX.test(m.content)).length;
        const linkCount = textMessages.filter(m => URL_REGEX.test(m.content)).length;
        const questionCount = textMessages.filter(m => m.content.includes('?')).length;

        let starterCount = 0;
        if (allMessages) {
            let lastMsgTime = null;
            for (const m of allMessages) {
                if (lastMsgTime && m.author === author) {
                    const diffHours = (m.timestamp - lastMsgTime) / (1000 * 60 * 60);
                    if (diffHours > 4) starterCount++;
                }
                lastMsgTime = m.timestamp;
            }
        }

        const hourCounts = Array(24).fill(0);
        timestamps.forEach(t => hourCounts[t.getHours()]++);

        const dayCounts = Array(7).fill(0);
        timestamps.forEach(t => dayCounts[t.getDay()]++);
        const monSunCounts = [...dayCounts.slice(1), dayCounts[0]];

        let weekend = 0, weekday = 0;
        timestamps.forEach(t => {
            const d = t.getDay();
            if (d === 0 || d === 6) weekend++; else weekday++;
        });

        const monthCounts = Array(12).fill(0);
        timestamps.forEach(t => monthCounts[t.getMonth()]++);

        const quarterlyMap = {};
        timestamps.forEach(t => {
            const month = t.getMonth();
            const year = t.getFullYear();
            const quarter = Math.floor(month / 3) + 1;
            const key = `${year}-Q${quarter}`;
            quarterlyMap[key] = (quarterlyMap[key] || 0) + 1;
        });

        const sortedQuarterKeys = Object.keys(quarterlyMap).sort();
        const timelineLabels = sortedQuarterKeys.map(k => {
            const [y, q] = k.split('-');
            return `${q} ${y}`;
        });
        const timelineDataPoints = sortedQuarterKeys.map(k => quarterlyMap[k]);

        let streak = { count: 0, startMessage: null, endMessage: null, startTimestamp: null, endTimestamp: null, author };
        if (allMessages && allMessages.length > 0) {
            let currentStreak = 0;
            let currentStartMsg = null;
            let tempStreakMessages = [];

            for (const msg of allMessages) {
                const isMediaOrDeleted = msg.isMultimedia || DELETED_MESSAGE_REGEX.test(msg.content);

                if (msg.author === author) {
                    if (!isMediaOrDeleted) {
                        if (currentStreak === 0) currentStartMsg = msg;
                        currentStreak++;
                        tempStreakMessages.push(msg);
                    }
                } else {
                    if (currentStreak > streak.count) {
                        streak = {
                            count: currentStreak,
                            author,
                            startMessage: currentStartMsg.content,
                            endMessage: tempStreakMessages[tempStreakMessages.length - 1].content,
                            startTimestamp: currentStartMsg.timestamp,
                            endTimestamp: tempStreakMessages[tempStreakMessages.length - 1].timestamp
                        };
                    }
                    currentStreak = 0;
                    tempStreakMessages = [];
                }
            }
            if (currentStreak > streak.count) {
                streak = {
                    count: currentStreak,
                    author,
                    startMessage: currentStartMsg.content,
                    endMessage: tempStreakMessages[tempStreakMessages.length - 1].content,
                    startTimestamp: currentStartMsg.timestamp,
                    endTimestamp: tempStreakMessages[tempStreakMessages.length - 1].timestamp
                };
            }
        }

        return {
            totalMessages,
            daysActive,
            totalWords,
            totalMedia,
            top5Emojis,
            laughterCount,
            linkCount,
            questionCount,
            starterCount,
            streak,
            charts: {
                hourly: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
                    datasets: [{ label: 'Mensajes', data: hourCounts, backgroundColor: '#00a884', borderRadius: 4 }]
                },
                weekly: {
                    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                    datasets: [{ label: 'Mensajes', data: monSunCounts, backgroundColor: '#53bdeb', borderRadius: 4 }]
                },
                weekend: {
                    labels: ['Semana', 'Finde'],
                    datasets: [{ data: [weekday, weekend], backgroundColor: ['#59a14f', '#edc948'] }]
                },
                seasonality: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [{ label: 'Mensajes', data: monthCounts, borderColor: '#9966FF', tension: 0.3, fill: true, backgroundColor: 'rgba(153, 102, 255, 0.2)' }]
                },
                timeline: {
                    labels: timelineLabels,
                    datasets: [{ label: 'Actividad', data: timelineDataPoints, borderColor: '#00a884', backgroundColor: 'rgba(0, 168, 132, 0.2)', fill: true, tension: 0.3 }]
                }
            }
        };
    }, [messages, allMessages, author]);

    if (!stats) return <div className="dashboard-empty">Sin datos para este usuario.</div>;

    // =========================================
    // DATA-DRIVEN LAYOUT CONFIGURATION
    // =========================================

    // Top KPIs - Always visible at the very top
    const topKPIs = [
        { id: 'messages', icon: MessageCircle, title: 'Mensajes', value: stats.totalMessages.toLocaleString() },
        { id: 'days', icon: Calendar, title: 'Días Activos', value: stats.daysActive.toLocaleString() }
    ];

    // Section-based content configuration
    // Each section can have charts and stats that will be interleaved
    const sections = [
        {
            id: 'temporal',
            title: 'Análisis Temporal',
            charts: [
                { id: 'timeline', title: 'Actividad en el Tiempo', type: 'line', data: stats.charts.timeline, fullWidth: true },
                { id: 'hourly', title: 'Por Hora del Día', type: 'bar', data: stats.charts.hourly },
                { id: 'weekly', title: 'Por Día de la Semana', type: 'bar', data: stats.charts.weekly },
                { id: 'weekend', title: 'Fin de Semana vs Laborables', type: 'pie', data: stats.charts.weekend },
                { id: 'seasonality', title: 'Estacionalidad (Mensual)', type: 'line', data: stats.charts.seasonality, fullWidth: true }
            ],
            stats: [] // No stats in temporal section
        },
        {
            id: 'content',
            title: 'Análisis de Contenido',
            charts: [
                {
                    id: 'emojis',
                    title: 'Emojis Más Usados',
                    type: 'doughnut',
                    data: {
                        labels: stats.top5Emojis.map(e => e[0]),
                        datasets: [{ data: stats.top5Emojis.map(e => e[1]), backgroundColor: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B'] }]
                    }
                }
            ],
            stats: [
                { id: 'words', icon: Type, title: 'Palabras', value: stats.totalWords.toLocaleString() },
                { id: 'media', icon: Image, title: 'Multimedia', value: stats.totalMedia },
                { id: 'initiatives', icon: Zap, title: 'Iniciativas', value: stats.starterCount },
                { id: 'laughs', icon: Smile, title: 'Risas', value: stats.laughterCount }
            ]
        },
        {
            id: 'social',
            title: 'Dinámicas Sociales',
            charts: [], // No charts, just stats and special components
            stats: [
                { id: 'links', icon: LinkIcon, title: 'Links', value: stats.linkCount },
                { id: 'questions', icon: HelpCircle, title: 'Preguntas', value: stats.questionCount }
            ],
            specialComponents: [
                { id: 'streak', type: 'historicStreak', data: stats.streak }
            ]
        }
    ];

    // =========================================
    // LAYOUT RENDERING HELPERS
    // =========================================

    /**
     * Renders a chart based on its configuration
     */
    const renderChart = (chart) => {
        const ChartComponent = {
            line: Line,
            bar: Bar,
            pie: Pie,
            doughnut: Doughnut
        }[chart.type];

        const options = chart.type === 'pie' || chart.type === 'doughnut' ? pieChartOptions : chartOptions;

        return (
            <FadeInSection key={chart.id}>
                <div className={`card ${chart.fullWidth ? 'full-width' : ''}`}>
                    <h3>{chart.title}</h3>
                    <div className="card-chart-container">
                        <ChartComponent data={chart.data} options={options} />
                    </div>
                </div>
            </FadeInSection>
        );
    };

    /**
     * Renders a group of 4 stat cards in a 2x2 grid
     */
    const renderStatGroup = (statGroup, groupIndex) => (
        <FadeInSection key={`stat-group-${groupIndex}`}>
            <div className="stat-group">
                <div className="stat-group-grid">
                    {statGroup.map(stat => (
                        <MiniStatCard
                            key={stat.id}
                            icon={stat.icon}
                            title={stat.title}
                            value={stat.value}
                        />
                    ))}
                </div>
            </div>
        </FadeInSection>
    );

    /**
     * Interleaves charts and stat groups following the rule:
     * Chart → StatGroup(4) → Chart → StatGroup(4)...
     * Remaining stats (< 4) go at the end
     */
    const renderInterleavedContent = (charts, allStats) => {
        const elements = [];

        // Split stats into groups of 6 and remainder
        const statGroups = [];
        const remainder = [];

        for (let i = 0; i < allStats.length; i++) {
            if (i < Math.floor(allStats.length / 6) * 6) {
                const groupIndex = Math.floor(i / 6);
                if (!statGroups[groupIndex]) statGroups[groupIndex] = [];
                statGroups[groupIndex].push(allStats[i]);
            } else {
                remainder.push(allStats[i]);
            }
        }

        // Interleave charts and stat groups
        let chartIndex = 0;
        let statGroupIndex = 0;

        while (chartIndex < charts.length || statGroupIndex < statGroups.length) {
            // Add next chart
            if (chartIndex < charts.length) {
                elements.push(renderChart(charts[chartIndex]));
                chartIndex++;
            }

            // Add next stat group of 4
            if (statGroupIndex < statGroups.length) {
                elements.push(renderStatGroup(statGroups[statGroupIndex], statGroupIndex));
                statGroupIndex++;
            }
        }

        // Add remainder stats at the end (less than 4)
        if (remainder.length > 0) {
            elements.push(
                <FadeInSection key="stat-remainder">
                    <div className="stat-group">
                        <div className="stat-group-grid">
                            {remainder.map(stat => (
                                <MiniStatCard
                                    key={stat.id}
                                    icon={stat.icon}
                                    title={stat.title}
                                    value={stat.value}
                                />
                            ))}
                        </div>
                    </div>
                </FadeInSection>
            );
        }

        return elements;
    };

    /**
     * Renders special components like HistoricStreak
     */
    const renderSpecialComponent = (component) => {
        if (component.type === 'historicStreak' && component.data.count > 0) {
            return <HistoricStreak key={component.id} streak={component.data} />;
        }
        return null;
    };

    // =========================================
    // MAIN RENDER
    // =========================================

    return (
        <div className="single-user-layout">
            {/* Top KPIs - Always at the very top */}
            <div className="stats-row top-kpis">
                {topKPIs.map(kpi => (
                    <MiniStatCard
                        key={kpi.id}
                        icon={kpi.icon}
                        title={kpi.title}
                        value={kpi.value}
                    />
                ))}
            </div>

            {/* Sections with interleaved content */}
            {sections.map(section => (
                <div key={section.id} className="dashboard-section">
                    <h2 className="section-title">{section.title}</h2>
                    <div className="dashboard-grid">
                        {renderInterleavedContent(section.charts, section.stats)}
                        {section.specialComponents?.map(renderSpecialComponent)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SingleUserStats;
