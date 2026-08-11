const btch = require('btch-downloader');

async function pinterestCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            await sock.sendMessage(chatId, { text: 'Utilisation : .pinterest <recherche>\nExemple : .pinterest paysage montagne' }, { quoted: message });
            return;
        }

        const res = await btch.pinterest(query);
        const pins = res?.result?.result?.result || [];

        if (!res?.status || pins.length === 0) {
            await sock.sendMessage(chatId, { text: 'Aucun résultat trouvé sur Pinterest pour cette recherche.' }, { quoted: message });
            return;
        }

        const picks = [...pins].sort(() => Math.random() - 0.5).slice(0, 5);

        for (const pin of picks) {
            const mediaUrl = pin.video_url || pin.images?.large || pin.image_url;
            if (!mediaUrl) continue;

            try {
                if (pin.video_url) {
                    await sock.sendMessage(chatId, {
                        video: { url: pin.video_url },
                        caption: pin.title?.trim() || `📌 ${query}`
                    }, { quoted: message });
                } else {
                    await sock.sendMessage(chatId, {
                        image: { url: mediaUrl },
                        caption: pin.title?.trim() || `📌 ${query}`
                    }, { quoted: message });
                }
            } catch (error) {
                console.error('Error sending pinterest media:', error.message);
            }
        }
    } catch (error) {
        console.error('Error in pinterest command:', error);
        await sock.sendMessage(chatId, { text: '❌ Échec de la recherche Pinterest. Réessaie plus tard.' }, { quoted: message });
    }
}

module.exports = pinterestCommand;
