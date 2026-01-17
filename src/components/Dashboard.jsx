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

import KPIGrid from './dashboard/KPIGrid';
import TemporalAnalysis from './dashboard/TemporalAnalysis';
import ContentAnalysis from './dashboard/ContentAnalysis';
import SocialAnalysis from './dashboard/SocialAnalysis';
import MultiSelect from './common/MultiSelect';
import SingleUserStats from './dashboard/SingleUserStats';
import { calculateStats } from '../utils/statsCalculator';
import { DEFAULT_CHART_OPTIONS } from '../utils/constants';

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

const Dashboard = ({ messages, fileName }) => {
    // Compute initial date range from messages
    const { minDate, maxDate } = useMemo(() => {
        if (!messages || messages.length === 0) return { minDate: '', maxDate: '' };
        const start = messages[0].timestamp?.toISOString().split('T')[0] || '';
        const end = messages[messages.length - 1].timestamp?.toISOString().split('T')[0] || '';
        return { minDate: start, maxDate: end };
    }, [messages]);

    const [dateStart, setDateStart] = useState(minDate);
    const [dateEnd, setDateEnd] = useState(maxDate);
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    // Extract unique authors for filter dropdown
    const allAuthors = useMemo(() => {
        if (!messages) return [];
        const authors = new Set(messages.map(m => m.author).filter(Boolean));
        return Array.from(authors).sort();
    }, [messages]);

    // Generate dynamic title based on participants
    const chatTitle = useMemo(() => {
        if (allAuthors.length === 0) return `Analítica: ${fileName}`;
        if (allAuthors.length === 1) return `Analítica de chat con ${allAuthors[0]}`;
        if (allAuthors.length === 2) return `Analítica de chat entre ${allAuthors[0]} y ${allAuthors[1]}`;
        if (allAuthors.length === 3) return `Analítica de chat entre ${allAuthors[0]}, ${allAuthors[1]} y ${allAuthors[2]}`;
        return `Analítica de chat entre ${allAuthors[0]}, ${allAuthors[1]} y ${allAuthors.length - 2} más`;
    }, [allAuthors, fileName]);

    // Filter messages by date range and participants
    const filteredMessages = useMemo(() => {
        if (!messages) return [];
        const start = dateStart ? new Date(dateStart) : new Date('1970-01-01');
        const end = dateEnd ? new Date(dateEnd) : new Date('2100-01-01');
        end.setHours(23, 59, 59, 999);

        return messages.filter(msg => {
            if (!msg.timestamp) return false;
            const inDateRange = msg.timestamp >= start && msg.timestamp <= end;
            const inParticipant = selectedParticipants.length === 0 || selectedParticipants.includes(msg.author);
            return inDateRange && inParticipant;
        });
    }, [messages, dateStart, dateEnd, selectedParticipants]);

    // Messages filtered only by date (for single user comparison)
    const messagesInDateRange = useMemo(() => {
        if (!messages) return [];
        const start = dateStart ? new Date(dateStart) : new Date('1970-01-01');
        const end = dateEnd ? new Date(dateEnd) : new Date('2100-01-01');
        end.setHours(23, 59, 59, 999);
        return messages.filter(msg => msg.timestamp >= start && msg.timestamp <= end);
    }, [messages, dateStart, dateEnd]);

    // Calculate statistics using extracted module
    const stats = useMemo(() => {
        try {
            return calculateStats(filteredMessages);
        } catch (error) {
            console.error('Dashboard Stats Error:', error);
            return null;
        }
    }, [filteredMessages]);

    const isSingleUser = selectedParticipants.length === 1;

    return (
        <div className="dashboard">
            <div className="dashboard-header-row">
                <div className="title-group">
                    <h2>{chatTitle}</h2>
                    <p className="subtitle" style={{ margin: 0 }}>
                        {stats ? `${stats.totalMessages.toLocaleString()} mensajes` : ''}
                        {dateStart && dateEnd ? ` • ${new Date(dateStart).toLocaleDateString()} - ${new Date(dateEnd).toLocaleDateString()}` : ''}
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
                    <div className="date-input-group" style={{ justifyContent: 'flex-end' }}>
                        <label>&nbsp;</label>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-secondary"
                            style={{ height: '38px', whiteSpace: 'nowrap' }}
                        >
                            Analizar otro archivo
                        </button>
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
                    {isSingleUser ? (
                        <SingleUserStats
                            messages={filteredMessages}
                            allMessages={messagesInDateRange}
                            author={selectedParticipants[0]}
                        />
                    ) : (
                        <>
                            <KPIGrid stats={stats} />
                            <TemporalAnalysis stats={stats} chartOptions={DEFAULT_CHART_OPTIONS} />
                            <ContentAnalysis stats={stats} chartOptions={DEFAULT_CHART_OPTIONS} />
                            <SocialAnalysis stats={stats} chartOptions={DEFAULT_CHART_OPTIONS} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
