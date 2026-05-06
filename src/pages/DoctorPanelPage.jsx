/* ============================================
   DISSLAPP — Doctor Control Panel
   ============================================ */

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const API_BASE = '/api';

async function apiFetch(endpoint) {
  const token = localStorage.getItem('disslapp_token');
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error en la solicitud');
  return res.json();
}

function formatTime(seconds) {
  if (!seconds) return '—';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Nunca';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function LevelBadge({ level, levelName }) {
  const colors = ['', '#7C3AED', '#059669', '#2563EB', '#D97706', '#DC2626', '#7C3AED'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
      background: colors[level] || '#7C3AED', color: '#fff',
    }}>
      Nv.{level} {levelName}
    </span>
  );
}

function PatientCard({ patient, onClick }) {
  return (
    <div className="card doctor-patient-card" onClick={() => onClick(patient)}>
      <div className="dpc-header">
        <div className="dpc-avatar">{patient.avatar || patient.name.charAt(0).toUpperCase()}</div>
        <div className="dpc-info">
          <div className="dpc-name">{patient.name}</div>
          <div className="dpc-code">{patient.patient_code || patient.email || '—'}</div>
        </div>
        <LevelBadge level={patient.level} levelName={patient.level_name} />
      </div>
      <div className="dpc-stats">
        <div className="dpc-stat">
          <span className="dpc-stat-icon">⭐</span>
          <span className="dpc-stat-val">{(patient.xp || 0).toLocaleString()}</span>
          <span className="dpc-stat-lbl">XP</span>
        </div>
        <div className="dpc-stat">
          <span className="dpc-stat-icon">🔥</span>
          <span className="dpc-stat-val">{patient.streak || 0}</span>
          <span className="dpc-stat-lbl">Racha</span>
        </div>
        <div className="dpc-stat">
          <span className="dpc-stat-icon">🎮</span>
          <span className="dpc-stat-val">{patient.total_games_played || 0}</span>
          <span className="dpc-stat-lbl">Juegos</span>
        </div>
        <div className="dpc-stat">
          <span className="dpc-stat-icon">📅</span>
          <span className="dpc-stat-val" style={{ fontSize: '11px' }}>{formatDate(patient.last_session)}</span>
          <span className="dpc-stat-lbl">Última sesión</span>
        </div>
      </div>
      <button className="btn btn-primary btn-sm dpc-btn">Ver Detalle →</button>
    </div>
  );
}

