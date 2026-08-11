const axios = require('axios');
const FormData = require('form-data');

async function tryRemoveBg(buffer) {
    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) return null;

    const form = new FormData();
    form.append('image_file', buffer, { filename: 'image.png' });
    form.append('size', 'auto');

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
        headers: { 'X-Api-Key': apiKey, ...form.getHeaders() },
        responseType: 'arraybuffer',
        timeout: 30000
    });
    return Buffer.from(response.data);
}

async function tryPhotoroom(buffer) {
    const apiKey = process.env.PHOTOROOM_API_KEY;
    if (!apiKey) return null;

    const form = new FormData();
    form.append('image_file', buffer, { filename: 'image.png' });

    const response = await axios.post('https://sdk.photoroom.com/v1/segment', form, {
        headers: { 'x-api-key': apiKey, ...form.getHeaders() },
        responseType: 'arraybuffer',
        timeout: 30000
    });
    return Buffer.from(response.data);
}

// Ordered chain: each provider is tried in turn (e.g. once a provider's free
// monthly quota runs out it starts returning 402/403, and we fall through to
// the next one) until one succeeds.
const providers = [
    { name: 'remove.bg', fn: tryRemoveBg },
    { name: 'Photoroom', fn: tryPhotoroom }
];

async function removeBackground(buffer) {
    let lastError = null;
    for (const provider of providers) {
        try {
            const result = await provider.fn(buffer);
            if (result) return { buffer: result, provider: provider.name };
        } catch (error) {
            const status = error.response?.status;
            console.error(`[removebg] ${provider.name} failed (status ${status ?? 'n/a'}): ${error.message}`);
            lastError = error;
        }
    }
    throw lastError || new Error('No background removal provider is configured');
}

module.exports = { removeBackground };
