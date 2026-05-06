/* ============================================
   DISSLAPP — Levels Map
   ============================================ */

function renderLevels() {
    const levels = AppData.levels;
    const completedCount = levels.filter(l => l.status === 'completed').length;
    const activeLevel = levels.find(l => l.status === 'active');
    const pathFillPercent = ((completedCount + (activeLevel ? activeLevel.progress / 100 : 0)) / levels.length) * 100;

    return `
    <div class="levels-page">
        <div class="container">
            <div class="levels-header animate-fade-in-up">
                <h1>🗺️ Mapa de Aventura</h1>
                <p>Avanza por los niveles del tratamiento. Cada nivel desbloquea nuevos juegos y retos.</p>
            </div>

            <div class="levels-map">
                <div class="levels-path">
                    <div class="levels-path-fill" style="height: ${pathFillPercent}%"></div>
                </div>

                ${levels.map((level, i) => renderLevelNode(level, i)).join('')}
            </div>

            ${activeLevel ? renderLevelDetail(activeLevel) : ''}
        </div>
    </div>
    `;
}

function renderLevelNode(level, index) {
    const statusBadge = {
        completed: '<span class="level-status-badge completed">✓ Completado</span>',
        active: '<span class="level-status-badge active">▶ En progreso</span>',
        locked: '<span class="level-status-badge locked">🔒 Bloqueado</span>'
    }[level.status];

    return `
    <div class="level-node ${level.status} reveal" style="transition-delay: ${index * 0.1}s">
        <div class="level-node-circle">${level.emoji}</div>
        <div class="level-node-content">
            <div class="level-name">${level.name}</div>
            <div class="level-description">${level.description}</div>
            ${statusBadge}
            ${level.progress > 0 ? `
                <div class="level-progress" style="margin-top:var(--space-2)">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${level.progress}%"></div>
                    </div>
                    <span class="level-percent">${level.progress}%</span>
                </div>
            ` : ''}
        </div>
    </div>
    `;
}

function renderLevelDetail(level) {
    const levelGames = AppData.games.filter(g => g.level === level.id);

    return `
    <div class="card level-detail-card animate-fade-in-up" style="animation-delay:0.3s">
        <h3>${level.emoji} Nivel Actual: ${level.name}</h3>
        <p style="color:var(--text-secondary);margin-bottom:var(--space-6);">${level.description} — ${level.gamesCompleted} de ${level.gamesCount} juegos completados.</p>
        <div class="level-games-list">
            ${levelGames.map(game => `
                <div class="level-game-item">
                    <span class="game-check ${game.stars > 0 ? 'done' : 'pending'}">${game.stars > 0 ? '✓' : '○'}</span>
                    <span>${game.emoji} ${game.name}</span>
                    <span style="margin-left:auto;font-size:var(--font-size-xs);color:var(--text-muted);">${game.stars > 0 ? '⭐'.repeat(game.stars) : 'Sin jugar'}</span>
                </div>
            `).join('')}
        </div>
        <div style="margin-top:var(--space-6);text-align:center;">
            <a href="#/juegos" class="btn btn-primary">Jugar Ahora →</a>
        </div>
    </div>
    `;
}

Router.register('/niveles', renderLevels);
