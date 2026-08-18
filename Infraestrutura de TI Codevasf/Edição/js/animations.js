/* ==========================================================================
   DYNAMIC COUNTERS, AMBIENT PARTICLES & COLLABORATIVE GRAPH CANVAS
   ========================================================================== */

// 1. Ambient Background Particle Stream
class AmbientBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#00f0ff';
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// 2. Collaborative Network Graph (Slide 3)
class CollabGraph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.init();
  }

  init() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || 500;
    this.height = this.canvas.height = rect.height || 380;

    const labels = ['Diretoria', 'Gerências', 'Equipes Técnicas', 'TI', 'Usuários'];
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.nodes = labels.map((label, idx) => {
      const angle = (idx / labels.length) * Math.PI * 2;
      const r = 110;
      return {
        label,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3
      };
    });

    this.centerNode = { label: 'Codevasf M365', x: centerX, y: centerY };
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw lines connecting center node to all sub-nodes
    this.nodes.forEach(n => {
      this.ctx.beginPath();
      this.ctx.moveTo(this.centerNode.x, this.centerNode.y);
      this.ctx.lineTo(n.x, n.y);
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Inter-node connections
      this.nodes.forEach(n2 => {
        this.ctx.beginPath();
        this.ctx.moveTo(n.x, n.y);
        this.ctx.lineTo(n2.x, n2.y);
        this.ctx.strokeStyle = 'rgba(0, 120, 212, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      });
    });

    // Render center node
    this.ctx.beginPath();
    this.ctx.arc(this.centerNode.x, this.centerNode.y, 28, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0078d4';
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#00f0ff';
    this.ctx.fill();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 12px Segoe UI';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('M365', this.centerNode.x, this.centerNode.y);

    // Render outer nodes
    this.nodes.forEach(n => {
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
      this.ctx.fillStyle = '#0f172a';
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 2;
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = '600 11px Segoe UI';
      this.ctx.fillText(n.label, n.x, n.y + 32);
    });

    requestAnimationFrame(() => this.animate());
  }
}

// 3. Counter Animation Helper
function animateCounter(element, target, duration = 2000, prefix = '', suffix = '') {
  if (!element) return;
  let start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(eased * target);

    element.textContent = prefix + currentVal.toLocaleString('pt-BR') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
    }
  }

  requestAnimationFrame(update);
}

window.AmbientBackground = AmbientBackground;
window.CollabGraph = CollabGraph;
window.animateCounter = animateCounter;
