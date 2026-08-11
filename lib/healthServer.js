const http = require('http');

// Render's free Web Services need something listening on $PORT, and an
// external uptime pinger (e.g. UptimeRobot) needs a URL to hit every <15min
// to prevent the service from spinning down. This is the bot's only inbound
// HTTP surface - it doesn't do anything besides answering "I'm alive".
function startHealthServer() {
    const port = process.env.PORT;
    if (!port) return; // local dev: no PORT set, nothing to do

    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Shadow Bot is running.');
    }).listen(port, () => {
        console.log(`Health check server listening on port ${port}`);
    });
}

module.exports = { startHealthServer };
