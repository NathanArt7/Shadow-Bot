const fetch = require('node-fetch');

// Maps language names (French/English) and ISO codes to a target ISO code.
const LANGUAGE_ALIASES = {
    fr: 'fr', français: 'fr', francais: 'fr', french: 'fr',
    en: 'en', anglais: 'en', english: 'en',
    es: 'es', espagnol: 'es', spanish: 'es',
    de: 'de', allemand: 'de', german: 'de',
    it: 'it', italien: 'it', italian: 'it',
    pt: 'pt', portugais: 'pt', portuguese: 'pt',
    ru: 'ru', russe: 'ru', russian: 'ru',
    ja: 'ja', japonais: 'ja', japanese: 'ja',
    ko: 'ko', coréen: 'ko', coreen: 'ko', korean: 'ko',
    zh: 'zh', chinois: 'zh', chinese: 'zh',
    ar: 'ar', arabe: 'ar', arabic: 'ar',
    hi: 'hi', hindi: 'hi'
};

// Connector words that can surround a language name (e.g. "en français", "français en", "to french").
const LANGUAGE_CONNECTORS = new Set(['en', 'in', 'to', 'vers', 'dans', 'au', 'a', 'à']);

// Given the words of a ".trt <text> <lang>" command, pulls the trailing language
// (name or code, optionally wrapped in a connector word like "en"/"in") off the end
// and returns { lang, textWords }. Falls back to treating the last word as a bare
// ISO code if nothing more specific matches.
function extractTrailingLanguage(words) {
    const last = words[words.length - 1]?.toLowerCase();
    const secondLast = words[words.length - 2]?.toLowerCase();

    if (secondLast && LANGUAGE_ALIASES[secondLast] && LANGUAGE_CONNECTORS.has(last)) {
        // "... français en" -> lang = fr, drop both words
        return { lang: LANGUAGE_ALIASES[secondLast], textWords: words.slice(0, -2) };
    }

    if (last && LANGUAGE_ALIASES[last]) {
        if (secondLast && LANGUAGE_CONNECTORS.has(secondLast)) {
            // "... en français" -> lang = fr, drop both words
            return { lang: LANGUAGE_ALIASES[last], textWords: words.slice(0, -2) };
        }
        // "... fr" -> lang = fr, drop last word
        return { lang: LANGUAGE_ALIASES[last], textWords: words.slice(0, -1) };
    }

    // Unknown word: treat literally as an ISO code (backward compatible)
    return { lang: last, textWords: words.slice(0, -1) };
}

async function translateText(text, lang, sourceLang = 'auto') {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
        if (response.ok) {
            const data = await response.json();
            if (data && data[0] && data[0][0] && data[0][0][0]) return data[0][0][0];
        }
    } catch (e) {}

    // MyMemory doesn't support 'auto' as a source language, so it's only usable when the source is known.
    if (sourceLang !== 'auto') {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${lang}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
                    return data.responseData.translatedText;
                }
            }
        } catch (e) {}
    }

    try {
        const response = await fetch(`https://api.dreaded.site/api/translate?text=${encodeURIComponent(text)}&lang=${lang}`);
        if (response.ok) {
            const data = await response.json();
            if (data && data.translated) return data.translated;
        }
    } catch (e) {}

    return null;
}

module.exports = { translateText, extractTrailingLanguage };
