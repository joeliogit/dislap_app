/* ============================================
   DISSLAPP — Dashboard Page
   ============================================ */

import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getXPForNextLevel, getXPPercent } from '../utils/xpCalculator';

export default function DashboardPage() {
  const { user, isLoggedIn, appData } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role === 'psychologist') return <Navigate to="/panel-doctor" replace />;

  const quote = appData.motivationalQuotes[Math.floor(Math.random() * appData.motivationalQuotes.length)];
  const xpForNextLevel = getXPForNextLevel(user.xp);
  const xpPercent = getXPPercent(user.xp);
  const unlockedCount = appData.achievements.filter(a => a.unlocked).length;

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Greeting */}
        <div className="dashboard-header animate-fade-in-up">
          <div className="dashboard-greeting">
            <div className="greeting-text">
              <h1>¡Hola, {user.name}! 🌟</h1>
              <p>¿Listo para jugar hoy? Sigamos avanzando juntos.</p>
            </div>
            <div className="streak-badge">
              <span className="streak-fire">🔥</span>
              <div>
                <div className="streak-count">{user.streak}</div>
                <div className="streak-label">días seguidos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level & XP Bar */}
        <div className="level-bar-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="level-badge-big">{user.level}</div>
          <div className="level-info">
            <div className="level-name">Nivel {user.level}: {user.levelName}</div>
            <div className="xp-text">{user.xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</div>
            <div className="progress-bar">
              <div className="progress-fill animate-xp-fill" style={{ width: `${xpPercent}%` }}></div>
            </div>
          </div>
          <span className="level-title-badge">🌟 {user.levelName}</span>
        </div>

        {/* Motivation */}
        <div className="motivation-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="motivation-icon">💡</span>
          <span className="motivation-text">{quote}</span>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/juegos" className="card quick-action-card card-glow animate-fade-in-up" style={{ animationDelay: '0.3s', textDecoration: 'none' }}>
            <div className="quick-action-icon">🎮</div>
            <h3>Juego del Día</h3>
            <p>Letras Saltarinas te espera — ¡recomendado por tu psicóloga!</p>
          </Link>
          <Link to="/juegos" className="card quick-action-card card-glow animate-fade-in-up" style={{ animationDelay: '0.4s', textDecoration: 'none' }}>
            <div className="quick-action-icon">▶️</div>
            <h3>Continuar</h3>
            <p>Retoma donde lo dejaste en Construye la Palabra.</p>
          </Link>
          <Link to="/avances" className="card quick-action-card card-glow animate-fade-in-up" style={{ animationDelay: '0.5s', textDecoration: 'none' }}>
            <div className="quick-action-icon">🏆</div>
            <h3>Mis Logros</h3>
            <p>Tienes {unlockedCount} logros desbloqueados. ¡Sigue así!</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-10)' }}>
          <div className="card stat-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="stat-value">{user.totalSessions}</div>
            <div className="stat-label">Sesiones</div>
          </div>
          <div className="card stat-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="stat-value">{user.totalGamesPlayed}</div>
            <div className="stat-label">Juegos Jugados</div>
          </div>
          <div className="card stat-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-value">{user.xp.toLocaleString()}</div>
            <div className="stat-label">XP Total</div>
          </div>
          <div className="card stat-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="stat-value">{unlockedCount}</div>
            <div className="stat-label">Logros</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="recent-achievements animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2>Logros Recientes 🏅</h2>
          <div className="achievements-row">
            {appData.achievements.filter(a => a.unlocked).slice(-4).map(a => (
              <div className="card mini-achievement" key={a.id}>
                <div className="achievement-emoji">{a.emoji}</div>
                <div className="achievement-name">{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
