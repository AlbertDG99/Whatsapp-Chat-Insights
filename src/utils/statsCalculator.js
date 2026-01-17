/**
 * Statistics Calculator Module
 * Extracts and calculates all chat statistics from parsed messages
 */

import {
    EMOJI_REGEX,
    DELETED_MESSAGE_REGEX,
    CONVERSATION_STARTER_THRESHOLD_HOURS,
    CHART_COLORS,
    DAY_LABELS,
    MONTH_LABELS,
    HOUR_LABELS
} from './constants';

/**
 * Detects if a message contains laughter patterns
 */
const isLaughterMessage = (content) => {
    const words = content.toLowerCase().split(/[\s,.;!?]+/);
    return words.some(word => {
        if (['lol', 'lmao', 'xd'].includes(word)) return true;
        const cleanWord = word.replace(/(.)\1+/g, '$1');
        if (/^[jhaeiou]+$/.test(cleanWord)) {
            const jhCount = (cleanWord.match(/[jh]/g) || []).length;
            return jhCount >= 2;
        }
        return false;
    });
};

/**
 * Creates a bar chart data structure
 */
const createBarData = (sourceObj, sortedAuthors, label, color) => ({
    labels: sortedAuthors.map(a => a[0]),
    datasets: [{
        label,
        data: sortedAuthors.map(a => sourceObj[a[0]] || 0),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
    }]
});

/**
 * Gets top N entries from an object sorted by value
 */
const getTop = (obj, limit = 10) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, limit);

/**
 * Main statistics calculation function
 */
