/* ==========================================================================
   LÓGICA DA APRESENTAÇÃO — CLUBE DE AVENTUREIROS CRUZEIRO DO SUL
   ========================================================================== */

/* -------- CONTROLE DA APRESENTAÇÃO -------- */
class Presentation {
  constructor() {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.cur = 0;
    this.total = this.slides.length;

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
    
    if (this.total > 0) {
      this.slides[this.cur].classList.add('active');
      this.update(this.cur);
      this.triggerAnim(this.cur);
    }
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
      if (['ArrowRight', 'Space', 'PageDown', 'l', 'L'].includes(e.key)) { e.preventDefault(); this.go(this.cur + 1); }
      if (['ArrowLeft', 'PageUp', 'h', 'H'].includes(e.key)) { e.preventDefault(); this.go(this.cur - 1); }
      if (e.key === 'Home') this.go(0);
      if (e.key === 'End') this.go(this.total - 1);
      if (e.key === 'm' || e.key === 'M') this.openModal();
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      }
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
    const activeSlide = this.slides[idx];
    if (!activeSlide) return;

    // Reinicia animações de cards
    const cards = activeSlide.querySelectorAll('.adv-card, .price-card, .spec-badge');
    cards.forEach(card => {
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = '';
    });
  }

  buildThumbs() {
    if (!this.thumbsGrid) return;
    this.thumbsGrid.innerHTML = '';
    this.slides.forEach((s, i) => {
      let title = s.querySelector('h2, h1')?.textContent || `Slide ${i + 1}`;
      title = title.replace(/\s+/g, ' ').trim();
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
});
