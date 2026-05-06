const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedDatabase() {
  console.log('🌱 Starting database seeding process...');

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const schemaSql = fs.readFileSync(path.join(__dirname, '../database.sql'), 'utf8');
    const statements = schemaSql.split(/;\s*$/m).filter(s => s.trim());

    console.log('📦 Creating database and tables...');
    for (const statement of statements) {
      if (statement.trim()) await connection.query(statement);
    }
    console.log('✅ Schema loaded.');

    await connection.query('USE disslapp');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('dislexia123', salt);

    console.log('👥 Inserting users...');
    await connection.execute(
      `INSERT INTO users (name, email, password_hash, role, patient_code, xp, level, level_name, streak, total_sessions, total_games_played)
       VALUES
       ('Dra. Elena',   'doctora@clinica.com', ?, 'psychologist', NULL,      0,    1, 'Explorador', 0, 0,  0),
       ('Mateo Rivera', 'mateo@mail.com',       ?, 'patient',      'PAC-001', 1250, 2, 'Aventurero', 5, 24, 87),
       ('Sofía Luna',   'sofia@mail.com',       ?, 'patient',      'PAC-002', 300,  1, 'Explorador', 2, 5,  12)`,
      [hashedPassword, hashedPassword, hashedPassword]
    );

    console.log('🎮 Inserting all 24 games...');
    const games = [
      // Tier 1 — Free (IDs 1-5)
      ['Letras Saltarinas',      '🔤', 'Ordena las letras mezcladas para formar la palabra correcta.',         'Conciencia fonológica', 1, 'word-scramble',  3, true ],
      ['El Espejo de Palabras',  '🪞', 'Identifica si las dos palabras mostradas son iguales o diferentes.',  'Discriminación visual',  1, 'word-compare',   3, false],
      ['Construye la Palabra',   '🧩', 'Haz clic en las sílabas en el orden correcto para formar la palabra.','Decodificación',         1, 'syllable-build', 3, false],
      ['El Dado Mágico',         '🎲', 'Encuentra palabras que empiezan con el fonema mostrado.',             'Conciencia fonémica',    1, 'phoneme-dice',   3, false],
      ['Colorea la Sílaba',      '🎨', 'Identifica la sílaba correcta según su posición en la palabra.',      'Segmentación silábica',  1, 'syllable-color', 3, false],
      // Tier 2 (IDs 6-10)
      ['Rima y Encuentra',       '🎵', 'Selecciona la palabra que rima con la mostrada.',                     'Rima y fonología',       2, 'rhyme-match',    3, false],
      ['El Laberinto de Letras', '🏰', 'Memoriza las letras y escríbelas en el orden correcto.',              'Memoria y secuencia',    2, 'memory-letters', 3, false],
      ['Palabras Escondidas',    '🔍', 'Descubre la letra oculta para completar la palabra.',                 'Reconocimiento visual',  2, 'word-fill',      3, false],
      ['La Cadena de Sílabas',   '🔗', 'La última sílaba de una palabra es la primera de la siguiente.',      'Segmentación silábica',  2, 'syllable-chain', 3, false],
      ['El Contador de Sonidos', '🎤', 'Cuenta cuántas sílabas tiene cada palabra.',                          'Conciencia fonémica',    2, 'sound-count',    3, false],
      // Tier 3 (IDs 11-15)
      ['Lectura Veloz',          '⚡', 'Lee el texto y responde las preguntas de comprensión.',               'Comprensión lectora',    3, 'generic',        3, false],
      ['La Fábrica de Palabras', '🏭', 'Combina prefijos y sufijos para crear nuevas palabras.',              'Morfología',             3, 'generic',        3, false],
      ['El Gran Detective',      '🔎', 'Lee las pistas y descubre la palabra misteriosa.',                    'Comprensión lectora',    3, 'generic',        3, false],
      ['Conecta las Palabras',   '🌐', 'Une palabras con sus significados correctos.',                        'Vocabulario',            3, 'generic',        3, false],
      ['La Escalera de Lectura', '📚', 'Lee textos cada vez más complejos y gana estrellas.',                 'Fluidez lectora',        3, 'generic',        3, false],
      // Tier 4 (IDs 16-20)
      ['El Mago de las Letras',  '🪄', 'Usa tu varita mágica para escribir palabras correctamente.',         'Ortografía',             4, 'generic',        3, false],
      ['Palabras en Familia',    '👨‍👩‍👧', 'Agrupa palabras de la misma familia léxica.',                      'Morfología',             4, 'generic',        3, false],
      ['El Poema Mágico',        '✍️', 'Completa el poema eligiendo las palabras correctas.',                'Escritura creativa',     4, 'generic',        3, false],
      ['La Historia Perdida',    '📖', 'Ordena los párrafos para reconstruir la historia.',                  'Comprensión lectora',    4, 'generic',        3, false],
      ['Escribe y Gana',         '🖊️', 'Escribe palabras correctamente contra el reloj.',                    'Escritura',              4, 'generic',        3, false],
      // Tier 5 (IDs 21-24)
      ['El Maestro Narrador',    '🦁', 'Crea historias con las palabras y escenas dadas.',                   'Narración',              5, 'generic',        3, false],
      ['La Sala de Trofeos',     '🏆', 'Demuestra todo lo que has aprendido en este reto final.',            'Revisión general',       5, 'generic',        3, false],
      ['El Gran Reto Lector',    '🌟', 'Lee textos complejos con fluidez y comprensión total.',              'Fluidez lectora',        5, 'generic',        3, false],
      ['Maestro de la Dislexia', '🎓', '¡El reto definitivo! Demuestra que eres un Maestro Disslapp.',      'Maestría',               5, 'generic',        3, false],
    ];

    for (const game of games) {
      await connection.execute(
        'INSERT INTO games (name, emoji, description, skill, level_required, type, max_stars, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        game
      );
    }
    console.log(`✅ Inserted ${games.length} games.`);

    console.log('🏆 Inserting achievements...');
    const achievements = [
      ['Primera Sesión',      '🎉', 'Completaste tu primer juego',               'primera-vez'],
      ['Juego Perfecto',      '⭐', 'Obtuviste 3 estrellas en un juego',         'rendimiento'],
      ['Racha de 3 Días',     '🔥', 'Jugaste 3 días seguidos',                   'constancia' ],
      ['Explorador Completo', '🗺️', 'Completaste todos los juegos del Nivel 1',  'primera-vez'],
      ['Racha de 7 Días',     '💪', 'Jugaste 7 días seguidos',                   'constancia' ],
      ['Veloz como el Rayo',  '⚡', 'Completa un juego en menos de 60 segundos', 'rendimiento'],
      ['Racha de 30 Días',    '🏆', 'Jugaste 30 días seguidos',                  'constancia' ],
      ['Maestro Constructor', '🧩', 'Completa todos los juegos del Nivel 3',     'primera-vez'],
      ['5 Perfectos',         '🌟', '3 estrellas en 5 juegos diferentes',        'rendimiento'],
      ['Explorador Total',    '🧭', 'Completa 8 juegos diferentes',              'exploración'],
      ['MVP Semanal',         '👑', 'Asignado por tu psicólogo',                 'especial'   ],
      ['Narrador Experto',    '📖', 'Completa todos los juegos del Nivel 4',     'primera-vez'],
    ];
    for (const ach of achievements) {
      await connection.execute(
        'INSERT INTO achievements (name, emoji, description, category) VALUES (?, ?, ?, ?)',
        ach
      );
    }

    // Demo sessions for Mateo (user_id=2) — uses game IDs 1-5
    await connection.execute(
      `INSERT INTO user_achievements (user_id, achievement_id) VALUES (2,1),(2,2),(2,3)`
    );

    await connection.execute(
      `INSERT INTO game_sessions (user_id, game_id, score, stars, xp_earned, completed, duration_seconds)
       VALUES
       (2,1,100,3,100,1,38),(2,2,75,3,75,1,22),(2,3,100,3,100,1,55),
       (2,4,75,2,75,1,41),(2,5,50,2,50,1,63),(2,1,100,3,100,1,35),
       (2,2,75,3,75,1,19),(3,1,50,1,50,1,72),(3,2,25,1,25,1,85)`
    );

    console.log('\n✨ Seeding completed! ✨');
    console.log('-------------------------------------------');
    console.log('Credentials:');
    console.log('  Psicólogo: doctora@clinica.com / dislexia123');
    console.log('  Paciente:  mateo@mail.com  o PAC-001 / dislexia123');
    console.log('  Paciente:  sofia@mail.com  o PAC-002 / dislexia123');
    console.log('-------------------------------------------');

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    console.error(err);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

seedDatabase();
