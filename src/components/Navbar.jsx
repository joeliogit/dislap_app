/* ============================================
   DISSLAPP — Navbar Component
   ============================================ */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const theme = localStorage.getItem('disslapp_theme') || 'light';
  const [currentTheme, setCurrentTheme] = useState(theme);

  const toggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('disslapp_theme', next);
    setCurrentTheme(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  const navLinks = [
    { to: '/', label: 'Inicio', page: 'landing' },
    { to: '/juegos', label: 'Juegos', page: 'games' },
    { to: '/niveles', label: 'Niveles', page: 'levels' },
    { to: '/avances', label: 'Avances', page: 'progress' },
    { to: '/doctora', label: 'La Doctora', page: 'doctor' },
    { to: '/nosotros', label: 'Nosotros', page: 'about' },
    { to: '/precios',  label: 'Precios',  page: 'pricing' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav id="main-navbar" className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 40 40" className="logo-svg">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#7C3AED' }} />
                  <stop offset="100%" style={{ stopColor: '#059669' }} />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" opacity="0.15" />
              <path d="M12 14c0-4 3-7 7-7s7 3 7 7c0 2-1 4-3 5l2 2c1 1 1 3-1 4l-3 2c-1 1-3 0-3-1l-1-3c-1 0-2 0-3-1-2-1-3-3-2-5z" fill="url(#logoGrad)" opacity="0.8" />
              <path d="M14 22c0 0 2 6 6 8s8-1 8-1" stroke="url(#logoGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="16" cy="13" r="1.5" fill="white" opacity="0.9" />
              <circle cx="24" cy="13" r="1.5" fill="white" opacity="0.9" />
            </svg>
          </div>
          <span className="brand-text">Diss<span className="brand-accent">lapp</span></span>
        </Link>

        <ul className={`navbar-links${menuOpen ? ' open' : ''}`} id="navbar-links">
          {navLinks.map(link => (
            <li key={link.page}>
              <Link
                to={link.to}
                className={`nav-link${location.pathname === link.to ? ' active' : ''}`}
                data-page={link.page}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button id="theme-toggle" className="btn-icon" title="Cambiar tema" aria-label="Cambiar tema" onClick={toggleTheme}>
            <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>

          {!isLoggedIn ? (
            <Link to="/login" className="btn btn-primary btn-sm" id="login-btn">Iniciar Sesión</Link>
          ) : (
            <div className="user-menu" id="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar"
                id="user-avatar-btn"
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
              >
                <span id="user-initials">{user?.avatar || user?.name?.charAt(0)?.toUpperCase() || 'P'}</span>
              </button>
              <div className={`user-dropdown${dropdownOpen ? '' : ' hidden'}`} id="user-dropdown">
                <div className="dropdown-header">
                  <span id="dropdown-name">{user?.name || 'Usuario'}</span>
                  <span id="dropdown-role" className="role-badge">
                    {user?.role === 'psychologist' ? 'Psicólogo' : 'Paciente'}
                  </span>
                </div>
                {user?.role === 'psychologist'
                  ? <Link to="/panel-doctor" className="dropdown-item">Panel de Control</Link>
                  : <Link to="/dashboard" className="dropdown-item">Mi Dashboard</Link>
                }
                {user?.role !== 'psychologist' && (
                  <Link to="/avances" className="dropdown-item">Mis Avances</Link>
                )}
                <button className="dropdown-item logout-btn" id="logout-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className={`navbar-hamburger${menuOpen ? ' active' : ''}`}
          id="hamburger-btn"
          aria-label="Menú"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
