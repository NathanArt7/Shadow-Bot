const btch = require('btch-downloader');

async function facebookCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const url = (text || '').split(' ').slice(1).join(' ').trim();

        if (!url) {
            return await sock.sendMessage(chatId, {
                text: "Merci de fournir un lien de vidéo Facebook.\nExemple : .fb https://www.facebook.com/..."
            }, { quoted: message });
        }

        if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
            return await sock.sendMessage(chatId, {
                text: "Ce n'est pas un lien Facebook."
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });

        const data = await btch.fbdown(url);
        const videoUrl = data?.HD || data?.Normal_video || data?.SD;

        if (!data || !data.status || !videoUrl) {
            return await sock.sendMessage(chatId, {
                text: '❌ Impossible de récupérer la vidéo.\n\nRaisons possibles :\n• La vidéo est privée ou supprimée\n• Le lien est invalide\n\nEssaie avec un autre lien Facebook.'
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: "𝗧𝗘́𝗟𝗘́𝗖𝗛𝗔𝗥𝗚𝗘́ 𝗣𝗔𝗥 𝗦𝗛𝗔𝗗𝗢𝗪 𝗕𝗢𝗧"
        }, { quoted: message });

    } catch (error) {
        console.error('Error in Facebook command:', error);
        await sock.sendMessage(chatId, {
            text: "Une erreur est survenue. L'API est peut-être indisponible. Erreur : " + error.message
        }, { quoted: message });
    }
}

module.exports = facebookCommand;
