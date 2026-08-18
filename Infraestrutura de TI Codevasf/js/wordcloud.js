/* ==========================================================================
   DYNAMIC HTML5 CANVAS WORD CLOUD (SLIDE 1 - EQUIPES)
   ========================================================================== */

class TeamWordCloud {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.names = [
      'André Luís', 'Caíque Lira', 'Carlos Magno', 'Diogo Bento',
      'Ivo Portela', 'Leonardo Santos', 'Marcelo Carvalho', 'Marcelo Ferreira',
      'Rafael Pontes', 'Rui Bisneto', 'Stênio Mendes', 'Vinícius Ximenes'
    ];

    this.words = [];
    this.animationFrame = null;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    const colors = ['#ffffff', '#00f0ff', '#38bdf8', '#00a896', '#60a5fa', '#93c5fd'];

    this.words = this.names.map((name, index) => {
      const angle = (index / this.names.length) * Math.PI * 2;
      const radius = 100 + Math.random() * 80;
      return {
        text: name,
        x: this.width / 2 + Math.cos(angle) * radius,
        y: this.height / 2 + Math.sin(angle) * radius,
        baseX: this.width / 2 + Math.cos(angle) * radius,
        baseY: this.height / 2 + Math.sin(angle) * radius,
        size: Math.floor(18 + Math.random() * 14),
        color: colors[index % colors.length],
        angle: angle,
        speed: 0.005 + Math.random() * 0.005,
        radius: radius
      };
    });

    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width || 600;
    this.height = this.canvas.height = rect.height || 400;
  }

  start() {
    const render = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);

      const centerX = this.width / 2;
      const centerY = this.height / 2;

      // Draw subtle connecting orbital rings
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.words.forEach(w => {
        w.angle += w.speed;
        w.x = centerX + Math.cos(w.angle) * w.radius;
        w.y = centerY + Math.sin(w.angle) * (w.radius * 0.6);

        // Glow effect
        this.ctx.save();
        this.ctx.font = `700 ${w.size}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = w.color;
        this.ctx.shadowColor = w.color;
        this.ctx.shadowBlur = 12;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(w.text, w.x, w.y);
        this.ctx.restore();
      });

      this.animationFrame = requestAnimationFrame(render);
    };

    render();
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

window.TeamWordCloud = TeamWordCloud;
