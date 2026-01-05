export const parseChat = (text) => {
    const lines = text.split('\n');
    const messages = [];
    let currentMessage = null;

    // Regex Patterns
    // iOS: [14/12/20, 15:30:12] Author: Message
    const iosRegex = /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),\s(\d{1,2}:\d{2}:\d{2})\]\s(.*?):\s(.*)/;

    // Android: 14/12/20, 15:30 - Author: Message
    const androidRegex = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s(\d{1,2}:\d{2})\s-\s(.*?):\s(.*)/;

    for (let line of lines) {
        // Remove invisible chars (BiDi markers)
        line = line.replace(/[\u200e\u200f]/g, "");

        let match = line.match(iosRegex) || line.match(androidRegex);

        if (match) {
            if (currentMessage) {
                messages.push(currentMessage);
            }

            const [_, dateStr, timeStr, author, content] = match;

            currentMessage = {
                date: dateStr,
                time: timeStr,
                author: author,
                content: content.trim(),
                timestamp: parseDateTime(dateStr, timeStr)
            };
        } else {
            // Multi-line message continuation
            if (currentMessage) {
                currentMessage.content += '\n' + line.trim();
            }
        }
    }

    if (currentMessage) messages.push(currentMessage);

    console.log(`Parsed ${messages.length} messages.`);
    return messages;
};

const parseDateTime = (dateStr, timeStr) => {
    // Normalize separators
    const d = dateStr.replace(/[-.]/g, '/');
    const parts = d.split('/');

    // Assume DD/MM/YYYY format (common in Spanish exports)
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    let year = parseInt(parts[2], 10);

    if (year < 100) year += 2000; // Handle YY format

    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    const timeParts = timeStr.split(':');
    if (timeParts.length >= 2) {
        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);
        if (timeParts.length === 3) {
            seconds = parseInt(timeParts[2], 10);
        }
    }

    return new Date(year, month, day, hours, minutes, seconds);
};
