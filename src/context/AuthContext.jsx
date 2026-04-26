/* ============================================
   DISSLAPP — Auth Context (React)
   ============================================ */

import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authAPI, gamesAPI, paymentsAPI } from '../services/api';

export const AuthContext = createContext(null);

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const TIER_SIZE = 5;

const PLAN_TIERS = { free: 1, pro: 3, premium: 5 };

const ALL_GAMES = [
  // Tier 1 (initially unlocked)
  { id: 1,  name: 'Letras Saltarinas',     emoji: '🔤', description: 'Ordena las letras mezcladas para formar la palabra correcta.',          skill: 'Conciencia fonológica', level: 1, maxStars: 3, recommended: true,  type: 'word-scramble' },
  { id: 2,  name: 'El Espejo de Palabras', emoji: '🪞', description: 'Identifica si las dos palabras mostradas son iguales o diferentes.',   skill: 'Discriminación visual', level: 1, maxStars: 3, recommended: false, type: 'word-compare' },
  { id: 3,  name: 'Construye la Palabra',  emoji: '🧩', description: 'Arrastra las sílabas en el orden correcto para formar la palabra.',    skill: 'Decodificación',         level: 1, maxStars: 3, recommended: false, type: 'syllable-build' },
  { id: 4,  name: 'El Dado Mágico',        emoji: '🎲', description: 'Lanza el dado y encuentra palabras que empiezan con ese fonema.',      skill: 'Conciencia fonémica',   level: 1, maxStars: 3, recommended: false, type: 'phoneme-dice' },
  { id: 5,  name: 'Colorea la Sílaba',     emoji: '🎨', description: 'Identifica la sílaba correcta según su posición en la palabra.',       skill: 'Segmentación silábica', level: 1, maxStars: 3, recommended: false, type: 'syllable-color' },
  // Tier 2
  { id: 6,  name: 'Rima y Encuentra',      emoji: '🎵', description: 'Selecciona la imagen que rima con la palabra mostrada.',              skill: 'Rima y fonología',      level: 2, maxStars: 3, recommended: false, type: 'generic' },
  { id: 7,  name: 'El Laberinto de Letras',emoji: '🏰', description: 'Navega el laberinto encontrando las letras en el orden correcto.',    skill: 'Memoria y secuencia',   level: 2, maxStars: 3, recommended: false, type: 'generic' },
  { id: 8,  name: 'Palabras Escondidas',   emoji: '🔍', description: 'Encuentra las palabras ocultas en la sopa de letras.',               skill: 'Reconocimiento visual', level: 2, maxStars: 3, recommended: false, type: 'generic' },
  { id: 9,  name: 'La Cadena de Sílabas',  emoji: '🔗', description: 'Encadena sílabas para formar palabras completas.',                   skill: 'Segmentación silábica', level: 2, maxStars: 3, recommended: false, type: 'generic' },
  { id: 10, name: 'El Contador de Sonidos',emoji: '🎤', description: 'Cuenta cuántos sonidos tiene cada palabra.',                         skill: 'Conciencia fonémica',   level: 2, maxStars: 3, recommended: false, type: 'generic' },
  // Tier 3
  { id: 11, name: 'Lectura Veloz',         emoji: '⚡', description: 'Lee el párrafo y responde las preguntas de comprensión a tiempo.',   skill: 'Comprensión lectora',   level: 3, maxStars: 3, recommended: false, type: 'generic' },
  { id: 12, name: 'La Fábrica de Palabras',emoji: '🏭', description: 'Combina prefijos y sufijos para crear nuevas palabras.',             skill: 'Morfología',             level: 3, maxStars: 3, recommended: false, type: 'generic' },
  { id: 13, name: 'El Gran Detective',     emoji: '🔎', description: 'Lee las pistas y descubre la palabra misteriosa.',                   skill: 'Comprensión lectora',   level: 3, maxStars: 3, recommended: false, type: 'generic' },
  { id: 14, name: 'Conecta las Palabras',  emoji: '🌐', description: 'Une palabras con sus significados correctos.',                       skill: 'Vocabulario',            level: 3, maxStars: 3, recommended: false, type: 'generic' },
  { id: 15, name: 'La Escalera de Lectura',emoji: '📚', description: 'Lee textos cada vez más complejos y gana estrellas.',               skill: 'Fluidez lectora',        level: 3, maxStars: 3, recommended: false, type: 'generic' },
  // Tier 4
  { id: 16, name: 'El Mago de las Letras', emoji: '🪄', description: 'Usa tu varita mágica para escribir palabras correctamente.',         skill: 'Ortografía',             level: 4, maxStars: 3, recommended: false, type: 'generic' },
  { id: 17, name: 'Palabras en Familia',   emoji: '👨‍👩‍👧', description: 'Agrupa palabras de la misma familia léxica.',                      skill: 'Morfología',             level: 4, maxStars: 3, recommended: false, type: 'generic' },
  { id: 18, name: 'El Poema Mágico',       emoji: '✍️', description: 'Completa el poema eligiendo las palabras correctas.',               skill: 'Escritura creativa',     level: 4, maxStars: 3, recommended: false, type: 'generic' },
  { id: 19, name: 'La Historia Perdida',   emoji: '📖', description: 'Ordena los párrafos para reconstruir la historia.',                 skill: 'Comprensión lectora',   level: 4, maxStars: 3, recommended: false, type: 'generic' },
  { id: 20, name: 'Escribe y Gana',        emoji: '🖊️', description: 'Escribe palabras correctamente contra el reloj.',                   skill: 'Escritura',              level: 4, maxStars: 3, recommended: false, type: 'generic' },
  // Tier 5
  { id: 21, name: 'El Maestro Narrador',   emoji: '🦁', description: 'Crea historias con las palabras y escenas dadas.',                  skill: 'Narración',              level: 5, maxStars: 3, recommended: false, type: 'generic' },
  { id: 22, name: 'La Sala de Trofeos',    emoji: '🏆', description: 'Demuestra todo lo que has aprendido en este reto final.',           skill: 'Revisión general',       level: 5, maxStars: 3, recommended: false, type: 'generic' },
  { id: 23, name: 'El Gran Reto Lector',   emoji: '🌟', description: 'Lee textos complejos con fluidez y comprensión total.',             skill: 'Fluidez lectora',        level: 5, maxStars: 3, recommended: false, type: 'generic' },
  { id: 24, name: 'Maestro de la Dislexia',emoji: '🎓', description: '¡El reto definitivo! Demuestra que eres un Maestro Disslapp.',      skill: 'Maestría',               level: 5, maxStars: 3, recommended: false, type: 'generic' },
];

