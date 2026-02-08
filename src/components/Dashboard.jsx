import React, { useMemo, useState } from 'react';

import KPIGrid from './dashboard/KPIGrid';
import TemporalAnalysis from './dashboard/TemporalAnalysis';
import ContentAnalysis from './dashboard/ContentAnalysis';
import SocialAnalysis from './dashboard/SocialAnalysis';
import MultiSelect from './common/MultiSelect';
import SingleUserStats from './dashboard/SingleUserStats';
import { calculateStats } from '../utils/statsCalculator';
import { DEFAULT_CHART_OPTIONS } from '../utils/constants';
import toast from 'react-hot-toast';
import styles from './Dashboard.module.css';

const Dashboard = ({ messages, fileName, onReset }) => {
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

    const isSingleUser = selectedParticipants.length === 1;

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

    // Messages filtered only by date (for single user comparison) - only computed when needed
    const messagesInDateRange = useMemo(() => {
        if (!isSingleUser || !messages) return [];
        const start = dateStart ? new Date(dateStart) : new Date('1970-01-01');
        const end = dateEnd ? new Date(dateEnd) : new Date('2100-01-01');
        end.setHours(23, 59, 59, 999);
        return messages.filter(msg => msg.timestamp >= start && msg.timestamp <= end);
    }, [messages, dateStart, dateEnd, isSingleUser]);

    // Date range validation handlers
    const handleDateStartChange = (e) => {
        const newStart = e.target.value;
        if (newStart && dateEnd && newStart > dateEnd) {
            setDateEnd(newStart);
            toast('Rango de fechas ajustado automáticamente.', { icon: '📅' });
        }
        setDateStart(newStart);
    };

    const handleDateEndChange = (e) => {
        const newEnd = e.target.value;
        if (newEnd && dateStart && newEnd < dateStart) {
            setDateStart(newEnd);
            toast('Rango de fechas ajustado automáticamente.', { icon: '📅' });
        }
        setDateEnd(newEnd);
    };

    const handleResetClick = () => {
        if (window.confirm('¿Seguro que quieres analizar otro archivo? Se perderán los filtros actuales.')) {
            onReset();
        }
    };

    // Calculate statistics using extracted module
    const { stats, statsError } = useMemo(() => {
        try {
            return { stats: calculateStats(filteredMessages), statsError: null };
        } catch (error) {
            console.error('Dashboard Stats Error:', error);
            return { stats: null, statsError: error.message || 'Error desconocido' };
        }
    }, [filteredMessages]);

    return (
        <div className={styles.dashboard}>
            <div className={styles.headerRow}>
                <div className={styles.titleGroup}>
                    <h2>{chatTitle}</h2>
                    <p className={`${styles.subtitle} subtitle-no-margin`}>
                        {stats ? `${stats.totalMessages.toLocaleString()} mensajes` : ''}
                        {dateStart && dateEnd ? ` • ${new Date(dateStart).toLocaleDateString()} - ${new Date(dateEnd).toLocaleDateString()}` : ''}
                    </p>
                </div>

                <div className={styles.filters}>
                    <div className={styles.dateInputGroup}>
                        <label htmlFor="participant-filter">Participantes</label>
                        <MultiSelect
                            id="participant-filter"
                            options={allAuthors}
                            selected={selectedParticipants}
                            onChange={setSelectedParticipants}
                        />
                    </div>
                    <div className={styles.dateInputGroup}>
                        <label htmlFor="date-start">Desde</label>
                        <input
                            id="date-start"
                            type="date"
                            value={dateStart}
                            onChange={handleDateStartChange}
                            className={styles.dateInput}
                        />
                    </div>
                    <div className={styles.dateInputGroup}>
                        <label htmlFor="date-end">Hasta</label>
                        <input
                            id="date-end"
                            type="date"
                            value={dateEnd}
                            onChange={handleDateEndChange}
                            className={styles.dateInput}
                        />
                    </div>
                    <div className={`${styles.dateInputGroup} ${styles.justifyEnd}`}>
                        <label>&nbsp;</label>
                        <button
                            onClick={handleResetClick}
                            className={`${styles.btnSecondary} ${styles.btnReload}`}
                        >
                            Analizar otro archivo
                        </button>
                    </div>
                </div>
            </div>

            {!stats ? (
                <div className={styles.empty}>
                    <div className={styles.emptyContent}>
                        {statsError ? (
                            <>
                                <h3>Error al calcular estadísticas</h3>
                                <p>{statsError}</p>
                            </>
                        ) : (
                            <>
                                <h3>No se encontraron mensajes en este rango de fechas</h3>
                                <p>Intenta ajustar los filtros para incluir un rango más amplio.</p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {isSingleUser ? (
                        <>
                            <button className={styles.breadcrumb} onClick={() => setSelectedParticipants([])}>
                                ← Volver a vista general
                            </button>
                            <SingleUserStats
                                messages={filteredMessages}
                                allMessages={messagesInDateRange}
                                author={selectedParticipants[0]}
                            />
                        </>
                    ) : (
                        <>
                            <KPIGrid stats={stats} />
                            <TemporalAnalysis stats={stats} chartOptions={DEFAULT_CHART_OPTIONS} />
                            <ContentAnalysis stats={stats} chartOptions={DEFAULT_CHART_OPTIONS} />
                            <SocialAnalysis stats={stats} chartOptions={DEFAULT_CHART_OPTIONS} messages={filteredMessages} />
                        </>
                    )}
                </>
            )}

            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} Whatsapp Chat Insights. No afiliado oficial de WhatsApp Inc.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
