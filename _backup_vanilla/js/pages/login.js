/* ============================================
   DISSLAPP — Login Page
   ============================================ */

function renderLogin() {
    return `
    <div class="auth-page">
        <div class="auth-visual">
            <div class="auth-visual-content">
                <div class="auth-visual-icon">🧠</div>
                <h2>Bienvenido a Disslapp</h2>
                <p>La plataforma terapéutica que transforma el tratamiento de la dislexia a través del juego y la tecnología.</p>
            </div>
        </div>
        <div class="auth-form-side">
            <div class="auth-form-container">
                <div class="auth-form-header">
                    <h1>Iniciar Sesión</h1>
                    <p>Accede a tu cuenta para continuar</p>
                </div>

                <div class="auth-tabs" id="auth-tabs">
                    <button class="auth-tab active" data-role="patient" id="tab-patient">🎮 Paciente</button>
                    <button class="auth-tab" data-role="psychologist" id="tab-psychologist">🩺 Psicólogo</button>
                </div>

                <form class="auth-form" id="login-form" autocomplete="off">
                    <div class="form-group">
                        <label class="form-label" for="login-user">
                            <span id="login-user-label">Código de Paciente</span>
                        </label>
                        <div class="input-icon-wrapper">
                            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <input type="text" class="form-input" id="login-user" placeholder="Ej: PAC-001 o tu nombre" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="login-password">Contraseña</label>
                        <div class="input-icon-wrapper">
                            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                            <input type="password" class="form-input" id="login-password" placeholder="••••••••" required>
                            <button type="button" class="password-toggle" id="toggle-password" aria-label="Mostrar contraseña">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                        </div>
                    </div>

                    <div class="remember-row">
                        <label class="remember-check">
                            <input type="checkbox" id="remember-me"> Recordarme
                        </label>
                        <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" class="btn btn-primary" id="login-submit-btn">
                        Iniciar Sesión
                    </button>
                </form>

                <div class="auth-divider">o</div>

                <p class="auth-footer-text">
                    ¿Eres profesional? <a href="#/login" id="register-link">Registra tu cuenta aquí</a>
                </p>
            </div>
        </div>
    </div>
    `;
}

// Login page logic
document.addEventListener('page:rendered', (e) => {
    if (e.detail.path === '/login') {
        initLoginPage();
    }
});

function initLoginPage() {
    // Redirect if already logged in
    if (Auth.isLoggedIn()) {
        Router.navigate('/dashboard');
        return;
    }

    const tabs = document.querySelectorAll('.auth-tab');
    const userLabel = document.getElementById('login-user-label');
    const userInput = document.getElementById('login-user');
    let currentRole = 'patient';

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentRole = tab.getAttribute('data-role');

            if (currentRole === 'psychologist') {
                userLabel.textContent = 'Correo Institucional';
                userInput.placeholder = 'doctor@clinica.com';
                userInput.type = 'email';
            } else {
                userLabel.textContent = 'Código de Paciente';
                userInput.placeholder = 'Ej: PAC-001 o tu nombre';
                userInput.type = 'text';
            }
        });
    });

    // Password toggle
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        });
    }

    // Form submit
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = userInput.value.trim();
        const password = passwordInput.value;

        if (!username) return;

        const btn = document.getElementById('login-submit-btn');
        btn.textContent = 'Ingresando...';
        btn.disabled = true;

        setTimeout(() => {
            Auth.login(username, password, currentRole);
            showLoginSuccess(username);
        }, 800);
    });
}

function showLoginSuccess(name) {
    const overlay = document.createElement('div');
    overlay.className = 'login-success-overlay';
    overlay.innerHTML = `
        <div class="login-success-card">
            <div class="success-icon">🎉</div>
            <h2>¡Bienvenido!</h2>
            <p>Hola <strong>${name}</strong>, tu sesión ha iniciado correctamente.</p>
        </div>
    `;
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
        Router.navigate('/dashboard');
    }, 1500);
}

Router.register('/login', renderLogin);
