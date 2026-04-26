const pool = require('../config/db');

function getLevel(xp) {
  if (xp >= 10000) return { level: 6, name: 'Maestro Disslapp' };
  if (xp >= 7000)  return { level: 5, name: 'Maestro' };
  if (xp >= 3500)  return { level: 4, name: 'Narrador' };
  if (xp >= 1500)  return { level: 3, name: 'Constructor' };
  if (xp >= 500)   return { level: 2, name: 'Aventurero' };
  return { level: 1, name: 'Explorador' };
}

exports.saveSession = async (req, res, next) => {
  try {
    const { gameId, score, stars, xpEarned, completed, durationSeconds } = req.body;
    const userId = req.user.id;

    if (!gameId) {
      return res.status(400).json({ success: false, message: 'gameId es requerido' });
    }

    await pool.execute(
      `INSERT INTO game_sessions (user_id, game_id, score, stars, xp_earned, completed, duration_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, gameId, score || 0, stars || 0, xpEarned || 0, completed !== false ? 1 : 0, durationSeconds || 0]
    );

    if (completed !== false) {
      await pool.execute(
        `UPDATE users SET
          xp = xp + ?,
          total_games_played = total_games_played + 1,
          total_sessions = total_sessions + 1
         WHERE id = ?`,
        [xpEarned || 0, userId]
      );

      const [rows] = await pool.execute('SELECT xp FROM users WHERE id = ?', [userId]);
      if (rows.length > 0) {
        const lvl = getLevel(rows[0].xp);
        await pool.execute(
          'UPDATE users SET level = ?, level_name = ? WHERE id = ?',
          [lvl.level, lvl.name, userId]
        );
      }
    }

    res.json({ success: true, message: 'Sesión guardada' });
  } catch (error) {
    next(error);
  }
};

exports.getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [sessions] = await pool.execute(
      `SELECT gs.id, gs.game_id, gs.score, gs.stars, gs.xp_earned, gs.completed,
              gs.duration_seconds, gs.played_at, g.name AS game_name, g.emoji
       FROM game_sessions gs
       JOIN games g ON gs.game_id = g.id
       WHERE gs.user_id = ?
       ORDER BY gs.played_at DESC
       LIMIT 50`,
      [userId]
    );
    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      'SELECT id, xp, level, level_name, streak, total_sessions, total_games_played FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Best stars per game
    const [completedGames] = await pool.execute(
      `SELECT game_id, MAX(stars) AS stars
       FROM game_sessions
       WHERE user_id = ? AND completed = 1
       GROUP BY game_id`,
      [userId]
    );

    // XP per day for last 7 days
    const [weeklyXP] = await pool.execute(
      `SELECT DATE(played_at) AS date, SUM(xp_earned) AS xp
       FROM game_sessions
       WHERE user_id = ? AND played_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(played_at)
       ORDER BY date ASC`,
      [userId]
    );

    // Average response time per game (treatment metric)
    const [avgTimes] = await pool.execute(
      `SELECT game_id, AVG(duration_seconds) AS avg_seconds, COUNT(*) AS attempts
       FROM game_sessions
       WHERE user_id = ?
       GROUP BY game_id`,
      [userId]
    );

    res.json({
      success: true,
      user: users[0],
      completedGames,
      weeklyXP,
      avgTimes,
    });
  } catch (error) {
    next(error);
  }
};
