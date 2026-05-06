/* ============================================
   DISSLAPP — Doctor Page
   ============================================ */

function renderDoctor() {
    return `
    <div class="doctor-page">
        <div class="container">
            <!-- Hero -->
            <div class="doctor-hero">
                <div class="doctor-photo-card animate-slide-left">
                    <div class="doctor-photo">👩‍⚕️</div>
                    <div class="doctor-badge-card">
                        <div class="years">15+</div>
                        <div class="years-label">Años de Experiencia</div>
                    </div>
                </div>
                <div class="doctor-info animate-slide-right">
                    <h1>Dra. Elena Martínez Ruiz</h1>
                    <div class="doctor-title">Neuropsicóloga Clínica · Especialista en Dislexia y Neurodesarrollo</div>

                    <blockquote class="doctor-quote">
                        "Creo firmemente que cada persona con dislexia tiene un potencial extraordinario esperando ser descubierto. Disslapp nació de mi deseo de hacer el tratamiento más accesible, más motivador y más efectivo para todos."
                    </blockquote>

                    <div class="doctor-philosophy">
                        <h3>Filosofía de Tratamiento</h3>
                        <p>Mi enfoque se basa en la neuroplasticidad — la capacidad del cerebro para reorganizarse y crear nuevas conexiones. Utilizando técnicas de intervención temprana, repetición espaciada y gamificación, logramos que el tratamiento sea no solo efectivo, sino también una experiencia positiva para el paciente. Cada juego en Disslapp está diseñado con base en literatura científica actualizada y años de experiencia clínica directa.</p>
                    </div>
                </div>
            </div>

            <!-- Timeline -->
            <div class="doctor-timeline reveal">
                <h2 class="text-gradient">Trayectoria Profesional</h2>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-year">2010</div>
                        <div class="timeline-title">Licenciatura en Psicología</div>
                        <div class="timeline-desc">Universidad Nacional Autónoma — Graduada con honores</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-year">2013</div>
                        <div class="timeline-title">Maestría en Neuropsicología</div>
                        <div class="timeline-desc">Especialización en trastornos del aprendizaje y desarrollo infantil</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-year">2015</div>
                        <div class="timeline-title">Certificación Internacional en Dislexia</div>
                        <div class="timeline-desc">International Dyslexia Association — Certified Dyslexia Specialist</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-year">2018</div>
                        <div class="timeline-title">Doctorado en Neurociencias</div>
                        <div class="timeline-desc">Investigación en intervenciones digitales para trastornos del aprendizaje</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-year">2023</div>
                        <div class="timeline-title">Fundación de Disslapp</div>
                        <div class="timeline-desc">Lanzamiento de la plataforma como herramienta clínica digital</div>
                    </div>
                </div>
            </div>

            <!-- Specializations -->
            <div class="doctor-specializations reveal">
                <h2 class="text-gradient">Áreas de Especialización</h2>
                <div class="specializations-grid">
                    <div class="card spec-card card-glow">
                        <div class="spec-icon">🧠</div>
                        <h4>Neuropsicología Infantil</h4>
                        <p>Evaluación y tratamiento de trastornos del neurodesarrollo en población infantil y adolescente.</p>
                    </div>
                    <div class="card spec-card card-glow">
                        <div class="spec-icon">📖</div>
                        <h4>Dislexia y Dificultades Lectoras</h4>
                        <p>Diagnóstico diferencial y programas de intervención personalizados para dislexia.</p>
                    </div>
                    <div class="card spec-card card-glow">
                        <div class="spec-icon">💻</div>
                        <h4>Tecnología Educativa</h4>
                        <p>Diseño de herramientas digitales basadas en evidencia para el tratamiento terapéutico.</p>
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="doctor-cta reveal">
                <h2>¿Deseas consultar con la Dra. Martínez?</h2>
                <p>Agenda una cita de evaluación o conoce más sobre el enfoque terapéutico de Disslapp.</p>
                <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap;">
                    <a href="#/nosotros" class="btn btn-primary btn-lg">Contactar ✉️</a>
                    <a href="#/nosotros" class="btn btn-secondary btn-lg">Conoce la Empresa →</a>
                </div>
            </div>
        </div>
    </div>
    `;
}

Router.register('/doctora', renderDoctor);
