const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '../data/groupInviteCache.json');

function loadCache() {
    try {
        return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    } catch {
        return {};
    }
}

function saveCache(cache) {
    try {
        const dir = path.dirname(CACHE_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
    } catch (e) {
        console.error('Failed to save group invite cache:', e.message);
    }
}

// Best-effort: always caches the group name; only caches the invite code if
// the bot is currently an admin there (WhatsApp restricts groupInviteCode to
// admins, same as .resetlink).
async function refreshGroupCache(sock, groupId) {
    try {
        const metadata = await sock.groupMetadata(groupId);
        const cache = loadCache();
        const entry = cache[groupId] || {};
        entry.groupName = metadata.subject;
        try {
            entry.inviteCode = await sock.groupInviteCode(groupId);
            entry.inviteCachedAt = Date.now();
        } catch {
            // Bot isn't admin here (or lost admin) - keep whatever was cached before
        }
        cache[groupId] = entry;
        saveCache(cache);
        return entry;
    } catch (e) {
        return null;
    }
}

function getCachedGroup(groupId) {
    const cache = loadCache();
    return cache[groupId] || null;
}

module.exports = { refreshGroupCache, getCachedGroup };
