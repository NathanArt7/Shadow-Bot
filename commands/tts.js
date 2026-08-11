const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

async function ttsCommand(sock, chatId, text, message) {
    if (!text) {
        await sock.sendMessage(chatId, { text: 'Please provide the text for TTS conversion.\nExample: .tts Bonjour\nOr choose a language: .tts en:Hello' });
        return;
    }

    let language = 'fr';
    let content = text;
    const langMatch = text.match(/^([a-zA-Z]{2}(?:-[a-zA-Z]{2})?):\s*(.+)$/s);
    if (langMatch) {
        language = langMatch[1].toLowerCase();
        content = langMatch[2];
    }

    const fileName = `tts-${Date.now()}.mp3`;
    const filePath = path.join(__dirname, '..', 'assets', fileName);

    const gtts = new gTTS(content, language);
    gtts.save(filePath, async function (err) {
        if (err) {
            await sock.sendMessage(chatId, { text: 'Error generating TTS audio.' });
            return;
        }

        await sock.sendMessage(chatId, {
            audio: { url: filePath },
            mimetype: 'audio/mpeg'
        }, { quoted: message });

        fs.unlinkSync(filePath);
    });
}

module.exports = ttsCommand;
