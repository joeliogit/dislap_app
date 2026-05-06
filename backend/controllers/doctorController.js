const pool = require('../config/db');

// GET /api/doctor/patients — list all patients with their stats
exports.getPatients = async (req, res, next) => {
  try {
    const [patients] = await pool.execute(
      `SELECT
         id, name, email, patient_code, avatar,
         xp, level, level_name, streak,
         total_sessions, total_games_played,
         subscription_plan, created_at,
         (SELECT MAX(played_at) FROM game_sessions WHERE user_id = users.id) AS last_session
       FROM users
       WHERE role = 'patient'
       ORDER BY last_session DESC, created_at DESC`
    );
    res.json({ success: true, patients });
  } catch (err) { next(err); }
};

// GET /api/doctor/patients/:id — full progress for one patient
exports.getPatientDetail = async (req, res, next) => {
  try {
    const patientId = req.params.id;

    const [users] = await pool.execute(
      `SELECT id, name, email, patient_code, avatar, xp, level, level_name,
              streak, total_sessions, total_games_played, subscription_plan, created_at
       FROM users WHERE id = ? AND role = 'patient'`,
      [patientId]
    );
    if (!users.length) {
      return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
    }

    // Last 30 sessions
    const [sessions] = await pool.execute(
      `SELECT gs.id, gs.game_id, gs.score, gs.stars, gs.xp_earned,
              gs.completed, gs.duration_seconds, gs.played_at,
              g.name AS game_name, g.emoji, g.skill
       FROM game_sessions gs
       JOIN games g ON gs.game_id = g.id
       WHERE gs.user_id = ?
       ORDER BY gs.played_at DESC
       LIMIT 30`,
      [patientId]
    );

    // Best stars per game (completed)
    const [completedGames] = await pool.execute(
      `SELECT game_id, MAX(stars) AS stars, COUNT(*) AS attempts,
              AVG(duration_seconds) AS avg_seconds, MIN(duration_seconds) AS best_seconds
       FROM game_sessions
       WHERE user_id = ? AND completed = 1
       GROUP BY game_id`,
      [patientId]
    );

    // XP per day for last 14 days
    const [weeklyXP] = await pool.execute(
      `SELECT DATE(played_at) AS date, SUM(xp_earned) AS xp, COUNT(*) AS sessions
       FROM game_sessions
       WHERE user_id = ? AND played_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
       GROUP BY DATE(played_at)
       ORDER BY date ASC`,
      [patientId]
    );

    // Average response time per skill (treatment metric)
    const [skillTimes] = await pool.execute(
      `SELECT g.skill, AVG(gs.duration_seconds) AS avg_seconds, COUNT(*) AS total
       FROM game_sessions gs
       JOIN games g ON gs.game_id = g.id
       WHERE gs.user_id = ? AND gs.completed = 1
       GROUP BY g.skill`,
      [patientId]
    );

    res.json({
      success: true,
      patient: users[0],
      sessions,
      completedGames,
      weeklyXP,
      skillTimes,
    });
  } catch (err) { next(err); }
};
