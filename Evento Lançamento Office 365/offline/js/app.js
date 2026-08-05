/* ==========================================================================
   PRESENTATION CONTROLLER & SLIDE NAVIGATION ENGINE
   ========================================================================== */

class PresentationController {
  constructor() {
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.currentSlideIndex = 0;
    this.totalSlides = this.slides.length;
    
    // UI Controls
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.counterEl = document.getElementById('slide-counter');
    this.progressBar = document.getElementById('progress-bar');
    this.timerEl = document.getElementById('timer-display');
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.gridBtn = document.getElementById('grid-btn');
    this.modalOverlay = document.getElementById('modal-overlay');
    this.thumbsGrid = document.getElementById('thumbs-grid');
    this.closeModalBtn = document.getElementById('close-modal-btn');

    // Timer variables
    this.secondsElapsed = 0;
    this.timerInterval = null;

    // Component instances
    this.wordCloudInstance = null;
    this.collabGraphInstance = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.buildThumbnails();
    this.updateSlideState(0);
    this.startTimer();

    // Initialize ambient background
    new AmbientBackground('ambient-canvas');
  }

  bindEvents() {
    // Navigation Buttons
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.modalOverlay.classList.contains('open')) {
        if (e.key === 'Escape') this.toggleModal(false);
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
        case 'PageDown':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'm':
        case 'M':
          this.toggleModal(true);
          break;
      }
    });

    // Touch Swiping support
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) this.nextSlide();
      if (touchEndX - touchStartX > 50) this.prevSlide();
    });

    // Fullscreen Button
    this.fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());
    this.gridBtn?.addEventListener('click', () => this.toggleModal(true));
    this.closeModalBtn?.addEventListener('click', () => this.toggleModal(false));
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    const previousIndex = this.currentSlideIndex;
    this.currentSlideIndex = index;
    this.updateSlideState(previousIndex);
  }

  nextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  updateSlideState(previousIndex) {
    this.slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'exit-left', 'exit-right');
      if (idx === this.currentSlideIndex) {
        slide.classList.add('active');
      } else if (idx < this.currentSlideIndex) {
        slide.classList.add('exit-left');
      } else {
        slide.classList.add('exit-right');
      }
    });

    // Update Counter & Progress Bar
    if (this.counterEl) {
      this.counterEl.innerHTML = `<span>${this.currentSlideIndex + 1}</span> / ${this.totalSlides}`;
    }

    if (this.progressBar) {
      const progressPercent = ((this.currentSlideIndex + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${progressPercent}%`;
    }

    // Nav buttons disabled state
    if (this.prevBtn) this.prevBtn.disabled = this.currentSlideIndex === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.currentSlideIndex === this.totalSlides - 1;

    // Trigger Slide-Specific Animations
    this.triggerSlideAnimations(this.currentSlideIndex);
  }

  triggerSlideAnimations(index) {
    // Slide 1: Word Cloud
    if (index === 0) {
      setTimeout(() => {
        if (!this.wordCloudInstance) {
          this.wordCloudInstance = new TeamWordCloud('wordcloud-canvas');
        }
      }, 300);
    }

    // Slide 3: Collab Network Graph
    if (index === 2) {
      setTimeout(() => {
        if (!this.collabGraphInstance) {
          this.collabGraphInstance = new CollabGraph('collab-canvas');
        }
      }, 300);
    }

    // Slide 4: Counter 1800
    if (index === 3) {
      const counterEl = document.getElementById('migrated-count');
      if (counterEl) animateCounter(counterEl, 1800, 1800);
    }

    // Slide 5: Volume Stats 12M e 6TB
    if (index === 4) {
      const msgEl = document.getElementById('stat-messages');
      const tbEl = document.getElementById('stat-tb');
      if (msgEl) animateCounter(msgEl, 12, 1500, '', ' Milhões');
      if (tbEl) animateCounter(tbEl, 6, 1500, '', ' TB');
    }

    // Slide 6: Storage comparison (5GB vs 50GB)
    if (index === 5) {
      const barBefore = document.getElementById('fill-before');
      const barAfter = document.getElementById('fill-after');
      if (barBefore) barBefore.style.width = '10%';
      if (barAfter) barAfter.style.width = '100%';
    }

    // Slide 7: Petabytes Counter
    if (index === 6) {
      const pbEl = document.getElementById('stat-pb');
      if (pbEl) animateCounter(pbEl, 2, 1200, '+', ' Petabytes');
    }

    // Slide 8: Users and Days Counters
    if (index === 7) {
      const usersEl = document.getElementById('stat-val-users');
      const daysEl = document.getElementById('stat-val-days');
      if (usersEl) animateCounter(usersEl, 50, 1200, '', '+');
      if (daysEl) animateCounter(daysEl, 30, 1200, '', '+');
    }
  }

  buildThumbnails() {
    if (!this.thumbsGrid) return;
    this.thumbsGrid.innerHTML = '';
    
    this.slides.forEach((slide, idx) => {
      const title = slide.querySelector('.slide-title')?.textContent || `Slide ${idx + 1}`;
      const card = document.createElement('div');
      card.className = `thumb-card ${idx === this.currentSlideIndex ? 'active' : ''}`;
      card.innerHTML = `
        <div class="thumb-num">SLIDE ${idx + 1}</div>
        <div class="thumb-title">${title}</div>
      `;
      card.addEventListener('click', () => {
        this.goToSlide(idx);
        this.toggleModal(false);
      });
      this.thumbsGrid.appendChild(card);
    });
  }

  toggleModal(open) {
    if (open) {
      this.buildThumbnails();
      this.modalOverlay.classList.add('open');
    } else {
      this.modalOverlay.classList.remove('open');
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao ativar tela cheia: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.secondsElapsed++;
      const mins = Math.floor(this.secondsElapsed / 60).toString().padStart(2, '0');
      const secs = (this.secondsElapsed % 60).toString().padStart(2, '0');
      if (this.timerEl) {
        this.timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }
}

// Start application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new PresentationController();
});
