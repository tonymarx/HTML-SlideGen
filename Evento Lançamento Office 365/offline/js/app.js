/* ==========================================================================
   LÓGICA DA APRESENTAÇÃO INSTITUCIONAL MICROSOFT 365 CODEVASF
   ========================================================================== */

/* -------- WORD CLOUD (Slide 1) -------- */
class WordCloud {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.names = ['André Luís', 'Caíque Lira', 'Carlos Magno', 'Diogo Bento', 'Ivo Portela', 'Leonardo Santos', 'Marcelo Carvalho', 'Marcelo Ferreira', 'Rafael Pontes', 'Rui Bisneto', 'Stênio Mendes', 'Vinícius Ximenes'];
    this.words = [];
    this.raf = null;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    const colors = ['#ffffff', '#49b7ff', '#a0d4f5', '#d0e8ff', '#7cb9f0', '#c8e6ff'];
    this.words = this.names.map((name, i) => {
      const angle = (i / this.names.length) * Math.PI * 2;
      const r = 95 + Math.random() * 55;
      return {
        text: name, x: this.w / 2 + Math.cos(angle) * r, y: this.h / 2 + Math.sin(angle) * r,
        size: 14 + Math.random() * 12, color: colors[i % colors.length],
        angle, speed: .004 + Math.random() * .004, radius: r
      };
    });
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.w = this.canvas.width = rect.width || 500;
    this.h = this.canvas.height = rect.height || 340;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    const cx = this.w / 2, cy = this.h / 2;
    // Orbital rings
    [80, 130, 165].forEach(r => {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(255,255,255,.08)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
    // Words
    this.words.forEach(w => {
      w.angle += w.speed;
      w.x = cx + Math.cos(w.angle) * w.radius;
      w.y = cy + Math.sin(w.angle) * (w.radius * 0.56);
      this.ctx.save();
      this.ctx.font = `700 ${w.size}px Inter,Segoe UI,sans-serif`;
      this.ctx.fillStyle = w.color;
      this.ctx.shadowColor = w.color;
      this.ctx.shadowBlur = 10;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(w.text, w.x, w.y);
      this.ctx.restore();
    });
    this.raf = requestAnimationFrame(() => this.animate());
  }
}

/* -------- COLLAB GRAPH (Slide 3) -------- */
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
    this.w = this.canvas.width = rect.width || 480;
    this.h = this.canvas.height = rect.height || 300;
    const labels = ['Diretoria', 'Gerências', 'Equipes Técnicas', 'TI', 'Usuários'];
    const cx = this.w / 2, cy = this.h / 2;
    this.nodes = labels.map((label, i) => {
      const angle = (i / labels.length) * Math.PI * 2;
      const r = Math.min(this.w, this.h) * 0.34;
      return {
        label, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r,
        angle, speed: .004 + i * .001, radius: r
      };
    });
    this.center = { x: cx, y: cy };
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    const cx = this.w / 2, cy = this.h / 2;

    // Lines center→nodes and node→node
    this.nodes.forEach(n => {
      n.angle += n.speed;
      n.x = cx + Math.cos(n.angle) * n.radius;
      n.y = cy + Math.sin(n.angle) * (n.radius * 0.72);

      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(n.x, n.y);
      this.ctx.strokeStyle = 'rgba(17,72,148,.18)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    });

    // Center node
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    const g = this.ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, 26);
    g.addColorStop(0, '#2f7de6');
    g.addColorStop(1, '#0b2e63');
    this.ctx.fillStyle = g;
    this.ctx.shadowBlur = 18;
    this.ctx.shadowColor = 'rgba(73,183,255,.5)';
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 10px Inter,sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('M365', cx, cy);

    // Outer nodes
    this.nodes.forEach(n => {
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'rgba(17,72,148,.28)';
      this.ctx.lineWidth = 2;
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#0b2e63';
      this.ctx.font = '600 10px Inter,sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(n.label, n.x, n.y + 30);
    });

    requestAnimationFrame(() => this.animate());
  }
}

