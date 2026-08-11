const fetch = require('node-fetch');

async function fetchSfwMeme() {
    // meme-api.com pulls from a curated set of general meme subreddits; retry a
    // couple times if we happen to land on a post flagged nsfw.
    for (let i = 0; i < 3; i++) {
        const response = await fetch('https://meme-api.com/gimme');
        const data = await response.json();
        if (data?.url && !data.nsfw) return data;
    }
    return null;
}

async function memeCommand(sock, chatId, message) {
    try {
        const meme = await fetchSfwMeme();
        if (!meme) {
            throw new Error('Invalid response from meme API');
        }

        const buttons = [
            { buttonId: '.meme', buttonText: { displayText: '🎭 Another Meme' }, type: 1 },
            { buttonId: '.joke', buttonText: { displayText: '😄 Joke' }, type: 1 }
        ];

        await sock.sendMessage(chatId, {
            image: { url: meme.url },
            caption: `> ${meme.title}\n📍 r/${meme.subreddit}`,
            buttons: buttons,
            headerType: 1
        }, { quoted: message });
    } catch (error) {
        console.error('Error in meme command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch meme. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = memeCommand;
