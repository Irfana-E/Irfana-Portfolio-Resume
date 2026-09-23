/* ============================================================
   INTRO / ACCESS CONTROL + CINEMATIC AUDIO
   Visual timing and entrance animation remain unchanged.
   The entrance effects use Web Audio; the interior ambience is a local natural sound bed.
   ============================================================ */
const intro = document.getElementById('intro');
const vault = document.getElementById('vault');
const enterBtn = document.getElementById('enterBtn');
const statusText = document.getElementById('status');
const securityText = document.getElementById('securityText');
let introReady = false;

/* ------------------------------------------------------------
   Soft cinematic audio engine
   ------------------------------------------------------------ */
let audioCtx = null;
let ambientAudio = null;
let ambientFadeTimer = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

function tone(frequency, duration, options = {}) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  oscillator.type = options.type || 'sine';
  oscillator.frequency.setValueAtTime(frequency, now);
  if (options.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, now + duration);
  filter.type = options.filterType || 'lowpass';
  filter.frequency.setValueAtTime(options.filterFrequency || 2600, now);
  filter.Q.value = options.q || 0.5;
  const volume = options.volume ?? 0.045;
  const attack = options.attack ?? 0.008;
  const release = options.release ?? Math.min(0.35, duration * 0.55);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
  oscillator.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  oscillator.start(now); oscillator.stop(now + duration + release + 0.03);
}

function uiInteractionSound() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'closed') return;
  const play = () => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(760, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.045);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.Q.value = 0.45;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(play).catch(() => {});
  } else {
    play();
  }
}

window.uiInteractionSound = uiInteractionSound;

function softClick() {
  tone(920, 0.045, { type:'sine', volume:0.055, filterFrequency:4200, attack:0.002, release:0.04 });
  tone(150, 0.035, { type:'sine', volume:0.025, filterFrequency:900, attack:0.001, release:0.03 });
}

function verificationPulse(delay = 0) {
  window.setTimeout(() => {
    tone(520, 0.12, { type:'sine', volume:0.018, filterFrequency:1800, attack:0.01, release:0.1 });
    tone(780, 0.16, { type:'sine', volume:0.014, filterFrequency:2400, attack:0.015, release:0.12 });
  }, delay);
}

function accessGrantedChime() {
  tone(523.25, 0.28, { volume:0.025, filterFrequency:2400, release:0.18 });
  window.setTimeout(() => tone(659.25, 0.34, { volume:0.022, filterFrequency:2600, release:0.22 }), 90);
  window.setTimeout(() => tone(783.99, 0.55, { volume:0.018, filterFrequency:3000, release:0.38 }), 190);
}

function startPeacefulAmbience() {
  if (ambientAudio) return;

  ambientAudio = new Audio('assets/audio/peaceful-natural-ambience.wav');
  ambientAudio.loop = true;
  ambientAudio.preload = 'auto';
  ambientAudio.volume = 0;
  ambientAudio.setAttribute('aria-hidden', 'true');

  // Begin from silence and ease into the natural bed so it never feels abrupt.
  const playPromise = ambientAudio.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(() => {
      ambientAudio = null;
      return;
    });
  }

  const fadeStart = performance.now();
  const fadeDuration = 7000;
  const fade = (now) => {
    if (!ambientAudio) return;
    const progress = Math.min(1, (now - fadeStart) / fadeDuration);
    // Deliberately restrained: the ambience should sit behind the portfolio, not compete with it.
    ambientAudio.volume = 0.075 * (progress * progress);
    if (progress < 1) {
      ambientFadeTimer = requestAnimationFrame(fade);
    }
  };
  ambientFadeTimer = requestAnimationFrame(fade);
}

function beginAudioFromEnter() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
  resume.then(() => {
    softClick();
    verificationPulse(180);
    verificationPulse(520);
    verificationPulse(860);

    window.setTimeout(() => {
      accessGrantedChime();
    }, 1050);

    // Start the calm interior ambience while the portfolio opens.
    startPeacefulAmbience();
  }).catch(() => {
    // Audio is enhancement only; the portfolio must work silently if blocked.
  });
}

setTimeout(() => {
  if (securityText && statusText) {
    securityText.textContent = 'SECURITY CHECK • VERIFIED';
    statusText.textContent = 'SYSTEM READY';
    introReady = true;
  }
}, 1100);

function openPortfolio() {
  if (!introReady || !intro || !vault || !enterBtn) return;

  // Must run directly from the user's click/keyboard gesture for browser audio policy.
  beginAudioFromEnter();

  intro.classList.add('scanning');
  vault.classList.add('opening');
  statusText.textContent = 'ACCESS GRANTED';
  enterBtn.disabled = true;
  enterBtn.textContent = 'OPENING...';

  setTimeout(() => {
    intro.classList.add('hide');
    document.body.classList.add('entered');
    const home = document.getElementById('home');
    if (home) home.scrollIntoView({ behavior: 'smooth' });
  }, 1500);
}

if (enterBtn) enterBtn.addEventListener('click', openPortfolio);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && intro && !intro.classList.contains('hide')) {
    openPortfolio();
  }
});

window.addEventListener('beforeunload', () => {
  if (ambientFadeTimer) window.cancelAnimationFrame(ambientFadeTimer);
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.src = '';
    ambientAudio = null;
  }
  if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
});
