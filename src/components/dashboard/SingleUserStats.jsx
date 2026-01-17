import React, { useMemo } from 'react';
import {
    MessageCircle, Type, Clock, Smile, Image, Link as LinkIcon,
    HelpCircle, Zap, Calendar
} from 'lucide-react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import HistoricStreak from './HistoricStreak';
import StatCard from './StatCard';
import FadeInSection from '../common/FadeInSection';
import { EMOJI_REGEX, LAUGHTER_REGEX, URL_REGEX, DEFAULT_CHART_OPTIONS } from '../../utils/constants';

const SingleUserStats = ({ messages, allMessages, author }) => {
    const chartOptions = DEFAULT_CHART_OPTIONS;

    const stats = useMemo(() => {
        const userMessages = messages.filter(m => m.author === author);
        const textMessages = userMessages.filter(m => !m.isMultimedia);
        const totalMessages = userMessages.length;

        if (totalMessages === 0) return null;

        // Timestamps and dates
        const timestamps = userMessages.map(m => m.timestamp);
        const dates = timestamps.map(t => t.toISOString().split('T')[0]);
        const uniqueDates = new Set(dates);
        const daysActive = uniqueDates.size;

        // Word statistics
        const totalWords = textMessages.reduce((acc, curr) => acc + curr.content.split(/\s+/).length, 0);
        const avgWords = textMessages.length > 0 ? (totalWords / textMessages.length).toFixed(1) : 0;

        // Multimedia count
        const totalMedia = userMessages.filter(m => m.isMultimedia).length;

        // Emoji analysis
        const emojiCounts = {};
        textMessages.forEach(m => {
            const match = m.content.match(EMOJI_REGEX);
            if (match) match.forEach(e => emojiCounts[e] = (emojiCounts[e] || 0) + 1);
        });
        const top5Emojis = Object.entries(emojiCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

        // Laughter count
        const laughterCount = textMessages.filter(m => LAUGHTER_REGEX.test(m.content)).length;

        // Links count
        const linkCount = textMessages.filter(m => URL_REGEX.test(m.content)).length;

        // Questions count
        const questionCount = textMessages.filter(m => m.content.includes('?')).length;

        // Conversation starters (> 4 hours gap)
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

        // Hourly distribution
        const hourCounts = Array(24).fill(0);
        timestamps.forEach(t => hourCounts[t.getHours()]++);

        // Weekly distribution (convert to Mon-Sun)
        const dayCounts = Array(7).fill(0);
        timestamps.forEach(t => dayCounts[t.getDay()]++);
        const monSunCounts = [...dayCounts.slice(1), dayCounts[0]];

        // Weekend vs Weekday
        let weekend = 0, weekday = 0;
        timestamps.forEach(t => {
            const d = t.getDay();
            if (d === 0 || d === 6) weekend++; else weekday++;
        });

        // Seasonality (Monthly)
        const monthCounts = Array(12).fill(0);
        timestamps.forEach(t => monthCounts[t.getMonth()]++);

        // Daily timeline
        const timelineMap = {};
        dates.forEach(d => timelineMap[d] = (timelineMap[d] || 0) + 1);
        const sortedDates = Array.from(uniqueDates).sort();
        const timelineDataPoints = sortedDates.map(d => timelineMap[d]);

        // Historic streak calculation
        let streak = { count: 0, startMessage: null, endMessage: null, startTimestamp: null, endTimestamp: null, author };
        if (allMessages && allMessages.length > 0) {
            let currentStreak = 0;
            let currentStartMsg = null;
            let tempStreakMessages = [];

            for (const msg of allMessages) {
                if (msg.author === author) {
                    if (currentStreak === 0) currentStartMsg = msg;
                    currentStreak++;
                    tempStreakMessages.push(msg);
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
            avgWords,
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
                    labels: sortedDates,
                    datasets: [{ label: 'Actividad Diaria', data: timelineDataPoints, borderColor: '#00a884', pointRadius: 1 }]
                }
            }
        };
    }, [messages, allMessages, author]);

    if (!stats) return <div className="dashboard-empty">Sin datos para este usuario.</div>;

    return (
        <div className="single-user-dashboard">
            <StatCard icon={MessageCircle} title="Mensajes Totales" value={stats.totalMessages.toLocaleString()} subtitle="Mensajes enviados" />
            <StatCard icon={Calendar} title="Días Activos" value={stats.daysActive.toLocaleString()} subtitle="Días con actividad" />

            {/* Temporal Analysis Section */}
            <div className="dashboard-section">
                <h2 className="section-title">Análisis Temporal</h2>
                <div className="layout-grid">
                    <FadeInSection className="col-span-4">
                        <div className="card card-tall">
                            <h3>Actividad en el Tiempo</h3>
                            <div style={{ flex: 1, minHeight: 0 }}><Line data={stats.charts.timeline} options={chartOptions} /></div>
                        </div>
                    </FadeInSection>
                    <FadeInSection className="col-span-2">
                        <div className="card card-chart">
                            <h3>Por Hora del Día</h3>
                            <div style={{ flex: 1, minHeight: 0 }}><Bar data={stats.charts.hourly} options={chartOptions} /></div>
                        </div>
                    </FadeInSection>
                    <FadeInSection className="col-span-2">
                        <div className="card card-chart">
                            <h3>Por Día de la Semana</h3>
                            <div style={{ flex: 1, minHeight: 0 }}><Bar data={stats.charts.weekly} options={chartOptions} /></div>
                        </div>
                    </FadeInSection>
                    <FadeInSection className="col-span-1">
                        <div className="card card-chart">
                            <h3>Finde vs Semana</h3>
                            <div style={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center' }}><Pie data={stats.charts.weekend} options={chartOptions} /></div>
                        </div>
                    </FadeInSection>
                    <FadeInSection className="col-span-3">
                        <div className="card card-chart">
                            <h3>Estacionalidad</h3>
                            <div style={{ flex: 1, minHeight: 0 }}><Line data={stats.charts.seasonality} options={chartOptions} /></div>
                        </div>
                    </FadeInSection>
                </div>
            </div>

            {/* Content Section */}
            <div className="dashboard-section">
                <h2 className="section-title">Contenido</h2>
                <div className="layout-grid">
                    <StatCard icon={Image} title="Multimedia" value={stats.totalMedia} subtitle="Fotos, videos, audios" gradient="linear-gradient(135deg, #FF9DA7 0%, #FF5C77 100%)" />
                    <StatCard icon={Type} title="Total Palabras" value={stats.totalWords.toLocaleString()} subtitle="Total escrito" />

                    <FadeInSection className="col-span-2">
                        <div className="card card-chart">
                            <h3>Emojis Más Usados</h3>
                            <div style={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center' }}>
                                <Doughnut
                                    data={{
                                        labels: stats.top5Emojis.map(e => e[0]),
                                        datasets: [{ data: stats.top5Emojis.map(e => e[1]), backgroundColor: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B'] }]
                                    }}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>

            {/* Social Dynamics Section */}
            <div className="dashboard-section">
                <h2 className="section-title">Dinámicas Sociales</h2>
                <div className="layout-grid">
                    {stats.streak.count > 0 && <HistoricStreak streak={stats.streak} />}
                    <StatCard icon={Zap} title="Iniciativas" value={stats.starterCount} subtitle="Conversaciones iniciadas" gradient="linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" />
                    <StatCard icon={Smile} title="Risas" value={stats.laughterCount} subtitle="Jaja, lol, xd..." gradient="linear-gradient(135deg, #59a14f 0%, #43e669 100%)" />
                    <StatCard icon={LinkIcon} title="Links" value={stats.linkCount} subtitle="Enlaces compartidos" gradient="linear-gradient(135deg, #53bdeb 0%, #2980b9 100%)" />
                    <StatCard icon={HelpCircle} title="Preguntas" value={stats.questionCount} subtitle="Veces que preguntó (?)" gradient="linear-gradient(135deg, #9c755f 0%, #795548 100%)" />
                </div>
            </div>
        </div>
    );
};

export default SingleUserStats;
