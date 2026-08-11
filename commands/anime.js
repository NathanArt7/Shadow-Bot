const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const webp = require('node-webpmux');
const crypto = require('crypto');

const ANIMU_BASE = 'https://api.some-random-api.com/animu';
const NEKOS_BASE = 'https://nekos.best/api/v2';
const LOVE_TYPES = ['kiss', 'hug', 'cuddle', 'kabedon', 'handhold', 'blowkiss'];

function normalizeType(input) {
    const lower = (input || '').toLowerCase();
    if (lower === 'facepalm' || lower === 'face_palm') return 'face-palm';
    if (lower === 'quote' || lower === 'animu-quote' || lower === 'animuquote') return 'quote';
    return lower;
}

// Convert a media buffer (gif or static image) into a sticker-ready webp buffer.
async function convertMediaToSticker(mediaBuffer, isAnimated) {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const inputExt = isAnimated ? 'gif' : 'jpg';
    const input = path.join(tmpDir, `animu_${Date.now()}.${inputExt}`);
    const output = path.join(tmpDir, `animu_${Date.now()}.webp`);
    fs.writeFileSync(input, mediaBuffer);

    const ffmpegCmd = isAnimated
        ? `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=15" -c:v libwebp -preset default -loop 0 -pix_fmt yuva420p -quality 60 -compression_level 6 "${output}"`
        : `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -c:v libwebp -preset default -loop 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${output}"`;

    try {
        await new Promise((resolve, reject) => {
            exec(ffmpegCmd, (err, stdout, stderr) => {
                if (err) return reject(err);
                // Some source GIFs from third-party APIs are corrupted at the
                // source (bad LZW data). ffmpeg tolerates this and still exits 0,
                // producing a truncated/glitched sticker WhatsApp silently refuses
                // to display - treat that as a failure so the caller can fall back.
                if (isAnimated && /LZW decode failed/i.test(stderr || '')) {
                    return reject(new Error('Corrupted source GIF (LZW decode failed)'));
                }
                resolve();
            });
        });

        let webpBuffer = fs.readFileSync(output);

        // Add sticker metadata
        const img = new webp.Image();
        await img.load(webpBuffer);

        const json = {
            'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
            'sticker-pack-name': 'Anime Stickers',
            'emojis': ['🎌']
        };
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        const exif = Buffer.concat([exifAttr, jsonBuffer]);
        exif.writeUIntLE(jsonBuffer.length, 14, 4);
        img.exif = exif;

        return await img.save(null);
    } finally {
        try { fs.unlinkSync(input); } catch {}
        try { fs.unlinkSync(output); } catch {}
    }
}

// Fallback for animated sources whose sticker conversion failed (e.g. a
// corrupted source GIF): re-encode as a real mp4 and send as a looping
// gif-style video instead, which WhatsApp renders far more tolerantly.
async function convertGifToVideo(mediaBuffer) {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const input = path.join(tmpDir, `animu_${Date.now()}.gif`);
    const output = path.join(tmpDir, `animu_${Date.now()}.mp4`);
    fs.writeFileSync(input, mediaBuffer);

    const ffmpegCmd = `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black" -pix_fmt yuv420p -movflags +faststart "${output}"`;

    try {
        await new Promise((resolve, reject) => {
            exec(ffmpegCmd, (err) => (err ? reject(err) : resolve()));
        });
        return fs.readFileSync(output);
    } finally {
        try { fs.unlinkSync(input); } catch {}
        try { fs.unlinkSync(output); } catch {}
    }
}

