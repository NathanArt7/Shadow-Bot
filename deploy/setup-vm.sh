#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu VM (Oracle Cloud Always Free A1.Flex or similar).
# Run this once via SSH: bash setup-vm.sh
set -euo pipefail

echo "==> Updating system packages"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "==> Installing base tools (git, ffmpeg, build tools for native npm modules)"
sudo apt-get install -y git ffmpeg build-essential python3 curl

echo "==> Installing Node.js 20 LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> Installing pm2 (process manager - keeps the bot running, restarts on crash/reboot)"
sudo npm install -g pm2

echo "==> Versions installed:"
node -v
npm -v
ffmpeg -version | head -1
pm2 -v

echo ""
echo "==> Done. Next steps:"
echo "  1. Clone the repo:  git clone <your-repo-url> shadow-bot && cd shadow-bot"
echo "  2. Install deps:    npm install"
echo "  3. Create .env with your API keys (GEMINI_API_KEY, REMOVEBG_API_KEY, PHOTOROOM_API_KEY, TELEGRAM_BOT_TOKEN)"
echo "  4. Start with pm2:  pm2 start deploy/ecosystem.config.js"
echo "  5. Pair with WhatsApp (check logs: pm2 logs shadow-bot)"
echo "  6. Save the process list and enable boot startup:"
echo "       pm2 save"
echo "       pm2 startup   (then run the command it prints)"
