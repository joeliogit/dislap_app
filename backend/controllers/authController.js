const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'disslapp_super_secret_key_change_in_production_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

function buildSafeUser(user, overrideStreak) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    patient_code: user.patient_code,
    xp: user.xp || 0,
    level: user.level || 1,
    levelName: user.level_name || 'Explorador',
    streak: overrideStreak !== undefined ? overrideStreak : (user.streak || 0),
    avatar: user.avatar || user.name.charAt(0).toUpperCase(),
    totalSessions: user.total_sessions || 0,
    totalGamesPlayed: user.total_games_played || 0,
    subscription_plan: user.subscription_plan || 'free',
    subscription_status: user.subscription_status || 'active',
  };
}

async function processStreakUpdate(userId, currentStreak, lastLoginDate) {
  const today = new Date().toISOString().split('T')[0];

  if (!lastLoginDate) {
    await pool.execute('UPDATE users SET streak = 1, last_login_date = ? WHERE id = ?', [today, userId]);
    return 1;
  }

  const lastDate = lastLoginDate instanceof Date
    ? lastLoginDate.toISOString().split('T')[0]
    : String(lastLoginDate).split('T')[0];

  if (lastDate === today) {
    return currentStreak;
  }

  const diffMs = new Date(today) - new Date(lastDate);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const newStreak = diffDays === 1 ? currentStreak + 1 : 1;

  await pool.execute('UPDATE users SET streak = ?, last_login_date = ? WHERE id = ?', [newStreak, today, userId]);
  return newStreak;
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'psychologist' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: result.insertId
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Credenciales incompletas' });
    }

    let user;
    if (role === 'psychologist') {
      const [users] = await pool.execute('SELECT * FROM users WHERE email = ? AND role = ?', [username, role]);
      user = users[0];
    } else {
      const [users] = await pool.execute('SELECT * FROM users WHERE name = ? OR patient_code = ?', [username, username]);
      user = users[0];
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ success: false, message: 'Este usuario usa Google para iniciar sesión. Usa el botón de Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    const updatedStreak = await processStreakUpdate(user.id, user.streak, user.last_login_date);

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: buildSafeUser(user, updatedStreak)
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: 'Token de Google requerido' });
    }

    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ success: false, message: 'Google Sign-In no está configurado en el servidor' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user;

    const [byOAuth] = await pool.execute(
      'SELECT * FROM users WHERE oauth_id = ? AND oauth_provider = ?',
      [googleId, 'google']
    );
    user = byOAuth[0];

    if (!user) {
      const [byEmail] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (byEmail.length > 0) {
        user = byEmail[0];
        await pool.execute(
          'UPDATE users SET oauth_id = ?, oauth_provider = ? WHERE id = ?',
          [googleId, 'google', user.id]
        );
      } else {
        const avatar = name ? name.charAt(0).toUpperCase() : 'U';
        const [result] = await pool.execute(
          `INSERT INTO users (name, email, role, oauth_id, oauth_provider, avatar, xp, level, level_name, streak, total_sessions, total_games_played)
           VALUES (?, ?, 'patient', ?, 'google', ?, 0, 1, 'Explorador', 0, 0, 0)`,
          [name, email, googleId, avatar]
        );
        const [newUsers] = await pool.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
        user = newUsers[0];
      }
    }

    const updatedStreak = await processStreakUpdate(user.id, user.streak, user.last_login_date);

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: buildSafeUser(user, updatedStreak)
    });
  } catch (error) {
    if (error.message && error.message.includes('Token used too late')) {
      return res.status(401).json({ success: false, message: 'Token de Google expirado. Intenta de nuevo.' });
    }
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, email, role, patient_code, xp, level, level_name, streak, avatar, total_sessions, total_games_played, subscription_plan, subscription_status FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      user: buildSafeUser(users[0])
    });
  } catch (error) {
    next(error);
  }
};
