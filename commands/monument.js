const fetch = require('node-fetch');

// A curated list of well-known world monuments (French Wikipedia article titles).
// Used when the user doesn't specify one, so .monument always returns something famous
// rather than whatever a raw random-article API happens to pick.
const MONUMENTS = [
    'Tour Eiffel', 'Statue de la Liberté', 'Grande Muraille de Chine', 'Taj Mahal',
    'Colisée', 'Machu Picchu', 'Christ Rédempteur (statue)', 'Big Ben',
    'Opéra de Sydney', 'Pétra', 'Grande Pyramide de Gizeh', 'Stonehenge',
    'Mont-Saint-Michel', 'Sagrada Família', 'Angkor Vat', 'Château de Chambord',
    'Acropole d\'Athènes', 'Kremlin de Moscou', 'Alhambra', 'Château de Neuschwanstein',
    'Cité interdite', 'Bourj Khalifa', 'Golden Gate Bridge', 'Empire State Building',
    'Arc de triomphe', 'Notre-Dame de Paris', 'Basilique Saint-Pierre',
    'Chichén Itzá', 'Forbidden City', 'Table Mountain'
];

async function fetchWikiSummary(title) {
    const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === 'disambiguation') return null;
    return data;
}

async function searchWikiTitle(query) {
    const res = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.query?.search?.[0]?.title || null;
}

async function monumentCommand(sock, chatId, message, args) {
    try {
        const query = (args || []).join(' ').trim();
        let summary = null;

        if (query) {
            const title = await searchWikiTitle(query);
            if (title) summary = await fetchWikiSummary(title);
            if (!summary) {
                await sock.sendMessage(chatId, { text: `❌ Aucun monument trouvé pour "${query}".` }, { quoted: message });
                return;
            }
        } else {
            const randomTitle = MONUMENTS[Math.floor(Math.random() * MONUMENTS.length)];
            summary = await fetchWikiSummary(randomTitle);
        }

        if (!summary || !summary.extract) {
            await sock.sendMessage(chatId, { text: '❌ Impossible de récupérer les informations sur ce monument.' }, { quoted: message });
            return;
        }

        const imageUrl = summary.originalimage?.source || summary.thumbnail?.source;
        const mapsLink = summary.coordinates
            ? `\n📍 https://maps.google.com/?q=${summary.coordinates.lat},${summary.coordinates.lon}`
            : '';
        const caption = `🏛️ *${summary.title}*\n\n${summary.extract}${mapsLink}`;

        if (imageUrl) {
            await sock.sendMessage(chatId, { image: { url: imageUrl }, caption }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: caption }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in monument command:', error);
        await sock.sendMessage(chatId, { text: '❌ Échec de la récupération du monument. Réessaie plus tard.' }, { quoted: message });
    }
}

module.exports = monumentCommand;
