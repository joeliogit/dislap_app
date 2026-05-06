/* ============================================
   DISSLAPP — Login / Register Page
   ============================================ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GOOGLE_CLIENT_ID = '111402690615-2kadqma0ep1rc9h77scumkgphrdi1d6e.apps.googleusercontent.com';

export default function LoginPage() {
  const { login, loginWithGoogle, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Login state
  const [role, setRole]               = useState('patient');
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [regName, setRegName]               = useState('');
  const [regEmail, setRegEmail]             = useState('');
  const [regPassword, setRegPassword]       = useState('');
  const [regConfirm, setRegConfirm]         = useState('');
  const [showRegPass, setShowRegPass]       = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Shared state
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successName, setSuccessName] = useState('');
  const [registerOk, setRegisterOk] = useState(false);

  const googleBtnRef      = useRef(null);
  const googleCallbackRef = useRef(null);
  const [googleRendered, setGoogleRendered] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard');
  }, [isLoggedIn, navigate]);

  // Reset errors when switching mode
  useEffect(() => {
    setError(null);
    setRegisterOk(false);
  }, [mode]);

  // ── Google Demo fallback ──
  const handleGoogleFallback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle(null);
      setSuccessName(result.user?.name || 'Usuario Google');
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); navigate('/dashboard'); }, 1500);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
      setLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  // ── Google Sign-In ──
  const handleGoogleResponse = useCallback(async (response) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle(response.credential);
      setSuccessName(result.user?.name || 'Usuario');
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); navigate('/dashboard'); }, 1500);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión con Google.');
      setLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  googleCallbackRef.current = handleGoogleResponse;

  useEffect(() => {
    if (mode !== 'login') return;
    const init = () => {
      if (!window.google || !googleBtnRef.current) return;
      try {
        window.google.accounts.id.initialize({
          client_id:            GOOGLE_CLIENT_ID,
          callback:             (r) => googleCallbackRef.current(r),
          use_fedcm_for_prompt: false,
        });
        const w = Math.min(googleBtnRef.current.offsetWidth || 380, 400);
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular', width: w,
        });
        setGoogleRendered(true);
      } catch { setGoogleRendered(false); }
    };

    if (window.google) {
      init();
    } else {
      const existing = document.getElementById('google-gsi-script');
      if (existing) { existing.addEventListener('load', init); }
      else {
        const s = document.createElement('script');
        s.id = 'google-gsi-script';
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true; s.defer = true;
        s.addEventListener('load', init);
        document.head.appendChild(s);
      }
    }
  }, [mode]);

  // ── Login submit ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setTimeout(async () => {
      const result = await login(username, password, role);
      setSuccessName(result.user?.name || username);
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); navigate('/dashboard'); }, 1500);
    }, 600);
  };

  // ── Register submit ──
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      return setError('Todos los campos son obligatorios.');
    }
    if (regPassword !== regConfirm) {
      return setError('Las contraseñas no coinciden.');
    }
    if (regPassword.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('disslapp_token');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, role: 'psychologist' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al registrar');
      setRegisterOk(true);
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirm('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => { setMode('register'); window.scrollTo(0, 0); };
  const switchToLogin    = () => { setMode('login'); window.scrollTo(0, 0); };

  return (
    <>
      <div className="auth-page">
        {/* ── Visual side ── */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">{mode === 'register' ? '🩺' : '🧠'}</div>
            <h2>{mode === 'register' ? 'Crea tu cuenta profesional' : 'Bienvenido a Disslapp'}</h2>
            <p>{mode === 'register'
              ? 'Regístrate como psicólogo para acceder al panel de control y gestionar el progreso de tus pacientes.'
              : 'La plataforma terapéutica que transforma el tratamiento de la dislexia a través del juego y la tecnología.'
            }</p>
          </div>
        </div>

        {/* ── Form side ── */}
        <div className="auth-form-side">
          <div className="auth-form-container">

            {/* ══════════ LOGIN ══════════ */}
            {mode === 'login' && (
              <>
                <div className="auth-form-header">
                  <h1>Iniciar Sesión</h1>
                  <p>Accede a tu cuenta para continuar</p>
                </div>

                <div className="google-btn-wrapper" ref={googleBtnRef} />
                {!googleRendered && (
                  <button
                    type="button"
                    className="btn-google-fallback"
                    onClick={handleGoogleFallback}
                    disabled={loading}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar con Google
                  </button>
                )}
                <div className="auth-divider">o continúa con tu cuenta</div>

                <div className="auth-tabs">
                  <button className={`auth-tab${role === 'patient' ? ' active' : ''}`} onClick={() => setRole('patient')}>🎮 Paciente</button>
                  <button className={`auth-tab${role === 'psychologist' ? ' active' : ''}`} onClick={() => setRole('psychologist')}>🩺 Psicólogo</button>
                </div>

                <form className="auth-form" autoComplete="off" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">
                      {role === 'psychologist' ? 'Correo Institucional' : 'Código de Paciente'}
                    </label>
                    <div className="input-icon-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type={role === 'psychologist' ? 'email' : 'text'}
                        className="form-input"
                        placeholder={role === 'psychologist' ? 'doctor@clinica.com' : 'Ej: PAC-001 o tu nombre'}
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <div className="input-icon-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {error && <div className="auth-error">⚠️ {error}</div>}

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                  </button>
                </form>

                <p className="auth-footer-text">
                  ¿Eres profesional?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); switchToRegister(); }}>
                    Registra tu cuenta aquí
                  </a>
                </p>
              </>
            )}

            {/* ══════════ REGISTER ══════════ */}
            {mode === 'register' && (
              <>
                <div className="auth-form-header">
                  <h1>Registro Profesional</h1>
                  <p>Crea tu cuenta de psicólogo en Disslapp</p>
                </div>

                {registerOk ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                    <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>🎉</div>
                    <h2 style={{ marginBottom: 'var(--space-2)' }}>¡Cuenta creada!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
                      Tu cuenta profesional ha sido registrada exitosamente. Ya puedes iniciar sesión.
                    </p>
                    <button className="btn btn-primary" onClick={switchToLogin}>
                      Ir al Login →
                    </button>
                  </div>
                ) : (
                  <form className="auth-form" autoComplete="off" onSubmit={handleRegister}>
                    <div className="form-group">
                      <label className="form-label">Nombre Completo</label>
                      <div className="input-icon-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Dra. Ana García"
                          required
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Correo Institucional</label>
                      <div className="input-icon-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="doctor@clinica.com"
                          required
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contraseña</label>
                      <div className="input-icon-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        <input
                          type={showRegPass ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Mínimo 6 caracteres"
                          required
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                        />
                        <button type="button" className="password-toggle" onClick={() => setShowRegPass(!showRegPass)}>
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirmar Contraseña</label>
                      <div className="input-icon-wrapper">
                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        <input
                          type={showRegConfirm ? 'text' : 'password'}
                          className="form-input"
                          placeholder="Repite tu contraseña"
                          required
                          value={regConfirm}
                          onChange={e => setRegConfirm(e.target.value)}
                        />
                        <button type="button" className="password-toggle" onClick={() => setShowRegConfirm(!showRegConfirm)}>
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Password match indicator */}
                    {regConfirm && (
                      <p style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 700,
                        marginBottom: 'var(--space-4)',
                        color: regPassword === regConfirm ? 'var(--green-600)' : '#DC2626',
                      }}>
                        {regPassword === regConfirm ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                      </p>
                    )}

                    {error && <div className="auth-error">⚠️ {error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Creando cuenta...' : 'Crear Cuenta Profesional 🩺'}
                    </button>
                  </form>
                )}

                <p className="auth-footer-text">
                  ¿Ya tienes cuenta?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); switchToLogin(); }}>
                    Inicia sesión aquí
                  </a>
                </p>
              </>
            )}

          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="login-success-overlay">
          <div className="login-success-card">
            <div className="success-icon">🎉</div>
            <h2>¡Bienvenido!</h2>
            <p>Hola <strong>{successName}</strong>, tu sesión ha iniciado correctamente.</p>
          </div>
        </div>
      )}
    </>
  );
}
