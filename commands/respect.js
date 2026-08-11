const { addRespectedUser, removeRespectedUser, getRespectedUsers } = require('../lib/index');

async function respectCommand(sock, chatId, message, args, isOwnerOrSudo) {
    if (!isOwnerOrSudo) {
        await sock.sendMessage(chatId, { text: '❌ Only the bot owner can manage this list.' }, { quoted: message });
        return;
    }

    const action = (args[0] || '').toLowerCase();
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const repliedTo = message.message?.extendedTextMessage?.contextInfo?.participant;
    const targetUser = mentioned[0] || repliedTo;

    if (action === 'list') {
        const list = await getRespectedUsers();
        if (list.length === 0) {
            await sock.sendMessage(chatId, { text: 'No one is on the respect list yet.' }, { quoted: message });
            return;
        }
        await sock.sendMessage(chatId, {
            text: `*Respect list* (chatbot is always polite/obedient with them):\n${list.map(j => `@${j.split('@')[0]}`).join('\n')}`,
            mentions: list
        }, { quoted: message });
        return;
    }

    if (action === 'add' || action === 'remove') {
        if (!targetUser) {
            await sock.sendMessage(chatId, { text: `Mention the user or reply to their message.\nExample: .respect ${action} @user` }, { quoted: message });
            return;
        }
        if (action === 'add') {
            await addRespectedUser(targetUser);
            await sock.sendMessage(chatId, { text: `✅ @${targetUser.split('@')[0]} added to the respect list.`, mentions: [targetUser] }, { quoted: message });
        } else {
            await removeRespectedUser(targetUser);
            await sock.sendMessage(chatId, { text: `✅ @${targetUser.split('@')[0]} removed from the respect list.`, mentions: [targetUser] }, { quoted: message });
        }
        return;
    }

    await sock.sendMessage(chatId, {
        text: `*RESPECT LIST SETUP*\n\nMakes the chatbot always polite, courteous and obedient with a specific person.\n\n.respect add @user - Add someone\n.respect remove @user - Remove someone\n.respect list - Show the list`
    }, { quoted: message });
}

module.exports = respectCommand;
