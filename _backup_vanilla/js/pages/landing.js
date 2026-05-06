/* ============================================
   DISSLAPP — Landing Page
   ============================================ */

function renderLanding() {
    return `
    <!-- Hero -->
    <section class="hero" id="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
        </div>
        <div class="hero-content">
            <div class="hero-text animate-fade-in-up">
                <div class="hero-badge">🧠 Plataforma Terapéutica Digital</div>
                <h1 class="hero-title">
                    Transformamos el tratamiento de la <span class="highlight">dislexia</span>
                </h1>
                <p class="hero-subtitle">
                    Herramienta clínica diseñada para psicólogos. Juegos terapéuticos, seguimiento de avances y un sistema de logros que motiva a tus pacientes.
                </p>
                <div class="hero-actions">
                    <a href="#/login" class="btn btn-primary btn-lg">Comenzar Ahora ✨</a>
                    <a href="#/nosotros" class="btn btn-outline">Conoce Más →</a>
                </div>
            </div>
            <div class="hero-illustration animate-fade-in" style="animation-delay: 0.3s">
                <div class="hero-visual">
                    <div class="orbit orbit-1"></div>
                    <div class="orbit orbit-2"></div>
                    <div class="orbit orbit-3"></div>
                    <div class="center-icon">🧠</div>
                    <div class="orbit-item" style="top:-5%;left:50%;transform:translateX(-50%)">📚</div>
                    <div class="orbit-item" style="top:50%;right:-5%;transform:translateY(-50%)">🎮</div>
                    <div class="orbit-item" style="bottom:-5%;left:50%;transform:translateX(-50%)">📊</div>
                    <div class="orbit-item" style="top:50%;left:-5%;transform:translateY(-50%)">🏆</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section class="section features-section" id="features-section">
        <div class="container">
            <div class="section-header reveal">
                <h2>¿Por qué elegir Disslapp?</h2>
                <p>Una plataforma completa que combina ciencia, tecnología y diversión para el tratamiento efectivo de la dislexia.</p>
            </div>
            <div class="features-grid stagger-children">
                <div class="card feature-card card-glow">
                    <div class="feature-icon">🎮</div>
                    <h3>Juegos Terapéuticos</h3>
                    <p>24 juegos diseñados con principios pedagógicos científicos para trabajar diferentes habilidades.</p>
                </div>
                <div class="card feature-card card-glow">
                    <div class="feature-icon">📈</div>
                    <h3>Niveles Progresivos</h3>
                    <p>5 niveles de tratamiento estructurados que adaptan la dificultad al avance del paciente.</p>
                </div>
                <div class="card feature-card card-glow">
                    <div class="feature-icon">🏅</div>
                    <h3>Sistema de Logros</h3>
                    <p>Insignias, puntos XP y rachas diarias que mantienen la motivación alta durante el tratamiento.</p>
                </div>
                <div class="card feature-card card-glow">
                    <div class="feature-icon">📊</div>
                    <h3>Reportes Clínicos</h3>
                    <p>Gráficas de avance, historial de sesiones y reportes exportables para el profesional.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- How it works -->
    <section class="section" id="how-it-works-section">
        <div class="container">
            <div class="section-header reveal">
                <h2>¿Cómo funciona?</h2>
                <p>En solo 3 pasos, comienza a transformar el tratamiento de tus pacientes.</p>
            </div>
            <div class="steps-grid reveal">
                <div class="step-card">
                    <div class="step-number">1</div>
                    <h3>Crea el Perfil</h3>
                    <p>El psicólogo registra al paciente y configura su nivel inicial de tratamiento.</p>
                </div>
                <div class="step-card">
                    <div class="step-number">2</div>
                    <h3>El Paciente Juega</h3>
                    <p>El paciente accede a los juegos asignados y completa ejercicios terapéuticos divertidos.</p>
                </div>
                <div class="step-card">
                    <div class="step-number">3</div>
                    <h3>Monitorea el Avance</h3>
                    <p>El profesional visualiza gráficas de progreso y genera reportes clínicos en tiempo real.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="section" id="testimonials-section" style="background: var(--bg-secondary);">
        <div class="container">
            <div class="section-header reveal">
                <h2>Lo que dicen los profesionales</h2>
                <p>Psicólogos y terapeutas ya confían en Disslapp para sus tratamientos.</p>
            </div>
            <div class="testimonials-track reveal">
                <div class="card testimonial-card">
                    <p class="testimonial-text">Disslapp ha revolucionado la forma en que trabajo con mis pacientes con dislexia. Los niños llegan motivados a cada sesión porque saben que van a jugar y ganar logros.</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">MC</div>
                        <div>
                            <div class="testimonial-name">Dra. María Castillo</div>
                            <div class="testimonial-role">Neuropsicóloga Infantil</div>
                        </div>
                    </div>
                </div>
                <div class="card testimonial-card">
                    <p class="testimonial-text">El sistema de niveles y logros hace que los pacientes se comprometan con su tratamiento. He visto mejoras significativas en solo 3 meses de uso constante.</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">RL</div>
                        <div>
                            <div class="testimonial-name">Dr. Roberto López</div>
                            <div class="testimonial-role">Psicólogo Educativo</div>
                        </div>
                    </div>
                </div>
                <div class="card testimonial-card">
                    <p class="testimonial-text">Los reportes de avance me permiten demostrar a los padres el progreso real de sus hijos. Es una herramienta indispensable en mi consulta.</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">AG</div>
                        <div>
                            <div class="testimonial-name">Dra. Ana García</div>
                            <div class="testimonial-role">Terapeuta del Lenguaje</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats -->
    <section class="stats-section" id="stats-section">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-card reveal">
                    <div class="stat-value" data-count="1250">0</div>
                    <div class="stat-label">Pacientes Atendidos</div>
                </div>
                <div class="stat-card reveal">
                    <div class="stat-value" data-count="8500">0</div>
                    <div class="stat-label">Sesiones Completadas</div>
                </div>
                <div class="stat-card reveal">
                    <div class="stat-value" data-count="15000">0</div>
                    <div class="stat-label">Logros Desbloqueados</div>
                </div>
                <div class="stat-card reveal">
                    <div class="stat-value" data-count="95">0</div>
                    <div class="stat-label">% Satisfacción</div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section" id="cta-section">
        <div class="container">
            <div class="cta-card reveal">
                <h2>¿Listo para transformar tu práctica clínica?</h2>
                <p>Únete a cientos de profesionales que ya usan Disslapp para potenciar el tratamiento de la dislexia.</p>
                <div style="display:flex;gap:var(--space-4);justify-content:center;flex-wrap:wrap;">
                    <a href="#/precios" class="btn btn-primary btn-lg">Ver Planes y Precios 💎</a>
                    <a href="#/doctora" class="btn btn-secondary btn-lg">Conoce a la Doctora</a>
                </div>
            </div>
        </div>
    </section>
    `;
}

// Counter animation
document.addEventListener('page:rendered', (e) => {
    if (e.detail.path === '/') {
        initCounters();
    }
});

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

Router.register('/', renderLanding);
