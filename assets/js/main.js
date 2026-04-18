/* ============================================================
   TYPING EFFECT
   Cycles through an array of strings, types them out
   character by character, then deletes them.
   ============================================================ */
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Security Enthusiast',
    'CTF Player',
    'Linux User',
    'Lifelong Learner',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const TYPING_SPEED = 80;   // ms per character when typing
  const DELETE_SPEED = 40;   // ms per character when deleting
  const PAUSE_END    = 1800; // ms pause at end of full phrase
  const PAUSE_START  = 400;  // ms pause before typing next phrase

  function tick() {
    const current = phrases[phraseIndex];

    if (deleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    }
  }

  tick();
})();

/* ============================================================
   TAG SCRAMBLE
   On hover, each character cycles through random chars before
   resolving back to the original text.
   Uses textContent only — never innerHTML — so no XSS risk.
   ============================================================ */
(function () {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&!?';

  document.querySelectorAll('.tag').forEach(function (el) {
    const original = el.textContent;
    let interval = null;

    el.addEventListener('mouseenter', function () {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(function () {
        el.textContent = original.split('').map(function (char, i) {
          if (char === ' ') return ' ';
          if (i < iteration) return original[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');

        iteration += 0.35;

        if (iteration > original.length) {
          clearInterval(interval);
          el.textContent = original;
        }
      }, 40);
    });

    el.addEventListener('mouseleave', function () {
      clearInterval(interval);
      el.textContent = original;
    });
  });
})();

/* ============================================================
   SCROLL REVEAL
   Adds a CSS class when elements enter the viewport.
   Uses IntersectionObserver — more efficient than scroll events.
   ============================================================ */
(function () {
  const targets = document.querySelectorAll(
    '.skill-card, .timeline-item, .blog-card, .about-grid > *, .tag-list .tag, #about h2, #skills h2, #experience h2, #contact h2'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach(el => observer.observe(el));
})();
