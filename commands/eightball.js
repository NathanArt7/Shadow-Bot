const eightBallResponses = [
    "Oui, sans aucun doute !",
    "Certainement pas !",
    "Redemande plus tard.",
    "C'est certain.",
    "Très douteux.",
    "Sans aucun doute.",
    "Ma réponse est non.",
    "Tout porte à croire que oui."
];

async function eightBallCommand(sock, chatId, question) {
    if (!question) {
        await sock.sendMessage(chatId, { text: 'Pose une question !' });
        return;
    }

    const randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
    await sock.sendMessage(chatId, { text: `🎱 ${randomResponse}` });
}

module.exports = { eightBallCommand };
