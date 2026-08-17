const {
    activeQuizzes, TOPICS, normalize, isCorrectAnswer, generateQuestion,
    getHistoricalAvoidList, recordSessionQuestions
} = require('../lib/quizz');

function buildRecap(scores) {
    const entries = Object.entries(scores).filter(([, pts]) => pts > 0).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
        return { text: "🏆 *Récap* : tout le monde est à 0 point pour l'instant.", mentions: [] };
    }
    const lines = entries.map(([jid, pts]) => `@${jid.split('@')[0]} : ${pts} pt${pts > 1 ? 's' : ''}`);
    return {
        text: `🏆 *Récap* :\n${lines.join('\n')}\n\nTous les autres membres sont à 0.`,
        mentions: entries.map(([jid]) => jid)
    };
}

async function askNextQuestion(sock, chatId) {
    const quiz = activeQuizzes[chatId];
    if (!quiz || !quiz.running) return;

    // Avoid both this session's own questions and anything still on cooldown
    // from recent sessions in this chat. Ask Gemini to avoid repeats via the
    // prompt, but also verify on our side since the prompt is only a
    // suggestion, not a guarantee - retry once if a duplicate slips through.
    const avoidList = [...quiz.historicalAvoid, ...quiz.askedQuestions];
    const avoidNormalized = new Set(avoidList.map(normalize));
    let q = null;
    for (let attempt = 0; attempt < 2; attempt++) {
        const candidate = await generateQuestion(quiz.topic, avoidList);
        if (!candidate) break;
        if (!avoidNormalized.has(normalize(candidate.question))) {
            q = candidate;
            break;
        }
    }

    if (!q) {
        await sock.sendMessage(chatId, { text: "❌ Impossible de générer une nouvelle question pour l'instant. Le quiz s'arrête. Réessaie avec .quizz." });
        delete activeQuizzes[chatId];
        return;
    }

    quiz.askedQuestions.push(q.question);

    const sent = await sock.sendMessage(chatId, {
        text: `❓ *Question (${q.points} point${q.points > 1 ? 's' : ''})*\n\n${q.question}\n\n_Réponds en répondant (reply) à ce message._`
    });

    quiz.currentQuestion = { ...q, messageId: sent.key.id };

    // 30s countdown, announced every 10s (30, 20, 10...), starting right away.
    let remaining = 30;
    await sock.sendMessage(chatId, { text: `${remaining}` });

    quiz.timeoutHandle = setInterval(async () => {
        const stillActive = activeQuizzes[chatId];
        if (!stillActive || !stillActive.currentQuestion || stillActive.currentQuestion.messageId !== sent.key.id) {
            clearInterval(quiz.timeoutHandle);
            return;
        }

        remaining -= 10;
        if (remaining <= 0) {
            clearInterval(quiz.timeoutHandle);
            await sock.sendMessage(chatId, { text: `⏱️ Personne n'a trouvé ! La réponse était : *${q.answer}*` });
            stillActive.currentQuestion = null;
            await askNextQuestion(sock, chatId);
            return;
        }

        await sock.sendMessage(chatId, { text: `${remaining}` });
    }, 10000);
}

async function quizzCommand(sock, chatId, message) {
    if (activeQuizzes[chatId]) {
        await sock.sendMessage(chatId, { text: "Un quiz est déjà en cours dans ce groupe ! Tape .quizzstop pour l'arrêter." }, { quoted: message });
        return;
    }

    activeQuizzes[chatId] = {
        awaitingTopic: true,
        topic: null,
        scores: {},
        currentQuestion: null,
        askedQuestions: [],
        historicalAvoid: getHistoricalAvoidList(chatId),
        running: false,
        timeoutHandle: null
    };

    const list = TOPICS.map((t, i) => `${i + 1}. ${t}`).join('\n');
    await sock.sendMessage(chatId, {
        text: `🎓 *QUIZZ — Choisis un thème*\n\n${list}\n\nRéponds avec le numéro ou le nom du thème.`
    }, { quoted: message });
}

async function quizzStopCommand(sock, chatId, message) {
    const quiz = activeQuizzes[chatId];
    if (!quiz) {
        await sock.sendMessage(chatId, { text: 'Aucun quiz en cours.' }, { quoted: message });
        return;
    }
    if (quiz.timeoutHandle) clearInterval(quiz.timeoutHandle);
    recordSessionQuestions(chatId, quiz.askedQuestions);
    const { text: recapText, mentions } = buildRecap(quiz.scores);
    delete activeQuizzes[chatId];
    await sock.sendMessage(chatId, { text: `🛑 Quiz arrêté.\n\n${recapText}`, mentions }, { quoted: message });
}

// Returns true if the message was consumed as a topic pick (valid or not
// while awaiting one shouldn't fall through to other handlers only when valid;
// invalid free text is left alone so normal chat/chatbot can still respond).
async function handleQuizzTopicSelection(sock, chatId, userText) {
    const quiz = activeQuizzes[chatId];
    if (!quiz || !quiz.awaitingTopic) return false;

    const trimmed = (userText || '').trim();
    if (!trimmed) return false;

    let chosenTopic = null;
    const asNumber = parseInt(trimmed, 10);
    if (!isNaN(asNumber) && asNumber >= 1 && asNumber <= TOPICS.length) {
        chosenTopic = TOPICS[asNumber - 1];
    } else {
        const normalizedInput = normalize(trimmed);
        chosenTopic = TOPICS.find(t => normalize(t) === normalizedInput || normalize(t).includes(normalizedInput));
    }

    if (!chosenTopic) return false;

    quiz.awaitingTopic = false;
    quiz.topic = chosenTopic;
    quiz.running = true;

    await sock.sendMessage(chatId, { text: `✅ Thème choisi : *${chosenTopic}*. C'est parti !` });
    await askNextQuestion(sock, chatId);
    return true;
}

// Returns true if this message was a reply to the active question (correct
// or not) so main.js knows to stop processing it any further (e.g. chatbot).
async function handleQuizzReply(sock, chatId, message, senderId) {
    const quiz = activeQuizzes[chatId];
    if (!quiz || !quiz.currentQuestion) return false;

    const ctx = message.message?.extendedTextMessage?.contextInfo;
    const repliedId = ctx?.stanzaId;
    if (!repliedId || repliedId !== quiz.currentQuestion.messageId) return false;

    const userText = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
    if (!isCorrectAnswer(userText, quiz.currentQuestion)) {
        await sock.sendMessage(chatId, { text: 'Faux ❌' }, { quoted: message });
        return true;
    }

    const points = quiz.currentQuestion.points;
    clearInterval(quiz.timeoutHandle);
    quiz.scores[senderId] = (quiz.scores[senderId] || 0) + points;
    quiz.currentQuestion = null;

    const { text: recapText, mentions: recapMentions } = buildRecap(quiz.scores);

    await sock.sendMessage(chatId, {
        text: `✅ Bonne réponse, @${senderId.split('@')[0]} ! (+${points} pt${points > 1 ? 's' : ''})\n\n${recapText}`,
        mentions: [...new Set([senderId, ...recapMentions])]
    });

    await askNextQuestion(sock, chatId);
    return true;
}

module.exports = { quizzCommand, quizzStopCommand, handleQuizzTopicSelection, handleQuizzReply };
