// sock.profilePictureUrl() can silently resolve to undefined (no picture node in
// the server response) without throwing, even when the picture does exist - this
// is often just a transient timing issue, so retry once before giving up.
async function resolveAvatarUrl(sock, targetJid, fallbackName = 'User') {
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&size=512&format=png`;
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const url = await sock.profilePictureUrl(targetJid, 'image');
            if (url) return url;
        } catch (error) {
            if (attempt === 1) {
                console.error('[AVATAR] profilePictureUrl failed for', targetJid, '-', error?.message || error);
            }
        }
        if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 400));
    }
    return fallback;
}

module.exports = { resolveAvatarUrl };
