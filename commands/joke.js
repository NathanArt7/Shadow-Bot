const axios = require('axios');

module.exports = async function (sock, chatId) {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=fr&safe-mode');
        const data = response.data;
        const joke = data.type === 'single' ? data.joke : `${data.setup}\n${data.delivery}`;
        await sock.sendMessage(chatId, { text: joke });
    } catch (error) {
        console.error('Error fetching joke:', error);
        await sock.sendMessage(chatId, { text: 'Désolé, impossible de récupérer une blague pour le moment.' });
    }
};
