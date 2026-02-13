/* ============================================
   Valentine's Day Proposal — JavaScript
   ============================================ */

(function () {
  "use strict";

  // === DOM Elements ===
  const envelope = document.getElementById("envelope");
  const openProposal = document.getElementById("openProposal");
  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const noCounter = document.getElementById("noCounter");
  const heartsCanvas = document.getElementById("heartsCanvas");
  const confettiCanvas = document.getElementById("confettiCanvas");
  const sparklesContainer = document.getElementById("sparkles");

  const envelopeStage = document.getElementById("envelope-stage");
  const proposalStage = document.getElementById("proposal-stage");
  const celebrationStage = document.getElementById("celebration-stage");

  // === State ===
  let noCount = 0;
  const noTexts = [
    "No",
    "Are you sure? 🥺",
    "Really sure?",
    "Please reconsider! 💕",
    "Think again...",
    "Pretty please? 🌹",
    "I'll be sad 😢",
    "Last chance!",
    "You're breaking my heart 💔",
    "Okay fine... just kidding! 😏",
  ];

  // === Floating Hearts Background ===
  const heartsCtx = heartsCanvas.getContext("2d");
  let hearts = [];
  let animFrameId;

  function resizeHeartsCanvas() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }

  function createHeart() {
    const size = Math.random() * 16 + 8;
    return {
      x: Math.random() * heartsCanvas.width,
      y: heartsCanvas.height + size,
      size: size,
      speed: Math.random() * 0.8 + 0.3,
      wobble: Math.random() * 2 - 1,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      hue: Math.random() * 30 + 340, // pink-red range
    };
  }

  function drawHeart(ctx, x, y, size, rotation, opacity, hue) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `hsla(${hue}, 70%, 65%, 1)`;
    ctx.beginPath();

    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);

    // Left curve
    ctx.bezierCurveTo(
      0,
      -topCurveHeight,
      -size,
      -topCurveHeight,
      -size,
      topCurveHeight,
    );

    // Left bottom
    ctx.bezierCurveTo(-size, size * 0.7, 0, size, 0, size * 1.2);

    // Right bottom
    ctx.bezierCurveTo(0, size, size, size * 0.7, size, topCurveHeight);

    // Right curve
    ctx.bezierCurveTo(
      size,
      -topCurveHeight,
      0,
      -topCurveHeight,
      0,
      topCurveHeight,
    );

    ctx.fill();
    ctx.restore();
  }

  function animateHearts() {
    heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);

    // Add new hearts
    if (hearts.length < 25 && Math.random() < 0.03) {
      hearts.push(createHeart());
    }

    hearts.forEach((h, i) => {
      h.y -= h.speed;
      h.x += Math.sin(h.y * h.wobbleSpeed) * h.wobble;
      h.rotation += h.rotationSpeed;

      drawHeart(heartsCtx, h.x, h.y, h.size, h.rotation, h.opacity, h.hue);

      if (h.y < -h.size * 2) {
        hearts.splice(i, 1);
      }
    });

    animFrameId = requestAnimationFrame(animateHearts);
  }

  // === Sparkle Particles ===
  function createSparkles() {
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.animationDelay = Math.random() * 4 + "s";
      sparkle.style.animationDuration = Math.random() * 3 + 3 + "s";
      sparklesContainer.appendChild(sparkle);
    }
  }

  // === Stage Transitions ===
  function switchStage(from, to) {
    from.classList.remove("active");
    from.style.display = "none";
    to.classList.add("active");
    to.style.display = "flex";
  }

  // === Envelope Interaction ===
  envelope.addEventListener("click", function () {
    if (!this.classList.contains("opened")) {
      this.classList.add("opened");
    }
  });

  openProposal.addEventListener("click", function (e) {
    e.stopPropagation();
    switchStage(envelopeStage, proposalStage);
  });

  // === "No" Button Dodge Mechanic ===
  function getRandomPosition() {
    const card = document.querySelector('.proposal-inner');
    const cardRect = card.getBoundingClientRect();
    const btnW = 120;
    const btnH = 50;

    // Keep within the card bounds with padding
    const pad = 10;
    const minX = pad;
    const maxX = cardRect.width - btnW - pad;
    const minY = pad;
    const maxY = cardRect.height - btnH - pad;

    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    return {
      x: randomX - cardRect.width / 2,
      y: randomY - cardRect.height / 2,
    };
  }

  function dodgeNo() {
    if (noCount >= 2 && noCount < 4) {
      btnNo.classList.add('dodging');
      const pos = getRandomPosition();
      btnNo.style.left = `calc(50% + ${pos.x}px)`;
      btnNo.style.top = `calc(50% + ${pos.y}px)`;
    }
  }

  function pulverizeButton(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = 40;
    const colors = ['#C94C6E', '#8B2252', '#FADADD', '#D4AF37', '#F8E8E0', '#FFB6C1'];

    // Hide the button immediately
    button.style.visibility = 'hidden';

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'pulverize-particle';
      const size = Math.random() * 8 + 3;
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 160 + 60;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transition: none;
      `;

      document.body.appendChild(particle);

      // Animate with JS for smooth physics
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - Math.random() * 80;
      const duration = Math.random() * 600 + 600;
      const rotation = Math.random() * 720 - 360;

      particle.animate([
        { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rotation}deg) scale(0)`, opacity: 0 }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });

      setTimeout(() => particle.remove(), duration);
    }

    // Remove the button after animation
    setTimeout(() => {
      button.remove();
    }, 300);
  }

  function handleNo() {
    noCount++;

    // On 4th click, PULVERIZE!
    if (noCount >= 2) {
      pulverizeButton(btnNo);
      // Grow Yes button to fill the space
      btnYes.style.transform = 'scale(1.5)';
      btnYes.style.fontSize = '1.3rem';
      return;
    }

    // Update text
    const textIndex = Math.min(noCount, noTexts.length - 1);
    btnNo.textContent = noTexts[textIndex];

    // Shrink No button
    const scale = Math.max(0.6, 1 - noCount * 0.1);
    btnNo.style.transform = `scale(${scale})`;

    // Grow Yes button
    const yesScale = Math.min(1.3, 1 + noCount * 0.08);
    btnYes.style.transform = `scale(${yesScale})`;
    btnYes.style.fontSize = Math.min(1.15, 1 + noCount * 0.04) + 'rem';

    // Make No button dodge after 2nd click
    dodgeNo();

    // Update counter text
    if (noCount === 1) {
      noCounter.textContent = 'the only way is my heart';
    } else if (noCount >= 2) {
      noCounter.textContent = '';
    }
  }

  btnNo.addEventListener('click', handleNo);
  btnNo.addEventListener('mouseenter', dodgeNo);

  // === "Yes" Button — Celebration! ===
  btnYes.addEventListener("click", function () {
    alert("Yay! I knew you'd say yes! 💖");
    switchStage(proposalStage, celebrationStage);
    startConfetti();

    // Boost hearts
    for (let i = 0; i < 15; i++) {
      const h = createHeart();
      h.speed = Math.random() * 1.5 + 1;
      h.opacity = Math.random() * 0.4 + 0.2;
      h.size = Math.random() * 20 + 12;
      hearts.push(h);
    }
  });

  // === Confetti System ===
  function startConfetti() {
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = [
      "#C94C6E",
      "#8B2252",
      "#D4AF37",
      "#FADADD",
      "#FF69B4",
      "#FFD700",
      "#FF1493",
      "#FFA07A",
      "#FFB6C1",
      "#FF6B6B",
    ];

    // Create confetti
    for (let i = 0; i < 200; i++) {
      confettiPieces.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        wobble: Math.random() * 10 - 5,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    let confettiFrame = 0;
    const maxFrames = 400;

    function animateConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiFrame++;

      confettiPieces.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.y * p.wobbleSpeed) * p.wobble * 0.1;
        p.rotation += p.rotationSpeed;

        // Fade out near end
        if (confettiFrame > maxFrames - 100) {
          p.opacity = Math.max(0, p.opacity - 0.01);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Reset if fallen off screen
        if (p.y > confettiCanvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * confettiCanvas.width;
        }
      });

      if (confettiFrame < maxFrames) {
        requestAnimationFrame(animateConfetti);
      }
    }

    animateConfetti();

    // Second burst after a short delay
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        confettiPieces.push({
          x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
          y: confettiCanvas.height / 2,
          w: Math.random() * 10 + 5,
          h: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 4 + 1,
          wobble: Math.random() * 15 - 7.5,
          wobbleSpeed: Math.random() * 0.1 + 0.05,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 15 - 7.5,
          opacity: 1,
          shape: Math.random() > 0.3 ? "rect" : "circle",
        });
      }
    }, 800);
  }

  // === Window Resize ===
  window.addEventListener("resize", () => {
    resizeHeartsCanvas();
    if (confettiCanvas.width) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

  // === Init ===
  resizeHeartsCanvas();
  createSparkles();
  animateHearts();
})();
