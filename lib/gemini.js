const fetch = require('node-fetch');

// gemini-2.0-flash/gemini-2.5-flash return a hard 0 free-tier quota on some
// Google accounts (regional restriction). gemini-flash-lite-latest isn't
// gated the same way and works reliably on the free tier.
const MODEL = 'gemini-flash-lite-latest';

async function getGeminiResponse(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Gemini API error: GEMINI_API_KEY is not set');
        return null;
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        );

        if (!response.ok) {
            const body = await response.text().catch(() => '');
            console.error(`Gemini API error: HTTP ${response.status} ${response.statusText} - ${body.slice(0, 300)}`);
            return null;
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text ? text.trim() : null;
    } catch (e) {
        console.error('Gemini API error:', e.message);
        return null;
    }
}

module.exports = { getGeminiResponse };
