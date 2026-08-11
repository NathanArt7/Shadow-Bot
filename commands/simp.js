const fetch = require('node-fetch');
const { resolveAvatarUrl } = require('../lib/resolveAvatar');

async function simpCommand(sock, chatId, repliedParticipant, mentionedJid, sender) {
    try {
        // Determine the target user: explicit mention > author of the replied-to message > self
        let who = (mentionedJid && mentionedJid[0]) || repliedParticipant || sender;

        // Get the profile picture URL
        const avatarUrl = await resolveAvatarUrl(sock, who);

        // Fetch the simp card from the API
        const apiUrl = `https://api.some-random-api.com/canvas/misc/simpcard?avatar=${encodeURIComponent(avatarUrl)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        // Get the image buffer
        const imageBuffer = await response.buffer();

        // Send the image with caption
        await sock.sendMessage(chatId, {
            image: imageBuffer,
            caption: `*@${who.split('@')[0]} : your religion is simping*`,
            mentions: [who],
            contextInfo: {}
        });

    } catch (error) {
        console.error('Error in simp command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Sorry, I couldn\'t generate the simp card. Please try again later!',
            contextInfo: {}
        });
    }
}

module.exports = { simpCommand };
