/* ============================================
   DISSLAPP — Patient Dashboard
   ============================================ */

function renderDashboard() {
    const user = Auth.getUser();
    if (!user) {
        return renderLogin();
    }

    const quote = AppData.motivationalQuotes[Math.floor(Math.random() * AppData.motivationalQuotes.length)];
    const xpForNextLevel = getXPForNextLevel(user.xp);
    const xpPercent = getXPPercent(user.xp);

    return `
    <div class="dashboard-page">
        <div class="container">
            <!-- Greeting -->
            <div class="dashboard-header animate-fade-in-up">
                <div class="dashboard-greeting">
                    <div class="greeting-text">
                        <h1>¡Hola, ${user.name}! 🌟</h1>
                        <p>¿Listo para jugar hoy? Sigamos avanzando juntos.</p>
                    </div>
                    <div class="streak-badge">
                        <span class="streak-fire">🔥</span>
                        <div>
                            <div class="streak-count">${user.streak}</div>
                            <div class="streak-label">días seguidos</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Level & XP Bar -->
            <div class="level-bar-section animate-fade-in-up" style="animation-delay:0.1s">
                <div class="level-badge-big">${user.level}</div>
                <div class="level-info">
                    <div class="level-name">Nivel ${user.level}: ${user.levelName}</div>
                    <div class="xp-text">${user.xp.toLocaleString()} / ${xpForNextLevel.toLocaleString()} XP</div>
                    <div class="progress-bar">
                        <div class="progress-fill animate-xp-fill" style="width: ${xpPercent}%"></div>
                    </div>
                </div>
                <span class="level-title-badge">🌟 ${user.levelName}</span>
            </div>

            <!-- Motivation -->
            <div class="motivation-card animate-fade-in-up" style="animation-delay:0.2s">
                <span class="motivation-icon">💡</span>
                <span class="motivation-text">${quote}</span>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <div class="card quick-action-card card-glow animate-fade-in-up" style="animation-delay:0.3s" onclick="Router.navigate('/juegos')">
                    <div class="quick-action-icon">🎮</div>
                    <h3>Juego del Día</h3>
                    <p>Letras Saltarinas te espera — ¡recomendado por tu psicóloga!</p>
                </div>
                <div class="card quick-action-card card-glow animate-fade-in-up" style="animation-delay:0.4s" onclick="Router.navigate('/juegos')">
                    <div class="quick-action-icon">▶️</div>
                    <h3>Continuar</h3>
                    <p>Retoma donde lo dejaste en Construye la Palabra.</p>
                </div>
                <div class="card quick-action-card card-glow animate-fade-in-up" style="animation-delay:0.5s" onclick="Router.navigate('/avances')">
                    <div class="quick-action-icon">🏆</div>
                    <h3>Mis Logros</h3>
                    <p>Tienes ${AppData.achievements.filter(a => a.unlocked).length} logros desbloqueados. ¡Sigue así!</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="stats-grid" style="margin-bottom: var(--space-10);">
                <div class="card stat-card animate-fade-in-up" style="animation-delay:0.2s">
                    <div class="stat-value">${user.totalSessions}</div>
                    <div class="stat-label">Sesiones</div>
                </div>
                <div class="card stat-card animate-fade-in-up" style="animation-delay:0.3s">
                    <div class="stat-value">${user.totalGamesPlayed}</div>
                    <div class="stat-label">Juegos Jugados</div>
                </div>
                <div class="card stat-card animate-fade-in-up" style="animation-delay:0.4s">
                    <div class="stat-value">${user.xp.toLocaleString()}</div>
                    <div class="stat-label">XP Total</div>
                </div>
                <div class="card stat-card animate-fade-in-up" style="animation-delay:0.5s">
                    <div class="stat-value">${AppData.achievements.filter(a => a.unlocked).length}</div>
                    <div class="stat-label">Logros</div>
                </div>
            </div>

            <!-- Recent Achievements -->
            <div class="recent-achievements animate-fade-in-up" style="animation-delay:0.5s">
                <h2>Logros Recientes 🏅</h2>
                <div class="achievements-row">
                    ${AppData.achievements.filter(a => a.unlocked).slice(-4).map(a => `
                        <div class="card mini-achievement">
                            <div class="achievement-emoji">${a.emoji}</div>
                            <div class="achievement-name">${a.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;
}

function getXPForNextLevel(xp) {
    if (xp < 500) return 500;
    if (xp < 1500) return 1500;
    if (xp < 3500) return 3500;
    if (xp < 7000) return 7000;
    if (xp < 10000) return 10000;
    return 15000;
}

function getXPPercent(xp) {
    const levels = [0, 500, 1500, 3500, 7000, 10000];
    for (let i = 0; i < levels.length - 1; i++) {
        if (xp < levels[i + 1]) {
            return ((xp - levels[i]) / (levels[i + 1] - levels[i])) * 100;
        }
    }
    return 100;
}

Router.register('/dashboard', renderDashboard);
