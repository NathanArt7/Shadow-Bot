const yts = require('yt-search');
const btch = require('btch-downloader');

async function videoCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = (text || '').split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { text: 'Quelle vidéo veux-tu télécharger ?' }, { quoted: message });
            return;
        }

        let videoUrl = '';
        let videoTitle = '';
        let videoThumbnail = '';
        if (searchQuery.startsWith('http://') || searchQuery.startsWith('https://')) {
            videoUrl = searchQuery;
        } else {
            const { videos } = await yts(searchQuery);
            if (!videos || videos.length === 0) {
                await sock.sendMessage(chatId, { text: 'Aucune vidéo trouvée !' }, { quoted: message });
                return;
            }
            videoUrl = videos[0].url;
            videoTitle = videos[0].title;
            videoThumbnail = videos[0].thumbnail;
        }

        try {
            const ytId = (videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1];
            const thumb = videoThumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/sddefault.jpg` : undefined);
            const captionTitle = videoTitle || searchQuery;
            if (thumb) {
                await sock.sendMessage(chatId, {
                    image: { url: thumb },
                    caption: `*${captionTitle}*\nTéléchargement...`
                }, { quoted: message });
            }
        } catch (e) { console.error('[VIDEO] thumb error:', e?.message || e); }

        const urls = videoUrl.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) {
            await sock.sendMessage(chatId, { text: "Ce n'est pas un lien YouTube valide !" }, { quoted: message });
            return;
        }

        const data = await btch.youtube(videoUrl);
        if (!data || !data.status || !data.mp4) {
            await sock.sendMessage(chatId, { text: '❌ Échec du téléchargement vidéo.' }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            video: { url: data.mp4 },
            mimetype: 'video/mp4',
            fileName: `${data.title || videoTitle || 'video'}.mp4`,
            caption: `*${data.title || videoTitle || 'Vidéo'}*`
        }, { quoted: message });

    } catch (error) {
        console.error('[VIDEO] Command Error:', error?.message || error);
        await sock.sendMessage(chatId, { text: 'Échec du téléchargement : ' + (error?.message || 'Erreur inconnue') }, { quoted: message });
    }
}

module.exports = videoCommand;
