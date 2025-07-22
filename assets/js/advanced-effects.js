/*
==========================================================================
INVESTMENT SITE - ADVANCED INTERACTIONS & EFFECTS
==========================================================================
Sophisticated mouse tracking, parallax effects, and premium interactions
==========================================================================
*/

class AdvancedEffects {
  constructor() {
    this.init();
    this.setupMouseTracking();
    this.setupParallaxEffects();
    this.setupMorphingEffects();
    this.setupAdvancedAnimations();
    this.setupIntersectionAnimations();
  }

  init() {
    // Initialize advanced effects after DOM load
    this.mouse = { x: 0, y: 0 };
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    
    // Bind resize handler
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Setup smooth scrolling enhancements
    this.setupSmoothScrolling();
  }

  setupMouseTracking() {
    // Advanced mouse tracking for spotlight effect
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      // Update CSS custom properties for spotlight effect
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / this.windowWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / this.windowHeight) * 100}%`);
      
      // Update floating elements based on mouse position
      this.updateFloatingElements(e);
    });

    // Enhanced card hover effects
    this.setupCardHoverEffects();
  }

  updateFloatingElements(e) {
    const floatingElements = document.querySelectorAll('.float-animation, .float-animation-delayed, .float-animation-slow');
    
    floatingElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / 50;
      const deltaY = (e.clientY - centerY) / 50;
      
      // Apply subtle mouse-following effect
      const intensity = 0.1 + (index * 0.05);
      element.style.transform = `translate(${deltaX * intensity}px, ${deltaY * intensity}px)`;
    });
  }

  setupCardHoverEffects() {
    const cards = document.querySelectorAll('.market-card, .stat, .glass-container');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.createHoverGlow(e.target);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.removeHoverGlow(e.target);
      });
      
      // 3D tilt effect
      card.addEventListener('mousemove', (e) => {
        this.apply3DTilt(e, card);
      });
    });
  }

  createHoverGlow(element) {
    // Create dynamic glow effect
    element.style.boxShadow = `
      0 20px 60px rgba(13, 148, 136, 0.2),
      0 0 40px rgba(13, 148, 136, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `;
    
    // Add pulsing border
    element.style.borderImage = 'linear-gradient(135deg, rgba(13, 148, 136, 0.5), rgba(217, 119, 6, 0.5)) 1';
  }

  removeHoverGlow(element) {
    // Reset to original state
    element.style.boxShadow = '';
    element.style.borderImage = '';
    element.style.transform = '';
  }

  apply3DTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    element.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateZ(10px)
    `;
  }

  setupParallaxEffects() {
    // Advanced parallax scrolling
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      // Header scroll effect
      this.updateHeaderOnScroll(scrollTop);
    });
  }

  updateHeaderOnScroll(scrollTop) {
    const header = document.querySelector('.header');
    
    if (scrollTop > 50) {
      header.classList.add('scrolled');
      header.style.background = 'rgba(255, 255, 255, 0.08)';
      header.style.backdropFilter = 'blur(40px)';
    } else {
      header.classList.remove('scrolled');
      header.style.background = 'rgba(255, 255, 255, 0.05)';
      header.style.backdropFilter = 'blur(30px)';
    }
  }

  setupMorphingEffects() {
    // Morphing background shapes
    this.createMorphingShapes();
    
    // Dynamic gradient shifts
    this.setupDynamicGradients();
  }

  createMorphingShapes() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create floating morphing shapes
    for (let i = 0; i < 3; i++) {
      const shape = document.createElement('div');
      shape.className = `morphing-shape morphing-shape-${i + 1}`;
      shape.style.cssText = `
        position: absolute;
        width: ${200 + i * 100}px;
        height: ${200 + i * 100}px;
        background: radial-gradient(circle, 
          rgba(13, 148, 136, ${0.05 - i * 0.01}) 0%, 
          transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
        animation: morphFloat${i + 1} ${15 + i * 5}s ease-in-out infinite;
        z-index: -1;
      `;
      
      hero.appendChild(shape);
    }
    
    // Add morphing animations to CSS
    this.addMorphingKeyframes();
  }

  addMorphingKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes morphFloat1 {
        0%, 100% { 
          transform: translate(10vw, 20vh) scale(1); 
          opacity: 0.5;
        }
        25% { 
          transform: translate(80vw, 10vh) scale(1.2); 
          opacity: 0.8;
        }
        50% { 
          transform: translate(70vw, 70vh) scale(0.8); 
          opacity: 0.3;
        }
        75% { 
          transform: translate(20vw, 80vh) scale(1.1); 
          opacity: 0.6;
        }
      }
      
      @keyframes morphFloat2 {
        0%, 100% { 
          transform: translate(80vw, 10vh) scale(0.8) rotate(0deg); 
          opacity: 0.3;
        }
        33% { 
          transform: translate(10vw, 50vh) scale(1.3) rotate(120deg); 
          opacity: 0.7;
        }
        66% { 
          transform: translate(60vw, 80vh) scale(0.9) rotate(240deg); 
          opacity: 0.4;
        }
      }
      
      @keyframes morphFloat3 {
        0%, 100% { 
          transform: translate(50vw, 80vh) scale(1.1) rotate(0deg); 
          opacity: 0.4;
        }
        40% { 
          transform: translate(20vw, 20vh) scale(0.7) rotate(160deg); 
          opacity: 0.8;
        }
        80% { 
          transform: translate(90vw, 60vh) scale(1.4) rotate(320deg); 
          opacity: 0.2;
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupDynamicGradients() {
    // Dynamic gradient animation based on time
    setInterval(() => {
      const time = Date.now() / 10000;
      const hue1 = Math.sin(time) * 30 + 180;
      const hue2 = Math.sin(time + 2) * 30 + 30;
      
      document.documentElement.style.setProperty(
        '--dynamic-gradient', 
        `linear-gradient(135deg, hsl(${hue1}, 70%, 40%) 0%, hsl(${hue2}, 80%, 50%) 100%)`
      );
    }, 100);
  }

  setupAdvancedAnimations() {
    // Staggered animations for grids
    this.setupStaggeredAnimations();
    
    // Advanced counter animations
    this.setupCounterAnimations();
    
    // Text reveal animations
    this.setupTextReveal();
  }

  setupStaggeredAnimations() {
    const gridContainers = document.querySelectorAll('.market-grid, .hero__stats');
    
    gridContainers.forEach(container => {
      const items = container.children;
      
      Array.from(items).forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          item.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, index * 150);
      });
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const animateCounter = (element) => {
      const target = parseFloat(element.dataset.counter);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        element.textContent = current.toFixed(1);
      }, 16);
    };
    
    // Trigger counters when in view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          animateCounter(entry.target);
          entry.target.dataset.animated = 'true';
        }
      });
    });
    
    counters.forEach(counter => observer.observe(counter));
  }

  setupTextReveal() {
    const textElements = document.querySelectorAll('.hero__title, .section-title');
    
    textElements.forEach(element => {
      const text = element.textContent;
      element.innerHTML = '';
      
      // Split text into spans
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: revealChar 0.6s ease forwards;
          animation-delay: ${index * 0.03}s;
        `;
        element.appendChild(span);
      });
    });
    
    // Add reveal animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes revealChar {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  setupIntersectionAnimations() {
    // Enhanced intersection observer for advanced animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger particle effects for special elements
          if (entry.target.classList.contains('market-card')) {
            this.createParticleEffect(entry.target);
          }
        }
      });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.market-card, .stat, .glass-container');
    animatedElements.forEach(el => observer.observe(el));
  }

  createParticleEffect(element) {
    // Create subtle particle animation around cards
    const particles = 12;
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(13, 148, 136, 0.6);
        border-radius: 50%;
        pointer-events: none;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        animation: particleFloat 3s ease-out forwards;
        z-index: 1000;
      `;
      
      // Random direction and speed
      const angle = (i / particles) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const duration = 2 + Math.random() * 2;
      
      particle.style.setProperty('--angle', `${angle}rad`);
      particle.style.setProperty('--distance', `${distance}px`);
      particle.style.animationDuration = `${duration}s`;
      
      document.body.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }
    
    // Add particle animation if not exists
    if (!document.querySelector('#particle-animation')) {
      const style = document.createElement('style');
      style.id = 'particle-animation';
      style.textContent = `
        @keyframes particleFloat {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * var(--distance)),
              calc(sin(var(--angle)) * var(--distance))
            ) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 100;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Add visual feedback
          this.addScrollFeedback(targetElement);
        }
      });
    });
  }

  addScrollFeedback(element) {
    // Brief highlight effect when scrolling to section
    element.style.boxShadow = '0 0 30px rgba(13, 148, 136, 0.3)';
    element.style.transition = 'box-shadow 0.3s ease';
    
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 1000);
  }

  handleResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    
    // Recalculate positions for responsive design
    this.updateResponsiveEffects();
  }

  updateResponsiveEffects() {
    // Adjust effects based on screen size
    const isMobile = this.windowWidth < 768;
    
    if (isMobile) {
      // Reduce intensive effects on mobile
      document.documentElement.style.setProperty('--glow-intensity', '0.1');
    } else {
      document.documentElement.style.setProperty('--glow-intensity', '0.3');
    }
  }
}

// Initialize advanced effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedEffects();
});

// Export for use in other modules
window.AdvancedEffects = AdvancedEffects;
