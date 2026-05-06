/* ============================================
   DISSLAPP — Levels Page (Redesign)
   ============================================ */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LEVEL_XP = [0, 500, 1500, 3500, 7000];
const LEVEL_SKILLS = {
  1: ['Fonología', 'Discriminación visual', 'Fonémica', 'Silábica', 'Decodificación'],
  2: ['Rima', 'Memoria', 'Visual avanzado', 'Cadenas silábicas', 'Conteo fonético'],
  3: ['Comprensión', 'Morfología', 'Vocabulario', 'Fluidez básica', 'Lectura crítica'],
  4: ['Ortografía', 'Escritura creativa', 'Comprensión profunda', 'Lectura expresiva', 'Narrativa'],
  5: ['Narración', 'Revisión integral', 'Fluidez avanzada', 'Maestría lectora'],
};

export default function LevelsPage() {
  const { appData, user } = useAuth();
  const levels = appData.levels;
  const completedCount = levels.filter(l => l.status === 'completed').length;
  const activeLevel    = levels.find(l => l.status === 'active');
  const totalPct = Math.round(
    ((completedCount + (activeLevel ? activeLevel.progress / 100 : 0)) / levels.length) * 100
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="levels-page">
      <div className="container">

        {/* ── Hero ── */}
        <div className="levels-hero animate-fade-in-up">
          <div className="levels-hero-inner">
            <div className="levels-hero-left">
              <span className="levels-eyebrow">🗺️ Mapa de Aprendizaje</span>
              <h1>Tu Camino <span className="text-gradient">Terapéutico</span></h1>
              <p>Avanza nivel a nivel dominando cada área. Cada etapa desbloquea nuevos juegos y retos diseñados por especialistas.</p>
              <div className="journey-bar-wrapper">
                <div className="journey-bar-labels">
                  <span>Progreso general</span>
                  <strong>{totalPct}%</strong>
                </div>
                <div className="journey-bar-track">
                  <div className="journey-bar-fill" style={{ width: `${totalPct}%` }} />
                </div>
                <p className="journey-bar-sub">{completedCount} de {levels.length} niveles completados</p>
              </div>
            </div>
            <div className="levels-hero-stats">
              {[
                { label: 'XP Total',     value: (user?.xp || 0).toLocaleString() },
                { label: 'Nivel actual', value: user?.levelName || 'Explorador'   },
                { label: 'Niveles',      value: `${completedCount}/${levels.length}` },
              ].map((s, i) => (
                <div key={i} className="levels-stat-card">
                  <div className="levels-stat-val">{s.value}</div>
                  <div className="levels-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Level Cards Grid ── */}
        <div className="levels-cards-grid">
          {levels.map((level, idx) => {
            const levelGames = appData.games.filter(g => g.level === level.id);
            const doneGames  = levelGames.filter(g => g.stars > 0).length;
            const skills     = LEVEL_SKILLS[level.id] || [];
            const xpReq      = LEVEL_XP[idx] || 0;
            const pct        = level.status === 'completed' ? 100 : (level.progress || 0);

            return (
              <div
                key={level.id}
                className={`lv-card lv-card--${level.status} reveal`}
                style={{ transitionDelay: `${idx * 0.08}s` }}
              >
                <div className="lv-card-accent" />

                <div className="lv-card-head">
                  <span className={`lv-badge lv-badge--${level.status}`}>Nivel {level.id}</span>
                  <div className={`lv-emoji lv-emoji--${level.status}`}>
                    {level.status === 'locked' ? '🔒' : level.emoji}
                  </div>
                </div>

                <div className="lv-card-body">
                  <h3 className="lv-title">{level.name}</h3>
                  <p className="lv-desc">{level.description}</p>

                  <div className="lv-skills">
                    {skills.slice(0, 3).map((sk, i) => (
                      <span key={i} className="lv-skill">{sk}</span>
                    ))}
                  </div>

                  {level.status !== 'locked' ? (
                    <div className="lv-progress-wrap">
                      <div className="lv-progress-head">
                        <span>{doneGames}/{levelGames.length} juegos</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="lv-progress-track">
                        <div
                          className={`lv-progress-fill lv-progress-fill--${level.status}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="lv-games-dots">
                        {levelGames.map(g => (
                          <span
                            key={g.id}
                            className={`lv-dot ${g.stars > 0 ? 'lv-dot--done' : ''}`}
                            title={g.name}
                          >
                            {g.stars > 0 ? '★' : '○'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="lv-locked-info">
                      {xpReq > 0 && <span>🏆 Necesitas {xpReq.toLocaleString()} XP</span>}
                      <span>Completa el nivel anterior para desbloquear</span>
                    </div>
                  )}
                </div>

                <div className="lv-card-foot">
                  {level.status === 'completed' && (
                    <span className="lv-status lv-status--completed">✓ Completado</span>
                  )}
                  {level.status === 'active' && (
                    <>
                      <span className="lv-status lv-status--active">▶ En progreso</span>
                      <Link to="/juegos" className="btn btn-primary btn-sm">Jugar →</Link>
                    </>
                  )}
                  {level.status === 'locked' && (
                    <span className="lv-status lv-status--locked">🔒 Bloqueado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Active Level Detail ── */}
        {activeLevel && (
          <div className="lv-detail reveal">
            <div className="lv-detail-header">
              <h2>
                {activeLevel.emoji} Jugando ahora:{' '}
                <span className="text-gradient">{activeLevel.name}</span>
              </h2>
              <p>{activeLevel.description} — Completa los juegos para avanzar al siguiente nivel.</p>
            </div>
            <div className="lv-detail-games">
              {appData.games.filter(g => g.level === activeLevel.id).map(game => (
                <div
                  key={game.id}
                  className={`lv-game-row ${game.stars > 0 ? 'lv-game-row--done' : ''}`}
                >
                  <div className={`lv-game-check ${game.stars > 0 ? 'done' : 'pending'}`}>
                    {game.stars > 0 ? '✓' : '○'}
                  </div>
                  <span className="lv-game-name">{game.emoji} {game.name}</span>
                  <span className="lv-game-skill">{game.skill}</span>
                  <span className="lv-game-stars">
                    {game.stars > 0 ? Array(game.stars).fill('⭐').join('') : '☆☆☆'}
                  </span>
                </div>
              ))}
            </div>
            <div className="lv-detail-cta">
              <Link to="/juegos" className="btn btn-primary btn-lg">🎮 Ir a los Juegos →</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
