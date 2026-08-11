const words = [
    // Animaux
    'éléphant', 'girafe', 'crocodile', 'papillon', 'kangourou', 'dauphin', 'hibou', 'tortue', 'écureuil', 'perroquet',
    // Nourriture
    'baguette', 'croissant', 'fromage', 'chocolat', 'ratatouille', 'crêpe', 'saucisson', 'macaron', 'artichaut', 'champignon',
    // Pays
    'france', 'senegal', 'canada', 'bresil', 'maroc', 'togo', 'belgique', 'japon', 'egypte', 'mexique',
    // Métiers
    'boulanger', 'pompier', 'astronaute', 'chirurgien', 'jardinier', 'menuisier', 'pilote', 'infirmiere', 'peintre', 'musicien',
    // Sport
    'football', 'natation', 'escalade', 'basketball', 'cyclisme', 'judo', 'tennis', 'volleyball', 'rugby', 'boxe',
    // Objets du quotidien
    'parapluie', 'ordinateur', 'telephone', 'bicyclette', 'refrigerateur', 'lunettes', 'chaussure', 'horloge', 'clavier', 'valise',
    // Nature
    'montagne', 'ocean', 'volcan', 'cascade', 'foret', 'desert', 'riviere', 'etoile', 'nuage', 'tempete',
    // Divers
    'aeroport', 'bibliotheque', 'restaurant', 'anniversaire', 'vacances', 'musique', 'peinture', 'cinema', 'voyage', 'aventure'
];
let hangmanGames = {};

function normalize(str) {
    return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function startHangman(sock, chatId) {
    const word = words[Math.floor(Math.random() * words.length)];
    const maskedWord = word.split('').map(() => '_');

    hangmanGames[chatId] = {
        word,
        maskedWord,
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrongGuesses: 6,
    };

    sock.sendMessage(chatId, { text: `🎮 Partie lancée ! Le mot (${word.length} lettres) : ${maskedWord.join(' ')}\nPropose une lettre avec .guess <lettre>` });
}

function guessLetter(sock, chatId, letter) {
    if (!hangmanGames[chatId]) {
        sock.sendMessage(chatId, { text: 'Aucune partie en cours. Lance-en une avec .hangman' });
        return;
    }

    const game = hangmanGames[chatId];
    const { word, guessedLetters, maskedWord, maxWrongGuesses } = game;
    const normalizedLetter = normalize(letter);
    const normalizedWord = normalize(word);

    if (guessedLetters.includes(normalizedLetter)) {
        sock.sendMessage(chatId, { text: `Tu as déjà proposé "${letter}". Essaie une autre lettre.` });
        return;
    }

    guessedLetters.push(normalizedLetter);

    if (normalizedWord.includes(normalizedLetter)) {
        for (let i = 0; i < normalizedWord.length; i++) {
            if (normalizedWord[i] === normalizedLetter) {
                maskedWord[i] = word[i];
            }
        }
        sock.sendMessage(chatId, { text: `✅ Bien joué ! ${maskedWord.join(' ')}` });

        if (!maskedWord.includes('_')) {
            sock.sendMessage(chatId, { text: `🎉 Félicitations ! Le mot était : ${word}` });
            delete hangmanGames[chatId];
        }
    } else {
        game.wrongGuesses += 1;
        const remaining = maxWrongGuesses - game.wrongGuesses;
        sock.sendMessage(chatId, { text: `❌ Mauvaise pioche ! Il te reste ${remaining} essai${remaining > 1 ? 's' : ''}.` });

        if (game.wrongGuesses >= maxWrongGuesses) {
            sock.sendMessage(chatId, { text: `💀 Perdu ! Le mot était : ${word}` });
            delete hangmanGames[chatId];
        }
    }
}

module.exports = { startHangman, guessLetter };
