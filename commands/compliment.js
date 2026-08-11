const compliments = [
    "Tu es incroyable tel(le) que tu es !",
    "Tu as un sens de l'humour excellent !",
    "Tu es d'une gentillesse rare.",
    "Tu es plus fort(e) que tu ne le penses.",
    "Tu illumines la pièce dès que tu y entres !",
    "Tu es un(e) véritable ami(e).",
    "Tu m'inspires !",
    "Ta créativité n'a pas de limites !",
    "Tu as un cœur en or.",
    "Tu fais une vraie différence dans ce monde.",
    "Ta positivité est contagieuse !",
    "Tu as une éthique de travail admirable.",
    "Tu fais ressortir le meilleur chez les gens.",
    "Ton sourire illumine la journée de tout le monde.",
    "Tu es doué(e) dans tout ce que tu entreprends.",
    "Ta gentillesse rend le monde meilleur.",
    "Tu as une perspective unique et merveilleuse.",
    "Ton enthousiasme est vraiment inspirant !",
    "Tu es capable d'accomplir de grandes choses.",
    "Tu sais toujours comment faire sentir quelqu'un spécial.",
    "Ta confiance en toi est admirable.",
    "Tu as une âme magnifique.",
    "Ta générosité est sans limites.",
    "Tu as un sens du détail impressionnant.",
    "Ta passion est vraiment motivante !",
    "Tu es un(e) auditeur/auditrice hors pair.",
    "Tu es plus fort(e) que tu ne le crois !",
    "Ton rire est contagieux.",
    "Tu as un don naturel pour faire sentir les autres valorisés.",
    "Tu rends le monde meilleur juste en y étant.",
    "Tu es une source d'inspiration pour moi.",
    "Ton énergie positive est communicative.",
    "Tu as un talent incroyable pour résoudre les problèmes.",
    "Ta bienveillance ne passe jamais inaperçue.",
    "Tu es quelqu'un sur qui on peut toujours compter.",
    "Ta présence rend tout meilleur.",
    "Tu as une force intérieure remarquable.",
    "Ton intelligence est impressionnante.",
    "Tu sais toujours trouver les bons mots.",
    "Ta bonne humeur est un vrai cadeau.",
    "Tu es exceptionnel(le), ne l'oublie jamais.",
    "Ta patience est admirable.",
    "Tu as un goût artistique incroyable.",
    "Tu es une personne authentique et précieuse.",
    "Ton courage force le respect.",
    "Tu sais transformer les problèmes en opportunités.",
    "Ta simplicité est ta plus grande force.",
    "Tu as un charisme naturel.",
    "Ta loyauté est rare et précieuse.",
    "Tu apportes toujours de la joie autour de toi.",
    "Tu es quelqu'un de vraiment inspirant.",
    "Ton honnêteté est admirable.",
    "Tu as toujours les mots justes pour réconforter.",
    "Ta détermination est impressionnante.",
    "Tu es une personne pleine de ressources.",
    "Ton empathie touche tout le monde autour de toi.",
    "Tu sais toujours voir le bon côté des choses.",
    "Ta joie de vivre est communicative.",
    "Tu as un talent pour rendre les gens heureux.",
    "Tu es une personne précieuse dans ma vie.",
    "Ta créativité m'impressionne à chaque fois.",
    "Tu as un sourire qui vaut de l'or.",
    "Ton optimisme est une vraie force.",
    "Tu sais motiver les autres sans effort.",
    "Tu es quelqu'un d'exceptionnellement attentionné.",
    "Ta présence apaise instantanément.",
    "Tu as un esprit brillant.",
    "Ta sincérité est une qualité rare.",
    "Tu sais toujours écouter sans juger.",
    "Ton humour illumine chaque conversation.",
    "Tu es une personne inspirante à bien des égards.",
    "Ta persévérance forcera toujours mon admiration.",
    "Tu as un talent pour rassembler les gens.",
    "Ta bonté n'a d'égal que ta modestie.",
    "Tu es quelqu'un d'incroyablement fiable.",
    "Ton énergie donne envie d'avancer.",
    "Tu as toujours su rester toi-même.",
    "Ta douceur apaise toutes les tensions.",
    "Tu es une personne pleine de surprises agréables.",
    "Ton regard sur la vie est inspirant.",
    "Tu sais transformer un mauvais jour en bon moment.",
    "Ta présence seule suffit à égayer une pièce.",
    "Tu as un talent inné pour rassurer les gens.",
    "Ta gentillesse est un exemple pour tous.",
    "Tu es quelqu'un d'admirable, tout simplement.",
    "Ton sourire a le pouvoir de tout arranger.",
    "Tu sais toujours donner le meilleur de toi-même.",
    "Ta bonne volonté ne passe jamais inaperçue.",
    "Tu es une personne rare et précieuse.",
    "Ta joie communicative fait du bien à tout le monde.",
    "Tu as une force tranquille qui inspire confiance.",
    "Ton sens de l'écoute est remarquable.",
    "Tu es quelqu'un de vraiment spécial.",
    "Ta manière d'être toi-même est inspirante.",
    "Tu apportes toujours une belle énergie.",
    "Tu es une personne qu'on n'oublie pas facilement.",
    "Ta bienveillance change vraiment la donne.",
    "Tu as un cœur immense.",
    "Tu illumines la vie de ceux qui t'entourent.",
    "Tu es tout simplement extraordinaire."
];

async function complimentCommand(sock, chatId, message) {
    try {
        if (!message || !chatId) {
            console.log('Invalid message or chatId:', { message, chatId });
            return;
        }

        let userToCompliment;

        // Check for mentioned users
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.participant;
        }

        if (!userToCompliment) {
            await sock.sendMessage(chatId, {
                text: 'Mentionne quelqu\'un ou réponds à son message pour lui faire un compliment !'
            });
            return;
        }

        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, {
            text: `Hé @${userToCompliment.split('@')[0]}, ${compliment}`,
            mentions: [userToCompliment]
        });
    } catch (error) {
        console.error('Error in compliment command:', error);
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
                    text: 'Une erreur est survenue lors de l\'envoi du compliment.'
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = { complimentCommand };
