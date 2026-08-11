// pm2 process config - keeps the bot alive, restarts it on crash, and
// survives VM reboots once `pm2 save` + `pm2 startup` have been run.
const path = require('path');
const projectRoot = path.join(__dirname, '..');

module.exports = {
    apps: [
        {
            name: 'shadow-bot',
            script: 'index.js',
            // cwd must be the project root, not this deploy/ folder - the bot's
            // relative file reads (./data, ./session, ./tmp) depend on it.
            cwd: projectRoot,
            autorestart: true,
            restart_delay: 5000,
            max_restarts: 20,
            watch: false,
            max_memory_restart: '800M',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
