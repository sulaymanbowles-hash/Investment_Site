/*
==========================================================================
INVESTMENT SITE - ANIMATIONS & INTERACTIONS
==========================================================================
Advanced animations, scroll effects, and interactive elements
==========================================================================
*/

class AnimationManager {
  constructor() {
    this.scrollPosition = 0;
    this.isScrolling = false;
    this.animatedElements = new Set();
    this.parallaxElements = [];
    
    this.init();
    this.bindEvents();
  }

  init() {
    this.setupScrollAnimations();
    this.setupParallaxElements();
    this.setupHoverEffects();
    this.setupLoadingAnimations();
    this.setupTypewriter();
  }

  bindEvents() {
    // Optimized scroll handling with requestAnimationFrame
    window.addEventListener('scroll', this.throttleScroll.bind(this), { passive: true });
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Touch events for mobile interactions
    this.setupTouchEvents();
  }

  throttleScroll() {
    if (!this.isScrolling) {
      requestAnimationFrame(() => {
        this.handleScroll();
        this.isScrolling = false;
      });
      this.isScrolling = true;
    }
  }

  handleScroll() {
    this.scrollPosition = window.pageYOffset;
    
    this.updateParallaxElements();
    this.updateScrollAnimations();
    this.updateProgressBar();
    this.updateNavigationState();
  }

