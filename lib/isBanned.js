const fs = require('fs');

function isBanned(userId) {
    try {
        const bannedUsers = JSON.parse(fs.readFileSync('./data/banned.json', 'utf8'));
        return bannedUsers.includes(userId);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Error checking banned status:', error.message);
        }
        return false;
    }
}

module.exports = { isBanned }; 