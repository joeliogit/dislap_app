/* ============================================
   DISSLAPP — Landing Page
   ============================================ */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function animateCounter(el, target) {
  let current = 0;
  const step = Math.ceil(target / 60);
  const suffix = target === 95 ? '%' : '+';
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString() + suffix;
  }, 25);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
}

export default function LandingPage() {
  useEffect(() => {
    initCounters();

    // Init reveal animations
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

  return (
    <>
      {/* Hero */}
      <section className="hero" id="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text animate-fade-in-up">
            <div className="hero-badge">🧠 Plataforma Terapéutica Digital</div>
            <h1 className="hero-title">
              Transformamos el tratamiento de la <span className="highlight">dislexia</span>
            </h1>
            <p className="hero-subtitle">
              Herramienta clínica diseñada para psicólogos. Juegos terapéuticos, seguimiento de avances y un sistema de logros que motiva a tus pacientes.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">Comenzar Ahora ✨</Link>
              <Link to="/nosotros" className="btn btn-outline">Conoce Más →</Link>
            </div>
          </div>
          <div className="hero-illustration animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="hero-visual">
              <div className="orbit orbit-1"></div>
              <div className="orbit orbit-2"></div>
              <div className="orbit orbit-3"></div>
              <div className="center-icon">🧠</div>
              <div className="orbit-item" style={{ top: '-5%', left: '50%', transform: 'translateX(-50%)' }}>📚</div>
              <div className="orbit-item" style={{ top: '50%', right: '-5%', transform: 'translateY(-50%)' }}>🎮</div>
              <div className="orbit-item" style={{ bottom: '-5%', left: '50%', transform: 'translateX(-50%)' }}>📊</div>
              <div className="orbit-item" style={{ top: '50%', left: '-5%', transform: 'translateY(-50%)' }}>🏆</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section" id="features-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>¿Por qué elegir Disslapp?</h2>
            <p>Una plataforma completa que combina ciencia, tecnología y diversión para el tratamiento efectivo de la dislexia.</p>
          </div>
          <div className="features-grid stagger-children">
            <div className="card feature-card card-glow">
              <div className="feature-icon">🎮</div>
              <h3>Juegos Terapéuticos</h3>
              <p>8 juegos diseñados con principios pedagógicos científicos para trabajar diferentes habilidades.</p>
            </div>
            <div className="card feature-card card-glow">
              <div className="feature-icon">📈</div>
              <h3>Niveles Progresivos</h3>
              <p>5 niveles de tratamiento estructurados que adaptan la dificultad al avance del paciente.</p>
            </div>
            <div className="card feature-card card-glow">
              <div className="feature-icon">🏅</div>
              <h3>Sistema de Logros</h3>
              <p>Insignias, puntos XP y rachas diarias que mantienen la motivación alta durante el tratamiento.</p>
            </div>
            <div className="card feature-card card-glow">
              <div className="feature-icon">📊</div>
              <h3>Reportes Clínicos</h3>
              <p>Gráficas de avance, historial de sesiones y reportes exportables para el profesional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" id="how-it-works-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>¿Cómo funciona?</h2>
            <p>En solo 3 pasos, comienza a transformar el tratamiento de tus pacientes.</p>
          </div>
          <div className="steps-grid reveal">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Crea el Perfil</h3>
              <p>El psicólogo registra al paciente y configura su nivel inicial de tratamiento.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>El Paciente Juega</h3>
              <p>El paciente accede a los juegos asignados y completa ejercicios terapéuticos divertidos.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Monitorea el Avance</h3>
              <p>El profesional visualiza gráficas de progreso y genera reportes clínicos en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="testimonials-section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <h2>Lo que dicen los profesionales</h2>
            <p>Psicólogos y terapeutas ya confían en Disslapp para sus tratamientos.</p>
          </div>
          <div className="testimonials-track reveal">
            <div className="card testimonial-card">
              <p className="testimonial-text">Disslapp ha revolucionado la forma en que trabajo con mis pacientes con dislexia. Los niños llegan motivados a cada sesión porque saben que van a jugar y ganar logros.</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">MC</div>
                <div>
                  <div className="testimonial-name">Dra. María Castillo</div>
                  <div className="testimonial-role">Neuropsicóloga Infantil</div>
                </div>
              </div>
            </div>
            <div className="card testimonial-card">
              <p className="testimonial-text">El sistema de niveles y logros hace que los pacientes se comprometan con su tratamiento. He visto mejoras significativas en solo 3 meses de uso constante.</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">RL</div>
                <div>
                  <div className="testimonial-name">Dr. Roberto López</div>
                  <div className="testimonial-role">Psicólogo Educativo</div>
                </div>
              </div>
            </div>
            <div className="card testimonial-card">
              <p className="testimonial-text">Los reportes de avance me permiten demostrar a los padres el progreso real de sus hijos. Es una herramienta indispensable en mi consulta.</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AG</div>
                <div>
                  <div className="testimonial-name">Dra. Ana García</div>
                  <div className="testimonial-role">Terapeuta del Lenguaje</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" id="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card reveal">
              <div className="stat-value" data-count="1250">0</div>
              <div className="stat-label">Pacientes Atendidos</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-value" data-count="8500">0</div>
              <div className="stat-label">Sesiones Completadas</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-value" data-count="15000">0</div>
              <div className="stat-label">Logros Desbloqueados</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-value" data-count="95">0</div>
              <div className="stat-label">% Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" id="cta-section">
        <div className="container">
          <div className="cta-card reveal">
            <h2>¿Listo para transformar tu práctica clínica?</h2>
            <p>Únete a cientos de profesionales que ya usan Disslapp para potenciar el tratamiento de la dislexia.</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary btn-lg">Comenzar Gratis</Link>
              <Link to="/doctora" className="btn btn-secondary btn-lg">Conoce a la Doctora</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
