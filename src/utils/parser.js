import { MULTIMEDIA_REGEX } from './constants';

/**
 * Parses WhatsApp chat export text into structured message objects.
 * Supports both iOS and Android export formats.
 */
export const parseChat = (text) => {
    const lines = text.split('\n');
    const messages = [];
    let currentMessage = null;

    // iOS format: [14/12/20, 15:30:12] Author: Message
    const iosRegex = /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),\s(\d{1,2}:\d{2}:\d{2})\]\s(.*?):\s(.*)/;
    // Android format: 14/12/20, 15:30 - Author: Message
    const androidRegex = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s(\d{1,2}:\d{2})\s-\s(.*?):\s(.*)/;

    for (let line of lines) {
        // Remove invisible BiDi markers
        line = line.replace(/[\u200e\u200f]/g, '');

        const match = line.match(iosRegex) || line.match(androidRegex);

        if (match) {
            if (currentMessage) {
                messages.push(currentMessage);
            }

            const [, dateStr, timeStr, author, content] = match;
            const isMultimedia = MULTIMEDIA_REGEX.test(content);

            currentMessage = {
                date: dateStr,
                time: timeStr,
                author: author,
                content: content.trim(),
                isMultimedia: isMultimedia,
                timestamp: parseDateTime(dateStr, timeStr)
            };
        } else if (currentMessage) {
            // Multi-line message continuation
            currentMessage.content += '\n' + line.trim();
        }
    }

    if (currentMessage) {
        messages.push(currentMessage);
    }

    console.log(`Parsed ${messages.length} messages.`);
    return messages;
};

/**
 * Parses date and time strings into a Date object.
 * Assumes DD/MM/YYYY format (common in Spanish exports).
 */
const parseDateTime = (dateStr, timeStr) => {
    const normalizedDate = dateStr.replace(/[-.]/g, '/');
    const [day, month, year] = normalizedDate.split('/').map(Number);

    const fullYear = year < 100 ? 2000 + year : year;
    const [hours = 0, minutes = 0, seconds = 0] = timeStr.split(':').map(Number);

    return new Date(fullYear, month - 1, day, hours, minutes, seconds);
};
