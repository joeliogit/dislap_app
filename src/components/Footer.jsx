/* ============================================
   DISSLAPP — Footer Component
   ============================================ */

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="main-footer" className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 40 40" className="logo-svg" width="36" height="36">
                <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" opacity="0.15" />
                <path d="M12 14c0-4 3-7 7-7s7 3 7 7c0 2-1 4-3 5l2 2c1 1 1 3-1 4l-3 2c-1 1-3 0-3-1l-1-3c-1 0-2 0-3-1-2-1-3-3-2-5z" fill="url(#logoGrad)" opacity="0.8" />
                <path d="M14 22c0 0 2 6 6 8s8-1 8-1" stroke="url(#logoGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span className="brand-text">Diss<span className="brand-accent">lapp</span></span>
            </div>
            <p className="footer-tagline">Transformando el tratamiento de la dislexia a través de la tecnología y el juego.</p>
          </div>
          <div className="footer-links-group">
            <h4>Plataforma</h4>
            <Link to="/juegos">Juegos</Link>
            <Link to="/niveles">Niveles</Link>
            <Link to="/avances">Avances</Link>
            <Link to="/login">Iniciar Sesión</Link>
          </div>
          <div className="footer-links-group">
            <h4>Empresa</h4>
            <Link to="/doctora">La Doctora</Link>
            <Link to="/nosotros">Sobre Nosotros</Link>
            <Link to="/nosotros">Contacto</Link>
          </div>
          <div className="footer-links-group">
            <h4>Legal</h4>
            <a href="#">Política de Privacidad</a>
            <a href="#">Términos de Uso</a>
            <a href="#">Aviso Legal</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Disslapp. Todos los derechos reservados.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
