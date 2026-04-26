/* ============================================
   DISSLAPP — Games Page
   ============================================ */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { launchConfetti } from '../utils/confetti';

export default function GamesPage() {
  const { appData, isLoggedIn, updateXP, completeGame } = useAuth();
  const games  = appData.games;
  const skills = [...new Set(games.map(g => g.skill))];
  const [filter, setFilter]       = useState('all');
  const [activeGame, setActiveGame] = useState(null);
  const [gameState, setGameState]   = useState(null);

  // Hidden timer — tracks seconds elapsed for treatment metrics
  const timerRef    = useRef(null);
  const startTimeRef = useRef(null);

  const filteredGames = filter === 'all'
    ? games
    : games.filter(g => g.skill === filter);

  // Start timer when game opens
  const startTimer = () => {
    startTimeRef.current = Date.now();
  };

  // Return elapsed seconds
  const stopTimer = () => {
    if (!startTimeRef.current) return 0;
    return Math.round((Date.now() - startTimeRef.current) / 1000);
  };

  // Clear timers on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const openGame = useCallback((gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game || game.locked) return;
    setActiveGame(game);
    startTimer();

    switch (game.type) {
      case 'word-scramble': {
        const words  = appData.gameWords.easy;
        const word   = words[Math.floor(Math.random() * words.length)];
        const scrambled = shuffleWord(word);
        setGameState({ type: 'word-scramble', word, scrambled, answer: '', feedback: null, attempts: 0 });
        break;
      }
      case 'word-compare': {
        const pair = appData.wordPairs[Math.floor(Math.random() * appData.wordPairs.length)];
        setGameState({ type: 'word-compare', pair, feedback: null, answered: false });
        break;
      }
      case 'syllable-build': {
        const wordData = appData.syllableWords[Math.floor(Math.random() * appData.syllableWords.length)];
        const shuffled = [...wordData.syllables].sort(() => Math.random() - 0.5);
        setGameState({ type: 'syllable-build', wordData, shuffled, picked: [], disabled: [], feedback: null });
        break;
      }
      case 'phoneme-dice': {
        const entry   = appData.phonemeData[Math.floor(Math.random() * appData.phonemeData.length)];
        const correct = entry.correct[Math.floor(Math.random() * entry.correct.length)];
        const wrongs  = entry.wrong.sort(() => Math.random() - 0.5).slice(0, 2);
        const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
        setGameState({ type: 'phoneme-dice', letter: entry.letter, correct, options, answered: false, feedback: null });
        break;
      }
      case 'syllable-color': {
        const wordData = appData.syllableWords[Math.floor(Math.random() * appData.syllableWords.length)];
        const posNames = ['primera', 'segunda', 'tercera', 'cuarta'];
        const posIndex = Math.floor(Math.random() * wordData.syllables.length);
        const answer   = wordData.syllables[posIndex];
        const posName  = posNames[posIndex] || `${posIndex + 1}ª`;
        const options  = [...wordData.syllables].sort(() => Math.random() - 0.5);
        setGameState({ type: 'syllable-color', wordData, posIndex, posName, answer, options, answered: false, feedback: null });
        break;
      }
      default:
        setGameState({ type: 'generic' });
    }
  }, [games, appData]);

  const closeGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveGame(null);
    setGameState(null);
    startTimeRef.current = null;
  };

  const showResults = (won, xp, stars) => {
    const duration = stopTimer();
    if (isLoggedIn) {
      updateXP(xp);
      if (activeGame) completeGame(activeGame.id, stars, xp, duration);
    }
    if (won) launchConfetti();
    setGameState(prev => ({ ...prev, results: { won, xp, stars, duration } }));
  };

  // ── Word Scramble ──
  const checkWordAnswer = () => {
    if (!gameState) return;
    const answer = gameState.answer.trim().toUpperCase();
    if (answer === gameState.word) {
      const stars = gameState.attempts === 0 ? 3 : gameState.attempts === 1 ? 2 : 1;
      showResults(true, stars === 3 ? 100 : stars === 2 ? 75 : 50, stars);
    } else {
      setGameState(prev => ({ ...prev, feedback: 'wrong', attempts: (prev.attempts || 0) + 1 }));
      setTimeout(() => setGameState(prev => prev ? ({ ...prev, feedback: null }) : null), 600);
    }
  };

  // ── Word Compare ──
  const checkCompareAnswer = (answeredSame) => {
    if (!gameState || gameState.answered) return;
    const correct = gameState.pair.same === answeredSame;
    setGameState(prev => ({ ...prev, answered: true, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => {
      showResults(correct, correct ? 75 : 25, correct ? 3 : 1);
    }, 800);
  };

  // ── Syllable Build ──
  const pickSyllable = (index, syllable) => {
    if (!gameState) return;
    const newPicked   = [...gameState.picked, syllable];
    const newDisabled = [...gameState.disabled, index];
    setGameState(prev => ({ ...prev, picked: newPicked, disabled: newDisabled }));

    if (newPicked.length === gameState.wordData.syllables.length) {
      const correct = newPicked.join('') === gameState.wordData.syllables.join('');
      setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 600);
    }
  };

  const resetSyllables = () => {
    setGameState(prev => prev ? ({ ...prev, picked: [], disabled: [] }) : null);
  };

  // ── Phoneme Dice ──
  const checkPhonemeAnswer = (chosen) => {
    if (!gameState || gameState.answered) return;
    const correct = chosen === gameState.correct;
    setGameState(prev => ({ ...prev, answered: true, chosen, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Syllable Color ──
  const checkSyllableColorAnswer = (chosen) => {
    if (!gameState || gameState.answered) return;
    const correct = chosen === gameState.answer;
    setGameState(prev => ({ ...prev, answered: true, chosen, feedback: correct ? 'correct' : 'wrong' }));
    setTimeout(() => showResults(correct, correct ? 100 : 25, correct ? 3 : 1), 800);
  };

  // ── Render Helpers ──
  const renderGameCard = (game, index) => {
    const starsHtml = Array.from({ length: game.maxStars }, (_, i) => (
      <span key={i} className={`game-star ${i < game.stars ? 'filled' : ''}`}>★</span>
    ));
    return (
      <div
        key={game.id}
        className={`card game-card card-glow animate-fade-in-up ${game.locked ? 'locked' : ''}`}
        data-skill={game.skill}
        data-game-id={game.id}
        style={{ animationDelay: `${0.1 + index * 0.08}s` }}
        onClick={() => !game.locked && openGame(game.id)}
      >
        {game.recommended && <div className="game-recommended">⭐ Recomendado</div>}
        {game.locked && game.lockReason === 'plan' && (
          <div className="game-lock-overlay plan-lock">
            <span className="lock-icon">🔒</span>
            <span className="lock-msg">Actualiza tu plan</span>
            <Link to="/precios" className="btn btn-primary btn-sm" onClick={e => e.stopPropagation()}>Ver Planes</Link>
          </div>
        )}
        <div className="game-card-image">{game.emoji}</div>
        <div className="game-card-body">
          <div className="game-card-tags">
            <span className="badge badge-purple">{game.skill}</span>
            <span className="badge badge-green">Nivel {game.level}</span>
          </div>
          <h3>{game.name}</h3>
          <p>{game.description}</p>
          <div className="game-card-footer">
            <div className="game-stars">{starsHtml}</div>
            <span className="game-level-req">Nivel {game.level}+</span>
          </div>
        </div>
      </div>
    );
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const renderResults = () => {
    if (!gameState?.results) return null;
    const { won, xp, stars, duration } = gameState.results;
    return (
      <div className="game-results">
        <div className="results-emoji">{won ? '🎉' : '💪'}</div>
        <div className="results-score">{won ? '¡Excelente!' : '¡Buen intento!'}</div>
        <div className="results-xp">+{xp} XP</div>
        <div className="results-stars">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="animate-star-pop" style={{ animationDelay: `${0.2 + i * 0.2}s` }}>
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        {/* Treatment metric — time taken */}
        <div className="results-metrics">
          <div className="metric-item">
            <span className="metric-label">Tiempo de respuesta</span>
            <span className="metric-value">{formatDuration(duration)}</span>
          </div>
          {duration > 0 && duration < 60 && won && (
            <div className="metric-badge">⚡ ¡Respuesta rápida!</div>
          )}
        </div>
        <div className="results-actions">
          <button className="btn btn-primary" onClick={closeGame}>Seguir Jugando</button>
          <button className="btn btn-secondary" onClick={closeGame}>Ver Avances</button>
        </div>
      </div>
    );
  };

  const renderGameModal = () => {
    if (!activeGame || !gameState) return null;

    return (
      <div className="game-play-overlay" id="game-overlay">
        <div className="game-play-modal">
          {gameState.results ? (
            renderResults()
          ) : (
            <>
              <div className="game-play-header">
                <h2>{activeGame.emoji} {activeGame.name}</h2>
                <button className="game-close-btn" onClick={closeGame}>✕</button>
              </div>
              <div className="game-play-area">

                {/* ── Word Scramble ── */}
                {gameState.type === 'word-scramble' && (
                  <>
                    <p className="game-instruction">Ordena las letras para formar una palabra:</p>
                    <div className="game-word-display">{gameState.scrambled}</div>
                    <div style={{ width: '100%', maxWidth: '300px' }}>
                      <input
                        type="text"
                        className={`form-input ${gameState.feedback === 'wrong' ? 'animate-wiggle' : ''}`}
                        placeholder="Escribe la palabra..."
                        style={{ textAlign: 'center', fontSize: 'var(--font-size-xl)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '4px' }}
                        autoFocus
                        value={gameState.answer}
                        onChange={e => setGameState(prev => ({ ...prev, answer: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && checkWordAnswer()}
                      />
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={checkWordAnswer}>Comprobar ✓</button>
                    {gameState.feedback === 'wrong' && (
                      <p style={{ color: '#EF4444', fontWeight: 700, marginTop: 'var(--space-4)' }}>¡Inténtalo de nuevo! 💪</p>
                    )}
                  </>
                )}

                {/* ── Word Compare ── */}
                {gameState.type === 'word-compare' && (
                  <>
                    <p className="game-instruction">¿Estas dos palabras son iguales o diferentes?</p>
                    <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <div className="game-word-display" style={{ fontSize: 'var(--font-size-4xl)' }}>{gameState.pair.word1}</div>
                      <span style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--text-muted)' }}>vs</span>
                      <div className="game-word-display" style={{ fontSize: 'var(--font-size-4xl)' }}>{gameState.pair.word2}</div>
                    </div>
                    <div className="game-options">
                      <button
                        className={`game-option-btn ${gameState.feedback === 'correct' && gameState.pair.same ? 'correct' : ''} ${gameState.feedback === 'wrong' && !gameState.pair.same ? 'wrong' : ''}`}
                        onClick={() => checkCompareAnswer(true)}
                        disabled={gameState.answered}
                      >✅ Iguales</button>
                      <button
                        className={`game-option-btn ${gameState.feedback === 'correct' && !gameState.pair.same ? 'correct' : ''} ${gameState.feedback === 'wrong' && gameState.pair.same ? 'wrong' : ''}`}
                        onClick={() => checkCompareAnswer(false)}
                        disabled={gameState.answered}
                      >❌ Diferentes</button>
                    </div>
                  </>
                )}

                {/* ── Syllable Build ── */}
                {gameState.type === 'syllable-build' && (
                  <>
                    <p className="game-instruction">
                      Haz clic en las sílabas en orden para formar:{' '}
                      <strong style={{ color: 'var(--purple-600)' }}>{gameState.wordData.word}</strong>
                    </p>
                    <div style={{ minHeight: '60px', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {gameState.picked.map((s, i) => (
                        <span key={i} className="badge badge-purple animate-scale-in" style={{ fontSize: 'var(--font-size-xl)', padding: 'var(--space-2) var(--space-4)' }}>{s}</span>
                      ))}
                    </div>
                    <div className="game-options">
                      {gameState.shuffled.map((s, i) => (
                        <button
                          key={i}
                          className="game-option-btn"
                          onClick={() => pickSyllable(i, s)}
                          disabled={gameState.disabled.includes(i)}
                          style={{ opacity: gameState.disabled.includes(i) ? 0.3 : 1 }}
                        >{s}</button>
                      ))}
                    </div>
                    <button className="btn btn-ghost" onClick={resetSyllables}>🔄 Reiniciar</button>
                  </>
                )}

                {/* ── Phoneme Dice ── */}
                {gameState.type === 'phoneme-dice' && (
                  <>
                    <p className="game-instruction">¿Cuál de estas palabras empieza con el sonido de la letra?</p>
                    <div className="phoneme-dice-display">
                      <span className="dice-letter">{gameState.letter}</span>
                    </div>
                    <div className="game-options">
                      {gameState.options.map((word, i) => (
                        <button
                          key={i}
                          className={`game-option-btn ${
                            gameState.answered && word === gameState.correct ? 'correct' : ''
                          } ${
                            gameState.answered && word === gameState.chosen && word !== gameState.correct ? 'wrong' : ''
                          }`}
                          onClick={() => checkPhonemeAnswer(word)}
                          disabled={gameState.answered}
                        >{word}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Syllable Color ── */}
                {gameState.type === 'syllable-color' && (
                  <>
                    <p className="game-instruction">
                      ¿Cuál es la <strong style={{ color: 'var(--purple-600)' }}>{gameState.posName}</strong> sílaba de esta palabra?
                    </p>
                    <div className="syllable-color-display">
                      {gameState.wordData.syllables.map((s, i) => (
                        <span
                          key={i}
                          className={`syllable-chip syl-color-${i % 4}`}
                          style={gameState.answered && i === gameState.posIndex ? { outline: '3px solid var(--purple-600)', outlineOffset: '3px' } : {}}
                        >{s}</span>
                      ))}
                    </div>
                    <div className="game-options">
                      {gameState.options.map((syl, i) => (
                        <button
                          key={i}
                          className={`game-option-btn ${
                            gameState.answered && syl === gameState.answer ? 'correct' : ''
                          } ${
                            gameState.answered && syl === gameState.chosen && syl !== gameState.answer ? 'wrong' : ''
                          }`}
                          onClick={() => checkSyllableColorAnswer(syl)}
                          disabled={gameState.answered}
                        >{syl}</button>
                      ))}
                    </div>
                  </>
                )}

                {/* ── Generic (coming soon) ── */}
                {gameState.type === 'generic' && (
                  <>
                    <div style={{ fontSize: '80px' }}>{activeGame.emoji}</div>
                    <p className="game-instruction" style={{ fontSize: 'var(--font-size-xl)' }}>¡Este juego estará disponible pronto!</p>
                    <p className="game-instruction">Estamos preparando una experiencia increíble. Mientras tanto, prueba los otros juegos disponibles.</p>
                    <button className="btn btn-primary" onClick={closeGame}>Volver al Catálogo</button>
                  </>
                )}

              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="games-page">
      <div className="container">
        <div className="games-header animate-fade-in-up">
          <h1>🎮 Juegos Terapéuticos</h1>
          <p>Selecciona un juego para practicar y ganar XP. Cada juego trabaja una habilidad diferente.</p>
        </div>

        <div className="games-filters animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button className={`filter-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
            Todos
          </button>
          {skills.map(s => (
            <button key={s} className={`filter-chip${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="games-grid">
          {filteredGames.map((game, i) => renderGameCard(game, i))}
        </div>
      </div>

      {renderGameModal()}
    </div>
  );
}

function shuffleWord(word) {
  let result = word.split('').sort(() => Math.random() - 0.5).join('');
  // Avoid accidental non-scramble
  if (result === word && word.length > 1) result = shuffleWord(word);
  return result;
}
