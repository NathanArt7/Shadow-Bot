const { ttdl } = require("ruhend-scraper");

async function tiktokCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: "Merci de fournir un lien TikTok."
            }, { quoted: message });
        }

        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            return await sock.sendMessage(chatId, {
                text: "Merci de fournir un lien TikTok."
            }, { quoted: message });
        }

        const tiktokPatterns = [
            /https?:\/\/(?:www\.)?tiktok\.com\//,
            /https?:\/\/(?:vm\.)?tiktok\.com\//,
            /https?:\/\/(?:vt\.)?tiktok\.com\//
        ];

        if (!tiktokPatterns.some(pattern => pattern.test(url))) {
            return await sock.sendMessage(chatId, {
                text: "Ce n'est pas un lien TikTok valide."
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });

        const data = await ttdl(url);
        const videoUrl = data?.video_hd || data?.video;

        if (!videoUrl) {
            return await sock.sendMessage(chatId, {
                text: "❌ Échec du téléchargement de la vidéo TikTok. Réessaie avec un autre lien."
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: data.title ? `𝗧𝗘́𝗟𝗘́𝗖𝗛𝗔𝗥𝗚𝗘́ 𝗣𝗔𝗥 𝗦𝗛𝗔𝗗𝗢𝗪 𝗕𝗢𝗧\n\n📝 ${data.title}` : "𝗧𝗘́𝗟𝗘́𝗖𝗛𝗔𝗥𝗚𝗘́ 𝗣𝗔𝗥 𝗦𝗛𝗔𝗗𝗢𝗪 𝗕𝗢𝗧"
        }, { quoted: message });

    } catch (error) {
        console.error('Error in TikTok command:', error);
        await sock.sendMessage(chatId, {
            text: "Une erreur est survenue lors du téléchargement. Réessaie plus tard."
        }, { quoted: message });
    }
}

module.exports = tiktokCommand;
