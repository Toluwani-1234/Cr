/* ===============================
   FIRE HORSE — ENHANCED JS
   Smooth Scrolling + Animations
   =============================== */

// Helper Functions
const qs = (s, o = document) => o.querySelector(s);
const qsa = (s, o = document) => [...o.querySelectorAll(s)];

/* ========== HAMBURGER MENU ========== */
const hamburger = qs('.hamburger');
const navMenu = qs('.nav-menu');
const navLinks = qsa('.nav-menu a');

function toggleMenu() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
      toggleMenu();
    }
  });
}

/* ========== SMOOTH SCROLL ========== */
// Enhanced smooth scrolling for navigation links
qsa('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = qs(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ========== CONTRACT ADDRESS COPY ========== */
const copyButton = qs('#copyButton');
const contractAddress = qs('#contractAddress');

if (copyButton && contractAddress) {
  copyButton.addEventListener('click', async () => {
    const address = contractAddress.textContent;
    
    try {
      await navigator.clipboard.writeText(address);
      
      // Visual feedback
      const originalHTML = copyButton.innerHTML;
      copyButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      copyButton.style.color = '#4ade80';
      
      // Reset after 2 seconds
      setTimeout(() => {
        copyButton.innerHTML = originalHTML;
        copyButton.style.color = '';
      }, 2000);
      
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        copyButton.style.color = '#4ade80';
        setTimeout(() => {
          copyButton.style.color = '';
        }, 2000);
      } catch (err2) {
        console.error('Fallback copy failed:', err2);
      }
      
      document.body.removeChild(textArea);
    }
  });
}

/* ========== NAVBAR SCROLL EFFECT ========== */
const nav = qs('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

/* ========== ACTIVE NAV HIGHLIGHT ========== */
const sections = qsa('section');
const navLinkElements = qsa('.nav-menu a');

const highlightNav = () => {
  let current = '';
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinkElements.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', highlightNav);

/* ========== SCROLL REVEAL ANIMATION ========== */
const revealElements = qsa('section, .token-card, .step, .phase, .grid, .social-link');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Add stagger effect for grid items
        if (entry.target.parentElement?.classList.contains('token-grid') ||
            entry.target.parentElement?.classList.contains('steps')) {
          const siblings = [...entry.target.parentElement.children];
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  }
);

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ========== GLITCH EFFECT ON HOVER ========== */
function createGlitchEffect(el) {
  const originalText = el.textContent;
  let glitchInterval;
  
  el.addEventListener('mouseenter', () => {
    let iterations = 0;
    const maxIterations = 5;
    
    glitchInterval = setInterval(() => {
      if (iterations >= maxIterations) {
        el.textContent = originalText;
        clearInterval(glitchInterval);
        return;
      }
      
      el.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return String.fromCharCode(33 + Math.floor(Math.random() * 94));
        })
        .join('');
      
      iterations += 0.5;
    }, 50);
  });
  
  el.addEventListener('mouseleave', () => {
    clearInterval(glitchInterval);
    el.textContent = originalText;
  });
}

// Apply glitch to specific elements
qsa('.cta, .hero-title').forEach(el => {
  if (el.classList.contains('hero-title')) {
    // Lighter glitch for hero title
    el.addEventListener('mouseenter', () => {
      el.style.textShadow = `
        3px 0 var(--accent-cyan),
        -3px 0 var(--fire-red),
        0 0 60px var(--fire-orange)
      `;
    });
    el.addEventListener('mouseleave', () => {
      el.style.textShadow = '';
    });
  }
});

/* ========== FIRE SPARKS CANVAS ========== */
const canvas = document.createElement('canvas');
canvas.style.cssText = `
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  opacity: 0.6;
`;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let w, h;

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Spark {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * w;
    this.y = h + Math.random() * 100;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(0.5 + Math.random() * 1.2);
    this.life = Math.random() * 150 + 100;
    this.maxLife = this.life;
    this.size = Math.random() * 2 + 1;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    
    if (this.life <= 0 || this.y < -20) {
      this.reset();
    }
  }
  
  draw() {
    const alpha = (this.life / this.maxLife) * 0.8;
    const hue = 20 + Math.random() * 40; // Orange to yellow hues
    
    ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsla(${hue}, 100%, 60%, ${alpha})`;
  }
}

const sparks = Array.from({ length: 80 }, () => new Spark());

function animateSparks() {
  ctx.clearRect(0, 0, w, h);
  
  sparks.forEach(spark => {
    spark.update();
    spark.draw();
  });
  
  requestAnimationFrame(animateSparks);
}
animateSparks();

/* ========== VIDEO BACKGROUND HANDLING ========== */
const heroVideo = qs('#heroVideo');

if (heroVideo) {
  // Ensure video plays on mobile
  heroVideo.play().catch(err => {
    console.log('Video autoplay prevented:', err);
    // Fallback: try playing on user interaction
    document.addEventListener('click', () => {
      heroVideo.play();
    }, { once: true });
  });
  
  // Optimize video performance
  heroVideo.playbackRate = 1;
  
  // Pause video when not in view (performance optimization)
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroVideo.play();
        } else {
          heroVideo.pause();
        }
      });
    },
    { threshold: 0.25 }
  );
  
  videoObserver.observe(qs('#home'));
}

/* ========== PARALLAX SCROLL EFFECT ========== */
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = qsa('.hero-content');
  
  parallaxElements.forEach(el => {
    const speed = 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

/* ========== HOVER TILT EFFECT FOR CARDS ========== */
qsa('.token-card, .step').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ========== REDUCE MOTION ACCESSIBILITY ========== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  canvas.remove();
  document.body.style.transform = 'none';
  
  qsa('.reveal').forEach(el => {
    el.style.transition = 'none';
    el.classList.add('active');
  });
  
  // Disable parallax
  qsa('.hero-content').forEach(el => {
    el.style.transform = 'none';
  });
}

/* ========== PERFORMANCE OPTIMIZATION ========== */
// Throttle scroll events
let ticking = false;
const throttledScroll = (callback) => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
    ticking = true;
  }
};

// Apply throttling to scroll handlers
window.addEventListener('scroll', () => {
  throttledScroll(highlightNav);
});

/* ========== LOADING STATE ========== */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  console.log('🔥 Fire Horse fully loaded — No brakes. Only fire.');
});

/* ========== CTA BUTTON RIPPLE EFFECT ========== */
qsa('.cta, .social-link').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    `;
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .cta, .social-link {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

console.log('✨ Enhanced Fire Horse JS initialized — Smooth scrolling activated');
