import React, { useMemo } from 'react';
import {
    MessageCircle, Type, Smile, Image, Link as LinkIcon,
    HelpCircle, Zap, Calendar
} from 'lucide-react';
import HistoricStreak from './HistoricStreak';
import WordSearchCard from './WordSearchCard';
import MiniStatCard from './MiniStatCard';
import FadeInSection from '../common/FadeInSection';
import AccessibleChart from '../common/AccessibleChart';
import { EMOJI_REGEX, LAUGHTER_REGEX, URL_REGEX, DELETED_MESSAGE_REGEX, DEFAULT_CHART_OPTIONS } from '../../utils/constants';
import { PIE_CHART_OPTIONS, PIE_CHART_PLUGINS } from '../../utils/chartConfig';
import dashStyles from '../Dashboard.module.css';
import styles from './SingleUserStats.module.css';

const SingleUserStats = ({ messages, allMessages, author }) => {
    const chartOptions = DEFAULT_CHART_OPTIONS;

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

    if (!stats) return <div className={dashStyles.empty}>Sin datos para este usuario.</div>;

    const topKPIs = [
        { id: 'messages', icon: MessageCircle, title: 'Mensajes', value: stats.totalMessages.toLocaleString() },
        { id: 'days', icon: Calendar, title: 'Días Activos', value: stats.daysActive.toLocaleString() }
    ];

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
            stats: []
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
            charts: [],
            stats: [
                { id: 'links', icon: LinkIcon, title: 'Links', value: stats.linkCount },
                { id: 'questions', icon: HelpCircle, title: 'Preguntas', value: stats.questionCount }
            ],
            specialComponents: [
                { id: 'streak', type: 'historicStreak', data: stats.streak },
                { id: 'wordSearch', type: 'wordSearch' }
            ]
        }
    ];

    const chartAriaLabels = {
        timeline: 'Gráfico de línea: actividad en el tiempo',
        hourly: 'Gráfico de barras: actividad por hora del día',
        weekly: 'Gráfico de barras: actividad por día de la semana',
        weekend: 'Gráfico circular: fin de semana vs días laborables',
        seasonality: 'Gráfico de línea: estacionalidad mensual',
        emojis: 'Gráfico de dona: emojis más usados'
    };

    const getRowClass = (count) => {
        if (count <= 1) return dashStyles.gridRows1;
        if (count <= 4) return dashStyles.gridRows2;
        return dashStyles.gridRows3;
    };

    const renderChart = (chart) => {
        const isPieType = chart.type === 'pie' || chart.type === 'doughnut';
        const options = isPieType ? PIE_CHART_OPTIONS : chartOptions;
        const plugins = isPieType ? PIE_CHART_PLUGINS : undefined;

        return (
            <FadeInSection key={chart.id}>
                <div className={`${dashStyles.card} ${chart.fullWidth ? dashStyles.fullWidth : ''}`}>
                    <h3>{chart.title}</h3>
                    <div className={dashStyles.chartContainer}>
                        <AccessibleChart
                            type={chart.type}
                            data={chart.data}
                            options={options}
                            plugins={plugins}
                            ariaLabel={chartAriaLabels[chart.id] || `Gráfico: ${chart.title}`}
                        />
                    </div>
                </div>
            </FadeInSection>
        );
    };

    const renderStatGroup = (statGroup, groupIndex) => (
        <FadeInSection key={`stat-group-${groupIndex}`}>
            <div className={dashStyles.statGroup}>
                <div className={`${dashStyles.statGroupGrid} ${getRowClass(statGroup.length)}`}>
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

    const renderInterleavedContent = (charts, allStats) => {
        const elements = [];
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

        let chartIndex = 0;
        let statGroupIndex = 0;

        while (chartIndex < charts.length || statGroupIndex < statGroups.length) {
            if (chartIndex < charts.length) {
                elements.push(renderChart(charts[chartIndex]));
                chartIndex++;
            }
            if (statGroupIndex < statGroups.length) {
                elements.push(renderStatGroup(statGroups[statGroupIndex], statGroupIndex));
                statGroupIndex++;
            }
        }

        if (remainder.length > 0) {
            elements.push(
                <FadeInSection key="stat-remainder">
                    <div className={dashStyles.statGroup}>
                        <div className={`${dashStyles.statGroupGrid} ${getRowClass(remainder.length)}`}>
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

    const renderSpecialComponent = (component) => {
        if (component.type === 'historicStreak' && component.data.count > 0) {
            return <HistoricStreak key={component.id} streak={component.data} />;
        }
        if (component.type === 'wordSearch') {
            return <WordSearchCard key={component.id} messages={messages} author={author} />;
        }
        return null;
    };

    return (
        <div className={styles.layout}>
            <div className={`${dashStyles.statsRow} ${styles.topKpis}`}>
                {topKPIs.map(kpi => (
                    <MiniStatCard
                        key={kpi.id}
                        icon={kpi.icon}
                        title={kpi.title}
                        value={kpi.value}
                    />
                ))}
            </div>

            {sections.map(section => (
                <div key={section.id} className="dashboard-section">
                    <h2 className={dashStyles.sectionTitle}>{section.title}</h2>
                    <div className={dashStyles.grid}>
                        {renderInterleavedContent(section.charts, section.stats)}
                        {section.specialComponents?.map(renderSpecialComponent)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SingleUserStats;
