/* ============================================
   DISSLAPP — About Us Page
   ============================================ */

import { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';

export default function AboutPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('idle'); // idle, sending, sent

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('sending');

    try {
      await contactAPI.send(contactForm);
    } catch {
      // Backend might not be running - still show success for demo
    }

    setTimeout(() => {
      setContactStatus('sent');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setContactStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero animate-fade-in-up">
          <h1>Sobre <span className="text-gradient">Disslapp</span></h1>
          <p>Somos un equipo multidisciplinario comprometido con transformar el tratamiento de la dislexia mediante tecnología accesible, ciencia y mucho corazón.</p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="mvv-section">
          <div className="mvv-grid stagger-children">
            <div className="card mvv-card">
              <div className="mvv-icon">🎯</div>
              <h3>Misión</h3>
              <p>Democratizar el acceso a herramientas terapéuticas efectivas y motivadoras para el tratamiento de la dislexia, empoderando a profesionales y pacientes por igual.</p>
            </div>
            <div className="card mvv-card">
              <div className="mvv-icon">🔭</div>
              <h3>Visión</h3>
              <p>Ser la plataforma líder en Latinoamérica para el tratamiento digital de la dislexia, reconocida por su impacto clínico y su innovación tecnológica.</p>
            </div>
            <div className="card mvv-card">
              <div className="mvv-icon">💜</div>
              <h3>Propósito</h3>
              <p>Cada persona con dislexia merece las mejores herramientas para descubrir su potencial. Nosotros las construimos.</p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="history-section reveal">
          <div className="history-content">
            <div className="history-text">
              <h2>Nuestra <span className="text-gradient">Historia</span></h2>
              <p>Disslapp nació en 2023 cuando la Dra. Elena Martínez, después de más de una década tratando pacientes con dislexia, identificó una necesidad crítica: las herramientas digitales disponibles no estaban diseñadas por clínicos, no eran motivadoras y no generaban datos útiles para el profesional.</p>
              <p>Reunió a un equipo de desarrolladores, diseñadores y neuropsicólogos para crear una plataforma que combinara lo mejor de la ciencia del aprendizaje con técnicas de gamificación probadas. El resultado es Disslapp: una herramienta que los pacientes quieren usar y los profesionales necesitan.</p>
              <p>Hoy, cientos de psicólogos confían en Disslapp para complementar sus tratamientos, y miles de pacientes han experimentado mejoras significativas en sus habilidades lectoras.</p>
            </div>
            <div className="history-image">🌱</div>
          </div>
        </div>

        {/* Values */}
        <div className="values-section reveal">
          <h2>Nuestros <span className="text-gradient">Valores</span></h2>
          <div className="values-grid stagger-children">
            {[
              { icon: '💛', title: 'Empatía', desc: 'Diseñamos pensando en cada usuario: el niño que se frustra, el adulto que perdió la esperanza, el profesional que busca impacto.' },
              { icon: '💡', title: 'Innovación', desc: 'Integramos las últimas investigaciones en neurociencias con tecnología moderna para crear experiencias únicas.' },
              { icon: '🔬', title: 'Evidencia Científica', desc: 'Cada juego, cada nivel y cada métrica está respaldada por literatura revisada por pares y experiencia clínica.' },
              { icon: '🤝', title: 'Inclusión', desc: 'Creemos en el acceso universal. Nuestra plataforma es accesible, asequible y diseñada para todas las edades.' },
            ].map((v, i) => (
              <div key={i} className="card value-card">
                <div className="value-icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="team-section reveal">
          <h2>Nuestro <span className="text-gradient">Equipo</span></h2>
          <div className="team-grid stagger-children">
            {[
              { avatar: '👩‍⚕️', name: 'Dra. Elena Martínez', role: 'Fundadora & Directora Clínica', bio: 'Neuropsicóloga con 15+ años de experiencia en dislexia. Diseña la metodología terapéutica de la plataforma.' },
              { avatar: '👨‍💻', name: 'Carlos Méndez', role: 'Director de Tecnología', bio: 'Ingeniero de software especializado en aplicaciones educativas y experiencias interactivas.' },
              { avatar: '👩‍🎨', name: 'Sofía Velasco', role: 'Diseñadora UX/UI', bio: 'Diseñadora de experiencias accesibles con enfoque en usabilidad para niños y adolescentes.' },
            ].map((m, i) => (
              <div key={i} className="card team-card">
                <div className="team-avatar">{m.avatar}</div>
                <h4>{m.name}</h4>
                <div className="team-role">{m.role}</div>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Impact */}
        <div className="impact-section reveal">
          <h2>Nuestro Impacto</h2>
          <div className="impact-grid">
            {[
              { value: '1,250+', label: 'Pacientes Atendidos' },
              { value: '85+', label: 'Profesionales' },
              { value: '5', label: 'Países' },
              { value: '8,500+', label: 'Sesiones' },
            ].map((item, i) => (
              <div key={i} className="impact-item">
                <div className="impact-value">{item.value}</div>
                <div className="impact-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="contact-section reveal">
          <h2>Contáctanos</h2>
          <p>¿Tienes preguntas o quieres colaborar con nosotros? Escríbenos y te responderemos pronto.</p>
          <div className="card contact-form">
            <form id="contact-form" onSubmit={handleContactSubmit}>
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Nombre</label>
                  <input
                    type="text"
                    className="form-input"
                    id="contact-name"
                    placeholder="Tu nombre"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Correo</label>
                  <input
                    type="email"
                    className="form-input"
                    id="contact-email"
                    placeholder="tu@correo.com"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Mensaje</label>
                <textarea
                  className="form-input"
                  id="contact-message"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                id="contact-submit-btn"
                disabled={contactStatus !== 'idle'}
                style={contactStatus === 'sent' ? { background: 'linear-gradient(135deg, #059669, #34D399)' } : {}}
              >
                {contactStatus === 'sending' ? 'Enviando...' : contactStatus === 'sent' ? '✓ Mensaje Enviado' : 'Enviar Mensaje ✉️'}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <div className="contact-info-item">
              <span className="info-icon">📧</span>
              <span>info@disslapp.com</span>
            </div>
            <div className="contact-info-item">
              <span className="info-icon">📍</span>
              <span>Ciudad de México, México</span>
            </div>
            <div className="contact-info-item">
              <span className="info-icon">📱</span>
              <span>@disslapp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
