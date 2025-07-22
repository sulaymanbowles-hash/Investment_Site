/*
==========================================================================
INVESTMENT SITE - MAIN JAVASCRIPT
==========================================================================
Core functionality, interactions, and user experience enhancements
==========================================================================
*/

class InvestmentSite {
  constructor() {
    this.init();
    this.bindEvents();
    this.setupScrollAnimations();
    this.initializeCounters();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupFormHandling();
    this.setupPerformanceChart();
  }

  init() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 100
      });
    }

    // Initialize loading overlay
    this.hideLoadingOverlay();
    
    // Set up intersection observer for animations
    this.setupIntersectionObserver();
    
    // Initialize navigation scroll effect
    this.setupNavigationScrollEffect();
  }

  bindEvents() {
    // Bind all event listeners
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('load', this.handleLoad.bind(this));
    
    // Navigation events
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
      navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }

    // Form events
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
    }

    // Time selector events
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
      btn.addEventListener('click', this.handleTimeSelection.bind(this));
    });

    // Navigation link events
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
  }

  setupScrollAnimations() {
    // Set up custom scroll animations
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  }

  initializeCounters() {
    // Animated counters for statistics
    const counters = document.querySelectorAll('[data-counter]');
    
    const animateCounter = (element) => {
      const target = parseFloat(element.dataset.counter);
      const duration = 2000; // 2 seconds
      const start = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        const current = target * easeOutExpo;
        
        // Format number based on target value
        if (target >= 1000) {
          element.textContent = Math.floor(current).toLocaleString();
        } else {
          element.textContent = current.toFixed(1);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = target % 1 === 0 ? target.toLocaleString() : target.toFixed(1);
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Intersection observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  setupMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when overlay is clicked
    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Close menu when nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    navToggle.classList.add('active');
    navMenu.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Stagger animation for menu items
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach((link, index) => {
      link.style.opacity = '0';
      link.style.transform = 'translateX(30px)';
      
      setTimeout(() => {
        link.style.transition = 'all 0.3s ease';
        link.style.opacity = '1';
        link.style.transform = 'translateX(0)';
      }, index * 100 + 200);
    });
  }

  closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';

    // Reset menu item styles
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.style.transition = '';
      link.style.opacity = '';
      link.style.transform = '';
    });
  }

  setupSmoothScrolling() {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (this.mobileMenuOpen) {
            this.toggleMobileMenu();
          }
        }
      });
    });
  }

  setupFormHandling() {
    // Enhanced form validation and handling
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('input', this.validateInput.bind(this));
      input.addEventListener('blur', this.validateInput.bind(this));
      
      // Enhanced focus effects
      input.addEventListener('focus', (e) => {
        e.target.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', (e) => {
        e.target.parentElement.classList.remove('focused');
      });
    });
  }

  validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    // Remove previous validation classes
    input.classList.remove('valid', 'invalid');
    
    // Validation logic
    let isValid = true;
    
    if (input.hasAttribute('required') && !value) {
      isValid = false;
    }
    
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }
    
    // Apply validation classes
    input.classList.add(isValid ? 'valid' : 'invalid');
    
    return isValid;
  }

  handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('.form-input');
    let allValid = true;
    
    // Validate all inputs
    inputs.forEach(input => {
      if (!this.validateInput({ target: input })) {
        allValid = false;
      }
    });
    
    if (!allValid) {
      this.showMessage('Please fill in all required fields correctly.', 'error');
      form.classList.add('error-animation');
      setTimeout(() => form.classList.remove('error-animation'), 500);
      return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      form.reset();
      inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
      });
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Show success message
      this.showMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
      form.classList.add('success-animation');
      setTimeout(() => form.classList.remove('success-animation'), 600);
    }, 2000);
  }

  showMessage(text, type = 'info') {
    // Create and show toast message
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = text;
    
    // Add styles
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#3b82f6',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: '1080',
      transform: 'translateX(400px)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px',
      fontSize: '14px',
      fontWeight: '500'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  setupPerformanceChart() {
    // Time period selector functionality
    this.currentPeriod = '1M';
  }

  handleTimeSelection(e) {
    const button = e.target;
    const period = button.dataset.period;
    
    if (!period || period === this.currentPeriod) return;
    
    // Update active state
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.classList.remove('time-btn--active');
    });
    button.classList.add('time-btn--active');
    
    this.currentPeriod = period;
    
    // Update chart (this would integrate with your charting library)
    this.updatePerformanceChart(period);
  }

  updatePerformanceChart(period) {
    // This would update the chart based on the selected time period
    console.log(`Updating chart for period: ${period}`);
    
    // Add loading state to chart
    const chartContainer = document.querySelector('.performance-chart-container');
    if (chartContainer) {
      chartContainer.style.opacity = '0.5';
      
      // Simulate data loading
      setTimeout(() => {
        chartContainer.style.opacity = '1';
      }, 500);
    }
  }

  setupNavigationScrollEffect() {
    // Navigation scroll effects
    this.lastScrollY = window.scrollY;
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    // Add/remove scrolled class
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Update active navigation link
    this.updateActiveNavLink();
    
    this.lastScrollY = currentScrollY;
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('nav__link--active');
      }
    });
  }

  handleNavClick(e) {
    const link = e.target;
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav__link').forEach(navLink => {
      navLink.classList.remove('nav__link--active');
    });
    
    // Add active class to clicked link
    link.classList.add('nav__link--active');
  }

  handleResize() {
    // Handle window resize events
    if (window.innerWidth > 768 && this.mobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  handleLoad() {
    // Handle page load events
    this.hideLoadingOverlay();
  }

  hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('active');
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 300);
    }
  }

  setupIntersectionObserver() {
    // Set up intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // API integration helpers
  async fetchMarketData() {
    try {
      // This would integrate with real financial APIs
      const response = await fetch('/api/market-data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      return null;
    }
  }

  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatPercentage(value, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value / 100);
  }
}

// Performance optimization: Use requestIdleCallback for non-critical operations
function initWhenIdle() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      new InvestmentSite();
    });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      new InvestmentSite();
    }, 1);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initWhenIdle);

// Service Worker registration for Progressive Web App features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InvestmentSite;
}
