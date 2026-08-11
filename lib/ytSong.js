const yts = require('yt-search');
const btch = require('btch-downloader');
const { urlToMp3Buffer } = require('./downloadYtAudio');

async function resolveVideo(query) {
    if (query.includes('youtube.com') || query.includes('youtu.be')) {
        return { url: query, title: query, thumbnail: null, timestamp: null, author: null };
    }
    const search = await yts(query);
    if (!search || !search.videos.length) return null;
    return search.videos[0];
}

async function downloadYtSong(query) {
    const video = await resolveVideo(query);
    if (!video) return null;

    const data = await btch.youtube(video.url);
    if (!data || !data.status || !data.mp3) return null;

    const buffer = await urlToMp3Buffer(data.mp3);
    return {
        buffer,
        title: data.title || video.title,
        author: data.author || video.author?.name || '',
        thumbnail: data.thumbnail || video.thumbnail,
        timestamp: video.timestamp
    };
}

module.exports = { downloadYtSong };
