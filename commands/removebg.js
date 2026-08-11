const axios = require('axios');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { removeBackground } = require('../lib/removebg');

async function getImageBuffer(sock, message, args) {
    // 1) URL argument
    if (args.length > 0) {
        const url = args.join(' ');
        if (!isValidUrl(url)) return { error: 'invalid_url' };
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 20000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        return { buffer: Buffer.from(res.data) };
    }

    // 2) Quoted image
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted?.imageMessage) {
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks) };
    }

    // 3) Image in the current message
    if (message.message?.imageMessage) {
        const stream = await downloadContentFromMessage(message.message.imageMessage, 'image');
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return { buffer: Buffer.concat(chunks) };
    }

    return { error: 'no_image' };
}

module.exports = {
    name: 'removebg',
    alias: ['rmbg', 'nobg'],
    category: 'general',
    desc: 'Remove background from images',
    async exec(sock, message, args) {
        const chatId = message.key.remoteJid;
        try {
            const { buffer, error } = await getImageBuffer(sock, message, args);
            if (error === 'invalid_url') {
                return sock.sendMessage(chatId, { text: '❌ Invalid URL provided.\n\nUsage: `.removebg https://example.com/image.jpg`' }, { quoted: message });
            }
            if (error === 'no_image' || !buffer) {
                return sock.sendMessage(chatId, { text: '📸 *Remove Background Command*\n\nUsage:\n• `.removebg <image_url>`\n• Reply to an image with `.removebg`\n• Send image with `.removebg`\n\nExample: `.removebg https://example.com/image.jpg`' }, { quoted: message });
            }

            const { buffer: resultBuffer, provider } = await removeBackground(buffer);

            await sock.sendMessage(chatId, {
                image: resultBuffer,
                caption: `✨ *Background removed successfully!* (via ${provider})`
            }, { quoted: message });

        } catch (error) {
            console.error('RemoveBG Error:', error.message);

            let errorMessage = '❌ Failed to remove background (all providers failed).';
            const status = error.response?.status;

            if (status === 429) {
                errorMessage = '⏰ Rate limit exceeded. Please try again later.';
            } else if (status === 400) {
                errorMessage = '❌ Invalid image.';
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = '⏰ Request timeout. Please try again.';
            } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
                errorMessage = '🌐 Network error. Please check your connection.';
            }

            await sock.sendMessage(chatId, { text: errorMessage }, { quoted: message });
        }
    }
};

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