export const calculateStats = (messages) => {
    if (!messages || messages.length === 0) return null;

    // Initialize counters
    const authorCounts = {};
    const dateCounts = {};
    const hourCounts = Array(24).fill(0);
    const dayOfWeekCounts = Array(7).fill(0);
    const emojiCounts = {};
    const mediaCounts = {};
    const laughterCounts = {};
    const starterCounts = {};
    const msgLengthSum = {};
    const weekendVsWeekday = { Semana: 0, Finde: 0 };
    const linkCounts = {};
    const questionCounts = {};
    const wordCounts = {};
    const monthlyCounts = Array(12).fill(0);

    // Streak tracking
    let historicStreak = {
        author: null,
        count: 0,
        startTimestamp: null,
        endTimestamp: null,
        startMessage: null,
        endMessage: null
    };
    let currentStreak = { ...historicStreak };

    let lastMsgTime = null;
    let validMessageCount = 0;

    messages.forEach(msg => {
        const author = msg.author || 'Unknown';
        const content = msg.content || '';

        // Skip deleted messages
        if (DELETED_MESSAGE_REGEX.test(content)) return;

        // Count multimedia separately and skip further processing
        if (msg.isMultimedia) {
            mediaCounts[author] = (mediaCounts[author] || 0) + 1;
            return;
        }

        validMessageCount++;

        // Update streak
        if (author === currentStreak.author) {
            currentStreak.count++;
            currentStreak.endTimestamp = msg.timestamp;
            currentStreak.endMessage = content;
        } else {
            if (currentStreak.count > historicStreak.count) {
                historicStreak = { ...currentStreak };
            }
            currentStreak = {
                author,
                count: 1,
                startTimestamp: msg.timestamp,
                endTimestamp: msg.timestamp,
                startMessage: content,
                endMessage: content
            };
        }

        // Count by author
        authorCounts[author] = (authorCounts[author] || 0) + 1;

        // Temporal analysis
        if (msg.timestamp) {
            const d = msg.timestamp;
            const hour = d.getHours();
            const dayOfWeek = d.getDay();
            const month = d.getMonth();

            // Quarterly timeline
            const year = d.getFullYear();
            const quarter = Math.floor(month / 3) + 1;
            const key = `${year}-Q${quarter}`;
            dateCounts[key] = (dateCounts[key] || 0) + 1;

            hourCounts[hour]++;
            // Convert Sunday-first to Monday-first
            const dayIndex = (dayOfWeek + 6) % 7;
            dayOfWeekCounts[dayIndex]++;
            monthlyCounts[month]++;

            // Weekend vs Weekday
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendVsWeekday.Finde++;
            } else {
                weekendVsWeekday.Semana++;
            }
        }

        // Laughter detection
        if (isLaughterMessage(content)) {
            laughterCounts[author] = (laughterCounts[author] || 0) + 1;
        }

        // Conversation starters
        if (lastMsgTime && msg.timestamp) {
            const diffHours = (msg.timestamp - lastMsgTime) / (1000 * 60 * 60);
            if (diffHours > CONVERSATION_STARTER_THRESHOLD_HOURS) {
                starterCounts[author] = (starterCounts[author] || 0) + 1;
            }
        }
        lastMsgTime = msg.timestamp;

        // Message length and word count
        msgLengthSum[author] = (msgLengthSum[author] || 0) + content.length;
        wordCounts[author] = (wordCounts[author] || 0) + content.split(/\s+/).length;

        // Links
        if (content.includes('http://') || content.includes('https://')) {
            linkCounts[author] = (linkCounts[author] || 0) + 1;
        }

        // Questions
        if (content.includes('?')) {
            questionCounts[author] = (questionCounts[author] || 0) + 1;
        }

        // Emojis
        const emojiMatches = content.match(EMOJI_REGEX);
        if (emojiMatches) {
            emojiMatches.forEach(e => {
                emojiCounts[e] = (emojiCounts[e] || 0) + 1;
            });
        }
    });

    // Final streak check
    if (currentStreak.count > historicStreak.count) {
        historicStreak = { ...currentStreak };
    }

    // Sort and prepare data
    const sortedAuthors = getTop(authorCounts);
    const sortedEmojis = getTop(emojiCounts, 5);

    // Timeline data
    const timelineKeys = Object.keys(dateCounts).sort();
    const timelineLabels = timelineKeys.map(k => {
        const [y, q] = k.split('-');
        return `${q} ${y}`;
    });
    const timelineData = timelineKeys.map(k => dateCounts[k]);

    return {
        totalMessages: validMessageCount,
        uniqueAuthors: Object.keys(authorCounts).length,
        daysActive: Object.keys(dateCounts).length,
        historicStreak,
        authorChartData: createBarData(authorCounts, sortedAuthors, 'Mensajes', CHART_COLORS.primary),
        timelineChartData: {
            labels: timelineLabels,
            datasets: [{
                label: 'Actividad',
                data: timelineData,
                borderColor: CHART_COLORS.secondary,
                backgroundColor: 'rgba(83, 189, 235, 0.5)',
                tension: 0.2,
                fill: true,
                pointRadius: 2
            }]
        },
        hourlyChartData: {
            labels: HOUR_LABELS,
            datasets: [{
                label: 'Mensajes por Hora',
                data: hourCounts,
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: CHART_COLORS.warning,
                borderWidth: 1
            }]
        },
        dayOfWeekChartData: {
            labels: DAY_LABELS,
            datasets: [{
                label: 'Mensajes por Día',
                data: dayOfWeekCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: CHART_COLORS.danger,
                borderWidth: 1
            }]
        },
        emojiChartData: {
            labels: sortedEmojis.map(e => e[0]),
            datasets: [{
                data: sortedEmojis.map(e => e[1]),
                backgroundColor: [
                    CHART_COLORS.danger,
                    CHART_COLORS.secondary,
                    CHART_COLORS.warning,
                    CHART_COLORS.teal,
                    CHART_COLORS.purple
                ],
                borderWidth: 0
            }]
        },
        mediaChartData: createBarData(mediaCounts, sortedAuthors, 'Multimedia Enviado', CHART_COLORS.orange),
        laughterChartData: createBarData(laughterCounts, sortedAuthors, 'Risas', CHART_COLORS.danger),
        starterChartData: createBarData(starterCounts, sortedAuthors, 'Inicios de Conversación', CHART_COLORS.secondary),
        avgLengthChartData: {
            labels: sortedAuthors.map(a => a[0]),
            datasets: [{
                label: 'Longitud Promedio',
                data: sortedAuthors.map(a => {
                    const sum = msgLengthSum[a[0]] || 0;
                    const count = authorCounts[a[0]] || 1;
                    return Math.round(sum / count);
                }),
                backgroundColor: CHART_COLORS.teal,
                borderColor: CHART_COLORS.teal,
                borderWidth: 1
            }]
        },
        weekendChartData: {
            labels: ['Semana', 'Finde'],
            datasets: [{
                data: [weekendVsWeekday.Semana, weekendVsWeekday.Finde],
                backgroundColor: [CHART_COLORS.green, CHART_COLORS.yellow],
                borderWidth: 1
            }]
        },
        linkChartData: createBarData(linkCounts, sortedAuthors, 'Links Compartidos', CHART_COLORS.lavender),
        questionChartData: createBarData(questionCounts, sortedAuthors, 'Preguntas Realizadas', CHART_COLORS.pink),
        wordChartData: createBarData(wordCounts, sortedAuthors, 'Palabras Totales', CHART_COLORS.brown),
        seasonalityChartData: {
            labels: MONTH_LABELS,
            datasets: [{
                label: 'Actividad Mensual',
                data: monthlyCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: CHART_COLORS.purple,
                borderWidth: 1
            }]
        }
    };
};
