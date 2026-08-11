const flirtLines = [
    "Excuse-moi, mais tu viens de faire tomber quelque chose... mon cœur.",
    "Si la beauté était un crime, tu serais en prison à vie.",
    "Es-tu un aimant ? Parce que je me sens attiré(e) vers toi.",
    "Crois-tu au coup de foudre, ou je dois repasser devant toi ?",
    "Tu dois être fatigué(e), parce que tu as couru dans mes pensées toute la journée.",
    "Si je pouvais réarranger l'alphabet, je mettrais le U et le I ensemble.",
    "Es-tu du Wi-Fi ? Parce que je sens une connexion entre nous.",
    "Ton sourire devrait être illégal, il est trop dangereux pour mon cœur.",
    "J'ai dû faire quelque chose de bien dans une vie antérieure pour te croiser aujourd'hui.",
    "Tu es la raison pour laquelle je crois encore aux jolies rencontres.",
    "Si t'étais un légume, tu serais un \"cute-cumber\".",
    "Mon jour vient de s'illuminer, et c'est de ta faute.",
    "On dit que les contraires s'attirent, alors moi imparfait(e), toi parfait(e), on est fait(e)s l'un pour l'autre.",
    "Es-tu une étoile filante ? Parce que je fais un vœu en te voyant.",
    "Je ne suis pas photographe, mais je peux facilement t'imaginer dans le cadre de ma vie.",
    "Ton nom doit être Google, parce que t'as tout ce que je cherche.",
    "Est-ce qu'il fait chaud ici, ou c'est juste toi ?",
    "Je crois que tu me dois un café, parce que je viens de te trouver à croquer.",
    "Si les baisers étaient des flocons de neige, je t'enverrais une tempête.",
    "On se connaît ? Parce que tu ressembles exactement à mon type.",
    "Tu ne serais pas fatigué(e) ? Parce que tu tournes dans ma tête depuis un moment.",
    "Je pense qu'il y a un problème avec mon téléphone... il n'a pas ton numéro.",
    "Si beauté rimait avec simplicité, on écrirait un poème rien que sur toi.",
    "Es-tu un aimant à sourires ? Parce que je ne peux pas m'empêcher d'en faire un.",
    "J'espère que tu connais la RCP, parce que tu me coupes le souffle.",
    "Il paraît que les licornes n'existent pas... et pourtant, te voilà.",
    "Ta présence suffit à rendre ma journée meilleure.",
    "Je collectionne les beaux souvenirs, tu veux bien en faire partie ?",
    "Si sourire était un super-pouvoir, le tien serait invincible.",
    "J'ai l'impression qu'on se connaît déjà... mon cœur, en tout cas, semble te reconnaître.",
    "Es-tu faite de cuivre et de tellure ? Parce que t'es Cu-Te.",
    "Il paraît que rêver, c'est gratuit... alors je rêve de toi.",
    "Ta beauté m'a rendu(e) sans voix, littéralement.",
    "Je crois que je viens de perdre mon cœur, tu ne l'aurais pas vu par hasard ?",
    "Si je devais choisir entre respirer et te regarder, je choisirais mal.",
    "On raconte que sourire est contagieux, le tien vient de me contaminer.",
    "Si la perfection existait, elle porterait ton visage.",
    "J'aimerais être une larme, pour naître dans tes yeux et mourir sur tes lèvres.",
    "Ton regard a le pouvoir d'arrêter le temps.",
    "Tu illumines la pièce plus que n'importe quelle lumière."
];

async function flirtCommand(sock, chatId, message) {
    try {
        const flirtMessage = flirtLines[Math.floor(Math.random() * flirtLines.length)];
        await sock.sendMessage(chatId, { text: flirtMessage }, { quoted: message });
    } catch (error) {
        console.error('Error in flirt command:', error);
        await sock.sendMessage(chatId, { text: '❌ Une erreur est survenue. Réessaie plus tard !' }, { quoted: message });
    }
}

module.exports = { flirtCommand };
