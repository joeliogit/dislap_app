/* ============================================
   DISSLAPP — About Us Page
   ============================================ */

function renderAbout() {
    return `
    <div class="about-page">
        <div class="container">
            <!-- Hero -->
            <div class="about-hero animate-fade-in-up">
                <h1>Sobre <span class="text-gradient">Disslapp</span></h1>
                <p>Somos un equipo multidisciplinario comprometido con transformar el tratamiento de la dislexia mediante tecnología accesible, ciencia y mucho corazón.</p>
            </div>

            <!-- Mission / Vision / Values -->
            <div class="mvv-section">
                <div class="mvv-grid stagger-children">
                    <div class="card mvv-card">
                        <div class="mvv-icon">🎯</div>
                        <h3>Misión</h3>
                        <p>Democratizar el acceso a herramientas terapéuticas efectivas y motivadoras para el tratamiento de la dislexia, empoderando a profesionales y pacientes por igual.</p>
                    </div>
                    <div class="card mvv-card">
                        <div class="mvv-icon">🔭</div>
                        <h3>Visión</h3>
                        <p>Ser la plataforma líder en Latinoamérica para el tratamiento digital de la dislexia, reconocida por su impacto clínico y su innovación tecnológica.</p>
                    </div>
                    <div class="card mvv-card">
                        <div class="mvv-icon">💜</div>
                        <h3>Propósito</h3>
                        <p>Cada persona con dislexia merece las mejores herramientas para descubrir su potencial. Nosotros las construimos.</p>
                    </div>
                </div>
            </div>

            <!-- Our Story -->
            <div class="history-section reveal">
                <div class="history-content">
                    <div class="history-text">
                        <h2>Nuestra <span class="text-gradient">Historia</span></h2>
                        <p>Disslapp nació en 2023 cuando la Dra. Elena Martínez, después de más de una década tratando pacientes con dislexia, identificó una necesidad crítica: las herramientas digitales disponibles no estaban diseñadas por clínicos, no eran motivadoras y no generaban datos útiles para el profesional.</p>
                        <p>Reunió a un equipo de desarrolladores, diseñadores y neuropsicólogos para crear una plataforma que combinara lo mejor de la ciencia del aprendizaje con técnicas de gamificación probadas. El resultado es Disslapp: una herramienta que los pacientes quieren usar y los profesionales necesitan.</p>
                        <p>Hoy, cientos de psicólogos confían en Disslapp para complementar sus tratamientos, y miles de pacientes han experimentado mejoras significativas en sus habilidades lectoras.</p>
                    </div>
                    <div class="history-image">🌱</div>
                </div>
            </div>

            <!-- Values -->
            <div class="values-section reveal">
                <h2>Nuestros <span class="text-gradient">Valores</span></h2>
                <div class="values-grid stagger-children">
                    <div class="card value-card">
                        <div class="value-icon">💛</div>
                        <h4>Empatía</h4>
                        <p>Diseñamos pensando en cada usuario: el niño que se frustra, el adulto que perdió la esperanza, el profesional que busca impacto.</p>
                    </div>
                    <div class="card value-card">
                        <div class="value-icon">💡</div>
                        <h4>Innovación</h4>
                        <p>Integramos las últimas investigaciones en neurociencias con tecnología moderna para crear experiencias únicas.</p>
                    </div>
                    <div class="card value-card">
                        <div class="value-icon">🔬</div>
                        <h4>Evidencia Científica</h4>
                        <p>Cada juego, cada nivel y cada métrica está respaldada por literatura revisada por pares y experiencia clínica.</p>
                    </div>
                    <div class="card value-card">
                        <div class="value-icon">🤝</div>
                        <h4>Inclusión</h4>
                        <p>Creemos en el acceso universal. Nuestra plataforma es accesible, asequible y diseñada para todas las edades.</p>
                    </div>
                </div>
            </div>

            <!-- Team -->
            <div class="team-section reveal">
                <h2>Nuestro <span class="text-gradient">Equipo</span></h2>
                <div class="team-grid stagger-children">
                    <div class="card team-card">
                        <div class="team-avatar">👩‍⚕️</div>
                        <h4>Dra. Elena Martínez</h4>
                        <div class="team-role">Fundadora & Directora Clínica</div>
                        <p class="team-bio">Neuropsicóloga con 15+ años de experiencia en dislexia. Diseña la metodología terapéutica de la plataforma.</p>
                    </div>
                    <div class="card team-card">
                        <div class="team-avatar">👨‍💻</div>
                        <h4>Carlos Méndez</h4>
                        <div class="team-role">Director de Tecnología</div>
                        <p class="team-bio">Ingeniero de software especializado en aplicaciones educativas y experiencias interactivas.</p>
                    </div>
                    <div class="card team-card">
                        <div class="team-avatar">👩‍🎨</div>
                        <h4>Sofía Velasco</h4>
                        <div class="team-role">Diseñadora UX/UI</div>
                        <p class="team-bio">Diseñadora de experiencias accesibles con enfoque en usabilidad para niños y adolescentes.</p>
                    </div>
                </div>
            </div>

            <!-- Impact -->
            <div class="impact-section reveal">
                <h2>Nuestro Impacto</h2>
                <div class="impact-grid">
                    <div class="impact-item">
                        <div class="impact-value">1,250+</div>
                        <div class="impact-label">Pacientes Atendidos</div>
                    </div>
                    <div class="impact-item">
                        <div class="impact-value">85+</div>
                        <div class="impact-label">Profesionales</div>
                    </div>
                    <div class="impact-item">
                        <div class="impact-value">5</div>
                        <div class="impact-label">Países</div>
                    </div>
                    <div class="impact-item">
                        <div class="impact-value">8,500+</div>
                        <div class="impact-label">Sesiones</div>
                    </div>
                </div>
            </div>

            <!-- Contact -->
            <div class="contact-section reveal">
                <h2>Contáctanos</h2>
                <p>¿Tienes preguntas o quieres colaborar con nosotros? Escríbenos y te responderemos pronto.</p>
                <div class="card contact-form">
                    <form id="contact-form" onsubmit="handleContactSubmit(event)">
                        <div class="contact-form-row">
                            <div class="form-group">
                                <label class="form-label" for="contact-name">Nombre</label>
                                <input type="text" class="form-input" id="contact-name" placeholder="Tu nombre" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="contact-email">Correo</label>
                                <input type="email" class="form-input" id="contact-email" placeholder="tu@correo.com" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="contact-message">Mensaje</label>
                            <textarea class="form-input" id="contact-message" placeholder="Escribe tu mensaje aquí..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg" id="contact-submit-btn">Enviar Mensaje ✉️</button>
                    </form>
                </div>

                <div class="contact-info">
                    <div class="contact-info-item">
                        <span class="info-icon">📧</span>
                        <span>info@disslapp.com</span>
                    </div>
                    <div class="contact-info-item">
                        <span class="info-icon">📍</span>
                        <span>Ciudad de México, México</span>
                    </div>
                    <div class="contact-info-item">
                        <span class="info-icon">📱</span>
                        <span>@disslapp</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function handleContactSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('contact-submit-btn');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = '✓ Mensaje Enviado';
        btn.style.background = 'linear-gradient(135deg, #059669, #34D399)';
        document.getElementById('contact-form').reset();

        setTimeout(() => {
            btn.textContent = 'Enviar Mensaje ✉️';
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 1200);
}

Router.register('/nosotros', renderAbout);
