const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

// winget installs ffmpeg outside the system PATH that Node inherits on this machine,
// so point fluent-ffmpeg at the real binary directly instead of relying on PATH.
const FFMPEG_BINARY = 'C:\\Users\\labar\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe';
if (fs.existsSync(FFMPEG_BINARY)) {
    ffmpeg.setFfmpegPath(FFMPEG_BINARY);
}

const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}

async function urlToMp3Buffer(url) {
    const inputPath = path.join(tmpDir, `yt_in_${Date.now()}_${Math.floor(Math.random() * 1e6)}`);
    const outputPath = `${inputPath}.mp3`;

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 60000 });
        fs.writeFileSync(inputPath, Buffer.from(response.data));

        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .audioCodec('libmp3lame')
                .audioBitrate(128)
                .toFormat('mp3')
                .on('end', resolve)
                .on('error', reject)
                .save(outputPath);
        });

        return fs.readFileSync(outputPath);
    } finally {
        try { fs.existsSync(inputPath) && fs.unlinkSync(inputPath); } catch {}
        try { fs.existsSync(outputPath) && fs.unlinkSync(outputPath); } catch {}
    }
}

module.exports = { urlToMp3Buffer };
