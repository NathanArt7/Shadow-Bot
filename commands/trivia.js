const axios = require('axios');
const { translateText } = require('../lib/translate');

let triviaGames = {};

async function startTrivia(sock, chatId) {
    if (triviaGames[chatId]) {
        sock.sendMessage(chatId, { text: 'Une partie de trivia est déjà en cours !' });
        return;
    }

    try {
        // url3986 encoding sidesteps OpenTDB's HTML-entity-encoded text (e.g. &#039;)
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986');
        const q = response.data.results[0];
        const decode = (s) => decodeURIComponent(s);

        const question = decode(q.question);
        const correctAnswer = decode(q.correct_answer);
        const incorrectAnswers = q.incorrect_answers.map(decode);

        // OpenTDB is English-only, so translate everything to French.
        const translatedQuestion = (await translateText(question, 'fr', 'en')) || question;
        const translatedCorrect = (await translateText(correctAnswer, 'fr', 'en')) || correctAnswer;
        const translatedIncorrect = await Promise.all(
            incorrectAnswers.map(async (a) => (await translateText(a, 'fr', 'en')) || a)
        );

        const options = [...translatedIncorrect, translatedCorrect].sort();

        triviaGames[chatId] = {
            question: translatedQuestion,
            correctAnswer: translatedCorrect,
            // Auto-translation sometimes mangles proper nouns (e.g. "Link" -> "Lien"),
            // so also accept the original English answer as correct.
            correctAnswerOriginal: correctAnswer,
            options,
        };

        sock.sendMessage(chatId, {
            text: `🎯 *Trivia !*\n\nQuestion : ${translatedQuestion}\n\nOptions :\n${options.join('\n')}\n\nRéponds avec .answer <réponse>`
        });
    } catch (error) {
        console.error('Error in trivia command:', error);
        sock.sendMessage(chatId, { text: '❌ Erreur lors de la récupération de la question. Réessaie plus tard.' });
    }
}

function answerTrivia(sock, chatId, answer) {
    if (!triviaGames[chatId]) {
        sock.sendMessage(chatId, { text: 'Aucune partie de trivia en cours.' });
        return;
    }

    const game = triviaGames[chatId];
    const normalizedAnswer = answer.toLowerCase().trim();
    const isCorrect = normalizedAnswer === game.correctAnswer.toLowerCase().trim() ||
        normalizedAnswer === game.correctAnswerOriginal.toLowerCase().trim();

    if (isCorrect) {
        sock.sendMessage(chatId, { text: `✅ Correct ! La réponse était : ${game.correctAnswer}` });
    } else {
        sock.sendMessage(chatId, { text: `❌ Faux ! La bonne réponse était : ${game.correctAnswer}` });
    }

    delete triviaGames[chatId];
}

module.exports = { startTrivia, answerTrivia };
