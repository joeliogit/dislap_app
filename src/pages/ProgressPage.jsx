/* ============================================
   DISSLAPP — Progress & Achievements Page
   ============================================ */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

function formatTime(totalSeconds) {
  if (!totalSeconds || totalSeconds < 60) return `${totalSeconds || 0}s`;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function ProgressPage() {
  const { user, appData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const achievements = appData.achievements;
  const sessions     = appData.sessions;
  const weeklyXP     = appData.weeklyXP;
  const skills       = appData.skills;
  const maxWeeklyXP  = Math.max(...weeklyXP.map(w => w.value), 1);

  // Total time played from real session durations
  const totalSeconds  = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const timeDisplay   = formatTime(totalSeconds);

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
  }, [activeTab]);

  return (
    <div className="progress-page">
      <div className="container">
        <div className="progress-header animate-fade-in-up">
          <h1>📊 Mis Avances</h1>
          <p>Visualiza tu progreso y celebra cada logro en tu camino.</p>
        </div>

        <div className="progress-tabs animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button className={`progress-tab${activeTab === 'overview' ? ' active' : ''}`} onClick={() => setActiveTab('overview')}>Resumen</button>
          <button className={`progress-tab${activeTab === 'achievements' ? ' active' : ''}`} onClick={() => setActiveTab('achievements')}>Logros</button>
          <button className={`progress-tab${activeTab === 'sessions' ? ' active' : ''}`} onClick={() => setActiveTab('sessions')}>Historial</button>
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="progress-tab-content">
            <div className="progress-stats stagger-children">
              <div className="card progress-stat-card">
                <div className="progress-stat-icon">🎮</div>
                <div className="progress-stat-value">{user?.totalSessions ?? 0}</div>
                <div className="progress-stat-label">Sesiones Totales</div>
              </div>
              <div className="card progress-stat-card">
                <div className="progress-stat-icon">⏱️</div>
                <div className="progress-stat-value">{timeDisplay}</div>
                <div className="progress-stat-label">Tiempo Jugado</div>
              </div>
              <div className="card progress-stat-card">
                <div className="progress-stat-icon">🔥</div>
                <div className="progress-stat-value">{user?.streak ?? 0}</div>
                <div className="progress-stat-label">Racha Actual</div>
              </div>
              <div className="card progress-stat-card">
                <div className="progress-stat-icon">⭐</div>
                <div className="progress-stat-value">Nv.{user?.level ?? 1}</div>
                <div className="progress-stat-label">Nivel Actual</div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="card chart-card reveal">
                <h3>📈 XP Semanal</h3>
                <div className="bar-chart">
                  {weeklyXP.map((d, i) => (
                    <div key={i} className="bar-chart-item">
                      <div className="bar-value">{d.value > 0 ? d.value : ''}</div>
                      <div className="bar-fill" style={{ height: `${(d.value / maxWeeklyXP) * 100}%` }}></div>
                      <div className="bar-label">{d.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card chart-card reveal">
                <h3>🎯 Habilidades</h3>
                <div className="skills-chart">
                  {skills.map((s, i) => (
                    <div key={i} className="skill-item">
                      <span className="skill-name">{s.name}</span>
                      <div className="skill-bar">
                        <div className={`skill-bar-fill ${s.color}`} style={{ width: `${s.percent}%` }}></div>
                      </div>
                      <span className="skill-percent">{s.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Achievements ── */}
        {activeTab === 'achievements' && (
          <div className="progress-tab-content">
            <div className="achievements-section">
              <h2>🏆 Logros Desbloqueados ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h2>
              <div className="achievements-grid stagger-children">
                {achievements.map(a => (
                  <div key={a.id} className={`card achievement-card ${a.unlocked ? '' : 'locked'}`}>
                    <span className="achievement-icon">{a.emoji}</span>
                    <div className="achievement-name">{a.name}</div>
                    <div className="achievement-desc">{a.desc}</div>
                    <div className="achievement-date">
                      {a.date ? `🗓️ ${a.date}` : '🔒 Bloqueado'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Session History ── */}
        {activeTab === 'sessions' && (
          <div className="progress-tab-content">
            <div className="sessions-section">
              <h2>📋 Historial de Sesiones</h2>
              {sessions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                  <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-muted)' }}>
                    🎮 Aún no has jugado ninguna sesión. ¡Empieza ya!
                  </p>
                </div>
              ) : (
                <div className="session-list">
                  {sessions.map((s, i) => (
                    <div key={i} className="card session-item reveal">
                      <div className="session-date">
                        <div className="session-day">{s.day}</div>
                        <div className="session-month">{s.month}</div>
                      </div>
                      <div className="session-info">
                        <div className="session-title">{s.title}</div>
                        <div className="session-detail">
                          {s.games} juego{s.games > 1 ? 's' : ''} completado{s.games > 1 ? 's' : ''}
                          {s.duration > 0 && ` · ${formatTime(s.duration)}`}
                        </div>
                      </div>
                      <div className="session-xp">+{s.xp} XP</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
