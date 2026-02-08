import React, { useState, useMemo } from 'react';
import AccessibleChart from '../common/AccessibleChart';
import { DELETED_MESSAGE_REGEX, DEFAULT_CHART_OPTIONS, CHART_COLORS } from '../../utils/constants';
import dashStyles from '../Dashboard.module.css';
import styles from './WordSearchCard.module.css';

const stripDiacritics = (str) =>
    str.normalize('NFD').replace(/[nN]\u0303/g, 'ñ').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const WordSearchCard = ({ messages, author }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    const result = useMemo(() => {
        if (!activeSearch || !messages || messages.length === 0) return null;

        const term = stripDiacritics(activeSearch);
        const textMessages = messages.filter(
            m => !m.isMultimedia && !DELETED_MESSAGE_REGEX.test(m.content)
        );

        if (author) {
            const userMessages = textMessages.filter(m => m.author === author);
            let count = 0;
            for (const m of userMessages) {
                const words = m.content.split(/\s+/);
                for (const w of words) {
                    if (stripDiacritics(w) === term) count++;
                }
            }
            return { count };
        }

        const counts = {};
        for (const m of textMessages) {
            const words = m.content.split(/\s+/);
            let msgCount = 0;
            for (const w of words) {
                if (stripDiacritics(w) === term) msgCount++;
            }
            if (msgCount > 0) {
                counts[m.author] = (counts[m.author] || 0) + msgCount;
            }
        }

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return { chartData: null, total: 0 };

        return {
            chartData: {
                labels: sorted.map(([name]) => name),
                datasets: [{
                    label: 'Ocurrencias',
                    data: sorted.map(([, count]) => count),
                    backgroundColor: CHART_COLORS.primary,
                    borderRadius: 4
                }]
            },
            total: sorted.reduce((sum, [, c]) => sum + c, 0)
        };
    }, [activeSearch, messages, author]);

    const handleSearch = () => {
        const trimmed = searchTerm.trim();
        if (trimmed) setActiveSearch(trimmed);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className={dashStyles.card}>
            <h3 title="Busca una palabra y descubre quién la dice más">Buscador de Palabras</h3>
            <div className={styles.searchRow}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Escribe una palabra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className={styles.searchButton} onClick={handleSearch}>
                    Buscar
                </button>
            </div>

            {!activeSearch && (
                <div className={styles.placeholder}>
                    Escribe una palabra para ver quién la usa más
                </div>
            )}

            {activeSearch && author && result && (
                <div className={styles.resultDisplay}>
                    <span className={styles.resultNumber}>{result.count}</span>
                    <span className={styles.resultLabel}>
                        {result.count === 1 ? 'vez dijo' : 'veces dijo'} &laquo;{activeSearch}&raquo;
                    </span>
                </div>
            )}

            {activeSearch && !author && result && result.chartData && (
                <div className={dashStyles.chartContainer}>
                    <AccessibleChart
                        type="bar"
                        data={result.chartData}
                        options={{ ...DEFAULT_CHART_OPTIONS, indexAxis: 'y' }}
                        ariaLabel={`Gráfico de barras: ocurrencias de "${activeSearch}" por participante`}
                    />
                </div>
            )}

            {activeSearch && !author && result && !result.chartData && (
                <div className={styles.placeholder}>
                    Nadie ha dicho &laquo;{activeSearch}&raquo;
                </div>
            )}
        </div>
    );
};

export default WordSearchCard;
