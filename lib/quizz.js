const fs = require('fs');
const path = require('path');
const { getGeminiResponse } = require('./gemini');

// chatId -> quiz state (in-memory, resets on restart - fine for a live game)
const activeQuizzes = {};

const TOPICS = [
    'Géographie', 'Histoire', 'Sciences', 'Espace', 'Technologie', 'Psychologie',
    'Économie', 'Droit et société', 'Arts et culture', 'Mangas/animé', 'Littérature', 'Informatique',
    'Sport', 'Togo'
];

// A question asked in a given .quizz session shouldn't come back for the
// next session(s) after it (i.e. only reusable again SESSION_COOLDOWN
// sessions later). Persisted per chat so the cooldown survives across
// separate .quizz runs, not just within one - each chat keeps a rolling
// window of its last SESSION_COOLDOWN sessions' worth of questions.
const SESSION_COOLDOWN = 2;
const HISTORY_PATH = path.join(__dirname, '../data/quizzHistory.json');

function loadHistory() {
    try {
        return JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
    } catch {
        return {};
    }
}

function saveHistory(history) {
    try {
        const dir = path.dirname(HISTORY_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
    } catch (e) {
        console.error('Failed to save quizz history:', e.message);
    }
}

// Flat list of every question still "on cooldown" for a session starting now.
// A question asked in session N is blocked in N+1..N+(COOLDOWN-1) and free
// again in session N+COOLDOWN - so only the last (COOLDOWN - 1) completed
// sessions count as blocking, even though up to COOLDOWN are kept in storage.
function getHistoricalAvoidList(chatId) {
    const history = loadHistory();
    const sessions = history[chatId] || [];
    return sessions.slice(-(SESSION_COOLDOWN - 1)).flat();
}

// Call once a session ends, with the list of questions it asked.
function recordSessionQuestions(chatId, questions) {
    if (!questions || questions.length === 0) return;
    const history = loadHistory();
    const sessions = history[chatId] || [];
    sessions.push(questions);
    while (sessions.length > SESSION_COOLDOWN) sessions.shift();
    history[chatId] = sessions;
    saveHistory(history);
}

function normalize(str) {
    return (str || '')
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function isCorrectAnswer(userText, question) {
    const normalizedUser = normalize(userText);
    if (!normalizedUser) return false;
    const candidates = [question.answer, ...(question.variants || [])].map(normalize).filter(Boolean);
    return candidates.some(c => normalizedUser === c || normalizedUser.includes(c) || c.includes(normalizedUser));
}

async function generateQuestion(topic, askedQuestions = []) {
    const avoidText = askedQuestions.length
        ? `\nÉvite de reposer une question déjà posée dans cette session : ${askedQuestions.join(' | ')}`
        : '';

    const prompt = `Tu es un générateur de questions de quiz de culture générale en français, sur le thème "${topic}".
Génère UNE SEULE question originale sur ce thème, avec sa réponse.${avoidText}
Choisis un niveau de difficulté et donne un nombre de points entre 1 (très facile) et 5 (très difficile) en conséquence.
Réponds STRICTEMENT avec un objet JSON valide, sans aucun texte autour, sans balises markdown, au format exact suivant :
{"question": "...", "reponse": "...", "points": <entier 1-5>, "variantes": ["...", "..."]}

La réponse doit être courte (un mot ou une courte expression), pas une phrase. "variantes" est une liste de formulations alternatives acceptables (peut être vide).`;

    // A single attempt: on a genuine failure (e.g. quota exceeded) retrying
    // immediately just burns more quota for the same result. The caller
    // (askNextQuestion) already retries a couple of times on its own for the
    // unrelated "got a duplicate" case.
    const raw = await getGeminiResponse(prompt);
    if (!raw) return null;
    try {
        const cleaned = raw.replace(/```json|```/gi, '').trim();
        const data = JSON.parse(cleaned);
        if (!data.question || !data.reponse) return null;
        return {
            question: String(data.question).trim(),
            answer: String(data.reponse).trim(),
            variants: Array.isArray(data.variantes) ? data.variantes.map(String) : [],
            points: Math.max(1, Math.min(5, parseInt(data.points, 10) || 2))
        };
    } catch (e) {
        return null;
    }
}

module.exports = {
    activeQuizzes, TOPICS, normalize, isCorrectAnswer, generateQuestion,
    getHistoricalAvoidList, recordSessionQuestions
};
