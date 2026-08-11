const { getGeminiResponse } = require('../lib/gemini');

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;

        if (!text) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a question after .gemini\n\nExample: .gemini write a basic html code"
            }, {
                quoted: message
            });
        }

        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a question after .gemini"
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(chatId, {
                react: { text: '🤖', key: message.key }
            });

            const answer = await getGeminiResponse(query);
            if (answer) {
                await sock.sendMessage(chatId, {
                    text: answer
                }, {
                    quoted: message
                });
            } else {
                throw new Error('Invalid response from API');
            }
        } catch (error) {
            console.error('API Error:', error);
            await sock.sendMessage(chatId, {
                text: "❌ Failed to get response. Please try again later.",
                contextInfo: {
                    mentionedJid: [message.key.participant || message.key.remoteJid],
                    quotedMessage: message.message
                }
            }, {
                quoted: message
            });
        }
    } catch (error) {
        console.error('AI Command Error:', error);
        await sock.sendMessage(chatId, {
            text: "❌ An error occurred. Please try again later.",
            contextInfo: {
                mentionedJid: [message.key.participant || message.key.remoteJid],
                quotedMessage: message.message
            }
        }, {
            quoted: message
        });
    }
}

module.exports = aiCommand;
