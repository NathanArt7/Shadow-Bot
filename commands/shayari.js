const shayariList = [
    "Dans le silence de la nuit, ton souvenir chante encore.",
    "Mon cœur t'a choisi bien avant que mes yeux ne te trouvent.",
    "Même absent(e), tu habites chaque pensée que j'ai.",
    "L'amour ne se dit pas toujours, parfois il se devine dans un regard.",
    "Tu es le vers que mon cœur n'a jamais su écrire seul.",
    "Entre mille étoiles, mes yeux ne cherchent que la tienne.",
    "Ton absence pèse plus lourd que tous les mots que je pourrais dire.",
    "Je t'aime comme on aime une chanson qu'on n'oublie jamais.",
    "Ton nom sur mes lèvres a le goût d'un poème inachevé.",
    "Le temps passe, mais mon cœur reste à l'endroit où tu l'as laissé.",
    "Il y a dans ton sourire tout ce que les poètes cherchent à décrire.",
    "Mon cœur bat une langue que seul le tien comprend.",
    "Tu es l'histoire que je veux relire, encore et encore.",
    "Certains cherchent l'amour, moi je t'ai trouvé(e).",
    "Dans chaque silence, j'entends encore ta voix.",
    "Mes plus beaux mots restent muets face à ce que je ressens pour toi.",
    "Tu es le rêve que je ne veux jamais quitter.",
    "L'amour, c'est te penser sans jamais m'en lasser.",
    "Chaque battement de mon cœur porte ton prénom.",
    "Loin des yeux, jamais loin du cœur.",
    "Ton souvenir est la seule lumière qui ne s'éteint jamais.",
    "Je n'ai pas besoin de la lune, ton sourire éclaire déjà mes nuits.",
    "Aimer, c'est choisir quelqu'un chaque jour, encore et encore.",
    "Tu es la question à laquelle mon cœur a enfin trouvé réponse.",
    "Un jour sans penser à toi n'existe pas dans mon calendrier.",
    "Les distances séparent les corps, jamais les cœurs sincères.",
    "Ton regard a écrit dans mon cœur des mots que je n'oublierai jamais.",
    "Je t'aime non pas pour ce que tu es, mais pour ce que je deviens avec toi.",
    "Chaque sourire que tu m'offres devient un souvenir que je garde précieusement.",
    "L'amour véritable ne se mesure pas en mots, mais en silences partagés."
];

async function shayariCommand(sock, chatId, message) {
    try {
        const result = shayariList[Math.floor(Math.random() * shayariList.length)];

        const buttons = [
            { buttonId: '.shayari', buttonText: { displayText: 'Shayari 🪄' }, type: 1 },
            { buttonId: '.roseday', buttonText: { displayText: '🌹 RoseDay' }, type: 1 }
        ];

        await sock.sendMessage(chatId, {
            text: result,
            buttons: buttons,
            headerType: 1
        }, { quoted: message });
    } catch (error) {
        console.error('Error in shayari command:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Une erreur est survenue. Réessaie plus tard.',
        }, { quoted: message });
    }
}

module.exports = { shayariCommand };
