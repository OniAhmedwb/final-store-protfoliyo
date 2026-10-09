/**
 * Freelancer Hub - Interactive Master JavaScript
 * Features:
 * - Theme Management (Dark / Light Mode) with persistence
 * - Web Audio API Synthesizer (micro-interaction sounds)
 * - Cursor Spotlight effect & Live Operational Clock
 * - Interactive Text Highlighting Toolbar & Dynamic Mode Switching
 * - Real-Time Services Instant Search & Category Filter
 * - Service Deliverables & Specs Modal Dialog (8 Services DB)
 * - Automated Service Quote & Cost Calculator (Real-time reactivity, copy & transfer)
 * - Service Comparison Matrix Table
 * - Interactive FAQ Accordion with Live Search & Highlight
 * - Portfolio Project Filtering & Quick-View Modal
 * - Testimonials Carousel with Add-Review Submission Modal
 * - Contact Form Validation & Booking Confirmation Voucher Receipt Modal
 * - Automated Live AI Service Assistant Chatbot ("NexusBot")
 * - Toast Notifications & Smooth Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Web Audio API Synthesizer Engine (Micro-Interactions)
  // ==========================================================================
  let audioCtx = null;
  let isSoundEnabled = localStorage.getItem('fh_sound') !== 'false'; // Default enabled

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playClickSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio not permitted or unsupported, fails gracefully
    }
  }

  function playChimeSound() {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {
      // Fails gracefully
    }
  }

  // Sound Toggle Control in Navbar
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    function updateSoundBtnUI() {
      const icon = soundToggleBtn.querySelector('i');
      if (isSoundEnabled) {
        soundToggleBtn.classList.remove('muted');
        soundToggleBtn.title = 'Sound Effects: ON';
        if (icon) icon.className = 'fas fa-volume-up';
      } else {
        soundToggleBtn.classList.add('muted');
        soundToggleBtn.title = 'Sound Effects: MUTED';
        if (icon) icon.className = 'fas fa-volume-xmark';
      }
    }
    updateSoundBtnUI();

    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('fh_sound', isSoundEnabled);
      updateSoundBtnUI();
      if (isSoundEnabled) {
        playClickSound();
        showToast('🔊 Sound Effects Enabled');
      } else {
        showToast('🔇 Sound Effects Muted');
      }
    });
  }

  // Attach click sound to interactive buttons
  document.querySelectorAll('.btn, .highlighter-pill, .filter-btn, .service-filter-btn, .calc-speed-card').forEach(el => {
    el.addEventListener('click', () => playClickSound());
  });

  // ==========================================================================
  // 2. Theme Management (Dark / Light Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const currentTheme = localStorage.getItem('fh_theme') || 'dark';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.className = 'fas fa-sun';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeIcon) themeIcon.className = 'fas fa-moon';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      playClickSound();
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('fh_theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        showToast('Switched to Dark Mode 🌙');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('fh_theme', 'light');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        showToast('Switched to Light Mode ☀️');
      }
    });
  }

  // ==========================================================================
  // 3. Cursor Spotlight Effect & Live Operational Clock
  // ==========================================================================
  const cursorSpotlight = document.getElementById('cursor-spotlight');
  if (cursorSpotlight) {
    window.addEventListener('mousemove', (e) => {
      cursorSpotlight.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
  }

  const liveClock = document.getElementById('live-clock');
  function updateLiveClock() {
    if (!liveClock) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
    liveClock.textContent = `UTC ${utcHours}:${utcMins}:${utcSecs}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // ==========================================================================
  // 4. Interactive Hero Text Highlighting Controller
  // ==========================================================================
  const highlighterPills = document.querySelectorAll('.highlighter-pill');
  const highlightSpans = document.querySelectorAll('.marker-highlight');
  const calloutBanner = document.getElementById('highlight-callout');

  const highlightMessages = {
    'all': {
      text: 'Highlighting all core pillars: Sub-second load times, bespoke interfaces, and rock-solid architecture.',
      metric: '99.8% Client Satisfaction'
    },
    'speed': {
      text: '⚡ Speed Focus: Benchmarked for Sub-100ms TTFB, 98+ PageSpeed, and CDN edge asset distribution.',
      metric: '99+ Core Web Vitals'
    },
    'design': {
      text: '🎨 UI/UX Focus: Figma token hierarchies, micro-interactions, WCAG contrast, and intuitive UX flows.',
      metric: '40% Higher Conversion'
    },
    'scale': {
      text: '📈 Scale Focus: Distributed microservices, horizontal autoscaling, PostgreSQL, and zero-downtime deploys.',
      metric: '100% Uptime SLA'
    },
    'security': {
      text: '🔒 Security Focus: JWT auth, OWASP Top 10 hardening, encrypted databases, and DDoS mitigation.',
      metric: 'Zero Security Flaws'
    }
  };

  highlighterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      highlighterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterType = pill.getAttribute('data-highlight');

      // Update Highlighted Text Spans
      highlightSpans.forEach(span => {
        const cat = span.getAttribute('data-highlight-category');
        if (filterType === 'all' || cat === filterType) {
          span.classList.add('active-glow');
        } else {
          span.classList.remove('active-glow');
        }
      });

      // Update Callout Banner
      if (calloutBanner && highlightMessages[filterType]) {
        const textEl = calloutBanner.querySelector('.callout-text');
        const metricEl = calloutBanner.querySelector('.callout-metric');
        if (textEl) textEl.textContent = highlightMessages[filterType].text;
        if (metricEl) metricEl.textContent = highlightMessages[filterType].metric;

        calloutBanner.style.transform = 'scale(1.02)';
        setTimeout(() => {
          calloutBanner.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });

  // ==========================================================================
  // 5. Navbar Sticky & Mobile Drawer Menu
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  }

  // Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  // ==========================================================================
  // 6. Dynamic Typing Headline Animation
  // ==========================================================================
  const typedTarget = document.querySelector('.typed-text');
  if (typedTarget) {
    const words = [
      'Next-Gen Web Apps.',
      'Modern UI/UX Systems.',
      'Scalable Full-Stack Products.',
      'High-Converting Stores.'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 85;
    const deletingSpeed = 40;
    const holdDelay = 1800;

    function typeEffect() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typedTarget.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTarget.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        currentSpeed = holdDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        currentSpeed = 400;
      }

      setTimeout(typeEffect, currentSpeed);
    }

    typeEffect();
  }

  // ==========================================================================
  // 7. Stats Counter Animation
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1600;
          const frameRate = 1000 / 60;
          const totalFrames = Math.round(duration / frameRate);
          let currentFrame = 0;

          const counterInterval = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeOut;

            if (isDecimal) {
              stat.textContent = currentVal.toFixed(1);
            } else {
              stat.textContent = Math.round(currentVal);
            }

            if (currentFrame >= totalFrames) {
              clearInterval(counterInterval);
              stat.textContent = isDecimal ? target.toFixed(1) : target;
            }
          }, frameRate);
        });
      }
    });
  }, { threshold: 0.35 });

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 8. Skills Progress Bar Trigger
  // ==========================================================================
  const skillBars = document.querySelectorAll('.progress-fill');
  let skillsAnimated = false;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
      }
    });
  }, { threshold: 0.25 });

  const skillsSection = document.querySelector('.skills-progress-container');
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ==========================================================================
  // 9. Services Search & Category Filter System
  // ==========================================================================
  const serviceSearchInput = document.getElementById('service-search-input');
  const clearSearchBtn = document.getElementById('clear-service-search');
  const serviceFilterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('#services-grid .service-card');

  let currentServiceCategory = 'all';
  let currentSearchQuery = '';

  function filterServices() {
    let visibleCount = 0;
    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();

      const matchesCategory = (currentServiceCategory === 'all' || category === currentServiceCategory);
      const matchesSearch = !currentSearchQuery || 
        title.includes(currentSearchQuery) || 
        desc.includes(currentSearchQuery) || 
        tags.includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.35s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (clearSearchBtn) {
      clearSearchBtn.style.display = currentSearchQuery ? 'block' : 'none';
    }
  }

  if (serviceSearchInput) {
    serviceSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      filterServices();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (serviceSearchInput) serviceSearchInput.value = '';
      currentSearchQuery = '';
      filterServices();
    });
  }

  serviceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentServiceCategory = btn.getAttribute('data-category');
      filterServices();
    });
  });

  // ==========================================================================
  // 10. Service Deliverables & Specs Modal Dialog
  // ==========================================================================
  const serviceModal = document.getElementById('service-modal');
  const serviceModalClose = document.getElementById('service-modal-close');
  const srvModalCategory = document.getElementById('srv-modal-category');
  const srvModalTitle = document.getElementById('srv-modal-title');
  const srvModalDesc = document.getElementById('srv-modal-desc');
  const srvModalChecklist = document.getElementById('srv-modal-checklist');
  const srvModalPrice = document.getElementById('srv-modal-price');
  const srvModalTurnaround = document.getElementById('srv-modal-turnaround');
  const srvModalEstimateBtn = document.getElementById('srv-modal-estimate-btn');
  const srvModalBookBtn = document.getElementById('srv-modal-book-btn');

  const servicesDatabase = {
    '1': {
      category: 'Web Development',
      title: 'Full-Stack Web Development',
      description: 'End-to-end web application engineering from database architecture to client interface. Engineered for lightning performance, maintainability, and enterprise scale.',
      deliverables: [
        'Production-ready Next.js / React application with Server-Side Rendering (SSR)',
        'RESTful and GraphQL API services powered by Node.js or Python',
        'Relational Database Setup (PostgreSQL) with Prisma / Supabase ORM',
        'Automated CI/CD staging pipeline and production Docker configuration',
        'Full unit and integration test coverage with documentation',
        '14-Day post-launch support & code warranty'
      ],
      price: 'From $1,499',
      turnaround: '2 - 4 Weeks',
      calcPreset: 'web'
    },
    '2': {
      category: 'UI/UX & Product Design',
      title: 'UI/UX & Product Design System',
      description: 'Human-centered digital product interfaces that combine brand aesthetics with conversion psychology and accessibility standards.',
      deliverables: [
        'User research, persona definition, and user journey flowcharts',
        'Interactive Figma high-fidelity prototypes with component auto-layout',
        'Scalable design token architecture (Typography, Spacing, Color tokens)',
        'Accessible color contrast compliance (WCAG 2.1 AA)',
        'Developer handoff package with CSS specifications & asset exports',
        'Interactive micro-interaction & animation guidelines'
      ],
      price: 'From $1,199',
      turnaround: '1 - 3 Weeks',
      calcPreset: 'uiux'
    },
    '3': {
      category: 'E-Commerce',
      title: 'Headless E-Commerce Architecture',
      description: 'Lightning-fast digital storefronts with custom product visualizers, multi-currency checkout, and conversion-optimized sales funnels.',
      deliverables: [
        'Headless Next.js storefront integrated with Shopify Storefront API',
        'Stripe, Apple Pay, PayPal & multi-currency payment checkout integration',
        'Real-time inventory synchronization and order management webhooks',
        'Abandoned cart recovery hooks and custom promotional banner systems',
        'Interactive 3D / zoomable product preview canvas',
        'Sub-second page navigation and 99+ Core Web Vitals score'
      ],
      price: 'From $2,299',
      turnaround: '3 - 6 Weeks',
      calcPreset: 'ecommerce'
    },
    '4': {
      category: 'Mobile Apps',
      title: 'Cross-Platform Mobile Apps',
      description: 'Fluid iOS and Android applications utilizing React Native and Expo with 60fps animations, biometric authentication, and offline capability.',
      deliverables: [
        'Universal code build for Apple iOS and Google Android',
        'Biometric authentication (FaceID, Fingerprint, Apple Keychain)',
        'Offline data persistence using SQLite / WatermelonDB with cloud sync',
        'Push notifications system via Firebase Cloud Messaging (FCM)',
        'In-app purchases and subscription management setup',
        'App Store and Google Play Store submission assistance'
      ],
      price: 'From $2,899',
      turnaround: '4 - 8 Weeks',
      calcPreset: 'mobile'
    },
    '5': {
      category: 'Performance & SEO',
      title: 'Speed & SEO Optimization Suite',
      description: 'Comprehensive Core Web Vitals tuning and technical search-engine infrastructure to maximize organic ranking and eliminate bounce rates.',
      deliverables: [
        '98+ PageSpeed & Core Web Vitals audit and code optimization',
        'Server response time (TTFB) reduction to under 100 milliseconds',
        'Next-gen image format pipelines (AVIF/WebP) and responsive loading',
        'Semantic JSON-LD Structured Data Schema implementation',
        'Automated XML sitemaps, robots.txt, and canonical URL structure',
        'Before-and-after Lighthouse performance benchmark report'
      ],
      price: 'From $899',
      turnaround: '1 - 2 Weeks',
      calcPreset: 'web'
    },
    '6': {
      category: 'Cloud & DevOps',
      title: 'Cloud DevOps & CI/CD Infrastructure',
      description: 'Automated deployment pipelines, zero-downtime releases, and hardened container infrastructure on AWS, Vercel, and Cloudflare.',
      deliverables: [
        'GitHub Actions continuous integration and continuous deployment (CI/CD)',
        'Docker containerization and multi-stage production builds',
        'Cloudflare Edge routing, DDoS mitigation, and SSL/TLS configuration',
        'Automated database backups and disaster recovery runbooks',
        'Environment variable secrets management (Vault / AWS KMS)',
        'Serverless edge functions and global caching rules'
      ],
      price: 'From $1,399',
      turnaround: '2 - 3 Weeks',
      calcPreset: 'web'
    },
    '7': {
      category: 'AI & Automation',
      title: 'AI Agents & Intelligent Automation',
      description: 'Custom AI agent workflows, retrieval-augmented generation (RAG) search engines, and OpenAI / Gemini API integrations.',
      deliverables: [
        'Custom prompt engineering and LangChain / LlamaIndex workflows',
        'Retrieval-Augmented Generation (RAG) system with Vector Databases',
        'Automated customer support assistant with custom business knowledge',
        'Document parsing, entity extraction, and automated categorization',
        'Streaming LLM chat responses with markdown and action buttons',
        'API cost management and token rate-limiting safeguards'
      ],
      price: 'From $1,799',
      turnaround: '2 - 4 Weeks',
      calcPreset: 'ai'
    },
    '8': {
      category: 'Code Audit & Security',
      title: 'Security Audits & Code Refactoring',
      description: 'Deep architectural code review, dependency vulnerability patching, and modular refactoring to eliminate technical debt.',
      deliverables: [
        'Comprehensive OWASP Top 10 security vulnerability audit',
        'Static application security testing (SAST) and dependency CVE audit',
        'Authentication and session token hijacking hardening',
        'Database query optimization and SQL injection prevention',
        'Codebase refactoring towards modular, clean architecture',
        'Executive security audit report with resolution verification'
      ],
      price: 'From $1,099',
      turnaround: '1 - 2 Weeks',
      calcPreset: 'web'
    }
  };

  let activeServiceId = '1';

  function openServiceModal(id) {
    const data = servicesDatabase[id];
    if (!data) return;
    activeServiceId = id;

    srvModalCategory.textContent = data.category;
    srvModalTitle.textContent = data.title;
    srvModalDesc.textContent = data.description;
    srvModalPrice.textContent = data.price;
    srvModalTurnaround.textContent = data.turnaround;

    // Render Checklist
    srvModalChecklist.innerHTML = '';
    data.deliverables.forEach(item => {
      const row = document.createElement('div');
      row.className = 'deliverable-check-item';
      row.innerHTML = `<i class="fas fa-check-circle"></i> <span>${item}</span>`;
      srvModalChecklist.appendChild(row);
    });

    serviceModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    serviceModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-service-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-service-id');
      openServiceModal(id);
    });
  });

  if (serviceModalClose) {
    serviceModalClose.addEventListener('click', closeServiceModal);
  }

  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) closeServiceModal();
    });
  }

  // Action buttons inside service modal
  if (srvModalEstimateBtn) {
    srvModalEstimateBtn.addEventListener('click', () => {
      closeServiceModal();
      const data = servicesDatabase[activeServiceId];
      if (data && data.calcPreset) {
        setCalculatorPreset(data.calcPreset);
      }
      document.querySelector('#calculator').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (srvModalBookBtn) {
    srvModalBookBtn.addEventListener('click', () => {
      closeServiceModal();
      const data = servicesDatabase[activeServiceId];
      const serviceSelect = document.getElementById('contact-service');
      if (serviceSelect) {
        if (data.calcPreset === 'web') serviceSelect.value = 'web-dev';
        else if (data.calcPreset === 'uiux') serviceSelect.value = 'ui-ux';
        else if (data.calcPreset === 'ecommerce') serviceSelect.value = 'ecommerce';
        else if (data.calcPreset === 'mobile') serviceSelect.value = 'mobile-dev';
        else serviceSelect.value = 'consultation';
      }
      document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
      showToast(`Selected "${data.title}" in Booking Form ✨`);
    });
  }

  // Preset buttons on service cards to jump to calculator
  document.querySelectorAll('.calc-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const preset = btn.getAttribute('data-preset');
      if (preset) setCalculatorPreset(preset);
    });
  });

  // ==========================================================================
  // 11. Automated Service Quote & Cost Calculator Engine
  // ==========================================================================
  const calcService = document.getElementById('calc-service');
  const calcScope = document.getElementById('calc-scope');
  const calcScopeDisplay = document.getElementById('calc-scope-display');
  const calcAddonCheckboxes = document.querySelectorAll('.calc-addon-checkbox');
  const calcSpeedCards = document.querySelectorAll('.calc-speed-card');
  const calcTotalPriceEl = document.getElementById('calc-total-price');
  const calcTotalTimelineEl = document.getElementById('calc-total-timeline');
  const calcBreakdownList = document.getElementById('calc-breakdown-list');
  const calcApplyBtn = document.getElementById('calc-apply-btn');
  const calcCopyBtn = document.getElementById('calc-copy-btn');

  let currentSpeedMultiplier = 1.0;
  let currentSpeedLabel = 'Standard Pacing';

  function setCalculatorPreset(serviceVal) {
    if (!calcService) return;
    calcService.value = serviceVal;
    calculateQuote();
  }

  function calculateQuote() {
    if (!calcService || !calcScope) return;

    const selectedOption = calcService.options[calcService.selectedIndex];
    const basePrice = parseInt(selectedOption.getAttribute('data-base')) || 1499;
    const baseDays = parseInt(selectedOption.getAttribute('data-days')) || 21;
    const serviceName = selectedOption.text.split('(')[0].trim();

    // Scope Calculation (extra views above 3 incur +$120 per view)
    const scopeCount = parseInt(calcScope.value) || 5;
    if (calcScopeDisplay) {
      calcScopeDisplay.textContent = `${scopeCount} ${scopeCount === 1 ? 'View' : 'Views'} / Screens`;
    }
    const extraViews = Math.max(0, scopeCount - 3);
    const scopePrice = extraViews * 125;
    const scopeDays = Math.ceil(extraViews * 0.7);

    // Add-ons Calculation
    let addonsTotal = 0;
    let addonsDays = 0;
    const selectedAddons = [];

    calcAddonCheckboxes.forEach(cb => {
      const parentCard = cb.closest('.calc-addon-card');
      if (cb.checked) {
        if (parentCard) parentCard.classList.add('checked');
        const cost = parseInt(cb.getAttribute('data-cost')) || 0;
        const days = parseInt(cb.getAttribute('data-days')) || 0;
        addonsTotal += cost;
        addonsDays += days;
        const title = cb.closest('.calc-addon-info').querySelector('.calc-addon-title span').textContent;
        selectedAddons.push({ title, cost });
      } else {
        if (parentCard) parentCard.classList.remove('checked');
      }
    });

    // Subtotal before speed modifier
    const subtotal = basePrice + scopePrice + addonsTotal;

    // Bundle Discount (if 3+ add-ons chosen, grant 8% courtesy discount)
    let discount = 0;
    if (selectedAddons.length >= 3) {
      discount = Math.round(subtotal * 0.08);
    }

    // Apply speed multiplier
    const finalTotal = Math.round((subtotal - discount) * currentSpeedMultiplier);

    // Calculate completion timeline
    const totalDays = Math.ceil((baseDays + scopeDays + addonsDays) / currentSpeedMultiplier);
    const totalWeeks = Math.ceil(totalDays / 7);

    // Update Price Display with smooth count
    if (calcTotalPriceEl) {
      calcTotalPriceEl.textContent = `$${finalTotal.toLocaleString()}`;
    }

    if (calcTotalTimelineEl) {
      calcTotalTimelineEl.textContent = `${totalWeeks} ${totalWeeks === 1 ? 'Week' : 'Weeks'} (~${totalDays} Days)`;
    }

    // Populate Itemized Breakdown
    if (calcBreakdownList) {
      calcBreakdownList.innerHTML = `
        <div class="calc-breakdown-item">
          <span>${serviceName} (Base)</span>
          <span>$${basePrice.toLocaleString()}</span>
        </div>
        <div class="calc-breakdown-item">
          <span>${scopeCount} Screens Scope (${extraViews} addl.)</span>
          <span>+$${scopePrice.toLocaleString()}</span>
        </div>
      `;

      selectedAddons.forEach(addon => {
        const item = document.createElement('div');
        item.className = 'calc-breakdown-item';
        item.innerHTML = `<span>+ ${addon.title}</span> <span>+$${addon.cost}</span>`;
        calcBreakdownList.appendChild(item);
      });

      if (discount > 0) {
        const discItem = document.createElement('div');
        discItem.className = 'calc-breakdown-item';
        discItem.style.color = 'var(--emerald-color)';
        discItem.innerHTML = `<span>Multi-Feature Bundle Incentive (8%)</span> <span>-$${discount}</span>`;
        calcBreakdownList.appendChild(discItem);
      }

      if (currentSpeedMultiplier > 1.0) {
        const speedItem = document.createElement('div');
        speedItem.className = 'calc-breakdown-item';
        speedItem.innerHTML = `<span>Speed: ${currentSpeedLabel}</span> <span>${Math.round((currentSpeedMultiplier - 1) * 100)}% rush</span>`;
        calcBreakdownList.appendChild(speedItem);
      }
    }
  }

  // Calculator Listeners
  if (calcService) calcService.addEventListener('change', calculateQuote);
  if (calcScope) calcScope.addEventListener('input', calculateQuote);
  calcAddonCheckboxes.forEach(cb => cb.addEventListener('change', calculateQuote));

  calcSpeedCards.forEach(card => {
    card.addEventListener('click', () => {
      calcSpeedCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentSpeedMultiplier = parseFloat(card.getAttribute('data-speed')) || 1.0;
      currentSpeedLabel = card.getAttribute('data-speed-label') || 'Standard';
      calculateQuote();
    });
  });

  // Calculate once on init
  calculateQuote();

  // Apply quote to contact / booking form
  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      playClickSound();
      const serviceVal = calcService.value;
      const contactService = document.getElementById('contact-service');
      const contactBudget = document.getElementById('contact-budget');
      const contactMsg = document.getElementById('contact-message');

      // Map service
      if (contactService) {
        if (serviceVal === 'web') contactService.value = 'web-dev';
        else if (serviceVal === 'uiux') contactService.value = 'ui-ux';
        else if (serviceVal === 'ecommerce') contactService.value = 'ecommerce';
        else if (serviceVal === 'mobile') contactService.value = 'mobile-dev';
        else contactService.value = 'consultation';
      }

      // Map budget tier
      const finalPrice = parseInt(calcTotalPriceEl.textContent.replace(/[^0-9]/g, '')) || 2500;
      if (contactBudget) {
        if (finalPrice <= 3000) contactBudget.value = '1k-3k';
        else if (finalPrice <= 7000) contactBudget.value = '3k-7k';
        else if (finalPrice <= 15000) contactBudget.value = '7k-15k';
        else contactBudget.value = '15k+';
      }

      // Populate quotation text
      const selectedOption = calcService.options[calcService.selectedIndex].text.split('(')[0].trim();
      const scopeVal = calcScope.value;
      const timelineVal = calcTotalTimelineEl.textContent;

      if (contactMsg) {
        contactMsg.value = `[AUTO-CALCULATED QUOTE SUMMARY]\nService: ${selectedOption}\nScope: ${scopeVal} Screens / Views\nPacing: ${currentSpeedLabel}\nEstimated Investment: ${calcTotalPriceEl.textContent}\nEstimated Turnaround: ${timelineVal}\n\nProject Requirements & Notes:\nWe would like to develop...`;
      }

      document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
      showToast('🚀 Quotation transferred to Booking Form!', 'success');
    });
  }

  // Copy Quote to Clipboard
  if (calcCopyBtn) {
    calcCopyBtn.addEventListener('click', () => {
      playClickSound();
      const serviceName = calcService.options[calcService.selectedIndex].text.split('(')[0].trim();
      const total = calcTotalPriceEl.textContent;
      const timeline = calcTotalTimelineEl.textContent;
      const scope = calcScope.value;

      const quoteText = `===========================================
FREELANCER HUB - OFFICIAL PROJECT QUOTATION
===========================================
Primary Service : ${serviceName}
Application Scope: ${scope} Views / Screens
Turnaround Speed : ${currentSpeedLabel}
Est. Turnaround  : ${timeline}
Est. Investment  : ${total}
Guarantees       : 100% IP Transfer, 30-Day Free Bug-Fix Warranty
Date Generated   : ${new Date().toLocaleDateString()}
Contact Inquiries: hello@freelancerhub.dev
===========================================`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(quoteText).then(() => {
          showToast('📋 Official Quote Copied to Clipboard!', 'success');
        }).catch(() => {
          showToast('Quote ready! (Check selection)');
        });
      } else {
        showToast('📋 Quote summary prepared!');
      }
    });
  }

  // ==========================================================================
  // 12. Interactive FAQ Accordion with Live Search & Highlight
  // ==========================================================================
  const faqSearchInput = document.getElementById('faq-search-input');
  const faqItems = document.querySelectorAll('#faq-list .faq-item');

  // Accordion Expand/Collapse
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      playClickSound();
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Real-Time FAQ Search
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();

      faqItems.forEach(item => {
        const questionEl = item.querySelector('.faq-header h3');
        const answerEl = item.querySelector('.faq-body p');
        const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();

        const questionText = questionEl.textContent.toLowerCase();
        const answerText = answerEl.textContent.toLowerCase();

        if (!query || questionText.includes(query) || answerText.includes(query) || keywords.includes(query)) {
          item.style.display = 'block';
          if (query) {
            item.classList.add('active');
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // ==========================================================================
  // 13. Portfolio Filter System & Quick-View Modal
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalImage = document.getElementById('modal-image');
  const modalTags = document.getElementById('modal-tags');
  const modalClient = document.getElementById('modal-client');
  const modalTimeline = document.getElementById('modal-timeline');
  const modalLiveBtn = document.getElementById('modal-live-btn');

  const projectData = {
    '1': {
      title: 'Fintech Pro: SaaS Analytics Dashboard',
      category: 'Web Apps',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      description: 'A comprehensive financial analytics and predictive forecasting platform built for fintech enterprises. Integrates real-time financial data feeds, custom chart visualizers, Stripe transaction monitoring, and multi-tenant user permission management.',
      client: 'Apex Financial Technologies LLC',
      timeline: '6 Weeks',
      tags: ['React', 'TypeScript', 'Node.js', 'Chart.js', 'PostgreSQL', 'Tailwind CSS'],
      liveUrl: 'https://github.com'
    },
    '2': {
      title: 'Aura Luxe: High-Fashion E-Commerce',
      category: 'E-Commerce',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      description: 'Modern headless luxury retail experience featuring 3D product previews, instant algorithmic search, multi-currency checkout, and lightning-fast sub-second Core Web Vitals score.',
      client: 'Aura Studio Paris',
      timeline: '8 Weeks',
      tags: ['Next.js', 'Shopify Storefront API', 'Stripe', 'Framer Motion', 'Tailwind CSS'],
      liveUrl: 'https://github.com'
    },
    '3': {
      title: 'Nova AI: Prompt Engineering & Studio UI',
      category: 'UI/UX Design',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      description: 'End-to-end product design system and frontend implementation for an AI model tuning interface. Includes custom token heatmaps, node-based workflow editor, and dark mode workspace.',
      client: 'Nova Intelligence Labs',
      timeline: '5 Weeks',
      tags: ['Figma', 'React', 'Canvas API', 'Tailwind CSS', 'Design System'],
      liveUrl: 'https://github.com'
    },
    '4': {
      title: 'PulseFit: Cross-Platform Wellness App',
      category: 'Mobile',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      description: 'Mobile workout companion and nutrition tracking application with offline caching, smartwatch synchronization, automated streak rewards, and interactive social challenges.',
      client: 'PulseFit Global',
      timeline: '10 Weeks',
      tags: ['React Native', 'Expo', 'GraphQL', 'Firebase', 'HealthKit API'],
      liveUrl: 'https://github.com'
    },
    '5': {
      title: 'StreamLine: Cloud Collaboration Workspace',
      category: 'Web Apps',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      description: 'Real-time collaborative whiteboard and document management workspace designed for distributed remote teams. Features WebSockets state synchronization, voice rooms, and end-to-end encryption.',
      client: 'StreamLine Systems Inc.',
      timeline: '7 Weeks',
      tags: ['Vue 3', 'WebSockets', 'Go Microservices', 'Docker', 'Redis'],
      liveUrl: 'https://github.com'
    },
    '6': {
      title: 'EcoVibe: Carbon Offset Marketplace',
      category: 'E-Commerce',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      description: 'Interactive green investment portal allowing eco-conscious businesses to calculate their footprint and purchase verified carbon credits with transparent tracking and digital certificates.',
      client: 'EcoVibe International',
      timeline: '6 Weeks',
      tags: ['TypeScript', 'Express', 'React', 'Mapbox GL', 'MongoDB'],
      liveUrl: 'https://github.com'
    }
  };

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalDescription.textContent = data.description;
    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalClient.textContent = data.client;
    modalTimeline.textContent = data.timeline;
    modalLiveBtn.href = data.liveUrl;

    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'project-tag';
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }

  // ==========================================================================
  // 14. Testimonials Slider & Review Submission System
  // ==========================================================================
  const trackContainer = document.querySelector('.testimonial-track-container');
  let slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  let dots = Array.from(document.querySelectorAll('.slider-dot'));
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  let currentSlide = 0;
  let autoSlideTimer = null;

  function refreshSliderControls() {
    slides = Array.from(document.querySelectorAll('.testimonial-slide'));
    const dotsContainer = document.querySelector('.slider-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `slider-dot ${idx === currentSlide ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
      });
      dots = Array.from(document.querySelectorAll('.slider-dot'));
    }
  }

  function goToSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;

    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      playClickSound();
      goToSlide(currentSlide - 1);
      resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
      playClickSound();
      goToSlide(currentSlide + 1);
      resetAutoSlide();
    });

    function startAutoSlide() {
      autoSlideTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 6000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }

    startAutoSlide();
  }

  // Review Modal & Submission
  const reviewModal = document.getElementById('review-modal');
  const openReviewModalBtn = document.getElementById('open-review-modal-btn');
  const reviewModalClose = document.getElementById('review-modal-close');
  const reviewForm = document.getElementById('review-form');
  const starPicker = document.getElementById('star-picker');
  let selectedRating = 5;

  if (openReviewModalBtn && reviewModal) {
    openReviewModalBtn.addEventListener('click', () => {
      reviewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (reviewModalClose && reviewModal) {
    reviewModalClose.addEventListener('click', () => {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) {
        reviewModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Interactive Star Rating Picker
  if (starPicker) {
    const stars = starPicker.querySelectorAll('.star-item');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        playClickSound();
        selectedRating = parseInt(star.getAttribute('data-value')) || 5;
        stars.forEach((s, idx) => {
          if (idx < selectedRating) s.classList.add('selected');
          else s.classList.remove('selected');
        });
      });
    });
  }

  if (reviewForm && trackContainer) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const authorName = document.getElementById('review-author').value.trim();
      const authorRole = document.getElementById('review-role').value.trim();
      const reviewText = document.getElementById('review-text').value.trim();

      if (!authorName || !authorRole || !reviewText) return;

      // Create new review slide
      const newSlide = document.createElement('div');
      newSlide.className = 'testimonial-slide';

      let starsHtml = '';
      for (let i = 0; i < selectedRating; i++) {
        starsHtml += '<i class="fas fa-star"></i> ';
      }

      newSlide.innerHTML = `
        <div class="client-stars">${starsHtml}</div>
        <p class="testimonial-quote">"${reviewText}"</p>
        <div class="testimonial-author-wrapper">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800;">
            ${authorName.charAt(0)}
          </div>
          <div class="author-details">
            <h4>${authorName}</h4>
            <p>${authorRole}</p>
          </div>
        </div>
      `;

      trackContainer.prepend(newSlide);
      refreshSliderControls();
      goToSlide(0);

      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
      reviewForm.reset();

      playChimeSound();
      showToast('🎉 Thank you! Your review has been published.', 'success');
    });
  }

  // ==========================================================================
  // 15. Contact & Booking Form Validation + Voucher Modal
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const voucherModal = document.getElementById('voucher-modal');
  const voucherModalClose = document.getElementById('voucher-modal-close');
  const voucherIdEl = document.getElementById('voucher-id');
  const voucherNameEl = document.getElementById('voucher-name');
  const voucherEmailEl = document.getElementById('voucher-email');
  const voucherServiceEl = document.getElementById('voucher-service');
  const voucherBudgetEl = document.getElementById('voucher-budget');
  const voucherDateEl = document.getElementById('voucher-date');
  const voucherDownloadBtn = document.getElementById('voucher-download-btn');
  const voucherWhatsappBtn = document.getElementById('voucher-whatsapp-btn');

  let latestVoucherData = null;

  if (voucherModalClose && voucherModal) {
    voucherModalClose.addEventListener('click', () => {
      voucherModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    voucherModal.addEventListener('click', (e) => {
      if (e.target === voucherModal) {
        voucherModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const serviceSelect = document.getElementById('contact-service');
      const budgetSelect = document.getElementById('contact-budget');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showError(nameInput, 'Please enter your full name (minimum 2 characters).');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid business email address.');
        isValid = false;
      } else {
        clearError(emailInput);
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        showError(messageInput, 'Please provide details about your project objectives.');
        isValid = false;
      } else {
        clearError(messageInput);
      }

      if (!isValid) return;

      // Button loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Booking Ticket...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Generate Booking Reference ID
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const ticketId = `#FH-2026-${randomNum}`;
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        const budgetText = budgetSelect.options[budgetSelect.selectedIndex].text;
        const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        latestVoucherData = {
          ticketId,
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          service: serviceText,
          budget: budgetText,
          message: messageInput.value.trim(),
          date: todayStr
        };

        // Populate Voucher Modal
        if (voucherIdEl) voucherIdEl.textContent = ticketId;
        if (voucherNameEl) voucherNameEl.textContent = latestVoucherData.name;
        if (voucherEmailEl) voucherEmailEl.textContent = latestVoucherData.email;
        if (voucherServiceEl) voucherServiceEl.textContent = serviceText;
        if (voucherBudgetEl) voucherBudgetEl.textContent = budgetText;
        if (voucherDateEl) voucherDateEl.textContent = todayStr;

        // Update WhatsApp Pre-filled link
        if (voucherWhatsappBtn) {
          const encodedMsg = encodeURIComponent(`Hi Alex, I submitted project inquiry ${ticketId} for ${serviceText}. Let's discuss!`);
          voucherWhatsappBtn.href = `https://wa.me/18005550199?text=${encodedMsg}`;
        }

        // Show Voucher Dialog
        if (voucherModal) {
          voucherModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }

        contactForm.reset();
        playChimeSound();
        showToast(`✨ Booking Confirmed! Ticket ${ticketId} created.`, 'success');
      }, 1100);
    });
  }

  // Voucher File Download Receipt
  if (voucherDownloadBtn) {
    voucherDownloadBtn.addEventListener('click', () => {
      if (!latestVoucherData) return;
      playClickSound();

      const receiptContent = `=====================================================
FREELANCER HUB - OFFICIAL BOOKING CONFIRMATION RECEIPT
=====================================================
Booking Reference : ${latestVoucherData.ticketId}
Date Confirmed    : ${latestVoucherData.date}
Client Name       : ${latestVoucherData.name}
Client Email      : ${latestVoucherData.email}
Requested Service : ${latestVoucherData.service}
Selected Budget   : ${latestVoucherData.budget}
Response SLA      : Under 15 Minutes
Status            : Active & Queued for Architecture Review

PROJECT NOTES:
${latestVoucherData.message}

NEXT STEPS:
1. Our engineering lead will review your scope specifications.
2. You will receive an invitation for a 15-min discovery call.
3. A formal sprint roadmap and milestone agreement will be issued.

Direct Contact:
Email   : hello@freelancerhub.dev
Phone   : +1 (800) 555-0199
Location: Remote Worldwide
=====================================================`;

      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FreelancerHub-Booking-${latestVoucherData.ticketId.replace('#', '')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('📥 Booking receipt downloaded!', 'success');
    });
  }

  function showError(input, message) {
    const parent = input.closest('.form-group');
    if (!parent) return;
    let feedback = parent.querySelector('.form-feedback');
    if (!feedback) {
      feedback = document.createElement('span');
      feedback.className = 'form-feedback';
      parent.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.classList.add('visible');
    input.style.borderColor = '#ef4444';
  }

  function clearError(input) {
    const parent = input.closest('.form-group');
    if (!parent) return;
    const feedback = parent.querySelector('.form-feedback');
    if (feedback) feedback.classList.remove('visible');
    input.style.borderColor = '';
  }

  // Newsletter Subscription
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        playChimeSound();
        showToast('🎉 Subscribed to Freelancer Hub Technical Newsletter!', 'success');
        input.value = '';
      }
    });
  }

  // ==========================================================================
  // 16. Automated Live AI Service Assistant Chatbot ("NexusBot")
  // ==========================================================================
  const chatbotLauncher = document.getElementById('chatbot-launcher');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatClearBtn = document.getElementById('chat-clear-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatTyping = document.getElementById('chat-typing');
  const quickChips = document.querySelectorAll('.quick-chip');
  const unreadBadge = document.querySelector('.chat-unread-badge');

  function toggleChatbot() {
    playClickSound();
    chatbotWindow.classList.toggle('open');
    if (chatbotWindow.classList.contains('open')) {
      if (unreadBadge) unreadBadge.style.display = 'none';
      if (chatInput) chatInput.focus();
    }
  }

  if (chatbotLauncher) chatbotLauncher.addEventListener('click', toggleChatbot);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', toggleChatbot);

  if (chatClearBtn) {
    chatClearBtn.addEventListener('click', () => {
      playClickSound();
      chatMessages.innerHTML = `
        <div class="chat-msg bot">
          👋 <strong>Welcome back!</strong> What technical challenge or sprint can I help you scope today?
          <span class="chat-timestamp">Just now</span>
        </div>
      `;
    });
  }

  function appendUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg user';
    msgEl.innerHTML = `${text} <span class="chat-timestamp">Just now</span>`;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendBotMessage(html) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg bot';
    msgEl.innerHTML = `${html} <span class="chat-timestamp">Just now</span>`;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    playChimeSound();
  }

  function processBotResponse(query) {
    if (chatTyping) chatTyping.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      if (chatTyping) chatTyping.classList.remove('active');
      const q = query.toLowerCase();

      let replyHtml = '';

      if (q.includes('service') || q.includes('what do you do') || q.includes('offer')) {
        replyHtml = `We offer <strong>8 specialized services</strong>:
        <ul style="margin: 0.5rem 0 0.5rem 1.25rem; font-size: 0.825rem;">
          <li>Full-Stack Web Apps (Next.js, Node, React)</li>
          <li>UI/UX &amp; Figma Design Systems</li>
          <li>Headless E-Commerce &amp; Stripe Stores</li>
          <li>Cross-Platform Mobile Apps (React Native)</li>
          <li>Speed, SEO &amp; Core Web Vitals Tuning</li>
          <li>Cloud DevOps &amp; CI/CD Infrastructure</li>
          <li>AI Agents &amp; RAG Workflow Automations</li>
        </ul>
        <a href="#services" class="chat-action-btn">View Services Directory &rarr;</a>`;
      } 
      else if (q.includes('cost') || q.includes('price') || q.includes('estimate') || q.includes('budget') || q.includes('calculator')) {
        replyHtml = `Our project sprint investments start from <strong>$1,199</strong> for UI/UX Systems and <strong>$1,499</strong> for Web Applications.
        <br><br>
        You can configure an exact quote in seconds using our automated calculator!
        <br>
        <a href="#calculator" class="chat-action-btn">Launch Quote Calculator &rarr;</a>`;
      } 
      else if (q.includes('turnaround') || q.includes('timeline') || q.includes('how long') || q.includes('time') || q.includes('speed')) {
        replyHtml = `Typical delivery timelines:
        <ul style="margin: 0.5rem 0 0.5rem 1.25rem; font-size: 0.825rem;">
          <li><strong>Starter MVPs:</strong> 1 - 2 Weeks</li>
          <li><strong>Full SaaS Apps:</strong> 4 - 8 Weeks</li>
          <li><strong>Express Sprints:</strong> 48h - 7 Days (Available)</li>
        </ul>
        We deploy working staging builds every Friday for live feedback.`;
      } 
      else if (q.includes('ip') || q.includes('ownership') || q.includes('code') || q.includes('guarantee') || q.includes('warranty')) {
        replyHtml = `🛡️ <strong>Ironclad Client Guarantees:</strong>
        <br><br>
        • <strong>100% IP Transfer:</strong> Full copyrights, Git repos, and designs belong to you.<br>
        • <strong>Bug-Fix Warranty:</strong> 14 to 30 days complimentary post-launch support.<br>
        • <strong>Performance SLA:</strong> 95+ PageSpeed benchmark guaranteed.`;
      } 
      else if (q.includes('contact') || q.includes('book') || q.includes('call') || q.includes('talk') || q.includes('hire') || q.includes('alex')) {
        replyHtml = `Ready to discuss your project? You can submit an inquiry or schedule a call directly with <strong>Alex Morgan</strong>:
        <br><br>
        📧 <strong>Email:</strong> hello@freelancerhub.dev<br>
        📱 <strong>Phone:</strong> +1 (800) 555-0199
        <br>
        <a href="#contact" class="chat-action-btn">Open Booking Form &rarr;</a>`;
      } 
      else if (q.includes('tech') || q.includes('stack') || q.includes('framework') || q.includes('react') || q.includes('node')) {
        replyHtml = `Our production stack:
        <br><br>
        • <strong>Frontend:</strong> Next.js 14, React, TypeScript, Tailwind CSS<br>
        • <strong>Backend:</strong> Node.js, Express, Python, Go, GraphQL<br>
        • <strong>Database:</strong> PostgreSQL, Supabase, Prisma, MongoDB, Redis<br>
        • <strong>Cloud:</strong> AWS, Docker, Vercel, Cloudflare`;
      } 
      else {
        replyHtml = `Thanks for reaching out! Freelancer Hub specializes in bespoke software development and design architectures.
        <br><br>
        Would you like to <strong>estimate project pricing</strong> or <strong>send an inquiry</strong> to our engineering lead?
        <br>
        <a href="#calculator" class="chat-action-btn">Calculate Quote</a>
        <a href="#contact" class="chat-action-btn" style="margin-left: 0.35rem;">Contact Us</a>`;
      }

      appendBotMessage(replyHtml);
    }, 700);
  }

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      appendUserMessage(text);
      chatInput.value = '';
      processBotResponse(text);
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playClickSound();
      const queryType = chip.getAttribute('data-query');
      let promptText = chip.textContent;
      appendUserMessage(promptText);
      processBotResponse(queryType);
    });
  });

  // ==========================================================================
  // 17. Toast Notification System
  // ==========================================================================
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle'}"></i>
      </div>
      <div class="toast-msg">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4200);
  }

  // ==========================================================================
  // 18. Back To Top Floating Action Button
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      playClickSound();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