// Fetch a gif/image link and send it as a sticker, falling back to a looping
// gif-style video (for corrupted gifs) and finally a plain image.
async function sendGifMedia(sock, chatId, message, link, label, userAgent = 'Mozilla/5.0') {
    const lower = link.toLowerCase();
    const isGifLink = lower.endsWith('.gif');
    const isImageLink = lower.match(/\.(jpg|jpeg|png|webp)$/);

    if (isGifLink || isImageLink) {
        let mediaBuf;
        try {
            const resp = await axios.get(link, {
                responseType: 'arraybuffer',
                timeout: 15000,
                headers: { 'User-Agent': userAgent }
            });
            mediaBuf = Buffer.from(resp.data);
            const stickerBuf = await convertMediaToSticker(mediaBuf, isGifLink);
            await sock.sendMessage(chatId, { sticker: stickerBuf }, { quoted: message });
            return;
        } catch (error) {
            console.error('Error converting media to sticker:', error);

            // Sticker conversion failed (often a corrupted source GIF) -
            // retry as a looping gif-style video, which is more tolerant.
            if (isGifLink && mediaBuf) {
                try {
                    const videoBuf = await convertGifToVideo(mediaBuf);
                    await sock.sendMessage(
                        chatId,
                        { video: videoBuf, gifPlayback: true, caption: label },
                        { quoted: message }
                    );
                    return;
                } catch (videoError) {
                    console.error('Error converting media to video fallback:', videoError);
                }
            }
        }
    }

    // Fallback to image if conversion fails
    try {
        await sock.sendMessage(chatId, { image: { url: link }, caption: label }, { quoted: message });
    } catch (error) {
        console.error('Error sending fallback image:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch animu.' }, { quoted: message });
    }
}

async function sendAnimu(sock, chatId, message, type) {
    const endpoint = `${ANIMU_BASE}/${type}`;
    const res = await axios.get(endpoint);
    const data = res.data || {};

    if (data.link) {
        await sendGifMedia(sock, chatId, message, data.link, `anime: ${type}`);
        return;
    }
    if (data.quote) {
        await sock.sendMessage(chatId, { text: data.quote }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Failed to fetch animu.' }, { quoted: message });
}

// nekos.best rejects requests (both the API and its CDN gif links) that don't
// send a descriptive User-Agent.
const NEKOS_USER_AGENT = 'ShadowBot-WhatsApp/1.0 (+https://github.com/NathanArt7)';

async function sendLove(sock, chatId, message) {
    const category = LOVE_TYPES[Math.floor(Math.random() * LOVE_TYPES.length)];
    const res = await axios.get(`${NEKOS_BASE}/${category}`, {
        headers: { 'User-Agent': NEKOS_USER_AGENT }
    });
    const result = res.data?.results?.[0];

    if (!result?.url) {
        await sock.sendMessage(chatId, { text: '❌ Failed to fetch a love gif.' }, { quoted: message });
        return;
    }

    await sendGifMedia(
        sock, chatId, message, result.url,
        `💕 ${category}${result.anime_name ? ` — ${result.anime_name}` : ''}`,
        NEKOS_USER_AGENT
    );
}

async function loveCommand(sock, chatId, message) {
    try {
        await sendLove(sock, chatId, message);
    } catch (err) {
        console.error('Error in love command:', err);
        await sock.sendMessage(chatId, { text: '❌ An error occurred while fetching a love gif.' }, { quoted: message });
    }
}

async function animeCommand(sock, chatId, message, args) {
    const subArg = args && args[0] ? args[0] : '';
    const sub = normalizeType(subArg);

    const supported = [
        'nom', 'poke', 'cry', 'kiss', 'pat', 'hug', 'wink', 'face-palm', 'quote'
    ];

    try {
        if (!sub) {
            // Fetch supported types from API for dynamic help
            try {
                const res = await axios.get(ANIMU_BASE);
                const apiTypes = res.data && res.data.types ? res.data.types.map(s => s.replace('/animu/', '')).join(', ') : supported.join(', ');
                await sock.sendMessage(chatId, { text: `Usage: .animu <type>\nTypes: ${apiTypes}` }, { quoted: message });
            } catch {
                await sock.sendMessage(chatId, { text: `Usage: .animu <type>\nTypes: ${supported.join(', ')}` }, { quoted: message });
            }
            return;
        }

        if (!supported.includes(sub)) {
            await sock.sendMessage(chatId, { text: `❌ Unsupported type: ${sub}. Try one of: ${supported.join(', ')}` }, { quoted: message });
            return;
        }

        await sendAnimu(sock, chatId, message, sub);
    } catch (err) {
        console.error('Error in animu command:', err);
        await sock.sendMessage(chatId, { text: '❌ An error occurred while fetching animu.' }, { quoted: message });
    }
}

module.exports = { animeCommand, loveCommand };
