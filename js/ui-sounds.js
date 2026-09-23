/* ============================================================
   IRFANA.E — QUIET UI INTERACTION SOUNDS
   Adds a restrained click to interactive controls without
   changing the existing ENTER/access sound sequence.
   ============================================================ */
(() => {
  const interactiveSelector = [
    'a[href]',
    'button:not(#enterBtn)',
    '[role="button"]'
  ].join(',');

  let lastPlayed = 0;

  function playInteractionSound() {
    // The audio engine is created by intro.js after the ENTER gesture.
    if (typeof window.uiInteractionSound !== 'function') return;
    const now = performance.now();
    // Prevent accidental double-triggering from nested/rapid events.
    if (now - lastPlayed < 45) return;
    lastPlayed = now;
    window.uiInteractionSound();
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest?.(interactiveSelector);
    if (!target) return;
    if (target.id === 'enterBtn') return; // ENTER has its own cinematic sequence.
    playInteractionSound();
  }, true);

  // Custom keyboard activation for elements such as the modal modules.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = document.activeElement;
    if (!target || target.id === 'enterBtn') return;
    if (!target.matches?.('[role="button"]')) return;
    playInteractionSound();
  }, true);
})();
