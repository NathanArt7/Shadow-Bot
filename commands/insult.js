const insults = [
    "T'es comme un nuage, quand tu pars, il fait beau.",
    "Tu répands la joie... surtout quand tu quittes la pièce.",
    "Je serais d'accord avec toi, mais on aurait tort tous les deux.",
    "T'es pas bête, t'as juste beaucoup de malchance en réflexion.",
    "Tes secrets sont en sécurité avec moi, je n'écoute jamais.",
    "T'es la preuve que même l'évolution fait des pauses.",
    "T'as un truc sur le menton... non, le troisième en partant du bas.",
    "T'es comme une mise à jour, à chaque fois je me demande si j'en ai vraiment besoin.",
    "T'apportes du bonheur à tout le monde... quand tu pars.",
    "T'es comme une pièce de monnaie, deux visages et pas grand-chose dedans.",
    "T'as un truc en tête... ah non, laisse tomber.",
    "À cause de toi, ils ont dû mettre un mode d'emploi sur les bouteilles de shampoing.",
    "T'es comme un nuage, tu flottes sans but précis.",
    "Tes blagues sont comme du lait périmé, aigres et difficiles à digérer.",
    "T'es comme une bougie dans le vent, inutile dès que ça se corse.",
    "T'as un truc unique, ta capacité à agacer tout le monde à parts égales.",
    "T'es comme le wifi, faible pile quand on en a besoin.",
    "T'es la preuve qu'on n'a pas besoin de filtre pour être sans charme.",
    "Ton énergie, c'est comme un trou noir, ça aspire toute la bonne ambiance.",
    "T'as vraiment une tête à faire de la radio.",
    "T'es comme un bouchon sur l'autoroute, personne ne te veut, mais te voilà.",
    "T'es comme un crayon cassé, inutile.",
    "Tes idées sont tellement originales que j'ai l'impression de les avoir déjà toutes entendues.",
    "T'es la preuve vivante que même les erreurs peuvent être productives.",
    "T'es pas fainéant(e), juste hyper motivé(e) à ne rien faire.",
    "Ton cerveau tourne encore sous Windows 95, lent et dépassé.",
    "T'es comme un dos d'âne, personne ne t'aime, mais tout le monde doit faire avec.",
    "T'es comme un nuage de moustiques, juste irritant(e).",
    "Tu rassembles les gens... pour parler de à quel point t'es agaçant(e).",
    "T'es tellement lent(e) qu'un escargot te dépasserait en marche arrière.",
    "T'as autant de charisme qu'une notice de four micro-ondes.",
    "T'es comme une pub, personne ne t'a demandé mais tu t'imposes quand même.",
    "T'es le genre de personne qu'on met en sourdine dans nos pensées.",
    "T'as une répartie aussi vive qu'un fromage qui fond au soleil.",
    "T'es la version bêta ratée de toi-même.",
    "T'as l'énergie d'un lundi matin sans café.",
    "T'es tellement prévisible qu'on pourrait régler une montre sur toi.",
    "T'es comme un GPS sans réseau, jamais là quand il faut.",
    "T'as un humour aussi frais qu'un sandwich oublié dans un sac depuis une semaine.",
    "T'es la preuve qu'on peut avoir l'air occupé sans jamais rien faire.",
    "T'as autant de subtilité qu'un éléphant dans un magasin de porcelaine.",
    "T'es comme une batterie à 1%, jamais fiable quand ça compte.",
    "Ton style vestimentaire a l'air d'avoir raté un pari.",
    "T'es tellement à côté de la plaque que tu pourrais servir de panneau indicateur.",
    "T'as la répartie d'un répondeur automatique.",
    "T'es comme une chanson qu'on connaît par cœur mais qu'on n'a jamais aimée.",
    "T'as un sens de l'orientation à faire pâlir un pigeon voyageur.",
    "T'es la preuve qu'on peut réussir à rater même les choses simples.",
    "T'as autant d'utilité qu'un parapluie troué.",
    "T'es comme une chaussette dépareillée, on sait jamais quoi faire de toi.",
    "T'es tellement lent(e) à comprendre qu'on pourrait breveter ta vitesse de réaction.",
    "T'as le charme d'une salle d'attente un lundi matin.",
    "T'es comme une imprimante, jamais prêt(e) quand il faut vraiment.",
    "Ton avis compte autant qu'une notice jamais lue.",
    "T'es aussi discret(e) qu'une alarme incendie en pleine nuit.",
    "T'as l'air aussi motivé(e) qu'un chat un dimanche après-midi.",
    "T'es comme une chanson en boucle, ça devient vite fatiguant.",
    "T'as autant de talent pour la danse qu'un piquet de clôture.",
    "T'es tellement en retard que même le temps a arrêté de t'attendre.",
    "T'as un sens de l'humour qu'on retrouve surtout dans les biscuits chinois.",
    "T'es comme une chaise bancale, jamais vraiment stable.",
    "T'as la grâce d'un hippopotame sur des patins à roulettes.",
    "T'es aussi utile qu'une chaîne de vélo sans vélo.",
    "T'as autant de peps qu'une pile usagée.",
    "T'es la définition même du mot \"meh\".",
    "T'as un sourire qui ferait fuir même un panneau publicitaire.",
    "T'es comme une clé USB corrompue, jamais quand on en a besoin.",
    "T'as autant de subtilité qu'un marteau-piqueur à 6h du matin.",
    "T'es tellement transparent(e) qu'on pourrait voir à travers tes excuses.",
    "T'as un talent inné pour arriver toujours au mauvais moment.",
    "T'es comme une chaussure trop serrée, on sait pas pourquoi on te garde.",
    "T'as autant de finesse qu'un camion dans un couloir étroit.",
    "T'es la preuve que même les copier-coller ratent parfois.",
    "T'as un charisme aussi puissant qu'une ampoule grillée.",
    "T'es comme un épisode qu'on regarde juste pour dire qu'on l'a fini.",
    "T'as autant d'énergie qu'un ordinateur en mode économie.",
    "T'es tellement prévisible qu'on pourrait écrire ton horoscope à l'avance.",
    "T'as le timing d'un feu rouge qui passe au orange juste avant toi.",
    "T'es comme un jean troué, ça se voit que t'as forcé un peu partout.",
    "T'as autant de peps qu'un dimanche pluvieux.",
    "T'es la preuve vivante qu'on peut se perdre même avec un GPS.",
    "T'as un talent pour transformer une réunion courte en éternité.",
    "T'es comme une chanson qu'on aime détester.",
    "T'as autant de discrétion qu'un klaxon en pleine nuit.",
    "T'es tellement dans la lune qu'on devrait te mettre un drapeau.",
    "T'as un sens de la mode qui mériterait sa propre enquête.",
    "T'es comme un café sans caféine, ça sert à quoi au juste.",
    "T'as autant de constance qu'une météo de printemps.",
    "T'es la personne qu'on appelle en dernier recours, et encore.",
    "T'as un charisme comparable à une salle d'attente d'hôpital.",
    "T'es comme une blague qu'on doit expliquer trois fois.",
    "T'as autant de rythme qu'un métronome cassé.",
    "T'es tellement lent(e) à répondre qu'on croirait que tu envoies un pigeon voyageur.",
    "T'as un talent pour rendre les choses simples compliquées.",
    "T'es comme une chaussette trouée, ça finit toujours par se voir.",
    "T'as autant de tact qu'un troupeau d'éléphants en talons hauts.",
    "T'es la preuve qu'on peut se tromper de direction même en ligne droite.",
    "T'as un sourire qui donne envie de vérifier l'heure.",
    "T'es comme une fenêtre embuée, jamais vraiment clair.",
    "T'es unique en ton genre... et c'est peut-être mieux ainsi."
];

async function insultCommand(sock, chatId, message) {
    try {
        if (!message || !chatId) {
            console.log('Invalid message or chatId:', { message, chatId });
            return;
        }

        let userToInsult;

        // Check for mentioned users
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToInsult = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToInsult = message.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToInsult) {
            await sock.sendMessage(chatId, {
                text: 'Mentionne quelqu\'un ou réponds à son message pour lui envoyer une vanne !'
            });
            return;
        }

        const insult = insults[Math.floor(Math.random() * insults.length)];

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, {
            text: `Hé @${userToInsult.split('@')[0]}, ${insult}`,
            mentions: [userToInsult]
        });
    } catch (error) {
        console.error('Error in insult command:', error);
        if (error.data === 429) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                await sock.sendMessage(chatId, {
                    text: 'Réessaie dans quelques secondes.'
                });
            } catch (retryError) {
                console.error('Error sending retry message:', retryError);
            }
        } else {
            try {
                await sock.sendMessage(chatId, {
                    text: 'Une erreur est survenue lors de l\'envoi de la vanne.'
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = { insultCommand };
