/**
 * Shared constants and regex patterns for the application
 */

// Regex for matching emoji characters
export const EMOJI_REGEX = /\p{Emoji_Presentation}/gu;

// Regex for detecting deleted messages (Spanish and English)
export const DELETED_MESSAGE_REGEX = /Eliminaste este mensaje|Este mensaje fue eliminado|This message was deleted|You deleted this message/i;

// Regex for detecting multimedia content
export const MULTIMEDIA_REGEX = /<Multimedia omitido>|<Media omitted>|<image omitted>|<audio omitido>|<sticker omitido>|<video omitted>|<GIF omitted>|sticker omitido|audio omitido|imagen omitida|video omitido|GIF omitido|documento omitido|document omitted/i;

// Regex for detecting laughter patterns
export const LAUGHTER_REGEX = /(ja|je|ji|jo|ju){2,}|lmao|lol|xd|risas/i;

// Regex for detecting URLs
export const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/;

// Time threshold for conversation starters (in hours)
export const CONVERSATION_STARTER_THRESHOLD_HOURS = 6;

// Chart color palette
export const CHART_COLORS = {
    primary: '#00a884',
    secondary: '#53bdeb',
    warning: '#FFCE56',
    danger: '#FF6384',
    purple: '#9966FF',
    teal: '#4BC0C0',
    orange: '#FF9F40',
    brown: '#9C755F',
    pink: '#FF9DA7',
    lavender: '#B07AA1',
    green: '#59a14f',
    yellow: '#edc948',
};

// Default chart options
export const DEFAULT_CHART_OPTIONS = {
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

// Day labels (Monday first)
export const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Month labels
export const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Hour labels
export const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
