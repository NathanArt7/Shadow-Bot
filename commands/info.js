const CATEGORIES = [
    {
        emoji: '🌐',
        title: 'Général',
        items: [
            ['.help / .menu', 'Affiche le menu complet des commandes du bot.'],
            ['.ping', 'Mesure la latence du bot (ms) et affiche son uptime.'],
            ['.alive', 'Confirme que le bot est en ligne.'],
            ['.tts <texte>', 'Synthèse vocale (texte → audio). ".tts en:texte" pour une autre langue.'],
            ['.owner', 'Envoie la carte de contact (vCard) du propriétaire du bot.'],
            ['.joke', 'Blague aléatoire en français.'],
            ['.quote', 'Citation inspirante aléatoire, traduite en français.'],
            ['.fact', 'Fait aléatoire, traduit en français.'],
            ['.weather <ville>', 'Météo actuelle d\'une ville.'],
            ['.news', 'Actualités depuis des sources françaises (Libération, L\'Équipe, Les Echos).'],
            ['.attp <texte>', 'Sticker animé de texte clignotant, généré localement (ffmpeg).'],
            ['.lyrics <titre>', 'Paroles d\'une chanson.'],
            ['.8ball <question>', 'Boule magique, réponse aléatoire en français.'],
            ['.groupinfo', 'Infos du groupe (ID, membres, admins, description) avec la photo.'],
            ['.staff / .admins', 'Liste les administrateurs du groupe avec la photo.'],
            ['.vv', 'Renvoie en clair un média "vue unique" ; répondre au message concerné.'],
            ['.trt <texte> <langue>', 'Traduit un texte vers la langue indiquée.'],
            ['.ss <lien>', 'Capture d\'écran d\'un site web.'],
            ['.jid', 'Affiche l\'ID (JID) du groupe.'],
            ['.url', 'Convertit un média envoyé/cité en lien URL hébergé.'],
            ['.monument [nom]', 'Photo + infos d\'un monument du monde (aléatoire ou recherché, via Wikipedia).']
        ]
    },
    {
        emoji: '👮‍♂️',
        title: 'Admin',
        items: [
            ['.ban @user', 'Bannit un utilisateur du groupe (admin requis).'],
            ['.unban @user', 'Retire un utilisateur de la liste des bannis (admin requis).'],
            ['.promote @user', 'Promeut un membre administrateur du groupe.'],
            ['.demote @user', 'Rétrograde un administrateur.'],
            ['.mute <minutes>', 'Passe le groupe en mode "annonces seules" (durée optionnelle).'],
            ['.unmute', 'Redonne la parole à tous les membres.'],
            ['.delete / .del', 'Supprime les derniers messages envoyés dans le chat.'],
            ['.kick @user', 'Expulse un membre du groupe.'],
            ['.warnings @user', 'Affiche le nombre d\'avertissements d\'un membre.'],
            ['.warn @user', 'Donne un avertissement à un membre.'],
            ['.antilink', 'Active/désactive/configure la suppression automatique des liens.'],
            ['.antibadword', 'Supprime les messages contenant des mots interdits (liste française).'],
            ['.clear', 'Supprime les derniers messages du bot/propriétaire dans le chat.'],
            ['.tag <message>', 'Répète un message en mentionnant silencieusement tout le monde.'],
            ['.tagall', 'Mentionne tous les membres du groupe.'],
            ['.tagnotadmin', 'Mentionne uniquement les membres non-administrateurs.'],
            ['.hidetag <message>', 'Envoie un message en mentionnant tout le monde sans afficher la liste.'],
            ['.chatbot', 'Active/désactive le chatbot IA (persona Shadow Bot) dans le groupe.'],
            ['.resetlink', 'Régénère le lien d\'invitation du groupe.'],
            ['.antitag <on/off>', 'Protection contre les messages qui taguent massivement le groupe.'],
            ['.welcome <on/off>', 'Active/personnalise le message de bienvenue.'],
            ['.goodbye <on/off>', 'Active/personnalise le message de départ.'],
            ['.setgdesc <texte>', 'Change la description du groupe.'],
            ['.setgname <nom>', 'Change le nom du groupe.'],
            ['.setgpp', 'Change la photo du groupe (répondre à une image).']
        ]
    },
    {
        emoji: '🔒',
        title: 'Propriétaire',
        items: [
            ['.respect <add/remove/list>', 'Gère la liste des utilisateurs toujours traités poliment par le chatbot.'],
            ['.mode <public/private>', 'Bascule le bot en mode public ou privé (accès restreint).'],
            ['.clearsession', 'Nettoie les fichiers de session Baileys (sauf creds.json).'],
            ['.antidelete', 'Renvoie au propriétaire les messages/médias supprimés.'],
            ['.cleartmp', 'Vide les dossiers temporaires du bot.'],
            ['.settings', 'Affiche l\'état de tous les réglages du bot.'],
            ['.setpp', 'Change la photo de profil du bot (répondre à une image).'],
            ['.autoreact <on/off>', 'Active/désactive les réactions emoji automatiques du bot.'],
            ['.autostatus <on/off>', 'Active/désactive la visualisation automatique des statuts.'],
            ['.autostatus react <on/off>', 'Active/désactive les réactions automatiques aux statuts.'],
            ['.autotyping <on/off>', 'Simule "en train d\'écrire" avant de répondre.'],
            ['.autoread <on/off>', 'Marque automatiquement les messages comme lus.'],
            ['.anticall <on/off>', 'Bloque automatiquement les appels entrants.'],
            ['.pmblocker <on/off/status>', 'Bloque les messages privés reçus par le bot.'],
            ['.pmblocker setmsg <texte>', 'Personnalise le message d\'avertissement du pmblocker.'],
            ['.setmention', 'Enregistre une réponse auto quand le bot est mentionné (répondre à un message).'],
            ['.mention <on/off>', 'Active/désactive la réponse automatique aux mentions du bot.']
        ]
    },
    {
        emoji: '🎨',
        title: 'Image / Sticker',
        items: [
            ['.blur', 'Applique un flou à une image envoyée ou citée.'],
            ['.simage', 'Convertit un sticker cité en image.'],
            ['.sticker', 'Convertit une image/vidéo citée en sticker.'],
            ['.removebg', 'Retire le fond d\'une image (remove.bg avec repli sur Photoroom).'],
            ['.crop', 'Recadre une image/vidéo/sticker citée en carré, renvoyé en sticker.'],
            ['.tgsticker <Lien>', 'Télécharge un pack de stickers Telegram (lien t.me/addstickers).'],
            ['.meme', 'Envoie un mème aléatoire (image + titre).'],
            ['.take <packname>', 'Recrée un sticker cité avec un nouveau nom de pack.'],
            ['.emojimix <e1>+<e2>', 'Fusionne deux emojis en un sticker.'],
            ['.igs <lien insta>', 'Convertit un lien/média Instagram en sticker.'],
            ['.igsc <lien insta>', 'Comme .igs mais recadré en carré.']
        ]
    },
    {
        emoji: '🎮',
        title: 'Jeux',
        items: [
            ['.tictactoe @user', 'Lance une partie de morpion contre un membre.'],
            ['.hangman', 'Lance une partie de pendu (mots français, 8 catégories).'],
            ['.guess <lettre>', 'Propose une lettre dans la partie de pendu en cours.'],
            ['.trivia', 'Question de culture générale, traduite en français.'],
            ['.answer <réponse>', 'Répond à la question de trivia en cours.'],
            ['.truth', 'Question "vérité" pour Action ou Vérité.'],
            ['.dare', 'Gage pour Action ou Vérité.']
        ]
    },
    {
        emoji: '🤖',
        title: 'IA',
        items: [
            ['.gemini <question>', 'Pose une question à l\'IA Google Gemini.'],
            ['.imagine <prompt>', 'Génère une image à partir d\'une description (Pollinations/Flux).']
        ]
    },
    {
        emoji: '🎯',
        title: 'Fun',
        items: [
            ['.compliment @user', 'Compliment aléatoire en français (100 phrases).'],
            ['.insult @user', 'Petite pique non vulgaire en français (100 phrases).'],
            ['.flirt', 'Phrase de drague en français.'],
            ['.shayari', 'Citation romantique façon poésie.'],
            ['.goodnight', 'Message de bonne nuit romantique.'],
            ['.roseday', 'Message "jour de la rose" romantique.'],
            ['.character @user', '"Analyse de caractère" fictive avec l\'avatar du membre.'],
            ['.wasted @user', 'Effet "wasted" (façon GTA) sur l\'avatar du membre.'],
            ['.ship @user', '"Ship" romantique entre deux membres (aléatoire ou choisi).'],
            ['.simp @user', 'Carte "simp" avec l\'avatar du membre.'],
            ['.stupid @user [texte]', 'Carte "stupide" avec avatar et texte personnalisé.']
        ]
    },
    {
        emoji: '🔤',
        title: 'Textmaker',
        items: [
            ['.metallic <texte>', 'Effet texte 3D métallique.'],
            ['.ice <texte>', 'Effet texte glace.'],
            ['.snow <texte>', 'Effet texte neige.'],
            ['.impressive <texte>', 'Effet texte peinture 3D colorée.'],
            ['.matrix <texte>', 'Effet texte façon Matrix.'],
            ['.light <texte>', 'Effet texte lumineux futuriste.'],
            ['.neon <texte>', 'Effet texte néon coloré.'],
            ['.devil <texte>', 'Effet texte ailes de démon néon.'],
            ['.purple <texte>', 'Effet texte violet.'],
            ['.thunder <texte>', 'Effet texte éclair/tonnerre.'],
            ['.leaves <texte>', 'Effet texte pinceau végétal.'],
            ['.1917 <texte>', 'Effet texte façon affiche du film "1917".'],
            ['.arena <texte>', 'Effet texte cover "Arena of Valor".'],
            ['.hacker <texte>', 'Effet texte hacker néon cyan.'],
            ['.sand <texte>', 'Effet texte écrit sur le sable.'],
            ['.blackpink <texte>', 'Effet texte logo façon Blackpink.'],
            ['.glitch <texte>', 'Effet texte glitch numérique.'],
            ['.fire <texte>', 'Effet texte enflammé.'],
            ['.font <style> <texte>', 'Convertit le texte en unicode stylé (10 styles : gras, cursive...).']
        ]
    },
    {
        emoji: '📥',
        title: 'Téléchargement',
        items: [
            ['.play <titre>', 'Recherche et télécharge une chanson YouTube en MP3.'],
            ['.instagram <lien>', 'Télécharge photos/vidéos Instagram.'],
            ['.facebook <lien>', 'Télécharge une vidéo Facebook.'],
            ['.tiktok <lien>', 'Télécharge une vidéo TikTok.'],
            ['.pinterest <recherche>', 'Envoie 5 images Pinterest aléatoires liées à la recherche.'],
            ['.video <lien/recherche>', 'Recherche et télécharge une vidéo YouTube en MP4.']
        ]
    },
    {
        emoji: '🖼️',
        title: 'Anime',
        items: [
            ['.nom', 'GIF anime "nom nom" envoyé en sticker animé.'],
            ['.poke', 'GIF anime "poke" envoyé en sticker animé.'],
            ['.cry', 'GIF anime de pleurs envoyé en sticker animé.'],
            ['.kiss', 'GIF anime de bisou envoyé en sticker animé.'],
            ['.pat', 'GIF anime "pat pat" envoyé en sticker animé.'],
            ['.hug', 'GIF anime de câlin envoyé en sticker animé.'],
            ['.wink', 'GIF anime de clin d\'œil envoyé en sticker animé.'],
            ['.facepalm', 'GIF anime "facepalm" envoyé en sticker animé.'],
            ['.love', 'GIF anime romantique aléatoire (bisou, câlin, main dans la main...).']
        ]
    }
];

async function infoCommand(sock, chatId, message) {
    let counter = 1;

    const header = `📖 *INFO — Liste complète des commandes*\n\nChaque commande est numérotée et décrite. Envoi en plusieurs messages (une catégorie à la fois).`;
    await sock.sendMessage(chatId, { text: header }, { quoted: message });

    for (const category of CATEGORIES) {
        const isOwnerCategory = category.title === 'Propriétaire';
        const lines = category.items.map(([cmd, desc]) => `${counter++}. \`${cmd}\` — ${isOwnerCategory ? '🤫' : desc}`);
        const text = `${category.emoji} *${category.title}*\n\n${lines.join('\n')}`;
        await sock.sendMessage(chatId, { text });
        await new Promise(resolve => setTimeout(resolve, 700));
    }
}

module.exports = infoCommand;