/* -------- COUNTER ANIMATION -------- */
function animateCounter(el, target, dur = 1800, fmt) {
  if (!el) return;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt ? fmt(Math.floor(ease * target)) : Math.floor(ease * target).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = fmt ? fmt(target) : target.toLocaleString('pt-BR');
  })(start);
}

/* -------- PRESENTATION CONTROLLER -------- */
class Presentation {
  constructor() {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.cur = 0;
    this.total = this.slides.length;
    this.wc = null;
    this.cg = null;

    this.progFill = document.getElementById('prog-fill');
    this.curEl = document.getElementById('cur-slide');
    this.totalEl = document.getElementById('total-slides');
    this.btnPrev = document.getElementById('btn-prev');
    this.btnNext = document.getElementById('btn-next');
    this.btnGrid = document.getElementById('btn-grid');
    this.modal = document.getElementById('modal-overlay');
    this.thumbsGrid = document.getElementById('thumbs-grid');
    this.btnClose = document.getElementById('btn-close-modal');

    if (this.totalEl) this.totalEl.textContent = this.total;
    this.buildThumbs();
    this.bind();
    this.update(0);
  }

  bind() {
    this.btnPrev?.addEventListener('click', () => this.go(this.cur - 1));
    this.btnNext?.addEventListener('click', () => this.go(this.cur + 1));
    this.btnGrid?.addEventListener('click', () => this.openModal());
    this.btnClose?.addEventListener('click', () => this.closeModal());
    this.modal?.addEventListener('click', e => { if (e.target === this.modal) this.closeModal(); });

    document.addEventListener('keydown', e => {
      if (this.modal?.classList.contains('open')) {
        if (e.key === 'Escape') this.closeModal();
        return;
      }
      if (['ArrowRight', 'Space', 'PageDown'].includes(e.key)) { e.preventDefault(); this.go(this.cur + 1); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); this.go(this.cur - 1); }
      if (e.key === 'Home') this.go(0);
      if (e.key === 'End') this.go(this.total - 1);
      if (e.key === 'm' || e.key === 'M') this.openModal();
      if (e.key === 'f' || e.key === 'F') document.documentElement.requestFullscreen?.().catch(() => { });
    });

