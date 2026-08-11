const btch = require('btch-downloader');
const { instagramGetUrl } = require('instagram-url-direct');

const processedMessages = new Set();

async function getMediaUrls(link) {
    try {
        const r = await btch.igdl(link);
        const urls = (r?.result || [])
            .map(item => item.url)
            .filter(url => typeof url === 'string' && url.startsWith('http'));
        if (urls.length > 0) return urls;
    } catch (e) {
        console.error('[INSTAGRAM] btch.igdl failed:', e.message);
    }

    try {
        const r = await instagramGetUrl(link);
        if (r?.url_list?.length > 0) return r.url_list;
    } catch (e) {
        console.error('[INSTAGRAM] instagram-url-direct failed:', e.message);
    }

    return [];
}

async function instagramCommand(sock, chatId, message) {
    try {
        if (processedMessages.has(message.key.id)) {
            return;
        }
        processedMessages.add(message.key.id);
        setTimeout(() => processedMessages.delete(message.key.id), 5 * 60 * 1000);

        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: "Merci de fournir un lien Instagram."
            });
        }

        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//
        ];

        if (!instagramPatterns.some(pattern => pattern.test(text))) {
            return await sock.sendMessage(chatId, {
                text: "Ce n'est pas un lien Instagram valide. Merci de fournir un lien de post, reel ou vidéo Instagram valide."
            });
        }

        await sock.sendMessage(chatId, {
            react: { text: '🔄', key: message.key }
        });

        const link = text.split(' ').slice(1).join(' ').trim() || text;
        const mediaUrls = await getMediaUrls(link);

        if (mediaUrls.length === 0) {
            return await sock.sendMessage(chatId, {
                text: "❌ Le téléchargement Instagram est actuellement indisponible (Instagram bloque agressivement les outils de scraping). Réessaie plus tard, ou vérifie que le lien est public."
            });
        }

        const mediaToDownload = mediaUrls.slice(0, 20);

        for (let i = 0; i < mediaToDownload.length; i++) {
            try {
                const mediaUrl = mediaToDownload[i];
                const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || text.includes('/reel/') || text.includes('/tv/');

                if (isVideo) {
                    await sock.sendMessage(chatId, {
                        video: { url: mediaUrl },
                        mimetype: "video/mp4",
                        caption: "𝗧𝗘́𝗟𝗘́𝗖𝗛𝗔𝗥𝗚𝗘́ 𝗣𝗔𝗥 𝗦𝗛𝗔𝗗𝗢𝗪 𝗕𝗢𝗧"
                    }, { quoted: message });
                } else {
                    await sock.sendMessage(chatId, {
                        image: { url: mediaUrl },
                        caption: "𝗧𝗘́𝗟𝗘́𝗖𝗛𝗔𝗥𝗚𝗘́ 𝗣𝗔𝗥 𝗦𝗛𝗔𝗗𝗢𝗪 𝗕𝗢𝗧"
                    }, { quoted: message });
                }

                if (i < mediaToDownload.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (mediaError) {
                console.error(`Error downloading media ${i + 1}:`, mediaError);
            }
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
        await sock.sendMessage(chatId, {
            text: "❌ Une erreur est survenue lors du traitement de la demande. Réessaie plus tard."
        });
    }
}

module.exports = instagramCommand;
