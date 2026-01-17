import React, { useMemo } from 'react';
import { MessageCircle, Type, Clock, Smile } from 'lucide-react';

const SingleUserStats = ({ messages, author }) => {
    const stats = useMemo(() => {
        const userMessages = messages.filter(m => m.author === author && !m.isMultimedia);
        const totalMessages = userMessages.length;

        // Word count
        const totalWords = userMessages.reduce((acc, curr) => {
            return acc + curr.content.split(/\s+/).length;
        }, 0);
        const avgWords = totalMessages > 0 ? (totalWords / totalMessages).toFixed(1) : 0;

        // Active hours
        const hours = {};
        userMessages.forEach(m => {
            const h = m.timestamp.getHours();
            hours[h] = (hours[h] || 0) + 1;
        });
        const peakHour = Object.keys(hours).reduce((a, b) => hours[a] > hours[b] ? a : b, 0);
        const peakHourFormatted = `${peakHour}:00 - ${parseInt(peakHour) + 1}:00`;

        // Emojis (simplified regex)
        const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
        const emojiCounts = {};
        userMessages.forEach(m => {
            const match = m.content.match(emojiRegex);
            if (match) {
                match.forEach(emoji => {
                    emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
                });
            }
        });

        const topEmojis = Object.entries(emojiCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([emoji]) => emoji);

        return {
            totalMessages,
            avgWords,
            peakHourFormatted,
            topEmojis
        };
    }, [messages, author]);

    return (
        <div className="dashboard-grid">
            <div className="card">
                <div className="streak-header">
                    <MessageCircle className="streak-icon" />
                    <h3>Mensajes Totales</h3>
                </div>
                <div className="kpi-value">{stats.totalMessages.toLocaleString()}</div>
                <p className="subtitle">Mensajes de texto enviados</p>
            </div>

            <div className="card">
                <div className="streak-header">
                    <Type className="streak-icon" />
                    <h3>Promedio de Palabras</h3>
                </div>
                <div className="kpi-value">{stats.avgWords}</div>
                <p className="subtitle">Palabras por mensaje</p>
            </div>

            <div className="card">
                <div className="streak-header">
                    <Clock className="streak-icon" />
                    <h3>Hora Más Activa</h3>
                </div>
                <div className="kpi-value" style={{ fontSize: '1.8rem' }}>{stats.peakHourFormatted}</div>
                <p className="subtitle">Momento de mayor actividad</p>
            </div>

            <div className="card">
                <div className="streak-header">
                    <Smile className="streak-icon" />
                    <h3>Emojis Favoritos</h3>
                </div>
                <div className="kpi-value" style={{ fontSize: '2rem', display: 'flex', gap: '0.5rem' }}>
                    {stats.topEmojis.length > 0 ? stats.topEmojis.join(' ') : '—'}
                </div>
                <p className="subtitle">Top 5 emojis más usados</p>
            </div>
        </div>
    );
};

export default SingleUserStats;
