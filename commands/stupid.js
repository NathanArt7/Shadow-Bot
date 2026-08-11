const fetch = require('node-fetch');
const { resolveAvatarUrl } = require('../lib/resolveAvatar');

async function stupidCommand(sock, chatId, repliedParticipant, mentionedJid, sender, args) {
    try {
        // Determine the target user: explicit mention > author of the replied-to message > self
        let who = (mentionedJid && mentionedJid[0]) || repliedParticipant || sender;

        // Get the text for the stupid card (default in French if not provided)
        let text = args && args.length > 0 ? args.join(' ') : 'je suis stupide';

        // Get the profile picture URL
        const avatarUrl = await resolveAvatarUrl(sock, who);

        // Fetch the stupid card from the API
        const apiUrl = `https://api.some-random-api.com/canvas/misc/its-so-stupid?avatar=${encodeURIComponent(avatarUrl)}&dog=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        // Get the image buffer
        const imageBuffer = await response.buffer();

        // Send the image with caption
        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: `*@${who.split('@')[0]}*`,
            mentions: [who]
        });

    } catch (error) {
        console.error('Error in stupid command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Désolé, impossible de générer la carte. Réessaie plus tard !'
        });
    }
}

module.exports = { stupidCommand };