  setupScrollAnimations() {
    // Advanced intersection observer with multiple thresholds
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1],
      rootMargin: '0px 0px -50px 0px'
    };

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const animationType = element.dataset.animation || 'fadeInUp';
        
        if (entry.isIntersecting && !this.animatedElements.has(element)) {
          this.animatedElements.add(element);
          this.triggerAnimation(element, animationType);
        }
        
        // Update animation progress based on intersection ratio
        this.updateAnimationProgress(element, entry.intersectionRatio);
      });
    }, observerOptions);

    // Observe all animated elements
    const elements = document.querySelectorAll('[data-animation], .animate-on-scroll');
    elements.forEach(el => this.scrollObserver.observe(el));
  }

  triggerAnimation(element, type) {
    element.style.opacity = '0';
    element.style.transform = this.getInitialTransform(type);
    
    // Use requestAnimationFrame for smooth animations
    requestAnimationFrame(() => {
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'none';
      
      // Add completion callback
      element.addEventListener('transitionend', () => {
        element.classList.add('animation-complete');
      }, { once: true });
    });
  }

  getInitialTransform(type) {
    const transforms = {
      fadeInUp: 'translateY(50px)',
      fadeInDown: 'translateY(-50px)',
      fadeInLeft: 'translateX(-50px)',
      fadeInRight: 'translateX(50px)',
      scaleIn: 'scale(0.8)',
      rotateIn: 'rotate(-10deg) scale(0.8)',
      slideInUp: 'translateY(100px)',
      bounceIn: 'scale(0.3)'
    };
    
    return transforms[type] || transforms.fadeInUp;
  }

  updateAnimationProgress(element, ratio) {
    // Create dynamic effects based on scroll progress
    if (element.classList.contains('parallax-element')) {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const yPos = -(this.scrollPosition * speed);
      element.style.transform = `translateY(${yPos}px)`;
    }
  }

  setupParallaxElements() {
    this.parallaxElements = document.querySelectorAll('.parallax-element, [data-parallax]');
    
    this.parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const direction = element.dataset.direction || 'up';
      
      element.parallaxConfig = {
        speed: parseFloat(speed),
        direction,
        initialOffset: element.getBoundingClientRect().top + window.pageYOffset
      };
    });
  }

  updateParallaxElements() {
    this.parallaxElements.forEach(element => {
      const config = element.parallaxConfig;
      if (!config) return;
      
      const elementTop = config.initialOffset;
      const elementVisible = elementTop - this.scrollPosition - window.innerHeight;
      
      if (elementVisible < 0 && elementTop > this.scrollPosition - element.offsetHeight) {
        const yPos = elementVisible * config.speed;
        const transform = config.direction === 'down' ? 
          `translateY(${-yPos}px)` : 
          `translateY(${yPos}px)`;
        
        element.style.transform = transform;
      }
    });
  }

  setupHoverEffects() {
    // Advanced hover effects for interactive elements
    this.setupCardHoverEffects();
    this.setupButtonHoverEffects();
    this.setupLinkHoverEffects();
  }

  setupCardHoverEffects() {
    const cards = document.querySelectorAll('.market-card, .research-card, .portfolio-card');
    
    cards.forEach(card => {
      let mouseX = 0;
      let mouseY = 0;
      let isHovering = false;
      
      card.addEventListener('mouseenter', (e) => {
        isHovering = true;
        this.animateCardTilt(card, true);
      });
      
      card.addEventListener('mouseleave', (e) => {
        isHovering = false;
        this.animateCardTilt(card, false);
        card.style.transform = '';
      });
      
      card.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = card.getBoundingClientRect();
        mouseX = e.clientX - rect.left - rect.width / 2;
        mouseY = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = (mouseY / rect.height) * 10;
        const rotateY = (mouseX / rect.width) * -10;
        
        card.style.transform = `
          translateY(-8px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          scale(1.02)
        `;
      });
    });
  }

  animateCardTilt(card, isEntering) {
    if (isEntering) {
      card.style.transition = 'transform 0.1s ease-out';
      card.style.transformStyle = 'preserve-3d';
    } else {
      card.style.transition = 'transform 0.3s ease-out';
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    }
  }

  setupButtonHoverEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Ripple effect
      button.addEventListener('click', (e) => {
        this.createRippleEffect(button, e);
      });
      
      // Magnetic effect on hover
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupLinkHoverEffects() {
    const links = document.querySelectorAll('.nav__link, .footer-link');
    
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        this.animateLink(link, true);
      });
      
      link.addEventListener('mouseleave', () => {
        this.animateLink(link, false);
      });
    });
  }

  animateLink(link, isEntering) {
    if (isEntering) {
      link.style.transform = 'translateY(-2px)';
      link.style.textShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
    } else {
      link.style.transform = '';
      link.style.textShadow = '';
    }
  }

  setupLoadingAnimations() {
    // Page load animations
    this.animatePageLoad();
    
    // Loading skeleton animations
    this.setupSkeletonLoaders();
  }

  animatePageLoad() {
    const elements = document.querySelectorAll('.hero__title, .hero__description, .hero__actions');
    
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 200 + (index * 100));
    });
  }

  setupSkeletonLoaders() {
    const skeletons = document.querySelectorAll('.skeleton');
    
    skeletons.forEach(skeleton => {
      skeleton.style.background = `
        linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)
      `;
      skeleton.style.backgroundSize = '200px 100%';
      skeleton.style.animation = 'shimmer 1.5s infinite';
    });
  }

  setupTypewriter() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
      const text = element.textContent;
      const speed = parseInt(element.dataset.speed) || 50;
      
      element.textContent = '';
      element.style.borderRight = '2px solid';
      element.style.animation = 'blink 1s infinite';
      
      this.typeWrite(element, text, speed);
    });
  }

  typeWrite(element, text, speed) {
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        element.style.borderRight = 'none';
        element.style.animation = 'none';
      }
    };
    
    type();
  }

  updateProgressBar() {
    // Reading progress bar
    const progressBar = document.querySelector('.reading-progress');
    if (!progressBar) return;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (this.scrollPosition / totalHeight) * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  updateNavigationState() {
    // Update navigation based on scroll position
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (this.scrollPosition > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  setupTouchEvents() {
    // Enhanced mobile interactions
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      // Add momentum scrolling effects
      this.handleMomentumScroll(deltaY);
    }, { passive: true });
  }

  handleMomentumScroll(deltaY) {
    // Add visual feedback for momentum scrolling
    if (Math.abs(deltaY) > 50) {
      document.body.style.transform = `translateY(${deltaY * 0.1}px)`;
      
      setTimeout(() => {
        document.body.style.transform = '';
      }, 100);
    }
  }

  handleResize() {
    // Recalculate parallax elements on resize
    this.parallaxElements.forEach(element => {
      if (element.parallaxConfig) {
        element.parallaxConfig.initialOffset = 
          element.getBoundingClientRect().top + window.pageYOffset;
      }
    });
  }

  // Utility methods for complex animations
  animate(element, keyframes, options = {}) {
    const defaultOptions = {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    };
    
    const animationOptions = { ...defaultOptions, ...options };
    
    if (element.animate) {
      return element.animate(keyframes, animationOptions);
    } else {
      // Fallback for older browsers
      return this.fallbackAnimate(element, keyframes, animationOptions);
    }
  }

  fallbackAnimate(element, keyframes, options) {
    // Simple fallback animation using transitions
    const startState = keyframes[0];
    const endState = keyframes[keyframes.length - 1];
    
    // Apply start state
    Object.assign(element.style, startState);
    
    requestAnimationFrame(() => {
      element.style.transition = `all ${options.duration}ms ${options.easing}`;
      Object.assign(element.style, endState);
    });
    
    return new Promise(resolve => {
      setTimeout(resolve, options.duration);
    });
  }

  // Public methods for external control
  triggerElementAnimation(selector, animationType = 'fadeInUp') {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
      setTimeout(() => {
        this.triggerAnimation(element, animationType);
      }, index * 100);
    });
  }

  pauseAllAnimations() {
    document.documentElement.style.setProperty('--animation-play-state', 'paused');
  }

  resumeAllAnimations() {
    document.documentElement.style.setProperty('--animation-play-state', 'running');
  }

  // Cleanup
  destroy() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
    
    window.removeEventListener('scroll', this.throttleScroll);
    window.removeEventListener('resize', this.handleResize);
  }
}

// CSS for ripple effect
const rippleCSS = `
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  @keyframes blink {
    0%, 50% { border-color: transparent; }
    51%, 100% { border-color: currentColor; }
  }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.animationManager = new AnimationManager();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (window.animationManager) {
    if (document.hidden) {
      window.animationManager.pauseAllAnimations();
    } else {
      window.animationManager.resumeAllAnimations();
    }
  }
});

// Export for global access
window.AnimationManager = AnimationManager;
