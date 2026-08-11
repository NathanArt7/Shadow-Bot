// Resolves whether a JID (phone-number JID or privacy LID) corresponds to a
// given phone number, cross-referencing group participants the same way
// isAdmin.js/isRespectedUser do, since WhatsApp can present the same person
// under either form depending on context.
async function matchesNumber(sock, chatId, jid, targetNumber) {
    const normalize = (j) => {
        if (!j) return '';
        const noSession = j.includes(':') ? j.split(':')[0] + '@' + j.split('@')[1] : j;
        return noSession.split('@')[0];
    };

    if (normalize(jid) === targetNumber) return true;

    if (sock && chatId && chatId.endsWith('@g.us')) {
        try {
            const metadata = await sock.groupMetadata(chatId);
            const participant = metadata.participants.find(p =>
                normalize(p.id) === normalize(jid) || normalize(p.lid) === normalize(jid) || normalize(p.phoneNumber) === normalize(jid)
            );
            if (participant) {
                const candidates = [participant.id, participant.lid, participant.phoneNumber].map(normalize).filter(Boolean);
                if (candidates.includes(targetNumber)) return true;
            }
        } catch {}
    }

    return false;
}

module.exports = { matchesNumber };
