/* ============================================
   DISSLAPP — Pricing Page
   ============================================ */

function renderPricing() {
    return `
    <div class="pricing-page">
        <div class="container">
            <!-- Hero -->
            <div class="pricing-hero animate-fade-in-up">
                <h1>💎 Planes y <span class="text-gradient">Precios</span></h1>
                <p>Elige el plan que mejor se adapte a tus necesidades. Comienza gratis y actualiza cuando estés listo.</p>
            </div>

            <!-- Free Trial Banner -->
            <div class="free-trial-banner animate-fade-in-up" style="animation-delay:0.1s">
                <div class="free-trial-icon">🎁</div>
                <div class="free-trial-content">
                    <h3>¡Prueba Gratis por 14 Días!</h3>
                    <p>Accede a todas las funciones del plan Profesional sin compromiso. Sin tarjeta de crédito requerida. Cancela en cualquier momento.</p>
                </div>
                <div class="free-trial-cta">
                    <a href="#/login" class="btn btn-lg">Comenzar Prueba Gratis →</a>
                </div>
            </div>

            <!-- Billing Toggle -->
            <div class="billing-toggle-container animate-fade-in-up" style="animation-delay:0.15s">
                <span class="billing-label active" id="label-monthly">Mensual</span>
                <button class="billing-toggle" id="billing-toggle" onclick="toggleBilling()">
                    <div class="toggle-knob"></div>
                </button>
                <span class="billing-label" id="label-annual">Anual</span>
                <span class="save-badge">Ahorra 25%</span>
            </div>

            <!-- Pricing Cards -->
            <div class="pricing-grid stagger-children">
                <!-- Plan Básico / Gratuito -->
                <div class="card pricing-card card-glow">
                    <div class="pricing-card-header">
                        <div class="pricing-plan-icon">🌱</div>
                        <div class="pricing-plan-name">Básico</div>
                        <div class="pricing-plan-desc">Ideal para conocer la plataforma</div>
                        <div class="pricing-amount">
                            <span class="pricing-currency">$</span>
                            <span class="pricing-value">0</span>
                        </div>
                        <div class="pricing-period">Gratis para siempre</div>
                    </div>
                    <div class="pricing-card-body">
                        <ul class="pricing-features">
                            <li><span class="check">✓</span> 3 juegos terapéuticos</li>
                            <li><span class="check">✓</span> Nivel 1 (Explorador)</li>
                            <li><span class="check">✓</span> Sistema de XP básico</li>
                            <li><span class="check">✓</span> 1 perfil de paciente</li>
                            <li><span class="check">✓</span> Logros básicos (5)</li>
                            <li class="disabled"><span class="cross">✕</span> Reportes clínicos</li>
                            <li class="disabled"><span class="cross">✕</span> Niveles avanzados</li>
                            <li class="disabled"><span class="cross">✕</span> Soporte prioritario</li>
                            <li class="disabled"><span class="cross">✕</span> Exportar datos</li>
                        </ul>
                        <a href="#/login" class="btn btn-ghost">Comenzar Gratis</a>
                    </div>
                </div>

                <!-- Plan Profesional -->
                <div class="card pricing-card card-glow featured">
                    <div class="pricing-card-badge">⭐ Más Popular</div>
                    <div class="pricing-card-header">
                        <div class="pricing-plan-icon">🚀</div>
                        <div class="pricing-plan-name">Profesional</div>
                        <div class="pricing-plan-desc">Para psicólogos y terapeutas</div>
                        <div class="pricing-amount">
                            <span class="pricing-currency">$</span>
                            <span class="pricing-value" data-monthly="299" data-annual="224">299</span>
                        </div>
                        <div class="pricing-period"><span class="period-text">MXN / mes</span></div>
                        <div class="pricing-original annual-only hidden">$299/mes → <strong style="color:var(--green-600);">$224/mes</strong></div>
                    </div>
                    <div class="pricing-card-body">
                        <ul class="pricing-features">
                            <li><span class="check">✓</span> <strong>Todos</strong> los juegos terapéuticos</li>
                            <li><span class="check">✓</span> <strong>5 niveles</strong> completos</li>
                            <li><span class="check">✓</span> Sistema de XP y logros completo</li>
                            <li><span class="check">✓</span> Hasta <strong>25 perfiles</strong> de pacientes</li>
                            <li><span class="check">✓</span> Reportes clínicos PDF</li>
                            <li><span class="check">✓</span> Dashboard de avance detallado</li>
                            <li><span class="check">✓</span> Soporte por correo (24h)</li>
                            <li><span class="check">✓</span> Exportar datos CSV</li>
                            <li class="disabled"><span class="cross">✕</span> API personalizada</li>
                        </ul>
                        <a href="#/login" class="btn btn-primary">Iniciar Prueba Gratis 🎉</a>
                    </div>
                </div>

                <!-- Plan Clínica -->
                <div class="card pricing-card card-glow">
                    <div class="pricing-card-header">
                        <div class="pricing-plan-icon">🏥</div>
                        <div class="pricing-plan-name">Clínica</div>
                        <div class="pricing-plan-desc">Para equipos y centros clínicos</div>
                        <div class="pricing-amount">
                            <span class="pricing-currency">$</span>
                            <span class="pricing-value" data-monthly="799" data-annual="599">799</span>
                        </div>
                        <div class="pricing-period"><span class="period-text">MXN / mes</span></div>
                        <div class="pricing-original annual-only hidden">$799/mes → <strong style="color:var(--green-600);">$599/mes</strong></div>
                    </div>
                    <div class="pricing-card-body">
                        <ul class="pricing-features">
                            <li><span class="check">✓</span> Todo del plan Profesional</li>
                            <li><span class="check">✓</span> <strong>Pacientes ilimitados</strong></li>
                            <li><span class="check">✓</span> Hasta <strong>10 profesionales</strong></li>
                            <li><span class="check">✓</span> Panel de administración</li>
                            <li><span class="check">✓</span> Reportes avanzados + gráficas</li>
                            <li><span class="check">✓</span> Integración con expedientes</li>
                            <li><span class="check">✓</span> Soporte prioritario (chat + tel)</li>
                            <li><span class="check">✓</span> API personalizada</li>
                            <li><span class="check">✓</span> Onboarding personalizado</li>
                        </ul>
                        <a href="#/nosotros" class="btn btn-secondary">Contactar Ventas</a>
                    </div>
                </div>
            </div>

            <!-- Feature Comparison -->
            <div class="compare-section reveal">
                <h2>Comparación <span class="text-gradient">Detallada</span></h2>
                <table class="compare-table">
                    <thead>
                        <tr>
                            <th>Característica</th>
                            <th>Básico</th>
                            <th class="featured-col">Profesional</th>
                            <th>Clínica</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Juegos terapéuticos</td>
                            <td>3</td>
                            <td class="featured-col"><strong>20+</strong></td>
                            <td><strong>20+</strong></td>
                        </tr>
                        <tr>
                            <td>Niveles de tratamiento</td>
                            <td>1</td>
                            <td class="featured-col"><strong>5</strong></td>
                            <td><strong>5</strong></td>
                        </tr>
                        <tr>
                            <td>Perfiles de pacientes</td>
                            <td>1</td>
                            <td class="featured-col">25</td>
                            <td><strong>Ilimitados</strong></td>
                        </tr>
                        <tr>
                            <td>Sistema de logros</td>
                            <td>Básico</td>
                            <td class="featured-col"><strong>Completo</strong></td>
                            <td><strong>Completo</strong></td>
                        </tr>
                        <tr>
                            <td>Reportes clínicos</td>
                            <td>✕</td>
                            <td class="featured-col"><strong>PDF</strong></td>
                            <td><strong>PDF + Excel</strong></td>
                        </tr>
                        <tr>
                            <td>Exportar datos</td>
                            <td>✕</td>
                            <td class="featured-col">CSV</td>
                            <td><strong>CSV + API</strong></td>
                        </tr>
                        <tr>
                            <td>Profesionales</td>
                            <td>1</td>
                            <td class="featured-col">1</td>
                            <td><strong>Hasta 10</strong></td>
                        </tr>
                        <tr>
                            <td>Soporte</td>
                            <td>Documentación</td>
                            <td class="featured-col">Correo (24h)</td>
                            <td><strong>Chat + Teléfono</strong></td>
                        </tr>
                        <tr>
                            <td>Integración expedientes</td>
                            <td>✕</td>
                            <td class="featured-col">✕</td>
                            <td><strong>✓</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Guarantee -->
            <div class="guarantee-section reveal">
                <div class="guarantee-icon">🛡️</div>
                <h3>Garantía de Satisfacción</h3>
                <p>Si no estás satisfecho con Disslapp en los primeros 30 días, te devolvemos tu dinero sin preguntas. Tu confianza es nuestra prioridad.</p>
            </div>

            <!-- FAQ -->
            <div class="faq-section reveal">
                <h2>Preguntas <span class="text-gradient">Frecuentes</span></h2>

                <div class="faq-item" onclick="toggleFaq(this)">
                    <button class="faq-question">
                        ¿Puedo probar antes de pagar?
                        <span class="faq-arrow">▼</span>
                    </button>
                    <div class="faq-answer">
                        <p>¡Sí! Ofrecemos una prueba gratuita de 14 días del plan Profesional completo, sin necesidad de tarjeta de crédito. Al finalizar la prueba, puedes elegir un plan o continuar con el plan Básico gratuito.</p>
                    </div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)">
                    <button class="faq-question">
                        ¿Puedo cambiar de plan en cualquier momento?
                        <span class="faq-arrow">▼</span>
                    </button>
                    <div class="faq-answer">
                        <p>Absolutamente. Puedes actualizar o cambiar tu plan en cualquier momento. Si actualizas, se te cobra la diferencia proporcional. Si bajas de plan, los cambios aplican al siguiente ciclo de facturación.</p>
                    </div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)">
                    <button class="faq-question">
                        ¿Qué métodos de pago aceptan?
                        <span class="faq-arrow">▼</span>
                    </button>
                    <div class="faq-answer">
                        <p>Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, transferencia bancaria y OXXO Pay para pagos en efectivo en México.</p>
                    </div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)">
                    <button class="faq-question">
                        ¿Qué pasa con mis datos si cancelo?
                        <span class="faq-arrow">▼</span>
                    </button>
                    <div class="faq-answer">
                        <p>Tus datos se mantienen seguros por 90 días después de la cancelación. Puedes exportar toda tu información en cualquier momento. Si reactivas tu cuenta dentro de ese período, todo estará donde lo dejaste.</p>
                    </div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)">
                    <button class="faq-question">
                        ¿Ofrecen descuentos para instituciones educativas?
                        <span class="faq-arrow">▼</span>
                    </button>
                    <div class="faq-answer">
                        <p>Sí, ofrecemos un 40% de descuento para instituciones educativas, ONGs y organizaciones sin fines de lucro. Contáctanos en info@disslapp.com con la documentación de tu institución.</p>
                    </div>
                </div>

                <div class="faq-item" onclick="toggleFaq(this)">
                    <button class="faq-question">
                        ¿Es segura la información de mis pacientes?
                        <span class="faq-arrow">▼</span>
                    </button>
                    <div class="faq-answer">
                        <p>La seguridad es nuestra prioridad. Toda la información está encriptada con AES-256, cumplimos con la Ley Federal de Protección de Datos Personales de México, y nuestros servidores tienen certificación SOC 2 Tipo II.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Toggle billing monthly/annual
function toggleBilling() {
    const toggle = document.getElementById('billing-toggle');
    const labelMonthly = document.getElementById('label-monthly');
    const labelAnnual = document.getElementById('label-annual');
    const isAnnual = !toggle.classList.contains('annual');

    toggle.classList.toggle('annual');
    labelMonthly.classList.toggle('active', !isAnnual);
    labelAnnual.classList.toggle('active', isAnnual);

    // Update prices
    document.querySelectorAll('.pricing-value[data-monthly]').forEach(el => {
        const monthly = el.getAttribute('data-monthly');
        const annual = el.getAttribute('data-annual');
        el.textContent = isAnnual ? annual : monthly;
    });

    // Toggle period text
    document.querySelectorAll('.period-text').forEach(el => {
        el.textContent = isAnnual ? 'MXN / mes (facturado anual)' : 'MXN / mes';
    });

    // Show/hide annual savings
    document.querySelectorAll('.annual-only').forEach(el => {
        el.classList.toggle('hidden', !isAnnual);
    });
}

// Toggle FAQ
function toggleFaq(item) {
    const wasOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Open clicked if was closed
    if (!wasOpen) {
        item.classList.add('open');
    }
}

Router.register('/precios', renderPricing);
