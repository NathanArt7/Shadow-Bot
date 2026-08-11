const checkAdmin = require('../lib/isAdmin');
const { refreshGroupCache } = require('../lib/groupInviteCache');

async function resetlinkCommand(sock, chatId, senderId) {
    try {
        // Reuses the robust LID/phone-number matching in isAdmin.js instead of a
        // naive p.id === botId check, which silently fails whenever WhatsApp
        // lists a participant by LID instead of phone number.
        const { isSenderAdmin: isAdmin, isBotAdmin } = await checkAdmin(sock, chatId, senderId);

        if (!isAdmin) {
            await sock.sendMessage(chatId, { text: '❌ Only admins can use this command!' });
            return;
        }

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: '❌ Bot must be admin to reset group link!' });
            return;
        }

        // Reset the group link
        const newCode = await sock.groupRevokeInvite(chatId);
        refreshGroupCache(sock, chatId).catch(() => {});

        // Send the new link
        await sock.sendMessage(chatId, { 
            text: `✅ Group link has been successfully reset\n\n📌 New link:\nhttps://chat.whatsapp.com/${newCode}`
        });

    } catch (error) {
        console.error('Error in resetlink command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to reset group link!' });
    }
}

module.exports = resetlinkCommand; 