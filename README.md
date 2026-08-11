# 🤖 Shadow Bot

Bot WhatsApp multi-fonctions basé sur la librairie [Baileys](https://github.com/WhiskeySockets/Baileys), entièrement en français : modération de groupe, IA (Google Gemini), téléchargement de médias, jeux, quiz, générateurs de texte/stickers, et bien plus.

---

## ⚙️ Fonctionnalités

- **Modération de groupe** : bannissement, mute/unmute, kick, promotion/rétrogradation, anti-lien, anti-spam de mentions, filtre de mots interdits, avertissements
- **IA** : `.gemini` (questions), `.imagine` (génération d'images), chatbot conversationnel activable par groupe
- **Téléchargement** : YouTube (`.play`, `.video`), Instagram, Facebook, TikTok, Pinterest
- **Jeux** : Morpion, Pendu, Trivia, **`.quizz`** (quiz de culture générale sur 12 thèmes, généré dynamiquement par IA, avec système de points)
- **Stickers & images** : création de stickers, suppression de fond, recadrage, flou, fusion d'emojis, packs Telegram
- **Générateurs de texte** : 18 styles d'effets visuels + convertisseur de police Unicode (`.font`)
- **Fun** : compliments, piques, drague, citations romantiques, cartes personnalisées, GIFs animés (anime + amour)
- **Commandes propriétaire** : activation par groupe, mode public/privé, auto-réponses, blocage de messages privés, et plus

La liste complète et détaillée de chaque commande est disponible via `.help` (aperçu par catégorie) ou `.info` (liste numérotée avec description).

---

## 🛠️ Installation locale

### Prérequis

- Node.js ≥ 18
- [ffmpeg](https://ffmpeg.org/) installé et accessible dans le PATH (nécessaire pour les stickers, la conversion audio/vidéo)
- Git

### Étapes

1. **Cloner le dépôt :**

    ```bash
    git clone https://github.com/NathanArt7/Shadow-Bot.git
    cd Shadow-Bot
    ```

2. **Installer les dépendances :**

    ```bash
    npm install
    ```

3. **Configurer les clés API** — créer un fichier `.env` à la racine :

    ```
    GEMINI_API_KEY=
    REMOVEBG_API_KEY=
    PHOTOROOM_API_KEY=
    TELEGRAM_BOT_TOKEN=
    ```

4. **Démarrer le bot :**

    ```bash
    npm start
    ```

5. **Connecter WhatsApp :** un code de jumelage (pairing code) s'affiche dans le terminal — entrez-le dans WhatsApp via *Appareils liés → Lier un appareil*.

---

## 🚀 Déploiement en production

### Option A — Render (gratuit)

Le projet est prêt à être déployé sur le [tier gratuit de Render](https://render.com) via le fichier [`render.yaml`](./render.yaml) (Blueprint) :

1. Sur Render : **New → Blueprint**, connecter ce dépôt GitHub
2. Render crée automatiquement le Web Service **et** une base Postgres gratuite liée
3. Renseigner les 4 clés API (`GEMINI_API_KEY`, `REMOVEBG_API_KEY`, `PHOTOROOM_API_KEY`, `TELEGRAM_BOT_TOKEN`) quand demandé
4. Consulter les logs du service pour scanner le code de pairing WhatsApp

**Pourquoi ça fonctionne malgré les limites du tier gratuit :**
- Le tier gratuit de Render efface le système de fichiers à chaque redémarrage/mise en veille → la session WhatsApp (`session/`) est donc stockée dans **Postgres** à la place (`lib/postgresAuthState.js`), qui persiste indépendamment
- Le bot expose un petit serveur HTTP (`lib/healthServer.js`) pour que Render lui attribue une URL — configurer un [UptimeRobot](https://uptimerobot.com) (gratuit) pour pinguer cette URL toutes les <15 minutes évite la mise en veille
- ffmpeg est embarqué via le paquet npm `ffmpeg-static` (aucun accès root nécessaire)

> ⚠️ Le Postgres gratuit de Render expire après 30 jours (14 jours de grâce ensuite). Une fois par mois : recréer la base gratuite, mettre à jour `DATABASE_URL`, et rescanner le pairing WhatsApp.

### Option B — VM Linux (Hetzner, Oracle Cloud, etc.)

Le dossier [`deploy/`](./deploy) contient tout le nécessaire pour un déploiement sur une vraie VM, sans les contraintes du tier gratuit :

- `deploy/setup-vm.sh` : installe Node.js, ffmpeg, git et pm2 en une seule commande
- `deploy/ecosystem.config.js` : configuration [pm2](https://pm2.keymetrics.io/) pour un fonctionnement en continu (redémarrage automatique en cas de crash ou de reboot)

```bash
git clone https://github.com/NathanArt7/Shadow-Bot.git shadow-bot
cd shadow-bot
bash deploy/setup-vm.sh
npm install
# créer le .env avec les clés API (pas de DATABASE_URL nécessaire ici)
npm run pm2:start
npm run pm2:logs      # pour scanner le code de pairing
pm2 save && pm2 startup   # pour survivre aux redémarrages
```

> Sur une VM, le disque étant persistant nativement, la session reste dans `session/` (pas besoin de Postgres) — s'assurer simplement que `DATABASE_URL` n'est pas défini dans l'environnement.

---

## 📄 Licence

Projet sous licence [MIT](https://opensource.org/licenses/MIT).

Basé à l'origine sur le template [Knight Bot MD](https://github.com/mruniquehacker/Knightbot-MD), largement réécrit et réorganisé depuis.

---

## ⚠️ Avertissement important

Ce bot n'est **pas un produit officiel WhatsApp**. Utiliser un bot tiers sur WhatsApp peut entraîner la suspension du compte utilisé. Utilisation à vos propres risques.

- Ce projet n'est affilié, autorisé, ni sponsorisé par WhatsApp ou Meta.
- Ne pas utiliser ce bot pour spammer ou envoyer des messages en masse.
- Ne pas l'utiliser à des fins illégales.
- Les auteurs déclinent toute responsabilité en cas d'usage abusif.

## 🙌 Crédits

- [Baileys](https://github.com/WhiskeySockets/Baileys) — librairie d'interaction avec WhatsApp Web
- [Knight Bot MD](https://github.com/mruniquehacker/Knightbot-MD) — base initiale du projet
