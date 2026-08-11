const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle, message) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '🔍 Please enter the song name to get the lyrics! Usage: *lyrics <song name>*'
        },{ quoted: message });
        return;
    }

    try {
        // Search for the track first (lyrics.ovh needs a separate artist + title)
        const searchRes = await fetch(`https://api.lyrics.ovh/suggest/${encodeURIComponent(songTitle)}`);
        if (!searchRes.ok) {
            const errText = await searchRes.text();
            throw errText;
        }

        const searchData = await searchRes.json();
        const track = searchData && searchData.data && searchData.data[0];
        if (!track) {
            await sock.sendMessage(chatId, {
                text: `❌ Sorry, I couldn't find any lyrics for "${songTitle}".`
            },{ quoted: message });
            return;
        }

        const lyricsRes = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(track.artist.name)}/${encodeURIComponent(track.title)}`);
        const lyricsData = lyricsRes.ok ? await lyricsRes.json() : null;
        const lyrics = lyricsData && lyricsData.lyrics ? lyricsData.lyrics : null;

        if (!lyrics) {
            await sock.sendMessage(chatId, {
                text: `❌ Sorry, I couldn't find any lyrics for "${songTitle}".`
            },{ quoted: message });
            return;
        }

        const maxChars = 4096;
        const body = lyrics.length > maxChars ? lyrics.slice(0, maxChars - 3) + '...' : lyrics;
        const output = `🎵 *${track.title}* — ${track.artist.name}\n\n${body}`;

        await sock.sendMessage(chatId, { text: output }, { quoted: message });
    } catch (error) {
        console.error('Error in lyrics command:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ An error occurred while fetching the lyrics for "${songTitle}".`
        },{ quoted: message });
    }
}

module.exports = { lyricsCommand };
