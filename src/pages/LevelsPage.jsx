/* ============================================
   DISSLAPP — Levels Map Page
   ============================================ */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LevelsPage() {
  const { appData } = useAuth();
  const levels = appData.levels;
  const completedCount = levels.filter(l => l.status === 'completed').length;
  const activeLevel = levels.find(l => l.status === 'active');
  const pathFillPercent = ((completedCount + (activeLevel ? activeLevel.progress / 100 : 0)) / levels.length) * 100;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const renderLevelNode = (level, index) => {
    const statusBadge = {
      completed: <span className="level-status-badge completed">✓ Completado</span>,
      active: <span className="level-status-badge active">▶ En progreso</span>,
      locked: <span className="level-status-badge locked">🔒 Bloqueado</span>,
    }[level.status];

    return (
      <div key={level.id} className={`level-node ${level.status} reveal`} style={{ transitionDelay: `${index * 0.1}s` }}>
        <div className="level-node-circle">{level.emoji}</div>
        <div className="level-node-content">
          <div className="level-name">{level.name}</div>
          <div className="level-description">{level.description}</div>
          {statusBadge}
          {level.progress > 0 && (
            <div className="level-progress" style={{ marginTop: 'var(--space-2)' }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${level.progress}%` }}></div>
              </div>
              <span className="level-percent">{level.progress}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLevelDetail = (level) => {
    const levelGames = appData.games.filter(g => g.level === level.id);

    return (
      <div className="card level-detail-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h3>{level.emoji} Nivel Actual: {level.name}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          {level.description} — {level.gamesCompleted} de {level.gamesCount} juegos completados.
        </p>
        <div className="level-games-list">
          {levelGames.map(game => (
            <div key={game.id} className="level-game-item">
              <span className={`game-check ${game.stars > 0 ? 'done' : 'pending'}`}>
                {game.stars > 0 ? '✓' : '○'}
              </span>
              <span>{game.emoji} {game.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                {game.stars > 0 ? '⭐'.repeat(game.stars) : 'Sin jugar'}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
          <Link to="/juegos" className="btn btn-primary">Jugar Ahora →</Link>
        </div>
      </div>
    );
  };

  return (
    <div className="levels-page">
      <div className="container">
        <div className="levels-header animate-fade-in-up">
          <h1>🗺️ Mapa de Aventura</h1>
          <p>Avanza por los niveles del tratamiento. Cada nivel desbloquea nuevos juegos y retos.</p>
        </div>

        <div className="levels-map">
          <div className="levels-path">
            <div className="levels-path-fill" style={{ height: `${pathFillPercent}%` }}></div>
          </div>
          {levels.map((level, i) => renderLevelNode(level, i))}
        </div>

        {activeLevel && renderLevelDetail(activeLevel)}
      </div>
    </div>
  );
}
