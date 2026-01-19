export const generateMockMessages = () => {
    const users = ['Alice', 'Bob', 'Charlie', 'Dave'];
    const messages = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 30); // Start 30 days ago

    let currentDate = new Date(baseDate);

    for (let i = 0; i < 500; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        // Add varying time: usually 2-15 mins, sometimes 5-10 hours
        const isGap = Math.random() > 0.9;
        const minutesToAdd = isGap ? (Math.floor(Math.random() * 600) + 300) : (Math.floor(Math.random() * 13) + 2);

        currentDate.setMinutes(currentDate.getMinutes() + minutesToAdd);
        const date = new Date(currentDate);


        // 80% text, 5% emoji-only, 10% media, 5% links
        const type = Math.random();
        let content = '';
        let isMultimedia = false;

        if (type < 0.05) {
            content = '😂😂😂';
        } else if (type < 0.15) {
            content = '<Multimedia omitido>';
            isMultimedia = true;
        } else if (type < 0.20) {
            content = 'Check this out: https://example.com';
        } else {
            const texts = [
                'Hola a todos!', 'Qué tal?', 'Todo bien', 'Jajaja',
                'Nos vemos luego?', 'Claro que sí', 'Qué opináis de esto?',
                'Buenísimo', 'No lo creo', 'Vamos a cenar?'
            ];
            content = texts[Math.floor(Math.random() * texts.length)];
        }

        messages.push({
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            author: user,
            content: content,
            isMultimedia: isMultimedia,
            timestamp: date
        });
    }

    return messages;
};
