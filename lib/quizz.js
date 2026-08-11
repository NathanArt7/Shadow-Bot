const { getGeminiResponse } = require('./gemini');

// chatId -> quiz state (in-memory, resets on restart - fine for a live game)
const activeQuizzes = {};

const TOPICS = [
    'Géographie', 'Histoire', 'Sciences', 'Espace', 'Technologie', 'Psychologie',
    'Économie', 'Droit et société', 'Arts et culture', 'Mangas/animé', 'Littérature', 'Informatique'
];

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

    for (let attempt = 0; attempt < 2; attempt++) {
        const raw = await getGeminiResponse(prompt);
        if (!raw) continue;
        try {
            const cleaned = raw.replace(/```json|```/gi, '').trim();
            const data = JSON.parse(cleaned);
            if (!data.question || !data.reponse) continue;
            return {
                question: String(data.question).trim(),
                answer: String(data.reponse).trim(),
                variants: Array.isArray(data.variantes) ? data.variantes.map(String) : [],
                points: Math.max(1, Math.min(5, parseInt(data.points, 10) || 2))
            };
        } catch (e) {
            continue;
        }
    }
    return null;
}

module.exports = { activeQuizzes, TOPICS, normalize, isCorrectAnswer, generateQuestion };
