import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', label: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', label: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
];

const resources = {
  en: {
    translation: {
      nav: {
        garden: 'My Garden',
        path: 'My Path',
        journal: 'Journal',
        doubts: 'Doubt Garden',
        feed: 'Community Feed',
        groups: 'Groups',
        leaderboard: 'Leaderboard',
        settings: 'Settings',
      },
      garden: {
        welcome: 'Welcome back',
        title: 'Your Garden',
        addHobby: '+ Add New Hobby',
        totalHobbies: 'Total hobbies',
        daysActive: 'Days active',
        tasksCompleted: 'Tasks completed',
        topBloom: 'Top bloom stage',
        continuePath: 'Continue Path →',
        daysActiveBadge: '{{count}} days active',
        plantFirst: 'Plant your first hobby 🌸',
        gardenWaiting: 'Your garden is waiting',
        gardenWaitingDesc: 'Plant your first hobby seed and watch it bloom into something beautiful.',
        growing: '{{count}} growing',
        addNewHobby: 'Add new hobby',
        aiPicksPerfect: 'AI picks the perfect one for you',
      },
      path: {
        title: 'My Path',
        subtitle: 'Learning Path 🗺️',
        bloomProbability: 'Bloom Probability',
        paceAI: 'Pace AI',
        overallProgress: '{{name}} Overall Progress',
        tasks: '{{done}}/{{total}} tasks',
        chapters: '{{count}} chapters generated',
        generateNext: '+ Generate next chapter',
        generating: '✨ Generating chapter {{num}}…',
        generatingPath: 'Generating your learning path…',
        generatingDesc: 'AI is building a personalised path for this hobby. This takes about 10 seconds.',
        markComplete: 'Mark Complete ✓',
        chapterReward: 'Chapter Reward: {{title}}',
        rewardUnlocked: '🎉 {{title}}',
        completeToUnlock: 'Complete all tasks to unlock this reward',
        proTip: 'Pro Tip',
        watchTutorials: 'Watch tutorials',
        hideTutorials: 'Hide tutorials',
        readArticles: '📖 Read articles →',
        communityChallenges: 'Community Challenges',
        realStruggles: 'Real struggles from real learners',
        postChallenge: '+ Post your challenge',
        commonIssue: '🔥 Common issue',
        pace: 'Pace: {{pace}}',
      },
      journal: {
        title: 'Your Journal 🌸',
        newEntry: '+ New Entry',
        saveEntry: 'Save Entry 📓',
        writeMode: '✍️ Write',
        typeMode: '⌨️ Type',
        convertToText: 'Convert to Text ✨',
        reading: 'Reading your handwriting... 🌸',
        stickers: 'Stickers',
        postPublicly: 'Post Publicly to community feed',
        entryTitle: 'Entry title…',
        writeFree: 'Write freely…',
        transcribedText: '✨ Converted text — edit before saving',
      },
      doubts: {
        title: 'Doubt Garden 🌿',
        askDoubt: 'Ask a Doubt',
        aiFirst: '✨ AI First Answer',
        postCommunity: 'Still need help? Post to community →',
        aiSays: '🤖 HobbyLily AI says:',
        communityAnswers: 'Community answers',
        postAnswer: 'Post Answer',
        shareExperience: 'Share your experience…',
        bestAnswer: '✓ Best Answer',
        thinking: 'Thinking…',
        cancel: 'Cancel',
      },
      settings: {
        title: 'Settings ⚙️',
        profile: 'Profile',
        appearance: 'Appearance',
        darkMode: 'Dark mode',
        darkModeDesc: 'Switch between light and dark garden themes',
        language: 'Language',
        languageDesc: 'Choose your preferred language',
        notifications: 'Notifications',
        dailyReminder: 'Daily reminder',
        weeklyInsights: 'Weekly insights',
        communityReactions: 'Community reactions',
        privacy: 'Privacy',
        journalPublic: 'Show my journal publicly by default',
        dangerZone: 'Danger zone',
        resetGarden: 'Reset my garden',
        save: 'Save',
        name: 'Name',
        email: 'Email',
        bio: 'Bio',
        bioPlaceholder: 'Tell the garden about yourself…',
      },
      common: {
        loading: 'Loading your garden…',
        cancel: 'Cancel',
        save: 'Save',
        post: 'Post',
        send: 'Send',
        back: '← Back',
        tryAgain: 'Try again',
        searchPlaceholder: 'Search hobbies, tasks, community…',
        signOut: 'Sign out',
        justNow: 'just now',
        bloomStages: {
          seed: 'Seed',
          sprout: 'Sprout',
          bud: 'Bud',
          bloom: 'Bloom',
          full_bloom: 'Full Bloom',
        },
      },
      community: {
        title: 'Community Feed',
        subtitle: 'No highlight reels. Just real progress.',
        postToGarden: 'Post to Garden 🌸',
        comments: 'Comments 💬',
        noComments: 'Be the first to leave an honest comment 🌱',
        writeComment: 'Write a comment…',
        messagePerson: 'Message {{name}}…',
        demoReply: '🌱 Thanks for the message! (This is a demo reply)',
      },
    },
  },
};

