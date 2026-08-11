const { setGroupActive, isGroupActive } = require('../lib/index');
const { matchesNumber } = require('../lib/specialNumbers');

const ACTIVATE_TRUSTED_NUMBER = '22892039293';

async function activateCommand(sock, chatId, message, action, isOwnerOrSudo, senderId) {
    if (!chatId.endsWith('@g.us')) {
        await sock.sendMessage(chatId, { text: 'This command can only be used in groups.' }, { quoted: message });
        return;
    }

    const hasControl = isOwnerOrSudo || (senderId && await matchesNumber(sock, chatId, senderId, ACTIVATE_TRUSTED_NUMBER));
    if (!hasControl) {
        await sock.sendMessage(chatId, { text: '❌ Only the bot owner can activate/deactivate the bot in a group.' }, { quoted: message });
        return;
    }

    if (!action) {
        const active = await isGroupActive(chatId);
        await sock.sendMessage(chatId, {
            text: `Bot is currently *${active ? 'active' : 'inactive'}* in this group.\n\nUsage:\n.activate on - Enable the bot here\n.activate off - Disable the bot here`
        }, { quoted: message });
        return;
    }

    if (action !== 'on' && action !== 'off') {
        await sock.sendMessage(chatId, { text: 'Usage: .activate on/off' }, { quoted: message });
        return;
    }

    await setGroupActive(chatId, action === 'on');
    await sock.sendMessage(chatId, { text: `✅ Bot is now *${action === 'on' ? 'active' : 'inactive'}* in this group.` }, { quoted: message });
}

module.exports = activateCommand;
