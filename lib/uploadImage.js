const fetch = require('node-fetch');
const FormData = require('form-data');
const FileType = require('file-type');
const fs = require('fs');
const path = require('path');
const { UploadFileUgu } = require('./uploader');

/**
 * Upload an image and return a public URL.
 * Tries Uguu.se first, falls back to Telegra.ph if that fails.
 * @param {Buffer} buffer File Buffer
 * @return {Promise<string>}
 */
async function uploadImage(buffer) {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }

    const fileType = await FileType.fromBuffer(buffer);
    const { ext, mime } = fileType || { ext: 'png', mime: 'image/png' };
    const tempFile = path.join(tmpDir, `temp_${Date.now()}.${ext}`);
    fs.writeFileSync(tempFile, buffer);

    try {
        // Upload to Uguu.se - any failure here (network error or an unsuccessful
        // response) falls through to the Telegra.ph fallback below.
        try {
            const result = await UploadFileUgu(tempFile);
            const url = typeof result === 'string' ? result : (result.url || result.url_full);
            if (url) return url;
        } catch (uguError) {
            console.error('Uguu.se upload failed, falling back to Telegra.ph:', uguError.message);
        }

        // Fallback to Telegra.ph
        const telegraphForm = new FormData();
        telegraphForm.append('file', buffer, {
            filename: `upload.${ext}`,
            contentType: mime
        });

        const telegraphResponse = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            body: telegraphForm
        });

        const img = await telegraphResponse.json();
        if (img[0]?.src) {
            return 'https://telegra.ph' + img[0].src;
        }

        throw new Error('Failed to upload image to both services');
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    } finally {
        try { fs.unlinkSync(tempFile); } catch {}
    }
}

module.exports = { uploadImage };
