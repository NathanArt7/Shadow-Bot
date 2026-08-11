async function shipCommand(sock, chatId, msg, mentionedJid) {
    try {
        // Get all participants from the group
        const participants = await sock.groupMetadata(chatId);
        const ps = participants.participants.map(v => v.id);

        if (ps.length < 2) {
            await sock.sendMessage(chatId, { text: '❌ Not enough members in this group to ship!' });
            return;
        }

        let firstUser, secondUser;

        // If someone was mentioned, ship them with a random other member
        const targetUser = mentionedJid && mentionedJid[0] && ps.includes(mentionedJid[0])
            ? mentionedJid[0]
            : null;

        if (targetUser) {
            firstUser = targetUser;
            do {
                secondUser = ps[Math.floor(Math.random() * ps.length)];
            } while (secondUser === firstUser);
        } else {
            // Select first random user
            firstUser = ps[Math.floor(Math.random() * ps.length)];

            // Select second random user (different from first)
            do {
                secondUser = ps[Math.floor(Math.random() * ps.length)];
            } while (secondUser === firstUser);
        }

        // Format the mentions
        const formatMention = id => '@' + id.split('@')[0];

        // Create and send the ship message
        await sock.sendMessage(chatId, {
            text: `${formatMention(firstUser)} ❤️ ${formatMention(secondUser)}\nCongratulations 💖🍻`,
            mentions: [firstUser, secondUser]
        });

    } catch (error) {
        console.error('Error in ship command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to ship! Make sure this is a group.' });
    }
}

module.exports = shipCommand;