// ─── Hindi ───────────────────────────────────────────────────────────────────
resources.hi = { translation: {
  nav: { garden: 'मेरा बगीचा', path: 'मेरा पथ', journal: 'डायरी', doubts: 'संदेह बगीचा', feed: 'समुदाय', groups: 'समूह', leaderboard: 'लीडरबोर्ड', settings: 'सेटिंग्स' },
  garden: { welcome: 'वापस स्वागत है', title: 'आपका बगीचा', addHobby: '+ नया शौक जोड़ें', totalHobbies: 'कुल शौक', daysActive: 'सक्रिय दिन', tasksCompleted: 'पूर्ण कार्य', topBloom: 'शीर्ष खिलाव', continuePath: 'पथ जारी रखें →', daysActiveBadge: '{{count}} दिन सक्रिय', plantFirst: 'पहला शौक लगाएं 🌸', gardenWaiting: 'आपका बगीचा इंतजार कर रहा है', gardenWaitingDesc: 'अपना पहला शौक लगाएं और उसे खिलते देखें।', growing: '{{count}} बढ़ रहे हैं', addNewHobby: 'नया शौक जोड़ें', aiPicksPerfect: 'AI आपके लिए सही चुनेगा' },
  path: { title: 'मेरा पथ', subtitle: 'सीखने का पथ 🗺️', bloomProbability: 'खिलाव संभावना', paceAI: 'गति AI', overallProgress: '{{name}} कुल प्रगति', tasks: '{{done}}/{{total}} कार्य', chapters: '{{count}} अध्याय बने', generateNext: '+ अगला अध्याय बनाएं', generating: '✨ अध्याय {{num}} बन रहा है…', generatingPath: 'आपका सीखने का पथ बन रहा है…', generatingDesc: 'AI इस शौक के लिए पथ बना रहा है। इसमें लगभग 10 सेकंड लगेंगे।', markComplete: 'पूर्ण करें ✓', chapterReward: 'अध्याय पुरस्कार: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: 'पुरस्कार पाने के लिए सभी कार्य पूरे करें', proTip: 'प्रो टिप', watchTutorials: 'ट्यूटोरियल देखें', hideTutorials: 'ट्यूटोरियल छुपाएं', readArticles: '📖 लेख पढ़ें →', communityChallenges: 'समुदाय चुनौतियां', realStruggles: 'असली सीखने वालों की असली परेशानियां', postChallenge: '+ अपनी चुनौती पोस्ट करें', commonIssue: '🔥 सामान्य समस्या', pace: 'गति: {{pace}}' },
  journal: { title: 'आपकी डायरी 🌸', newEntry: '+ नई प्रविष्टि', saveEntry: 'सहेजें 📓', writeMode: '✍️ लिखें', typeMode: '⌨️ टाइप करें', convertToText: 'टेक्स्ट में बदलें ✨', reading: 'आपकी लिखावट पढ़ रहे हैं... 🌸', stickers: 'स्टिकर', postPublicly: 'समुदाय में सार्वजनिक करें', entryTitle: 'शीर्षक…', writeFree: 'स्वतंत्र रूप से लिखें…', transcribedText: '✨ परिवर्तित टेक्स्ट — सहेजने से पहले संपादित करें' },
  doubts: { title: 'संदेह बगीचा 🌿', askDoubt: 'संदेह पूछें', aiFirst: '✨ AI पहले जवाब दे', postCommunity: 'अभी भी मदद चाहिए? समुदाय में पोस्ट करें →', aiSays: '🤖 HobbyLily AI कहता है:', communityAnswers: 'समुदाय के जवाब', postAnswer: 'जवाब पोस्ट करें', shareExperience: 'अपना अनुभव साझा करें…', bestAnswer: '✓ सर्वश्रेष्ठ जवाब', thinking: 'सोच रहा है…', cancel: 'रद्द करें' },
  settings: { title: 'सेटिंग्स ⚙️', profile: 'प्रोफ़ाइल', appearance: 'दिखावट', darkMode: 'डार्क मोड', darkModeDesc: 'लाइट और डार्क थीम के बीच स्विच करें', language: 'भाषा', languageDesc: 'अपनी पसंदीदा भाषा चुनें', notifications: 'सूचनाएं', dailyReminder: 'दैनिक अनुस्मारक', weeklyInsights: 'साप्ताहिक अंतर्दृष्टि', communityReactions: 'समुदाय प्रतिक्रियाएं', privacy: 'गोपनीयता', journalPublic: 'डायरी डिफ़ॉल्ट रूप से सार्वजनिक करें', dangerZone: 'खतरा क्षेत्र', resetGarden: 'बगीचा रीसेट करें', save: 'सहेजें', name: 'नाम', email: 'ईमेल', bio: 'परिचय', bioPlaceholder: 'बगीचे को अपने बारे में बताएं…' },
  common: { loading: 'आपका बगीचा लोड हो रहा है…', cancel: 'रद्द करें', save: 'सहेजें', post: 'पोस्ट करें', send: 'भेजें', back: '← वापस', tryAgain: 'फिर कोशिश करें', searchPlaceholder: 'शौक, कार्य, समुदाय खोजें…', signOut: 'साइन आउट', justNow: 'अभी', bloomStages: { seed: 'बीज', sprout: 'अंकुर', bud: 'कली', bloom: 'खिलाव', full_bloom: 'पूर्ण खिलाव' } },
  community: { title: 'समुदाय फ़ीड', subtitle: 'कोई दिखावा नहीं। बस असली प्रगति।', postToGarden: 'बगीचे में पोस्ट करें 🌸', comments: 'टिप्पणियां 💬', noComments: 'पहली टिप्पणी करें 🌱', writeComment: 'टिप्पणी लिखें…', messagePerson: '{{name}} को संदेश…', demoReply: '🌱 संदेश के लिए धन्यवाद! (यह एक डेमो जवाब है)' },
}};

// ─── Spanish ─────────────────────────────────────────────────────────────────
resources.es = { translation: {
  nav: { garden: 'Mi Jardín', path: 'Mi Camino', journal: 'Diario', doubts: 'Jardín de Dudas', feed: 'Comunidad', groups: 'Grupos', leaderboard: 'Clasificación', settings: 'Ajustes' },
  garden: { welcome: 'Bienvenido de nuevo', title: 'Tu Jardín', addHobby: '+ Añadir Hobby', totalHobbies: 'Total hobbies', daysActive: 'Días activo', tasksCompleted: 'Tareas completadas', topBloom: 'Mejor floración', continuePath: 'Continuar Camino →', daysActiveBadge: '{{count}} días activo', plantFirst: 'Planta tu primer hobby 🌸', gardenWaiting: 'Tu jardín te espera', gardenWaitingDesc: 'Planta tu primera semilla y mírala florecer.', growing: '{{count}} creciendo', addNewHobby: 'Añadir nuevo hobby', aiPicksPerfect: 'La IA elige el perfecto para ti' },
  path: { title: 'Mi Camino', subtitle: 'Camino de Aprendizaje 🗺️', bloomProbability: 'Probabilidad de Floración', paceAI: 'IA de Ritmo', overallProgress: 'Progreso de {{name}}', tasks: '{{done}}/{{total}} tareas', chapters: '{{count}} capítulos generados', generateNext: '+ Generar siguiente capítulo', generating: '✨ Generando capítulo {{num}}…', generatingPath: 'Generando tu camino de aprendizaje…', generatingDesc: 'La IA está construyendo un camino personalizado. Tarda unos 10 segundos.', markComplete: 'Marcar Completo ✓', chapterReward: 'Recompensa del Capítulo: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: 'Completa todas las tareas para desbloquear', proTip: 'Consejo Pro', watchTutorials: 'Ver tutoriales', hideTutorials: 'Ocultar tutoriales', readArticles: '📖 Leer artículos →', communityChallenges: 'Desafíos de la Comunidad', realStruggles: 'Dificultades reales de aprendices reales', postChallenge: '+ Publicar tu desafío', commonIssue: '🔥 Problema común', pace: 'Ritmo: {{pace}}' },
  journal: { title: 'Tu Diario 🌸', newEntry: '+ Nueva Entrada', saveEntry: 'Guardar Entrada 📓', writeMode: '✍️ Escribir', typeMode: '⌨️ Teclear', convertToText: 'Convertir a Texto ✨', reading: 'Leyendo tu escritura... 🌸', stickers: 'Pegatinas', postPublicly: 'Publicar en la comunidad', entryTitle: 'Título de la entrada…', writeFree: 'Escribe libremente…', transcribedText: '✨ Texto convertido — edita antes de guardar' },
  doubts: { title: 'Jardín de Dudas 🌿', askDoubt: 'Hacer una Pregunta', aiFirst: '✨ Respuesta IA Primero', postCommunity: '¿Necesitas más ayuda? Publicar en comunidad →', aiSays: '🤖 HobbyLily IA dice:', communityAnswers: 'Respuestas de la comunidad', postAnswer: 'Publicar Respuesta', shareExperience: 'Comparte tu experiencia…', bestAnswer: '✓ Mejor Respuesta', thinking: 'Pensando…', cancel: 'Cancelar' },
  settings: { title: 'Ajustes ⚙️', profile: 'Perfil', appearance: 'Apariencia', darkMode: 'Modo oscuro', darkModeDesc: 'Cambiar entre temas claro y oscuro', language: 'Idioma', languageDesc: 'Elige tu idioma preferido', notifications: 'Notificaciones', dailyReminder: 'Recordatorio diario', weeklyInsights: 'Perspectivas semanales', communityReactions: 'Reacciones de la comunidad', privacy: 'Privacidad', journalPublic: 'Mostrar diario públicamente por defecto', dangerZone: 'Zona de peligro', resetGarden: 'Reiniciar jardín', save: 'Guardar', name: 'Nombre', email: 'Correo', bio: 'Bio', bioPlaceholder: 'Cuéntale al jardín sobre ti…' },
  common: { loading: 'Cargando tu jardín…', cancel: 'Cancelar', save: 'Guardar', post: 'Publicar', send: 'Enviar', back: '← Atrás', tryAgain: 'Intentar de nuevo', searchPlaceholder: 'Buscar hobbies, tareas, comunidad…', signOut: 'Cerrar sesión', justNow: 'ahora mismo', bloomStages: { seed: 'Semilla', sprout: 'Brote', bud: 'Capullo', bloom: 'Floración', full_bloom: 'Plena Floración' } },
  community: { title: 'Feed de la Comunidad', subtitle: 'Sin poses. Solo progreso real.', postToGarden: 'Publicar en el Jardín 🌸', comments: 'Comentarios 💬', noComments: 'Sé el primero en comentar 🌱', writeComment: 'Escribe un comentario…', messagePerson: 'Mensaje a {{name}}…', demoReply: '🌱 ¡Gracias por el mensaje! (Esta es una respuesta de demo)' },
}};

// ─── French ──────────────────────────────────────────────────────────────────
resources.fr = { translation: {
  nav: { garden: 'Mon Jardin', path: 'Mon Chemin', journal: 'Journal', doubts: 'Jardin des Doutes', feed: 'Communauté', groups: 'Groupes', leaderboard: 'Classement', settings: 'Paramètres' },
  garden: { welcome: 'Bon retour', title: 'Votre Jardin', addHobby: '+ Ajouter un Hobby', totalHobbies: 'Total hobbies', daysActive: 'Jours actifs', tasksCompleted: 'Tâches complétées', topBloom: 'Meilleure floraison', continuePath: 'Continuer le Chemin →', daysActiveBadge: '{{count}} jours actifs', plantFirst: 'Plantez votre premier hobby 🌸', gardenWaiting: 'Votre jardin vous attend', gardenWaitingDesc: 'Plantez votre première graine et regardez-la fleurir.', growing: '{{count}} en croissance', addNewHobby: 'Ajouter un hobby', aiPicksPerfect: "L'IA choisit le parfait pour vous" },
  path: { title: 'Mon Chemin', subtitle: "Chemin d'Apprentissage 🗺️", bloomProbability: 'Probabilité de Floraison', paceAI: 'IA de Rythme', overallProgress: 'Progression de {{name}}', tasks: '{{done}}/{{total}} tâches', chapters: '{{count}} chapitres générés', generateNext: '+ Générer le prochain chapitre', generating: '✨ Génération du chapitre {{num}}…', generatingPath: "Génération de votre chemin d'apprentissage…", generatingDesc: "L'IA construit un chemin personnalisé. Cela prend environ 10 secondes.", markComplete: 'Marquer Terminé ✓', chapterReward: 'Récompense du Chapitre: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: 'Complétez toutes les tâches pour débloquer', proTip: 'Conseil Pro', watchTutorials: 'Voir les tutoriels', hideTutorials: 'Masquer les tutoriels', readArticles: '📖 Lire les articles →', communityChallenges: 'Défis de la Communauté', realStruggles: 'Vraies difficultés de vrais apprenants', postChallenge: '+ Publier votre défi', commonIssue: '🔥 Problème courant', pace: 'Rythme: {{pace}}' },
  journal: { title: 'Votre Journal 🌸', newEntry: '+ Nouvelle Entrée', saveEntry: 'Sauvegarder 📓', writeMode: '✍️ Écrire', typeMode: '⌨️ Taper', convertToText: 'Convertir en Texte ✨', reading: 'Lecture de votre écriture... 🌸', stickers: 'Autocollants', postPublicly: 'Publier dans la communauté', entryTitle: "Titre de l'entrée…", writeFree: 'Écrivez librement…', transcribedText: '✨ Texte converti — modifiez avant de sauvegarder' },
  doubts: { title: 'Jardin des Doutes 🌿', askDoubt: 'Poser une Question', aiFirst: "✨ Réponse IA d'Abord", postCommunity: 'Besoin de plus? Publier dans la communauté →', aiSays: '🤖 HobbyLily IA dit:', communityAnswers: 'Réponses de la communauté', postAnswer: 'Publier la Réponse', shareExperience: 'Partagez votre expérience…', bestAnswer: '✓ Meilleure Réponse', thinking: 'Réflexion…', cancel: 'Annuler' },
  settings: { title: 'Paramètres ⚙️', profile: 'Profil', appearance: 'Apparence', darkMode: 'Mode sombre', darkModeDesc: 'Basculer entre les thèmes clair et sombre', language: 'Langue', languageDesc: 'Choisissez votre langue préférée', notifications: 'Notifications', dailyReminder: 'Rappel quotidien', weeklyInsights: 'Aperçus hebdomadaires', communityReactions: 'Réactions de la communauté', privacy: 'Confidentialité', journalPublic: 'Afficher le journal publiquement par défaut', dangerZone: 'Zone de danger', resetGarden: 'Réinitialiser le jardin', save: 'Sauvegarder', name: 'Nom', email: 'Email', bio: 'Bio', bioPlaceholder: 'Parlez de vous au jardin…' },
  common: { loading: 'Chargement de votre jardin…', cancel: 'Annuler', save: 'Sauvegarder', post: 'Publier', send: 'Envoyer', back: '← Retour', tryAgain: 'Réessayer', searchPlaceholder: 'Rechercher hobbies, tâches, communauté…', signOut: 'Se déconnecter', justNow: "à l'instant", bloomStages: { seed: 'Graine', sprout: 'Pousse', bud: 'Bourgeon', bloom: 'Floraison', full_bloom: 'Pleine Floraison' } },
  community: { title: 'Fil de la Communauté', subtitle: 'Pas de mise en scène. Juste du vrai progrès.', postToGarden: 'Publier dans le Jardin 🌸', comments: 'Commentaires 💬', noComments: 'Soyez le premier à commenter 🌱', writeComment: 'Écrire un commentaire…', messagePerson: 'Message à {{name}}…', demoReply: '🌱 Merci pour le message! (Ceci est une réponse de démo)' },
}};

// ─── German ──────────────────────────────────────────────────────────────────
resources.de = { translation: {
  nav: { garden: 'Mein Garten', path: 'Mein Pfad', journal: 'Tagebuch', doubts: 'Zweifelgarten', feed: 'Community', groups: 'Gruppen', leaderboard: 'Rangliste', settings: 'Einstellungen' },
  garden: { welcome: 'Willkommen zurück', title: 'Dein Garten', addHobby: '+ Hobby hinzufügen', totalHobbies: 'Hobbys gesamt', daysActive: 'Aktive Tage', tasksCompleted: 'Aufgaben erledigt', topBloom: 'Beste Blüte', continuePath: 'Pfad fortsetzen →', daysActiveBadge: '{{count}} Tage aktiv', plantFirst: 'Erstes Hobby pflanzen 🌸', gardenWaiting: 'Dein Garten wartet', gardenWaitingDesc: 'Pflanze dein erstes Hobby und sieh es erblühen.', growing: '{{count}} wachsen', addNewHobby: 'Neues Hobby hinzufügen', aiPicksPerfect: 'KI wählt das Perfekte für dich' },
  path: { title: 'Mein Pfad', subtitle: 'Lernpfad 🗺️', bloomProbability: 'Blütewahrscheinlichkeit', paceAI: 'Tempo-KI', overallProgress: '{{name}} Gesamtfortschritt', tasks: '{{done}}/{{total}} Aufgaben', chapters: '{{count}} Kapitel generiert', generateNext: '+ Nächstes Kapitel generieren', generating: '✨ Kapitel {{num}} wird generiert…', generatingPath: 'Dein Lernpfad wird generiert…', generatingDesc: 'KI erstellt einen personalisierten Pfad. Das dauert etwa 10 Sekunden.', markComplete: 'Als erledigt markieren ✓', chapterReward: 'Kapitelbelohnung: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: 'Alle Aufgaben erledigen zum Freischalten', proTip: 'Profi-Tipp', watchTutorials: 'Tutorials ansehen', hideTutorials: 'Tutorials ausblenden', readArticles: '📖 Artikel lesen →', communityChallenges: 'Community-Herausforderungen', realStruggles: 'Echte Kämpfe echter Lernender', postChallenge: '+ Herausforderung posten', commonIssue: '🔥 Häufiges Problem', pace: 'Tempo: {{pace}}' },
  journal: { title: 'Dein Tagebuch 🌸', newEntry: '+ Neuer Eintrag', saveEntry: 'Eintrag speichern 📓', writeMode: '✍️ Schreiben', typeMode: '⌨️ Tippen', convertToText: 'In Text umwandeln ✨', reading: 'Handschrift wird gelesen... 🌸', stickers: 'Aufkleber', postPublicly: 'Öffentlich in der Community posten', entryTitle: 'Eintragstitel…', writeFree: 'Schreib frei…', transcribedText: '✨ Umgewandelter Text — vor dem Speichern bearbeiten' },
  doubts: { title: 'Zweifelgarten 🌿', askDoubt: 'Frage stellen', aiFirst: '✨ KI-Antwort zuerst', postCommunity: 'Noch Hilfe nötig? In Community posten →', aiSays: '🤖 HobbyLily KI sagt:', communityAnswers: 'Community-Antworten', postAnswer: 'Antwort posten', shareExperience: 'Erfahrung teilen…', bestAnswer: '✓ Beste Antwort', thinking: 'Denkt nach…', cancel: 'Abbrechen' },
  settings: { title: 'Einstellungen ⚙️', profile: 'Profil', appearance: 'Erscheinungsbild', darkMode: 'Dunkelmodus', darkModeDesc: 'Zwischen hellem und dunklem Thema wechseln', language: 'Sprache', languageDesc: 'Bevorzugte Sprache wählen', notifications: 'Benachrichtigungen', dailyReminder: 'Tägliche Erinnerung', weeklyInsights: 'Wöchentliche Einblicke', communityReactions: 'Community-Reaktionen', privacy: 'Datenschutz', journalPublic: 'Tagebuch standardmäßig öffentlich zeigen', dangerZone: 'Gefahrenzone', resetGarden: 'Garten zurücksetzen', save: 'Speichern', name: 'Name', email: 'E-Mail', bio: 'Bio', bioPlaceholder: 'Erzähl dem Garten von dir…' },
  common: { loading: 'Dein Garten wird geladen…', cancel: 'Abbrechen', save: 'Speichern', post: 'Posten', send: 'Senden', back: '← Zurück', tryAgain: 'Erneut versuchen', searchPlaceholder: 'Hobbys, Aufgaben, Community suchen…', signOut: 'Abmelden', justNow: 'gerade eben', bloomStages: { seed: 'Samen', sprout: 'Sprössling', bud: 'Knospe', bloom: 'Blüte', full_bloom: 'Volle Blüte' } },
  community: { title: 'Community-Feed', subtitle: 'Kein Hochglanz. Nur echter Fortschritt.', postToGarden: 'Im Garten posten 🌸', comments: 'Kommentare 💬', noComments: 'Sei der Erste, der kommentiert 🌱', writeComment: 'Kommentar schreiben…', messagePerson: 'Nachricht an {{name}}…', demoReply: '🌱 Danke für die Nachricht! (Dies ist eine Demo-Antwort)' },
}};

// ─── Japanese ────────────────────────────────────────────────────────────────
resources.ja = { translation: {
  nav: { garden: 'マイガーデン', path: 'マイパス', journal: 'ジャーナル', doubts: '疑問の庭', feed: 'コミュニティ', groups: 'グループ', leaderboard: 'リーダーボード', settings: '設定' },
  garden: { welcome: 'おかえりなさい', title: 'あなたの庭', addHobby: '+ 趣味を追加', totalHobbies: '趣味の合計', daysActive: 'アクティブ日数', tasksCompleted: '完了タスク', topBloom: 'トップブルーム', continuePath: 'パスを続ける →', daysActiveBadge: '{{count}}日アクティブ', plantFirst: '最初の趣味を植える 🌸', gardenWaiting: 'あなたの庭が待っています', gardenWaitingDesc: '最初の趣味の種を植えて、咲くのを見守りましょう。', growing: '{{count}}個成長中', addNewHobby: '新しい趣味を追加', aiPicksPerfect: 'AIがあなたに最適なものを選びます' },
  path: { title: 'マイパス', subtitle: '学習パス 🗺️', bloomProbability: 'ブルーム確率', paceAI: 'ペースAI', overallProgress: '{{name}}の全体進捗', tasks: '{{done}}/{{total}}タスク', chapters: '{{count}}章生成済み', generateNext: '+ 次の章を生成', generating: '✨ 第{{num}}章を生成中…', generatingPath: '学習パスを生成中…', generatingDesc: 'AIがこの趣味のパスを構築しています。約10秒かかります。', markComplete: '完了にする ✓', chapterReward: '章の報酬: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: 'すべてのタスクを完了して報酬を解除', proTip: 'プロのヒント', watchTutorials: 'チュートリアルを見る', hideTutorials: 'チュートリアルを隠す', readArticles: '📖 記事を読む →', communityChallenges: 'コミュニティチャレンジ', realStruggles: '本物の学習者の本物の悩み', postChallenge: '+ チャレンジを投稿', commonIssue: '🔥 よくある問題', pace: 'ペース: {{pace}}' },
  journal: { title: 'あなたのジャーナル 🌸', newEntry: '+ 新しいエントリ', saveEntry: 'エントリを保存 📓', writeMode: '✍️ 書く', typeMode: '⌨️ タイプ', convertToText: 'テキストに変換 ✨', reading: '手書きを読んでいます... 🌸', stickers: 'ステッカー', postPublicly: 'コミュニティに公開投稿', entryTitle: 'タイトル…', writeFree: '自由に書いてください…', transcribedText: '✨ 変換されたテキスト — 保存前に編集' },
  doubts: { title: '疑問の庭 🌿', askDoubt: '質問する', aiFirst: '✨ AIが最初に回答', postCommunity: 'まだ助けが必要? コミュニティに投稿 →', aiSays: '🤖 HobbyLily AIが言います:', communityAnswers: 'コミュニティの回答', postAnswer: '回答を投稿', shareExperience: '経験を共有…', bestAnswer: '✓ ベストアンサー', thinking: '考え中…', cancel: 'キャンセル' },
  settings: { title: '設定 ⚙️', profile: 'プロフィール', appearance: '外観', darkMode: 'ダークモード', darkModeDesc: 'ライトとダークテーマを切り替え', language: '言語', languageDesc: '希望の言語を選択', notifications: '通知', dailyReminder: '毎日のリマインダー', weeklyInsights: '週次インサイト', communityReactions: 'コミュニティリアクション', privacy: 'プライバシー', journalPublic: 'デフォルトでジャーナルを公開', dangerZone: '危険ゾーン', resetGarden: '庭をリセット', save: '保存', name: '名前', email: 'メール', bio: '自己紹介', bioPlaceholder: '庭に自己紹介してください…' },
  common: { loading: '庭を読み込み中…', cancel: 'キャンセル', save: '保存', post: '投稿', send: '送信', back: '← 戻る', tryAgain: 'もう一度試す', searchPlaceholder: '趣味、タスク、コミュニティを検索…', signOut: 'サインアウト', justNow: 'たった今', bloomStages: { seed: '種', sprout: '芽', bud: 'つぼみ', bloom: '開花', full_bloom: '満開' } },
  community: { title: 'コミュニティフィード', subtitle: 'ハイライトなし。本物の進歩だけ。', postToGarden: '庭に投稿 🌸', comments: 'コメント 💬', noComments: '最初にコメントしてください 🌱', writeComment: 'コメントを書く…', messagePerson: '{{name}}へのメッセージ…', demoReply: '🌱 メッセージありがとう！（これはデモの返信です）' },
}};

// ─── Chinese ─────────────────────────────────────────────────────────────────
resources.zh = { translation: {
  nav: { garden: '我的花园', path: '我的路径', journal: '日记', doubts: '疑问花园', feed: '社区', groups: '群组', leaderboard: '排行榜', settings: '设置' },
  garden: { welcome: '欢迎回来', title: '你的花园', addHobby: '+ 添加爱好', totalHobbies: '爱好总数', daysActive: '活跃天数', tasksCompleted: '已完成任务', topBloom: '最高开花阶段', continuePath: '继续路径 →', daysActiveBadge: '活跃{{count}}天', plantFirst: '种下你的第一个爱好 🌸', gardenWaiting: '你的花园在等待', gardenWaitingDesc: '种下你的第一颗种子，看它绽放。', growing: '{{count}}个成长中', addNewHobby: '添加新爱好', aiPicksPerfect: 'AI为你选择最完美的' },
  path: { title: '我的路径', subtitle: '学习路径 🗺️', bloomProbability: '开花概率', paceAI: '节奏AI', overallProgress: '{{name}}总体进度', tasks: '{{done}}/{{total}}任务', chapters: '已生成{{count}}章', generateNext: '+ 生成下一章', generating: '✨ 正在生成第{{num}}章…', generatingPath: '正在生成你的学习路径…', generatingDesc: 'AI正在为这个爱好构建个性化路径，大约需要10秒。', markComplete: '标记完成 ✓', chapterReward: '章节奖励: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: '完成所有任务以解锁奖励', proTip: '专业提示', watchTutorials: '观看教程', hideTutorials: '隐藏教程', readArticles: '📖 阅读文章 →', communityChallenges: '社区挑战', realStruggles: '真实学习者的真实困难', postChallenge: '+ 发布你的挑战', commonIssue: '🔥 常见问题', pace: '节奏: {{pace}}' },
  journal: { title: '你的日记 🌸', newEntry: '+ 新条目', saveEntry: '保存条目 📓', writeMode: '✍️ 书写', typeMode: '⌨️ 打字', convertToText: '转换为文字 ✨', reading: '正在读取你的手写…🌸', stickers: '贴纸', postPublicly: '公开发布到社区', entryTitle: '条目标题…', writeFree: '自由书写…', transcribedText: '✨ 转换文字 — 保存前可编辑' },
  doubts: { title: '疑问花园 🌿', askDoubt: '提问', aiFirst: '✨ AI先回答', postCommunity: '还需要帮助？发布到社区 →', aiSays: '🤖 HobbyLily AI说:', communityAnswers: '社区回答', postAnswer: '发布回答', shareExperience: '分享你的经验…', bestAnswer: '✓ 最佳回答', thinking: '思考中…', cancel: '取消' },
  settings: { title: '设置 ⚙️', profile: '个人资料', appearance: '外观', darkMode: '深色模式', darkModeDesc: '在浅色和深色主题之间切换', language: '语言', languageDesc: '选择你的首选语言', notifications: '通知', dailyReminder: '每日提醒', weeklyInsights: '每周洞察', communityReactions: '社区反应', privacy: '隐私', journalPublic: '默认公开显示日记', dangerZone: '危险区域', resetGarden: '重置花园', save: '保存', name: '姓名', email: '邮箱', bio: '简介', bioPlaceholder: '向花园介绍你自己…' },
  common: { loading: '正在加载你的花园…', cancel: '取消', save: '保存', post: '发布', send: '发送', back: '← 返回', tryAgain: '再试一次', searchPlaceholder: '搜索爱好、任务、社区…', signOut: '退出登录', justNow: '刚刚', bloomStages: { seed: '种子', sprout: '嫩芽', bud: '花蕾', bloom: '开花', full_bloom: '盛开' } },
  community: { title: '社区动态', subtitle: '没有精彩集锦，只有真实进步。', postToGarden: '发布到花园 🌸', comments: '评论 💬', noComments: '成为第一个评论的人 🌱', writeComment: '写评论…', messagePerson: '给{{name}}发消息…', demoReply: '🌱 感谢你的消息！（这是演示回复）' },
}};

// ─── Arabic ──────────────────────────────────────────────────────────────────
resources.ar = { translation: {
  nav: { garden: 'حديقتي', path: 'مساري', journal: 'مذكرتي', doubts: 'حديقة الشكوك', feed: 'المجتمع', groups: 'المجموعات', leaderboard: 'لوحة المتصدرين', settings: 'الإعدادات' },
  garden: { welcome: 'مرحباً بعودتك', title: 'حديقتك', addHobby: '+ إضافة هواية', totalHobbies: 'إجمالي الهوايات', daysActive: 'أيام النشاط', tasksCompleted: 'المهام المكتملة', topBloom: 'أعلى مرحلة تفتح', continuePath: 'متابعة المسار ←', daysActiveBadge: '{{count}} أيام نشطة', plantFirst: 'ازرع هوايتك الأولى 🌸', gardenWaiting: 'حديقتك تنتظرك', gardenWaitingDesc: 'ازرع بذرتك الأولى وشاهدها تتفتح.', growing: '{{count}} تنمو', addNewHobby: 'إضافة هواية جديدة', aiPicksPerfect: 'الذكاء الاصطناعي يختار المثالية لك' },
  path: { title: 'مساري', subtitle: 'مسار التعلم 🗺️', bloomProbability: 'احتمالية التفتح', paceAI: 'ذكاء الإيقاع', overallProgress: 'التقدم الكلي لـ{{name}}', tasks: '{{done}}/{{total}} مهام', chapters: '{{count}} فصول مُنشأة', generateNext: '+ إنشاء الفصل التالي', generating: '✨ جارٍ إنشاء الفصل {{num}}…', generatingPath: 'جارٍ إنشاء مسار التعلم…', generatingDesc: 'الذكاء الاصطناعي يبني مساراً مخصصاً. يستغرق حوالي 10 ثوانٍ.', markComplete: 'تحديد كمكتمل ✓', chapterReward: 'مكافأة الفصل: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: 'أكمل جميع المهام لفتح المكافأة', proTip: 'نصيحة احترافية', watchTutorials: 'مشاهدة الدروس', hideTutorials: 'إخفاء الدروس', readArticles: '📖 قراءة المقالات ←', communityChallenges: 'تحديات المجتمع', realStruggles: 'صعوبات حقيقية من متعلمين حقيقيين', postChallenge: '+ نشر تحديك', commonIssue: '🔥 مشكلة شائعة', pace: 'الإيقاع: {{pace}}' },
  journal: { title: 'مذكرتك 🌸', newEntry: '+ إدخال جديد', saveEntry: 'حفظ الإدخال 📓', writeMode: '✍️ كتابة', typeMode: '⌨️ طباعة', convertToText: 'تحويل إلى نص ✨', reading: 'جارٍ قراءة خطك... 🌸', stickers: 'ملصقات', postPublicly: 'نشر علناً في المجتمع', entryTitle: 'عنوان الإدخال…', writeFree: 'اكتب بحرية…', transcribedText: '✨ النص المحوّل — عدّل قبل الحفظ' },
  doubts: { title: 'حديقة الشكوك 🌿', askDoubt: 'طرح سؤال', aiFirst: '✨ إجابة الذكاء الاصطناعي أولاً', postCommunity: 'تحتاج مزيداً من المساعدة؟ انشر في المجتمع ←', aiSays: '🤖 HobbyLily AI يقول:', communityAnswers: 'إجابات المجتمع', postAnswer: 'نشر الإجابة', shareExperience: 'شارك تجربتك…', bestAnswer: '✓ أفضل إجابة', thinking: 'يفكر…', cancel: 'إلغاء' },
  settings: { title: 'الإعدادات ⚙️', profile: 'الملف الشخصي', appearance: 'المظهر', darkMode: 'الوضع الداكن', darkModeDesc: 'التبديل بين السمات الفاتحة والداكنة', language: 'اللغة', languageDesc: 'اختر لغتك المفضلة', notifications: 'الإشعارات', dailyReminder: 'تذكير يومي', weeklyInsights: 'رؤى أسبوعية', communityReactions: 'تفاعلات المجتمع', privacy: 'الخصوصية', journalPublic: 'عرض المذكرة علناً بشكل افتراضي', dangerZone: 'منطقة الخطر', resetGarden: 'إعادة تعيين الحديقة', save: 'حفظ', name: 'الاسم', email: 'البريد الإلكتروني', bio: 'نبذة', bioPlaceholder: 'أخبر الحديقة عن نفسك…' },
  common: { loading: 'جارٍ تحميل حديقتك…', cancel: 'إلغاء', save: 'حفظ', post: 'نشر', send: 'إرسال', back: '← رجوع', tryAgain: 'حاول مجدداً', searchPlaceholder: 'ابحث عن هوايات، مهام، مجتمع…', signOut: 'تسجيل الخروج', justNow: 'الآن', bloomStages: { seed: 'بذرة', sprout: 'برعم', bud: 'كُمّة', bloom: 'تفتح', full_bloom: 'تفتح كامل' } },
  community: { title: 'تغذية المجتمع', subtitle: 'لا مقاطع مميزة. فقط تقدم حقيقي.', postToGarden: 'نشر في الحديقة 🌸', comments: 'التعليقات 💬', noComments: 'كن أول من يعلق 🌱', writeComment: 'اكتب تعليقاً…', messagePerson: 'رسالة إلى {{name}}…', demoReply: '🌱 شكراً على رسالتك! (هذا رد تجريبي)' },
}};

// ─── Portuguese ──────────────────────────────────────────────────────────────
resources.pt = { translation: {
  nav: { garden: 'Meu Jardim', path: 'Meu Caminho', journal: 'Diário', doubts: 'Jardim de Dúvidas', feed: 'Comunidade', groups: 'Grupos', leaderboard: 'Classificação', settings: 'Configurações' },
  garden: { welcome: 'Bem-vindo de volta', title: 'Seu Jardim', addHobby: '+ Adicionar Hobby', totalHobbies: 'Total de hobbies', daysActive: 'Dias ativos', tasksCompleted: 'Tarefas concluídas', topBloom: 'Melhor floração', continuePath: 'Continuar Caminho →', daysActiveBadge: '{{count}} dias ativo', plantFirst: 'Plante seu primeiro hobby 🌸', gardenWaiting: 'Seu jardim está esperando', gardenWaitingDesc: 'Plante sua primeira semente e veja-a florescer.', growing: '{{count}} crescendo', addNewHobby: 'Adicionar novo hobby', aiPicksPerfect: 'A IA escolhe o perfeito para você' },
  path: { title: 'Meu Caminho', subtitle: 'Caminho de Aprendizado 🗺️', bloomProbability: 'Probabilidade de Floração', paceAI: 'IA de Ritmo', overallProgress: 'Progresso de {{name}}', tasks: '{{done}}/{{total}} tarefas', chapters: '{{count}} capítulos gerados', generateNext: '+ Gerar próximo capítulo', generating: '✨ Gerando capítulo {{num}}…', generatingPath: 'Gerando seu caminho de aprendizado…', generatingDesc: 'A IA está construindo um caminho personalizado. Leva cerca de 10 segundos.', markComplete: 'Marcar Concluído ✓', chapterReward: 'Recompensa do Capítulo: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: 'Complete todas as tarefas para desbloquear', proTip: 'Dica Pro', watchTutorials: 'Ver tutoriais', hideTutorials: 'Ocultar tutoriais', readArticles: '📖 Ler artigos →', communityChallenges: 'Desafios da Comunidade', realStruggles: 'Dificuldades reais de aprendizes reais', postChallenge: '+ Publicar seu desafio', commonIssue: '🔥 Problema comum', pace: 'Ritmo: {{pace}}' },
  journal: { title: 'Seu Diário 🌸', newEntry: '+ Nova Entrada', saveEntry: 'Salvar Entrada 📓', writeMode: '✍️ Escrever', typeMode: '⌨️ Digitar', convertToText: 'Converter em Texto ✨', reading: 'Lendo sua escrita... 🌸', stickers: 'Adesivos', postPublicly: 'Publicar na comunidade', entryTitle: 'Título da entrada…', writeFree: 'Escreva livremente…', transcribedText: '✨ Texto convertido — edite antes de salvar' },
  doubts: { title: 'Jardim de Dúvidas 🌿', askDoubt: 'Fazer uma Pergunta', aiFirst: '✨ Resposta da IA Primeiro', postCommunity: 'Precisa de mais ajuda? Publicar na comunidade →', aiSays: '🤖 HobbyLily IA diz:', communityAnswers: 'Respostas da comunidade', postAnswer: 'Publicar Resposta', shareExperience: 'Compartilhe sua experiência…', bestAnswer: '✓ Melhor Resposta', thinking: 'Pensando…', cancel: 'Cancelar' },
  settings: { title: 'Configurações ⚙️', profile: 'Perfil', appearance: 'Aparência', darkMode: 'Modo escuro', darkModeDesc: 'Alternar entre temas claro e escuro', language: 'Idioma', languageDesc: 'Escolha seu idioma preferido', notifications: 'Notificações', dailyReminder: 'Lembrete diário', weeklyInsights: 'Insights semanais', communityReactions: 'Reações da comunidade', privacy: 'Privacidade', journalPublic: 'Mostrar diário publicamente por padrão', dangerZone: 'Zona de perigo', resetGarden: 'Redefinir jardim', save: 'Salvar', name: 'Nome', email: 'Email', bio: 'Bio', bioPlaceholder: 'Conte ao jardim sobre você…' },
  common: { loading: 'Carregando seu jardim…', cancel: 'Cancelar', save: 'Salvar', post: 'Publicar', send: 'Enviar', back: '← Voltar', tryAgain: 'Tentar novamente', searchPlaceholder: 'Pesquisar hobbies, tarefas, comunidade…', signOut: 'Sair', justNow: 'agora mesmo', bloomStages: { seed: 'Semente', sprout: 'Broto', bud: 'Botão', bloom: 'Floração', full_bloom: 'Plena Floração' } },
  community: { title: 'Feed da Comunidade', subtitle: 'Sem destaques. Só progresso real.', postToGarden: 'Publicar no Jardim 🌸', comments: 'Comentários 💬', noComments: 'Seja o primeiro a comentar 🌱', writeComment: 'Escreva um comentário…', messagePerson: 'Mensagem para {{name}}…', demoReply: '🌱 Obrigado pela mensagem! (Esta é uma resposta de demonstração)' },
}};

// ─── Korean ──────────────────────────────────────────────────────────────────
resources.ko = { translation: {
  nav: { garden: '내 정원', path: '내 경로', journal: '일기', doubts: '의심 정원', feed: '커뮤니티', groups: '그룹', leaderboard: '리더보드', settings: '설정' },
  garden: { welcome: '다시 오신 것을 환영합니다', title: '당신의 정원', addHobby: '+ 취미 추가', totalHobbies: '총 취미', daysActive: '활동 일수', tasksCompleted: '완료된 작업', topBloom: '최고 개화 단계', continuePath: '경로 계속하기 →', daysActiveBadge: '{{count}}일 활동', plantFirst: '첫 번째 취미를 심으세요 🌸', gardenWaiting: '당신의 정원이 기다리고 있어요', gardenWaitingDesc: '첫 번째 취미 씨앗을 심고 꽃피는 것을 지켜보세요.', growing: '{{count}}개 성장 중', addNewHobby: '새 취미 추가', aiPicksPerfect: 'AI가 당신에게 완벽한 것을 선택합니다' },
  path: { title: '내 경로', subtitle: '학습 경로 🗺️', bloomProbability: '개화 확률', paceAI: '페이스 AI', overallProgress: '{{name}} 전체 진행률', tasks: '{{done}}/{{total}} 작업', chapters: '{{count}}개 챕터 생성됨', generateNext: '+ 다음 챕터 생성', generating: '✨ {{num}}번 챕터 생성 중…', generatingPath: '학습 경로를 생성하는 중…', generatingDesc: 'AI가 이 취미를 위한 맞춤 경로를 구축하고 있습니다. 약 10초 걸립니다.', markComplete: '완료로 표시 ✓', chapterReward: '챕터 보상: {{title}}', rewardUnlocked: '🎉 {{title}}', completeToUnlock: '보상을 잠금 해제하려면 모든 작업을 완료하세요', proTip: '프로 팁', watchTutorials: '튜토리얼 보기', hideTutorials: '튜토리얼 숨기기', readArticles: '📖 기사 읽기 →', communityChallenges: '커뮤니티 챌린지', realStruggles: '실제 학습자의 실제 어려움', postChallenge: '+ 챌린지 게시', commonIssue: '🔥 일반적인 문제', pace: '페이스: {{pace}}' },
  journal: { title: '당신의 일기 🌸', newEntry: '+ 새 항목', saveEntry: '항목 저장 📓', writeMode: '✍️ 쓰기', typeMode: '⌨️ 타이핑', convertToText: '텍스트로 변환 ✨', reading: '필기를 읽는 중... 🌸', stickers: '스티커', postPublicly: '커뮤니티에 공개 게시', entryTitle: '항목 제목…', writeFree: '자유롭게 쓰세요…', transcribedText: '✨ 변환된 텍스트 — 저장 전에 편집하세요' },
  doubts: { title: '의심 정원 🌿', askDoubt: '질문하기', aiFirst: '✨ AI 먼저 답변', postCommunity: '더 도움이 필요하신가요? 커뮤니티에 게시 →', aiSays: '🤖 HobbyLily AI 말합니다:', communityAnswers: '커뮤니티 답변', postAnswer: '답변 게시', shareExperience: '경험을 공유하세요…', bestAnswer: '✓ 최고의 답변', thinking: '생각 중…', cancel: '취소' },
  settings: { title: '설정 ⚙️', profile: '프로필', appearance: '외관', darkMode: '다크 모드', darkModeDesc: '밝은 테마와 어두운 테마 사이를 전환', language: '언어', languageDesc: '선호하는 언어를 선택하세요', notifications: '알림', dailyReminder: '일일 알림', weeklyInsights: '주간 인사이트', communityReactions: '커뮤니티 반응', privacy: '개인정보', journalPublic: '기본적으로 일기를 공개로 표시', dangerZone: '위험 구역', resetGarden: '정원 초기화', save: '저장', name: '이름', email: '이메일', bio: '소개', bioPlaceholder: '정원에 자신을 소개하세요…' },
  common: { loading: '정원을 불러오는 중…', cancel: '취소', save: '저장', post: '게시', send: '보내기', back: '← 뒤로', tryAgain: '다시 시도', searchPlaceholder: '취미, 작업, 커뮤니티 검색…', signOut: '로그아웃', justNow: '방금', bloomStages: { seed: '씨앗', sprout: '새싹', bud: '꽃봉오리', bloom: '개화', full_bloom: '만개' } },
  community: { title: '커뮤니티 피드', subtitle: '하이라이트 없음. 진짜 진전만.', postToGarden: '정원에 게시 🌸', comments: '댓글 💬', noComments: '첫 번째로 댓글을 남기세요 🌱', writeComment: '댓글 작성…', messagePerson: '{{name}}에게 메시지…', demoReply: '🌱 메시지 감사합니다! (데모 답변입니다)' },
}};

// ─── Init ─────────────────────────────────────────────────────────────────────
const savedLang = localStorage.getItem('hl_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
