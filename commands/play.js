const { downloadYtSong } = require('../lib/ytSong');

async function playCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            return await sock.sendMessage(chatId, {
                text: "Quelle chanson veux-tu télécharger ?"
            });
        }

        const result = await downloadYtSong(searchQuery);
        if (!result) {
            return await sock.sendMessage(chatId, {
                text: "Échec de récupération de l'audio. Réessaie plus tard."
            });
        }

        if (result.thumbnail) {
            await sock.sendMessage(chatId, {
                image: { url: result.thumbnail },
                caption: `🎵 Téléchargement : *${result.title}*${result.timestamp ? `\n⏱ Durée : ${result.timestamp}` : ''}`
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            audio: result.buffer,
            mimetype: "audio/mpeg",
            fileName: `${result.title}.mp3`
        }, { quoted: message });

    } catch (error) {
        console.error('Error in play command:', error?.response?.status, error?.code, error?.message);
        await sock.sendMessage(chatId, {
            text: "Échec du téléchargement. Réessaie plus tard."
        });
    }
}

module.exports = playCommand;
