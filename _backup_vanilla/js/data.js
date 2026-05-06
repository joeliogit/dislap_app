/* ============================================
   DISSLAPP — Data Store (Demo Data)
   ============================================ */

const AppData = {
    games: [
        // === NIVEL 1 — Explorador ===
        {
            id: 1,
            name: 'Letras Saltarinas',
            emoji: '🔤',
            description: 'Ordena las letras mezcladas para formar la palabra correcta.',
            skill: 'Conciencia fonológica',
            level: 1,
            stars: 2,
            maxStars: 3,
            recommended: true,
            locked: false,
            type: 'word-scramble'
        },
        {
            id: 2,
            name: 'El Espejo de Palabras',
            emoji: '🪞',
            description: 'Identifica si las dos palabras mostradas son iguales o diferentes.',
            skill: 'Discriminación visual',
            level: 1,
            stars: 3,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'word-compare'
        },
        {
            id: 3,
            name: 'Sonido Escondido',
            emoji: '👂',
            description: 'Escucha el sonido y selecciona la letra que corresponde al fonema.',
            skill: 'Conciencia fonológica',
            level: 1,
            stars: 1,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'phoneme-listen'
        },
        {
            id: 4,
            name: 'Parejas de Letras',
            emoji: '🃏',
            description: 'Encuentra las parejas de letras mayúsculas y minúsculas en el tablero.',
            skill: 'Discriminación visual',
            level: 1,
            stars: 2,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'letter-match'
        },
        {
            id: 5,
            name: 'Río de Vocales',
            emoji: '🌊',
            description: 'Atrapa las vocales correctas mientras fluyen por el río de letras.',
            skill: 'Conciencia fonológica',
            level: 1,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'vowel-catch'
        },

        // === NIVEL 2 — Aventurero ===
        {
            id: 6,
            name: 'Construye la Palabra',
            emoji: '🧩',
            description: 'Arrastra las sílabas en el orden correcto para formar la palabra.',
            skill: 'Decodificación',
            level: 2,
            stars: 1,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'syllable-build'
        },
        {
            id: 7,
            name: 'El Dado Mágico',
            emoji: '🎲',
            description: 'Lanza el dado y pronuncia el fonema que aparece.',
            skill: 'Conciencia fonémica',
            level: 2,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'phoneme-dice'
        },
        {
            id: 8,
            name: 'Colorea la Sílaba',
            emoji: '🎨',
            description: 'Identifica y selecciona las sílabas según su posición en la palabra.',
            skill: 'Segmentación silábica',
            level: 2,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'syllable-color'
        },
        {
            id: 9,
            name: 'Tren de Palabras',
            emoji: '🚂',
            description: 'Conecta los vagones del tren colocando las palabras en el orden correcto de la oración.',
            skill: 'Decodificación',
            level: 2,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'word-train'
        },
        {
            id: 10,
            name: 'Cazador de Sílabas',
            emoji: '🎯',
            description: 'Cuenta cuántas sílabas tiene cada palabra y selecciona la respuesta correcta.',
            skill: 'Segmentación silábica',
            level: 2,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: false,
            type: 'syllable-count'
        },

        // === NIVEL 3 — Constructor ===
        {
            id: 11,
            name: 'Rima y Encuentra',
            emoji: '🎵',
            description: 'Selecciona la palabra que rima con la palabra mostrada.',
            skill: 'Rima y fonología',
            level: 3,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'rhyme-match'
        },
        {
            id: 12,
            name: 'El Laberinto de Letras',
            emoji: '🏰',
            description: 'Navega el laberinto encontrando las letras en el orden correcto.',
            skill: 'Memoria y secuencia',
            level: 3,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'letter-maze'
        },
        {
            id: 13,
            name: 'Dictado Mágico',
            emoji: '✏️',
            description: 'Escucha la palabra dictada y escríbela correctamente antes de que se agote el tiempo.',
            skill: 'Escritura',
            level: 3,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'dictation'
        },
        {
            id: 14,
            name: 'Memoria de Palabras',
            emoji: '🧠',
            description: 'Memoriza las palabras que aparecen y luego selecciónalas en el orden correcto.',
            skill: 'Memoria y secuencia',
            level: 3,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'word-memory'
        },
        {
            id: 15,
            name: 'Completa la Frase',
            emoji: '📝',
            description: 'Elige la palabra correcta para completar la frase y que tenga sentido.',
            skill: 'Comprensión lectora',
            level: 3,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'sentence-fill'
        },
        {
            id: 16,
            name: 'Ritmo de Sílabas',
            emoji: '🥁',
            description: 'Sigue el ritmo y aplaude en cada sílaba de la palabra. ¡Siente el compás!',
            skill: 'Conciencia fonológica',
            level: 3,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'syllable-rhythm'
        },

        // === NIVEL 4 — Narrador ===
        {
            id: 17,
            name: 'Lectura Veloz',
            emoji: '⚡',
            description: 'Lee el párrafo y responde las preguntas de comprensión a tiempo.',
            skill: 'Comprensión lectora',
            level: 4,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'speed-reading'
        },
        {
            id: 18,
            name: 'El Detective de Errores',
            emoji: '🔍',
            description: 'Encuentra los errores ortográficos escondidos en el texto.',
            skill: 'Escritura',
            level: 4,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'error-find'
        },
        {
            id: 19,
            name: 'Cuenta Cuentos',
            emoji: '📖',
            description: 'Ordena las imágenes para reconstruir la secuencia correcta de la historia.',
            skill: 'Comprensión lectora',
            level: 4,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'story-order'
        },
        {
            id: 20,
            name: 'Palabras Escondidas',
            emoji: '🔎',
            description: 'Encuentra las palabras ocultas en la sopa de letras temática.',
            skill: 'Discriminación visual',
            level: 4,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'word-search'
        },

        // === NIVEL 5 — Maestro ===
        {
            id: 21,
            name: 'Escritor Creativo',
            emoji: '🖊️',
            description: 'Escribe una oración utilizando las tres palabras clave proporcionadas.',
            skill: 'Escritura',
            level: 5,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'creative-write'
        },
        {
            id: 22,
            name: 'Tribunal de Palabras',
            emoji: '⚖️',
            description: 'Decide si la palabra está bien escrita o tiene un error. ¡Sé el juez!',
            skill: 'Discriminación visual',
            level: 5,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'spell-judge'
        },
        {
            id: 23,
            name: 'Crucigrama Terapéutico',
            emoji: '📰',
            description: 'Resuelve el crucigrama con pistas de definiciones adaptadas a tu nivel.',
            skill: 'Decodificación',
            level: 5,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'crossword'
        },
        {
            id: 24,
            name: 'Lectura en Voz Alta',
            emoji: '🎙️',
            description: 'Lee el texto en voz alta. El sistema evalúa tu fluidez y pronunciación.',
            skill: 'Comprensión lectora',
            level: 5,
            stars: 0,
            maxStars: 3,
            recommended: false,
            locked: true,
            type: 'read-aloud'
        }
    ],

    levels: [
        {
            id: 1,
            name: 'Explorador',
            emoji: '🌱',
            description: 'Conciencia fonológica básica y discriminación visual',
            status: 'completed',
            progress: 100,
            gamesCount: 5,
            gamesCompleted: 5
        },
        {
            id: 2,
            name: 'Aventurero',
            emoji: '🌟',
            description: 'Decodificación y segmentación silábica',
            status: 'active',
            progress: 40,
            gamesCount: 5,
            gamesCompleted: 2
        },
        {
            id: 3,
            name: 'Constructor',
            emoji: '🚀',
            description: 'Rimas, memoria, escritura y comprensión',
            status: 'locked',
            progress: 0,
            gamesCount: 6,
            gamesCompleted: 0
        },
        {
            id: 4,
            name: 'Narrador',
            emoji: '🦁',
            description: 'Lectura veloz y comprensión avanzada',
            status: 'locked',
            progress: 0,
            gamesCount: 4,
            gamesCompleted: 0
        },
        {
            id: 5,
            name: 'Maestro',
            emoji: '🏆',
            description: 'Fluidez lectora, escritura creativa y dominio total',
            status: 'locked',
            progress: 0,
            gamesCount: 4,
            gamesCompleted: 0
        }
    ],

    achievements: [
        { id: 1, name: 'Primera Sesión', emoji: '🎉', desc: 'Completaste tu primera sesión', date: '15 Ene 2026', unlocked: true, category: 'primera-vez' },
        { id: 2, name: 'Juego Perfecto', emoji: '⭐', desc: 'Obtuviste 3 estrellas en un juego', date: '18 Ene 2026', unlocked: true, category: 'rendimiento' },
        { id: 3, name: 'Racha de 3 Días', emoji: '🔥', desc: 'Jugaste 3 días seguidos', date: '20 Ene 2026', unlocked: true, category: 'constancia' },
        { id: 4, name: 'Explorador Completo', emoji: '🗺️', desc: 'Completaste el Nivel 1', date: '10 Feb 2026', unlocked: true, category: 'primera-vez' },
        { id: 5, name: 'Racha de 7 Días', emoji: '💪', desc: 'Jugaste 7 días seguidos', date: '28 Feb 2026', unlocked: true, category: 'constancia' },
        { id: 6, name: 'Veloz como el Rayo', emoji: '⚡', desc: 'Completaste un juego en menos de 1 minuto', date: '5 Mar 2026', unlocked: true, category: 'rendimiento' },
        { id: 7, name: 'Racha de 30 Días', emoji: '🏆', desc: 'Jugaste 30 días seguidos', date: null, unlocked: false, category: 'constancia' },
        { id: 8, name: 'Maestro Constructor', emoji: '🧩', desc: 'Completa todos los juegos del Nivel 3', date: null, unlocked: false, category: 'primera-vez' },
        { id: 9, name: '5 Perfectos', emoji: '🌟', desc: '3 estrellas en 5 juegos diferentes', date: null, unlocked: false, category: 'rendimiento' },
        { id: 10, name: 'Explorador Total', emoji: '🧭', desc: 'Prueba todos los tipos de juego', date: null, unlocked: false, category: 'exploración' },
        { id: 11, name: 'MVP Semanal', emoji: '👑', desc: 'Asignado por tu psicólogo', date: null, unlocked: false, category: 'especial' },
        { id: 12, name: 'Narrador Experto', emoji: '📖', desc: 'Completa el Nivel 4', date: null, unlocked: false, category: 'primera-vez' }
    ],

    sessions: [
        { date: '2026-04-18', day: 18, month: 'Abr', title: 'Letras Saltarinas + El Espejo', games: 2, xp: 125 },
        { date: '2026-04-17', day: 17, month: 'Abr', title: 'Construye la Palabra', games: 1, xp: 75 },
        { date: '2026-04-16', day: 16, month: 'Abr', title: 'Letras Saltarinas', games: 1, xp: 100 },
        { date: '2026-04-15', day: 15, month: 'Abr', title: 'El Espejo + Dado Mágico', games: 2, xp: 150 },
        { date: '2026-04-14', day: 14, month: 'Abr', title: 'Colorea la Sílaba', games: 1, xp: 50 }
    ],

    weeklyXP: [
        { label: 'Lun', value: 80 },
        { label: 'Mar', value: 120 },
        { label: 'Mié', value: 60 },
        { label: 'Jue', value: 150 },
        { label: 'Vie', value: 100 },
        { label: 'Sáb', value: 40 },
        { label: 'Dom', value: 0 }
    ],

    skills: [
        { name: 'Fonología', percent: 78, color: 'purple' },
        { name: 'Visual', percent: 85, color: 'green' },
        { name: 'Decodificación', percent: 45, color: 'purple' },
        { name: 'Comprensión', percent: 20, color: 'green' },
        { name: 'Memoria', percent: 55, color: 'purple' }
    ],

    motivationalQuotes: [
        '¡Cada letra que aprendes es un superpoder nuevo! 💪',
        'Los errores son maestros disfrazados. ¡Sigue intentando! 🌟',
        'Tu cerebro es increíble, ¡y hoy lo demostrarás! 🧠',
        'Un paso a la vez, ¡y llegarás a la meta! 🏆',
        'Leer es como volar: ¡hoy estás más cerca de las nubes! ☁️',
        '¡Tú puedes! Cada día eres más fuerte y más sabio. 🦁'
    ],

    // Game logic data
    gameWords: {
        easy: ['GATO', 'CASA', 'LUNA', 'PELO', 'MESA', 'DADO', 'PATO', 'ROJO', 'AZUL', 'BOLA'],
        medium: ['LIBRO', 'PLAYA', 'TIGRE', 'FUEGO', 'CIELO', 'PIANO', 'ROBOT', 'NIEVE', 'FLORE', 'ARBOL'],
        hard: ['MARIPOSA', 'ELEFANTE', 'CHOCOLATE', 'CAMPANA', 'ESTRELLA', 'VENTANA']
    },

    wordPairs: [
        { word1: 'CASA', word2: 'CASA', same: true },
        { word1: 'BODA', word2: 'BOBA', same: false },
        { word1: 'LIBRO', word2: 'LIBRO', same: true },
        { word1: 'PERRO', word2: 'PERO', same: false },
        { word1: 'LUNA', word2: 'LUNA', same: true },
        { word1: 'DADO', word2: 'DEDO', same: false },
        { word1: 'MESA', word2: 'MESA', same: true },
        { word1: 'PATO', word2: 'GATO', same: false }
    ],

    syllableWords: [
        { word: 'MARIPOSA', syllables: ['MA', 'RI', 'PO', 'SA'] },
        { word: 'ELEFANTE', syllables: ['E', 'LE', 'FAN', 'TE'] },
        { word: 'CAMPANA', syllables: ['CAM', 'PA', 'NA'] },
        { word: 'PELOTA', syllables: ['PE', 'LO', 'TA'] },
        { word: 'VENTANA', syllables: ['VEN', 'TA', 'NA'] }
    ]
};