    let tx = 0;
    document.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; });
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - tx;
      if (dx < -50) this.go(this.cur + 1);
      if (dx > 50) this.go(this.cur - 1);
    });
  }

  go(idx) {
    if (idx < 0 || idx >= this.total) return;
    const prev = this.cur;
    this.slides[prev].classList.remove('active');
    this.slides[prev].classList.add('prev');
    setTimeout(() => this.slides[prev].classList.remove('prev'), 620);
    this.cur = idx;
    this.slides[idx].classList.add('active');
    this.update(idx);
    this.triggerAnim(idx);
  }

  update(idx) {
    const pct = ((idx + 1) / this.total) * 100;
    if (this.progFill) this.progFill.style.width = pct + '%';
    if (this.curEl) this.curEl.textContent = idx + 1;
    if (this.btnPrev) this.btnPrev.disabled = idx === 0;
    if (this.btnNext) this.btnNext.disabled = idx === this.total - 1;
  }

  triggerAnim(idx) {
    // Slide 0 — Vídeo capa: play ao entrar, pause ao sair
    const vid = document.getElementById('cover-video');
    if (vid) {
      if (idx === 0) {
        vid.playbackRate = 0.5;
        vid.play().catch(() => { });
      } else {
        vid.pause();
      }
    }
    // Slide 1 — Painel de Equipe: reinicia animação de entrada a cada visita
    if (idx === 1) {
      setTimeout(() => {
        const cards = document.querySelectorAll('#slide-1 .member-card');
        cards.forEach(card => {
          card.style.animation = 'none';
          void card.offsetWidth; // force reflow
          card.style.animation = '';
        });
      }, 80);
    }
    // Slide 3 (antigo slide 2) — Collab Graph
    if (idx === 3 && !this.cg) {
      setTimeout(() => { this.cg = new CollabGraph('collab-canvas'); }, 200);
    }
    // Slide 4 (antigo slide 3) — 1.800 counter
    if (idx === 4) {
      setTimeout(() => {
        const el = document.getElementById('count-1800');
        if (el) animateCounter(el, 1800, 1600, n => n.toLocaleString('pt-BR'));
      }, 150);
    }
    // Slide 5 — Volume de Dados Migrados (+12M e ~6 TB)
    if (idx === 5) {
      const m = document.getElementById('count-12m');
      const t = document.getElementById('count-6tb');
      const g = document.getElementById('gauge-fill-6tb');
      if (g) {
        g.style.animation = 'none';
        void g.offsetWidth; // Force reflow
        g.style.animation = 'fillStorageGauge 4.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
      setTimeout(() => {
        if (m) animateCounter(m, 12000000, 4200, '+');
        if (t) animateCounter(t, 6, 4200, '~', ' TB');
      }, 80);
    }
    // Slide 6 (antigo slide 5) — Storage bars
    if (idx === 6) {
      const b = document.getElementById('fill-before');
      const a = document.getElementById('fill-after');
      setTimeout(() => { if (b) b.style.width = '20%'; if (a) a.style.width = '100%'; }, 200);
    }
    // Slide 7 — +2 Petabytes em Nuvem Corporativa
    if (idx === 7) {
      const pb = document.getElementById('count-pb');
      const bar = document.getElementById('bar-pb');
      if (bar) {
        bar.style.animation = 'none';
        void bar.offsetWidth; // Force reflow
        bar.style.animation = 'fillPbBar 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      }
      setTimeout(() => {
        if (pb) animateCounter(pb, 2, 1200, '+');
      }, 100);
    }
    // Slide 8 — Testes e Validação: Contadores e Barras Animadas
    if (idx === 8) {
      setTimeout(() => {
        const u = document.getElementById('count-users');
        const dft = document.getElementById('count-dft');
        const d = document.getElementById('count-days');
        const bu = document.getElementById('bar-users');
        const bdft = document.getElementById('bar-dft');
        const bd = document.getElementById('bar-days');
        if (u) animateCounter(u, 50, 1400, n => '+' + n);
        if (dft) animateCounter(dft, 70, 1400, n => '+' + n);
        if (d) animateCounter(d, 30, 1400, n => '+' + n);
        if (bu) bu.style.width = '100%';
        if (bdft) bdft.style.width = '100%';
        if (bd) bd.style.width = '100%';
      }, 150);
    }
    // Slide 9 — Vídeo da Suite M365 (Velocidade 0.5x)
    if (idx === 9) {
      const v = document.getElementById('suite-365-video');
      if (v) {
        v.playbackRate = 0.5;
        v.play().catch(() => {});
      }
    }
  }

  buildThumbs() {
    if (!this.thumbsGrid) return;
    this.thumbsGrid.innerHTML = '';
    this.slides.forEach((s, i) => {
      const title = s.querySelector('h2')?.textContent || `Slide ${i + 1}`;
      const card = document.createElement('div');
      card.className = 'thumb-card' + (i === this.cur ? ' active' : '');
      card.innerHTML = `<div class="thumb-num">SLIDE ${i + 1}</div><div class="thumb-title">${title}</div>`;
      card.addEventListener('click', () => { this.go(i); this.closeModal(); });
      this.thumbsGrid.appendChild(card);
    });
  }

  openModal() {
    this.buildThumbs();
    this.modal?.classList.add('open');
  }

  closeModal() {
    this.modal?.classList.remove('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ppt = new Presentation();

  // Configura playbackRate 0.5x no vídeo da Suite 365 (Slide 9)
  const suiteVideo = document.getElementById('suite-365-video');
  if (suiteVideo) {
    suiteVideo.playbackRate = 0.5;
    suiteVideo.addEventListener('canplay', () => { suiteVideo.playbackRate = 0.5; });
  }
});
