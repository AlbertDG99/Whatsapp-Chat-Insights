
export const parseChat = (text) => {
    const lines = text.split('\n');
    const messages = [];
    let currentMessage = null;

    // Regex Patterns
    // iOS: [14/12/20, 15:30:12] Author: Message
    // Note: Date format might vary by locale, but usually it's DD/MM/YY or MM/DD/YY. We'll assume DD/MM first or try to detect.
    // We'll look for the structure "[\d/\d/\d, \d:\d:\d]"
    const iosRegex = /^\[(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),\s(\d{1,2}:\d{2}:\d{2})\]\s(.*?):\s(.*)/;

    // Android: 14/12/20, 15:30 - Author: Message
    // Sometimes: 14/12/20 15:30 - ...
    const androidRegex = /^(\d{1,2}[./-]\d{1,2}[./-]\d{2,4}),?\s(\d{1,2}:\d{2})\s-\s(.*?):\s(.*)/;

    for (let line of lines) {
        // line = line.trim(); // Don't trim blindly, indentation might matter, but usually not for WA.
        // Actually, WA exports might have BOM or clean lines.

        // Remove invisible chars
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
            // Multi-line message or System message
            if (currentMessage) {
                currentMessage.content += '\n' + line.trim();
            } else {
                // Might be a system message at start, or just garbage.
                // Check for system message pattern if needed?
                // "Messages and calls are end-to-end encrypted"
            }
        }
    }

    if (currentMessage) messages.push(currentMessage);

    console.log(`Parsed ${messages.length} messages.`);
    return messages;
};

const parseDateTime = (dateStr, timeStr) => {
    // Normalize seperators
    const d = dateStr.replace(/[-.]/g, '/');
    const parts = d.split('/');

    // Simple heuristic: if parts[0] > 12, it's definitely day. 
    // If not, we assume DD/MM/YYYY for consistency with most exports globally unless US.
    // Let's assume DD/MM/YYYY as default for "WhatsappClon" (Spanish).

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
    let year = parseInt(parts[2], 10);

    if (year < 100) year += 2000; // Handle YY

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
