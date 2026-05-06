/* ============================================
   DISSLAPP — Doctor Page
   ============================================ */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DoctorPage() {
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

  return (
    <div className="doctor-page">
      <div className="container">
        {/* Hero */}
        <div className="doctor-hero">
          <div className="doctor-photo-card animate-slide-left">
            <div className="doctor-photo">👩‍⚕️</div>
            <div className="doctor-badge-card">
              <div className="years">15+</div>
              <div className="years-label">Años de Experiencia</div>
            </div>
          </div>
          <div className="doctor-info animate-slide-right">
            <h1>Dra. Elena Martínez Ruiz</h1>
            <div className="doctor-title">Neuropsicóloga Clínica · Especialista en Dislexia y Neurodesarrollo</div>

            <blockquote className="doctor-quote">
              "Creo firmemente que cada persona con dislexia tiene un potencial extraordinario esperando ser descubierto. Disslapp nació de mi deseo de hacer el tratamiento más accesible, más motivador y más efectivo para todos."
            </blockquote>

            <div className="doctor-philosophy">
              <h3>Filosofía de Tratamiento</h3>
              <p>Mi enfoque se basa en la neuroplasticidad — la capacidad del cerebro para reorganizarse y crear nuevas conexiones. Utilizando técnicas de intervención temprana, repetición espaciada y gamificación, logramos que el tratamiento sea no solo efectivo, sino también una experiencia positiva para el paciente. Cada juego en Disslapp está diseñado con base en literatura científica actualizada y años de experiencia clínica directa.</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="doctor-timeline reveal">
          <h2 className="text-gradient">Trayectoria Profesional</h2>
          <div className="timeline">
            {[
              { year: '2010', title: 'Licenciatura en Psicología', desc: 'Universidad Nacional Autónoma — Graduada con honores' },
              { year: '2013', title: 'Maestría en Neuropsicología', desc: 'Especialización en trastornos del aprendizaje y desarrollo infantil' },
              { year: '2015', title: 'Certificación Internacional en Dislexia', desc: 'International Dyslexia Association — Certified Dyslexia Specialist' },
              { year: '2018', title: 'Doctorado en Neurociencias', desc: 'Investigación en intervenciones digitales para trastornos del aprendizaje' },
              { year: '2023', title: 'Fundación de Disslapp', desc: 'Lanzamiento de la plataforma como herramienta clínica digital' },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="doctor-specializations reveal">
          <h2 className="text-gradient">Áreas de Especialización</h2>
          <div className="specializations-grid">
            <div className="card spec-card card-glow">
              <div className="spec-icon">🧠</div>
              <h4>Neuropsicología Infantil</h4>
              <p>Evaluación y tratamiento de trastornos del neurodesarrollo en población infantil y adolescente.</p>
            </div>
            <div className="card spec-card card-glow">
              <div className="spec-icon">📖</div>
              <h4>Dislexia y Dificultades Lectoras</h4>
              <p>Diagnóstico diferencial y programas de intervención personalizados para dislexia.</p>
            </div>
            <div className="card spec-card card-glow">
              <div className="spec-icon">💻</div>
              <h4>Tecnología Educativa</h4>
              <p>Diseño de herramientas digitales basadas en evidencia para el tratamiento terapéutico.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="doctor-cta reveal">
          <h2>¿Deseas consultar con la Dra. Martínez?</h2>
          <p>Agenda una cita de evaluación o conoce más sobre el enfoque terapéutico de Disslapp.</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/nosotros" className="btn btn-primary btn-lg">Contactar ✉️</Link>
            <Link to="/nosotros" className="btn btn-secondary btn-lg">Conoce la Empresa →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
