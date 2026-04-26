const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedDatabase() {
  console.log('🌱 Starting database seeding process...');
  
  // Connection without database to create it first
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Run schema file
    const schemaSql = fs.readFileSync(path.join(__dirname, '../database.sql'), 'utf8');
    const statements = schemaSql.split(/;\s*$/m).filter(Boolean);
    
    console.log('📦 Creating database and tables...');
    for (let statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    
    console.log('✅ Base schema loaded successfully.');

    // Connect to the newly created database
    await connection.query('USE disslapp');

    // Default password for demo users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('dislexia123', salt);

    // 1. Insert Users
    console.log('👥 Inserting users...');
    await connection.execute(
      `INSERT INTO users (name, email, password_hash, role, patient_code, xp, level, level_name, streak, total_sessions, total_games_played)
       VALUES
       ('Dra. Elena',   'doctora@clinica.com', ?, 'psychologist', NULL,      0,    1, 'Explorador', 0, 0,  0),
       ('Mateo Rivera', 'mateo@mail.com',       ?, 'patient',      'PAC-001', 1250, 2, 'Aventurero', 5, 24, 87),
       ('Sofía Luna',   'sofia@mail.com',        ?, 'patient',      'PAC-002', 300,  1, 'Explorador', 2, 5,  12)`,
      [hashedPassword, hashedPassword, hashedPassword]
    );

    // 2. Insert Games
    console.log('🎮 Inserting games...');
    const games = [
      ['Letras Saltarinas', '🔤', 'Ordena las letras mezcladas para formar la palabra correcta.', 'Conciencia fonológica', 1, 'word-scramble', 3, true],
      ['El Espejo de Palabras', '🪞', 'Identifica si las dos palabras mostradas son iguales o diferentes.', 'Discriminación visual', 1, 'word-compare', 3, false],
      ['Construye la Palabra', '🧩', 'Arrastra las sílabas en el orden correcto para formar la palabra.', 'Decodificación', 2, 'syllable-build', 3, false],
      ['El Dado Mágico', '🎲', 'Lanza el dado y pronuncia el fonema que aparece.', 'Conciencia fonémica', 2, 'phoneme-dice', 3, false],
      ['Rima y Encuentra', '🎵', 'Selecciona la imagen que rima con la palabra mostrada.', 'Rima y fonología', 3, 'rhyme-match', 3, false]
    ];
    
    for (let game of games) {
      await connection.execute(
        `INSERT INTO games (name, emoji, description, skill, level_required, type, max_stars, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        game
      );
    }

    // 3. Insert Achievements
    console.log('🏆 Inserting achievements...');
    const achievements = [
      ['Primera Sesión', '🎉', 'Completaste tu primera sesión', 'primera-vez'],
      ['Juego Perfecto', '⭐', 'Obtuviste 3 estrellas en un juego', 'rendimiento'],
      ['Racha de 3 Días', '🔥', 'Jugaste 3 días seguidos', 'constancia']
    ];

    for (let ach of achievements) {
      await connection.execute(
        `INSERT INTO achievements (name, emoji, description, category) VALUES (?, ?, ?, ?)`,
        ach
      );
    }

    // Assign achievements to Mateo (User ID 2)
    await connection.execute(
      `INSERT INTO user_achievements (user_id, achievement_id) VALUES (2, 1), (2, 2), (2, 3)`
    );

    console.log('✨ Database seeding completed successfully! ✨');
    console.log('----------------------------------------------------');
    console.log('Credentials for testing:');
    console.log('Psicólogo: doctora@clinica.com / dislexia123');
    console.log('Paciente : mateo@mail.com o PAC-001 / dislexia123');
    console.log('----------------------------------------------------');

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

seedDatabase();
