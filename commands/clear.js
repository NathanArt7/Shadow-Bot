const store = require('../lib/lightweight_store');

async function clearCommand(sock, chatId, message, countArg) {
    try {
        const count = Math.min(countArg && countArg > 0 ? countArg : 20, 50);
        const chatMessages = Array.isArray(store.messages[chatId]) ? store.messages[chatId] : [];

        // Only messages sent from the bot's own account: the bot's replies
        // AND the owner's own typed commands (both share fromMe: true since
        // the bot runs on the owner's linked WhatsApp account). This is the
        // symmetric complement to .delete, which skips fromMe messages.
        const toDelete = [];
        const seenIds = new Set();
        for (let i = chatMessages.length - 1; i >= 0 && toDelete.length < count; i--) {
            const m = chatMessages[i];
            if (seenIds.has(m.key.id)) continue;
            if (m.message?.protocolMessage) continue;
            if (!m.key.fromMe) continue;
            if (message && m.key.id === message.key.id) continue; // don't delete the .clear command itself
            toDelete.push(m);
            seenIds.add(m.key.id);
        }

        if (toDelete.length === 0) {
            await sock.sendMessage(chatId, { text: 'No recent bot/owner messages found to clear.' }, { quoted: message });
            return;
        }

        for (const m of toDelete) {
            try {
                await sock.sendMessage(chatId, { delete: m.key });
                await new Promise(r => setTimeout(r, 300));
            } catch (e) {
                // continue
            }
        }
    } catch (error) {
        console.error('Error clearing messages:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while clearing messages.' }, { quoted: message });
    }
}

module.exports = { clearCommand };
