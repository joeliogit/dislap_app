/* ============================================
   DISSLAPP — Progress & Achievements
   ============================================ */

function renderProgress() {
    const user = Auth.getUser();
    const achievements = AppData.achievements;
    const sessions = AppData.sessions;
    const weeklyXP = AppData.weeklyXP;
    const skills = AppData.skills;
    const maxWeeklyXP = Math.max(...weeklyXP.map(w => w.value));

    return `
    <div class="progress-page">
        <div class="container">
            <div class="progress-header animate-fade-in-up">
                <h1>📊 Mis Avances</h1>
                <p>Visualiza tu progreso y celebra cada logro en tu camino.</p>
            </div>

            <!-- Tabs -->
            <div class="progress-tabs animate-fade-in-up" style="animation-delay:0.1s">
                <button class="progress-tab active" data-tab="overview" onclick="switchProgressTab('overview', this)">Resumen</button>
                <button class="progress-tab" data-tab="achievements" onclick="switchProgressTab('achievements', this)">Logros</button>
                <button class="progress-tab" data-tab="sessions" onclick="switchProgressTab('sessions', this)">Historial</button>
            </div>

            <!-- Overview Tab -->
            <div class="progress-tab-content" id="tab-overview">
                <!-- Stats -->
                <div class="progress-stats stagger-children">
                    <div class="card progress-stat-card">
                        <div class="progress-stat-icon">🎮</div>
                        <div class="progress-stat-value">${user ? user.totalSessions : 24}</div>
                        <div class="progress-stat-label">Sesiones Totales</div>
                    </div>
                    <div class="card progress-stat-card">
                        <div class="progress-stat-icon">⏱️</div>
                        <div class="progress-stat-value">12h</div>
                        <div class="progress-stat-label">Tiempo Jugado</div>
                    </div>
                    <div class="card progress-stat-card">
                        <div class="progress-stat-icon">🔥</div>
                        <div class="progress-stat-value">${user ? user.streak : 5}</div>
                        <div class="progress-stat-label">Racha Máxima</div>
                    </div>
                    <div class="card progress-stat-card">
                        <div class="progress-stat-icon">⭐</div>
                        <div class="progress-stat-value">Nv.${user ? user.level : 2}</div>
                        <div class="progress-stat-label">Nivel Actual</div>
                    </div>
                </div>

                <!-- Charts -->
                <div class="charts-grid">
                    <div class="card chart-card reveal">
                        <h3>📈 XP Semanal</h3>
                        <div class="bar-chart">
                            ${weeklyXP.map(d => `
                                <div class="bar-chart-item">
                                    <div class="bar-value">${d.value}</div>
                                    <div class="bar-fill" style="height: ${maxWeeklyXP > 0 ? (d.value / maxWeeklyXP) * 100 : 0}%"></div>
                                    <div class="bar-label">${d.label}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card chart-card reveal">
                        <h3>🎯 Habilidades</h3>
                        <div class="skills-chart">
                            ${skills.map(s => `
                                <div class="skill-item">
                                    <span class="skill-name">${s.name}</span>
                                    <div class="skill-bar">
                                        <div class="skill-bar-fill ${s.color}" style="width:${s.percent}%"></div>
                                    </div>
                                    <span class="skill-percent">${s.percent}%</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Achievements Tab -->
            <div class="progress-tab-content hidden" id="tab-achievements">
                <div class="achievements-section">
                    <h2>🏆 Logros Desbloqueados (${achievements.filter(a => a.unlocked).length}/${achievements.length})</h2>
                    <div class="achievements-grid stagger-children">
                        ${achievements.map(a => `
                            <div class="card achievement-card ${a.unlocked ? '' : 'locked'}">
                                <span class="achievement-icon">${a.emoji}</span>
                                <div class="achievement-name">${a.name}</div>
                                <div class="achievement-desc">${a.desc}</div>
                                ${a.date ? `<div class="achievement-date">🗓️ ${a.date}</div>` : '<div class="achievement-date">🔒 Bloqueado</div>'}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Sessions Tab -->
            <div class="progress-tab-content hidden" id="tab-sessions">
                <div class="sessions-section">
                    <h2>📋 Historial de Sesiones</h2>
                    <div class="session-list">
                        ${sessions.map(s => `
                            <div class="card session-item reveal">
                                <div class="session-date">
                                    <div class="session-day">${s.day}</div>
                                    <div class="session-month">${s.month}</div>
                                </div>
                                <div class="session-info">
                                    <div class="session-title">${s.title}</div>
                                    <div class="session-detail">${s.games} juego${s.games > 1 ? 's' : ''} completado${s.games > 1 ? 's' : ''}</div>
                                </div>
                                <div class="session-xp">+${s.xp} XP</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function switchProgressTab(tabName, btn) {
    // Update tab buttons
    document.querySelectorAll('.progress-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide content
    document.querySelectorAll('.progress-tab-content').forEach(c => c.classList.add('hidden'));
    const target = document.getElementById('tab-' + tabName);
    if (target) {
        target.classList.remove('hidden');
        // Re-trigger reveal animations
        target.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('visible'), 50);
        });
    }
}

Router.register('/avances', renderProgress);