function PatientModal({ patientId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('resumen');

  useEffect(() => {
    apiFetch(`/doctor/patients/${patientId}`)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [patientId]);

  if (loading) return (
    <div className="doctor-modal-overlay">
      <div className="doctor-modal">
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-muted)' }}>
          Cargando datos del paciente...
        </div>
      </div>
    </div>
  );

  if (!data?.patient) return null;

  const { patient, sessions, completedGames, weeklyXP, skillTimes } = data;
  const maxXP = Math.max(...(weeklyXP || []).map(w => w.xp), 1);

  return (
    <div className="doctor-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="doctor-modal">
        <div className="doctor-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div className="dpc-avatar" style={{ width: 48, height: 48, fontSize: '20px' }}>
              {patient.avatar || patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ marginBottom: 4 }}>{patient.name}</h2>
              <LevelBadge level={patient.level} levelName={patient.level_name} />
            </div>
          </div>
          <button className="game-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Quick stats */}
        <div className="dpm-quick-stats">
          {[
            { icon: '⭐', val: (patient.xp || 0).toLocaleString(), lbl: 'XP Total' },
            { icon: '🔥', val: patient.streak || 0, lbl: 'Racha' },
            { icon: '🎮', val: patient.total_games_played || 0, lbl: 'Juegos' },
            { icon: '📋', val: patient.total_sessions || 0, lbl: 'Sesiones' },
          ].map((s, i) => (
            <div key={i} className="dpm-qs-item">
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span className="dpm-qs-val">{s.val}</span>
              <span className="dpm-qs-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="progress-tabs" style={{ margin: '0 var(--space-6)', borderBottom: '2px solid var(--border-color)' }}>
          {['resumen', 'sesiones', 'tiempos'].map(t => (
            <button key={t} className={`progress-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'resumen' ? 'Resumen' : t === 'sesiones' ? 'Historial' : 'Métricas'}
            </button>
          ))}
        </div>

        <div className="doctor-modal-body">

          {/* ── Resumen ── */}
          {tab === 'resumen' && (
            <>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>XP últimas 2 semanas</h3>
              {weeklyXP?.length > 0 ? (
                <div className="bar-chart" style={{ height: 140, marginBottom: 'var(--space-6)' }}>
                  {weeklyXP.map((d, i) => {
                    const label = new Date(d.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                    return (
                      <div key={i} className="bar-chart-item">
                        <div className="bar-value">{d.xp > 0 ? d.xp : ''}</div>
                        <div className="bar-fill" style={{ height: `${(d.xp / maxXP) * 100}%` }}></div>
                        <div className="bar-label" style={{ fontSize: 9 }}>{label}</div>
                      </div>
                    );
                  })}
                </div>
              ) : <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>Sin actividad reciente.</p>}

              <h3 style={{ marginBottom: 'var(--space-4)' }}>Juegos completados ({completedGames?.length || 0})</h3>
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {(completedGames || []).map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: 20 }}>{'⭐'.repeat(g.stars)}{'☆'.repeat(3 - g.stars)}</span>
                    <span style={{ fontWeight: 700, flex: 1, fontSize: 'var(--font-size-sm)' }}>Juego #{g.game_id}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.attempts} intento{g.attempts > 1 ? 's' : ''}</span>
                    <span style={{ fontSize: 12, color: 'var(--purple-600)', fontWeight: 700 }}>{formatTime(g.avg_seconds)} prom.</span>
                  </div>
                ))}
                {(!completedGames || completedGames.length === 0) && (
                  <p style={{ color: 'var(--text-muted)' }}>Aún no ha completado juegos.</p>
                )}
              </div>
            </>
          )}

          {/* ── Historial ── */}
          {tab === 'sesiones' && (
            <>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Últimas 30 sesiones</h3>
              {sessions?.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Sin sesiones registradas.</p>}
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                {(sessions || []).map((s, i) => (
                  <div key={i} className="session-item card" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                        {s.emoji} {s.game_name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {formatDate(s.played_at)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                      <span style={{ fontSize: 14 }}>{'⭐'.repeat(s.stars)}{'☆'.repeat(3 - s.stars)}</span>
                      <span style={{ fontSize: 12, color: 'var(--purple-600)', fontWeight: 700 }}>{formatTime(s.duration_seconds)}</span>
                      <span style={{ fontSize: 13, color: 'var(--green-600)', fontWeight: 800 }}>+{s.xp_earned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Métricas de tratamiento ── */}
          {tab === 'tiempos' && (
            <>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Tiempo promedio de respuesta por habilidad</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
                Métrica de tratamiento: un tiempo menor indica mayor automatización de la habilidad.
              </p>
              {skillTimes?.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Sin datos suficientes.</p>}
              <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                {(skillTimes || []).map((s, i) => {
                  const secs = Math.round(s.avg_seconds);
                  const pct  = Math.min((secs / 120) * 100, 100); // 120s = barra llena
                  const color = secs < 30 ? '#059669' : secs < 60 ? '#D97706' : '#DC2626';
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{s.skill}</span>
                        <span style={{ fontWeight: 800, color, fontSize: 'var(--font-size-sm)' }}>
                          {formatTime(secs)} prom. · {s.total} sesión{s.total > 1 ? 'es' : ''}
                        </span>
                      </div>
                      <div style={{ background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', height: 10, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                        <span>Rápido (&lt;30s)</span><span>Moderado (30-60s)</span><span>Lento (&gt;60s)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DoctorPanelPage() {
  const { user, isLoggedIn } = useAuth();

  const [patients, setPatients]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedId, setSelectedId]   = useState(null);
  const [search, setSearch]           = useState('');

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== 'psychologist') return <Navigate to="/dashboard" replace />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    apiFetch('/doctor/patients')
      .then(d => { setPatients(d.patients || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.patient_code || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalSessions = patients.reduce((s, p) => s + (p.total_sessions || 0), 0);
  const avgXP         = patients.length ? Math.round(patients.reduce((s, p) => s + (p.xp || 0), 0) / patients.length) : 0;

  return (
    <div className="doctor-panel-page">
      <div className="container">

        {/* Header */}
        <div className="dp-header animate-fade-in-up">
          <div>
            <h1>🩺 Panel de Control</h1>
            <p>Bienvenido, <strong>{user.name}</strong> — supervisión de pacientes en tiempo real.</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="dp-summary stagger-children">
          <div className="card dp-summary-card">
            <div className="dp-sum-icon">👥</div>
            <div className="dp-sum-val">{patients.length}</div>
            <div className="dp-sum-lbl">Pacientes</div>
          </div>
          <div className="card dp-summary-card">
            <div className="dp-sum-icon">🎮</div>
            <div className="dp-sum-val">{totalSessions}</div>
            <div className="dp-sum-lbl">Sesiones Totales</div>
          </div>
          <div className="card dp-summary-card">
            <div className="dp-sum-icon">⭐</div>
            <div className="dp-sum-val">{avgXP.toLocaleString()}</div>
            <div className="dp-sum-lbl">XP Promedio</div>
          </div>
          <div className="card dp-summary-card">
            <div className="dp-sum-icon">🔥</div>
            <div className="dp-sum-val">{patients.filter(p => p.streak > 0).length}</div>
            <div className="dp-sum-lbl">Con Racha Activa</div>
          </div>
        </div>

        {/* Search */}
        <div className="dp-search-bar animate-fade-in-up">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar paciente por nombre o código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', boxShadow: 'none', padding: 0, background: 'transparent' }}
          />
        </div>

        {/* Patient Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
            Cargando pacientes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            {search
              ? <p style={{ color: 'var(--text-muted)' }}>No se encontraron pacientes con "{search}".</p>
              : <p style={{ color: 'var(--text-muted)' }}>Aún no hay pacientes registrados en el sistema.</p>
            }
          </div>
        ) : (
          <div className="dp-patients-grid">
            {filtered.map(p => (
              <PatientCard key={p.id} patient={p} onClick={p => setSelectedId(p.id)} />
            ))}
          </div>
        )}
      </div>

      {selectedId && (
        <PatientModal patientId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