const SKILL_GAME_IDS = {
  'Fonología':       [1, 4, 6, 10],
  'Visual':          [2, 8],
  'Decodificación':  [3, 5, 9, 12],
  'Comprensión':     [11, 13, 15, 19, 23],
  'Memoria':         [7, 14],
};

const STATIC_DATA = {
  levels: [
    { id: 1, name: 'Explorador',  emoji: '🌱', description: 'Conciencia fonológica básica',       status: 'active', progress: 0, gamesCount: 5, gamesCompleted: 0 },
    { id: 2, name: 'Aventurero',  emoji: '🌟', description: 'Discriminación visual y fonémica',   status: 'locked', progress: 0, gamesCount: 5, gamesCompleted: 0 },
    { id: 3, name: 'Constructor', emoji: '🚀', description: 'Decodificación de palabras',          status: 'locked', progress: 0, gamesCount: 5, gamesCompleted: 0 },
    { id: 4, name: 'Narrador',    emoji: '🦁', description: 'Comprensión lectora sencilla',        status: 'locked', progress: 0, gamesCount: 5, gamesCompleted: 0 },
    { id: 5, name: 'Maestro',     emoji: '🏆', description: 'Fluidez lectora y escritura',         status: 'locked', progress: 0, gamesCount: 4, gamesCompleted: 0 },
  ],
  achievementsCatalog: [
    { id: 1,  name: 'Primera Sesión',       emoji: '🎉', desc: 'Completaste tu primer juego',              category: 'primera-vez' },
    { id: 2,  name: 'Juego Perfecto',       emoji: '⭐', desc: 'Obtuviste 3 estrellas en un juego',        category: 'rendimiento' },
    { id: 3,  name: 'Racha de 3 Días',      emoji: '🔥', desc: 'Jugaste 3 días seguidos',                  category: 'constancia' },
    { id: 4,  name: 'Explorador Completo',  emoji: '🗺️', desc: 'Completaste todos los juegos del Nivel 1', category: 'primera-vez' },
    { id: 5,  name: 'Racha de 7 Días',      emoji: '💪', desc: 'Jugaste 7 días seguidos',                  category: 'constancia' },
    { id: 6,  name: 'Veloz como el Rayo',   emoji: '⚡', desc: 'Completa un juego en menos de 60 segundos',category: 'rendimiento' },
    { id: 7,  name: 'Racha de 30 Días',     emoji: '🏆', desc: 'Jugaste 30 días seguidos',                 category: 'constancia' },
    { id: 8,  name: 'Maestro Constructor',  emoji: '🧩', desc: 'Completa todos los juegos del Nivel 3',    category: 'primera-vez' },
    { id: 9,  name: '5 Perfectos',          emoji: '🌟', desc: '3 estrellas en 5 juegos diferentes',       category: 'rendimiento' },
    { id: 10, name: 'Explorador Total',     emoji: '🧭', desc: 'Completa 8 juegos diferentes',             category: 'exploración' },
    { id: 11, name: 'MVP Semanal',          emoji: '👑', desc: 'Asignado por tu psicólogo',                category: 'especial' },
    { id: 12, name: 'Narrador Experto',     emoji: '📖', desc: 'Completa todos los juegos del Nivel 4',    category: 'primera-vez' },
  ],
  motivationalQuotes: [
    '¡Cada letra que aprendes es un superpoder nuevo! 💪',
    'Los errores son maestros disfrazados. ¡Sigue intentando! 🌟',
    'Tu cerebro es increíble, ¡y hoy lo demostrarás! 🧠',
    'Un paso a la vez, ¡y llegarás a la meta! 🏆',
    'Leer es como volar: ¡hoy estás más cerca de las nubes! ☁️',
    '¡Tú puedes! Cada día eres más fuerte y más sabio. 🦁',
  ],
  gameWords: {
    easy:   ['GATO', 'CASA', 'LUNA', 'PELO', 'MESA', 'DADO', 'PATO', 'ROJO', 'AZUL', 'BOLA',
             'MANO', 'NUBE', 'PERA', 'SOPA', 'TORO', 'VACA', 'HOJA', 'FOCA', 'LOBO', 'RANA'],
    medium: ['LIBRO', 'PLAYA', 'TIGRE', 'FUEGO', 'CIELO', 'PIANO', 'ROBOT', 'NIEVE', 'ARBOL', 'BARCO',
             'GLOBO', 'FLOTA', 'NEGRO', 'BRUJA', 'TRAJE', 'PLAZA', 'CLAVO', 'FRESA', 'GRUTA', 'PREMIO'],
    hard:   ['MARIPOSA', 'ELEFANTE', 'CHOCOLATE', 'CAMPANA', 'ESTRELLA', 'VENTANA',
             'PARAGUAS', 'DINOSAURIO', 'TORTUGA', 'MURCIÉLAGO'],
  },
  wordPairs: [
    { word1: 'CASA',  word2: 'CASA',  same: true },
    { word1: 'BODA',  word2: 'BOBA',  same: false },
    { word1: 'LIBRO', word2: 'LIBRO', same: true },
    { word1: 'PERRO', word2: 'PERO',  same: false },
    { word1: 'LUNA',  word2: 'LUNA',  same: true },
    { word1: 'DADO',  word2: 'DEDO',  same: false },
    { word1: 'MESA',  word2: 'MESA',  same: true },
    { word1: 'PATO',  word2: 'GATO',  same: false },
    { word1: 'TORO',  word2: 'TORO',  same: true },
    { word1: 'CAMA',  word2: 'LAMA',  same: false },
    { word1: 'POLO',  word2: 'POLO',  same: true },
    { word1: 'BESO',  word2: 'PESO',  same: false },
    { word1: 'NUBE',  word2: 'NUBE',  same: true },
    { word1: 'MANO',  word2: 'MONO',  same: false },
  ],
  syllableWords: [
    { word: 'MARIPOSA', syllables: ['MA', 'RI', 'PO', 'SA'] },
    { word: 'ELEFANTE', syllables: ['E', 'LE', 'FAN', 'TE'] },
    { word: 'CAMPANA',  syllables: ['CAM', 'PA', 'NA'] },
    { word: 'PELOTA',   syllables: ['PE', 'LO', 'TA'] },
    { word: 'VENTANA',  syllables: ['VEN', 'TA', 'NA'] },
    { word: 'CARACOL',  syllables: ['CA', 'RA', 'COL'] },
    { word: 'FAMILIA',  syllables: ['FA', 'MI', 'LIA'] },
    { word: 'PALMERA',  syllables: ['PAL', 'ME', 'RA'] },
    { word: 'COLUMPIO', syllables: ['CO', 'LUM', 'PIO'] },
    { word: 'SEMANA',   syllables: ['SE', 'MA', 'NA'] },
  ],
  // Data for El Dado Mágico (phoneme-dice)
  phonemeData: [
    { letter: 'M', correct: ['MESA', 'MANO', 'MONO'], wrong: ['PATO', 'ROCA', 'LUNA'] },
    { letter: 'P', correct: ['PATO', 'POLO', 'PERA'], wrong: ['CASA', 'BOLA', 'NUBE'] },
    { letter: 'S', correct: ['SOPA', 'SALA', 'SACO'], wrong: ['GATO', 'DEDO', 'FOCA'] },
    { letter: 'T', correct: ['TORO', 'TAZA', 'TELA'], wrong: ['ROCA', 'LIMA', 'BESO'] },
    { letter: 'L', correct: ['LUNA', 'LOMA', 'LATA'], wrong: ['PATO', 'SOPA', 'MANO'] },
    { letter: 'C', correct: ['CASA', 'CAMA', 'COCO'], wrong: ['PATO', 'SOPA', 'MANO'] },
    { letter: 'G', correct: ['GATO', 'GOMA', 'GOTA'], wrong: ['MANO', 'PELO', 'DEDO'] },
    { letter: 'B', correct: ['BOLA', 'BESO', 'BOCA'], wrong: ['TORO', 'PATO', 'LOMO'] },
    { letter: 'R', correct: ['ROJO', 'ROCA', 'ROSA'], wrong: ['POLO', 'GATO', 'NUBE'] },
    { letter: 'N', correct: ['NUBE', 'NIDO', 'NABO'], wrong: ['LATA', 'BESO', 'FOCA'] },
    { letter: 'F', correct: ['FOCA', 'FARO', 'FULA'], wrong: ['MANO', 'TORO', 'SOPA'] },
    { letter: 'D', correct: ['DADO', 'DEDO', 'DAMA'], wrong: ['GATO', 'POLO', 'ROCA'] },
  ],
};

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [completedGames, setCompletedGames] = useState(new Set());
  const [gameStars, setGameStars]     = useState({});
  const [localSessions, setLocalSessions] = useState([]);

  const loadUserLocalData = useCallback((userId) => {
    if (!userId) {
      setCompletedGames(new Set());
      setGameStars({});
      setLocalSessions([]);
      return;
    }
    const savedCompleted = localStorage.getItem(`disslapp_completed_${userId}`);
    const savedStars     = localStorage.getItem(`disslapp_stars_${userId}`);
    const savedSessions  = localStorage.getItem(`disslapp_sessions_${userId}`);
    setCompletedGames(savedCompleted ? new Set(JSON.parse(savedCompleted)) : new Set());
    setGameStars(savedStars     ? JSON.parse(savedStars)    : {});
    setLocalSessions(savedSessions ? JSON.parse(savedSessions) : []);
  }, []);

  // Sync completed games and stars from DB progress
  const syncProgressFromDB = useCallback(async (userId) => {
    try {
      const data = await gamesAPI.getProgress();
      if (!data.completedGames) return;
      const ids   = new Set(data.completedGames.map(g => g.game_id));
      const stars = {};
      data.completedGames.forEach(g => { stars[g.game_id] = g.stars; });
      setCompletedGames(prev => {
        const merged = new Set([...prev, ...ids]);
        localStorage.setItem(`disslapp_completed_${userId}`, JSON.stringify([...merged]));
        return merged;
      });
      setGameStars(prev => {
        const merged = { ...prev, ...stars };
        localStorage.setItem(`disslapp_stars_${userId}`, JSON.stringify(merged));
        return merged;
      });
    } catch { /* backend unavailable, keep local */ }
  }, []);

  useEffect(() => {
    const token     = localStorage.getItem('disslapp_token');
    const savedUser = localStorage.getItem('disslapp_user');
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        loadUserLocalData(parsed.id);
        authAPI.getMe()
          .then(data => {
            const merged = {
              ...parsed,
              ...data.user,
              totalGamesPlayed: Math.max(data.user.totalGamesPlayed || 0, parsed.totalGamesPlayed || 0),
            };
            setUser(merged);
            localStorage.setItem('disslapp_user', JSON.stringify(merged));
            syncProgressFromDB(merged.id);
          })
          .catch(() => {});
      } catch {
        localStorage.removeItem('disslapp_token');
        localStorage.removeItem('disslapp_user');
      }
    }
    setLoading(false);
  }, [loadUserLocalData, syncProgressFromDB]);

  const login = useCallback(async (username, password, role = 'patient') => {
    try {
      const data = await authAPI.login({ username, password, role });
      const { token, user: userData } = data;
      localStorage.setItem('disslapp_token', token);
      localStorage.setItem('disslapp_user', JSON.stringify(userData));
      setUser(userData);
      loadUserLocalData(userData.id);
      syncProgressFromDB(userData.id);
      return { success: true, user: userData };
    } catch {
      // Demo fallback — blank history
      const demoUser = {
        id:               `demo-${Date.now()}`,
        name:             username || 'Paciente Demo',
        role,
        xp:               0,
        level:            1,
        levelName:        'Explorador',
        streak:           0,
        totalSessions:    0,
        totalGamesPlayed: 0,
        joinDate:         new Date().toISOString().split('T')[0],
        avatar:           username ? username.charAt(0).toUpperCase() : 'P',
        demo:             true,
      };
      localStorage.setItem('disslapp_user', JSON.stringify(demoUser));
      localStorage.setItem('disslapp_token', 'demo-token');
      setUser(demoUser);
      loadUserLocalData(demoUser.id);
      return { success: true, user: demoUser, demo: true };
    }
  }, [loadUserLocalData, syncProgressFromDB]);

  const loginWithGoogle = useCallback(async (credential) => {
    const data = await authAPI.googleLogin(credential);
    const { token, user: userData } = data;
    localStorage.setItem('disslapp_token', token);
    localStorage.setItem('disslapp_user', JSON.stringify(userData));
    setUser(userData);
    loadUserLocalData(userData.id);
    syncProgressFromDB(userData.id);
    return { success: true, user: userData };
  }, [loadUserLocalData, syncProgressFromDB]);

  const logout = useCallback(() => {
    setUser(null);
    setCompletedGames(new Set());
    setGameStars({});
    setLocalSessions([]);
    localStorage.removeItem('disslapp_token');
    localStorage.removeItem('disslapp_user');
  }, []);

  const updateXP = useCallback((amount) => {
    setUser(prev => {
      if (!prev) return prev;
      const newXP = prev.xp + amount;
      const levels = [
        { min: 0,     max: 499,      level: 1, name: 'Explorador' },
        { min: 500,   max: 1499,     level: 2, name: 'Aventurero' },
        { min: 1500,  max: 3499,     level: 3, name: 'Constructor' },
        { min: 3500,  max: 6999,     level: 4, name: 'Narrador' },
        { min: 7000,  max: 9999,     level: 5, name: 'Maestro' },
        { min: 10000, max: Infinity, level: 6, name: 'Maestro Disslapp' },
      ];
      const newLevel = levels.find(l => newXP >= l.min && newXP <= l.max);
      const updated = {
        ...prev,
        xp: newXP,
        totalGamesPlayed: (prev.totalGamesPlayed || 0) + 1,
        ...(newLevel && newLevel.level > prev.level && {
          level: newLevel.level,
          levelName: newLevel.name,
        }),
      };
      localStorage.setItem('disslapp_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Called when user finishes a game — saves locally and to DB
  const completeGame = useCallback((gameId, stars = 1, xpEarned = 0, durationSeconds = 0) => {
    if (!user) return;
    const uid = user.id;
    const won = stars > 0;

    setCompletedGames(prev => {
      const next = new Set(prev);
      next.add(gameId);
      localStorage.setItem(`disslapp_completed_${uid}`, JSON.stringify([...next]));
      return next;
    });

    setGameStars(prev => {
      const next = { ...prev, [gameId]: Math.max(prev[gameId] || 0, stars) };
      localStorage.setItem(`disslapp_stars_${uid}`, JSON.stringify(next));
      return next;
    });

    const game = ALL_GAMES.find(g => g.id === gameId);
    if (game) {
      const now     = new Date();
      const session = {
        date:     now.toISOString().split('T')[0],
        day:      now.getDate(),
        month:    MONTH_NAMES[now.getMonth()],
        title:    game.name,
        games:    1,
        xp:       xpEarned,
        duration: durationSeconds,
      };
      setLocalSessions(prev => {
        const next = [session, ...prev].slice(0, 50);
        localStorage.setItem(`disslapp_sessions_${uid}`, JSON.stringify(next));
        return next;
      });
    }

    // Persist to backend (fire-and-forget for non-demo users)
    if (!user.demo) {
      gamesAPI.saveSession({
        gameId,
        score: xpEarned,
        stars,
        xpEarned,
        completed: won,
        durationSeconds,
      }).catch(() => {});
    }
  }, [user]);

  const appData = useMemo(() => {
    const userPlan     = user?.subscription_plan || 'free';
    const maxTierCount = PLAN_TIERS[userPlan] ?? 1;

    const gamesWithStatus = ALL_GAMES.map((game, index) => {
      const tier    = Math.floor(index / TIER_SIZE);
      const tierNum = tier + 1;

      if (tierNum > maxTierCount) {
        return { ...game, locked: true, lockReason: 'plan', stars: gameStars[game.id] || 0 };
      }
      if (tier === 0) {
        return { ...game, locked: false, lockReason: null, stars: gameStars[game.id] || 0 };
      }
      const prevDone = ALL_GAMES.slice((tier - 1) * TIER_SIZE, tier * TIER_SIZE)
        .every(g => completedGames.has(g.id));
      return { ...game, locked: !prevDone, lockReason: !prevDone ? 'progress' : null, stars: gameStars[game.id] || 0 };
    });

    const completedCount = completedGames.size;
    const perfectCount   = Object.values(gameStars).filter(s => s === 3).length;
    const streak         = user?.streak || 0;
    const tier1Done      = ALL_GAMES.slice(0,  5).every(g => completedGames.has(g.id));
    const tier3Done      = ALL_GAMES.slice(10, 15).every(g => completedGames.has(g.id));
    const tier4Done      = ALL_GAMES.slice(15, 20).every(g => completedGames.has(g.id));

    const achievements = STATIC_DATA.achievementsCatalog.map(a => {
      let unlocked = false;
      switch (a.id) {
        case 1:  unlocked = completedCount >= 1;    break;
        case 2:  unlocked = perfectCount >= 1;      break;
        case 3:  unlocked = streak >= 3;            break;
        case 4:  unlocked = tier1Done;              break;
        case 5:  unlocked = streak >= 7;            break;
        case 6:  unlocked = false;                  break; // Determined by timer in GamesPage
        case 7:  unlocked = streak >= 30;           break;
        case 8:  unlocked = tier3Done;              break;
        case 9:  unlocked = perfectCount >= 5;      break;
        case 10: unlocked = completedCount >= 8;    break;
        case 11: unlocked = false;                  break;
        case 12: unlocked = tier4Done;              break;
      }
      return { ...a, unlocked, date: unlocked ? 'Hoy' : null };
    });

    const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();
    const weeklyXP = Array.from({ length: 7 }, (_, i) => {
      const d       = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const xp      = localSessions
        .filter(s => s.date === dateStr)
        .reduce((sum, s) => sum + s.xp, 0);
      return { label: DAY_LABELS[d.getDay()], value: xp };
    });

    const skills = [
      { name: 'Fonología',      color: 'purple' },
      { name: 'Visual',         color: 'green' },
      { name: 'Decodificación', color: 'purple' },
      { name: 'Comprensión',    color: 'green' },
      { name: 'Memoria',        color: 'purple' },
    ].map(skill => {
      const ids       = SKILL_GAME_IDS[skill.name] || [];
      const completed = ids.filter(id => completedGames.has(id)).length;
      const percent   = ids.length > 0 ? Math.round((completed / ids.length) * 100) : 0;
      return { ...skill, percent };
    });

    return {
      games:              gamesWithStatus,
      levels:             STATIC_DATA.levels,
      achievements,
      sessions:           localSessions,
      weeklyXP,
      skills,
      motivationalQuotes: STATIC_DATA.motivationalQuotes,
      gameWords:          STATIC_DATA.gameWords,
      wordPairs:          STATIC_DATA.wordPairs,
      syllableWords:      STATIC_DATA.syllableWords,
      phonemeData:        STATIC_DATA.phonemeData,
    };
  }, [user, completedGames, gameStars, localSessions]);

  const updateSubscription = useCallback(async () => {
    try {
      const data = await paymentsAPI.getSubscription();
      setUser(prev => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          subscription_plan:   data.subscription.plan,
          subscription_status: data.subscription.status,
        };
        localStorage.setItem('disslapp_user', JSON.stringify(updated));
        return updated;
      });
    } catch { /* keep current state */ }
  }, []);

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    updateXP,
    completeGame,
    updateSubscription,
    isLoggedIn: !!user,
    appData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
