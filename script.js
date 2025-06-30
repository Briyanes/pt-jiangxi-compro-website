// script.js
// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupMobileNavigation();
    setupSmoothScrolling();
    setupHeaderScrollEffect();
    setupScrollAnimations();
    setupCounterAnimations();
    setupFormHandling();
    setupParallaxEffects(); // Placeholder, not implemented in guide
    setupLazyLoading();
    setupTestingTools(); // From Testing and Optimasi section
    optimizeSEO(); // From SEO Optimization section
}

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Mobile Navigation Setup
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!hamburger || !navMenu) return;

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Add CSS for body scroll lock
const style = document.createElement('style');
style.textContent = `
    body.menu-open {
        overflow: hidden;
    }
    @media (max-width: 768px) {
        body.menu-open {
            position: fixed;
            width: 100%;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Update active navigation
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Update active navigation based on scroll position
function updateActiveNavigation(activeId = null) {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    if (activeId) {
        // Manual update when clicking navigation
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    } else {
        // Auto update based on scroll position
        let currentSection = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
}

// Setup scroll spy
window.addEventListener('scroll', utils.throttle(function() {
    updateActiveNavigation();
}, 100));

// Header Scroll Effect
function setupHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;
    const scrollHandler = utils.throttle(function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 16); // ~60fps
    window.addEventListener('scroll', scrollHandler);
}

// Scroll Animations Setup
function setupScrollAnimations() {
    // Create intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-card, .product-card, .stat-item, .contact-item, .about-text, .about-image, .team-member'
    );
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });

    // Add CSS for animations
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .animate-child {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .animate-child.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(animationStyles);
}

// Counter Animations
function setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isGreaterThan = target.includes('>');
    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
    if (!numericValue) return;

    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = 1000 / 60; // ~60fps
    const totalSteps = duration / stepTime;
    const increment = numericValue / totalSteps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        if (isGreaterThan) {
            element.textContent = `> ${Math.floor(current)}`;
        } else if (target === '2012') { // Specific handling for year 2012
            element.textContent = Math.floor(current);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Form Handling Setup
function setupFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formObject = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }

    // Validate all fields
    const isValid = validateForm(form);
    if (isValid) {
        // Show loading state
        showFormLoading(form);

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showFormSuccess(form);
            form.reset();
        }, 2000);
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    }
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format email tidak valid';
        }
    }
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format nomor telepon tidak valid';
        }
    }

    // Show/hide error
    showFieldError(field, isValid, errorMessage);
    return isValid;
}

function showFieldError(field, isValid, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || createErrorElement(formGroup);

    if (isValid) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        errorElement.style.display = 'none';
    } else {
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function createErrorElement(formGroup) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
    return errorElement;
}

function showFormLoading(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Mengirim...';
    submitButton.classList.add('loading');
    // Store original text for later
    submitButton.dataset.originalText = originalText;
}

function showFormSuccess(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = submitButton.dataset.originalText || 'Kirim Pesan';
    submitButton.classList.remove('loading');
    // Show success message
    showNotification('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add notification styles
    const notificationStyles = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.style.cssText = notificationStyles;

    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Placeholder for parallax effects (not detailed in guide)
function setupParallaxEffects() {
    // console.log("Parallax effects setup (placeholder)");
}

// Testing dan Debugging Tools
function setupTestingTools() {
    // Add testing utilities in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        addDevTools();
    }
    // Performance monitoring
    monitorPerformance();
    // Error tracking
    setupErrorTracking();
}

function addDevTools() {
    // Add responsive testing buttons
    const devPanel = document.createElement('div');
    devPanel.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; z-index: 10000; background: #333; color: white; padding: 10px; border-radius: 5px; font-size: 12px;">
            <div>Dev Tools</div>
            <button onclick="testResponsive('mobile')">Mobile</button>
            <button onclick="testResponsive('tablet')">Tablet</button>
            <button onclick="testResponsive('desktop')">Desktop</button>
            <button onclick="testAccessibility()">A11y Test</button>
        </div>
    `;
    document.body.appendChild(devPanel);
}

function testResponsive(device) {
    const sizes = {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1200, height: 800 }
    };
    const size = sizes[device];
    if (size) {
        window.resizeTo(size.width, size.height);
    }
}

function testAccessibility() {
    // Basic accessibility checks
    const issues = [];
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
        if (!img.alt) {
            issues.push(`Image ${index + 1} missing alt text`);
        }
    });
    // Check for form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label')) {
            issues.push(`Input ${index + 1} missing label`);
        }
    });
    // Check color contrast (basic check)
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        // This is a simplified check - in production, use a proper contrast checker
        if (color === backgroundColor) {
            issues.push(`Element has poor color contrast: ${el.tagName}`);
        }
    });
    console.log('Accessibility Issues:', issues);
    alert(`Found ${issues.length} accessibility issues. Check console for details.`);
}

// Performance Monitoring
function monitorPerformance() {
    // Measure page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        // Track Core Web Vitals
        trackCoreWebVitals();
    });
}

function trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
        });
    }).observe({ entryTypes: ['first-input'] });
    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        });
        console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
}

// Lazy Loading Implementation
function setupLazyLoading() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));

    // Lazy load sections
    const sections = document.querySelectorAll('section[data-lazy]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    });
    sections.forEach(section => sectionObserver.observe(section));
}

// Error Tracking
function setupErrorTracking() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error
        });
        // In production, send to error tracking service
        // trackError(e);
    });
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        // In production, send to error tracking service
        // trackError(e);
    });
}

// SEO Optimization
function optimizeSEO() {
    // Dynamic meta tags
    updateMetaTags();
    // Structured data
    addStructuredData();
    // Open Graph tags
    addOpenGraphTags();
}

function updateMetaTags() {
    // Update page title based on current section
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const titles = {
                    'home': 'PT. Energi Persada - Solusi Energi Terbarukan',
                    'about': 'Tentang Kami - PT. Energi Persada',
                    'services': 'Layanan Kami - PT. Energi Persada',
                    'projects': 'Proyek Kami - PT. Energi Persada',
                    'contact': 'Hubungi Kami - PT. Energi Persada'
                };
                if (titles[sectionId]) {
                    document.title = titles[sectionId];
                }
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(section => observer.observe(section));
}

function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PT. Energi Persada",
        "description": "Perusahaan nasional yang bergerak di bidang pengembangan dan pemanfaatan energi terbarukan, khususnya energi hidro (Hydro Energy).",
        "url": window.location.origin,
        "logo": window.location.origin + "/images/logo.png", // Assuming logo.png will be in images folder
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-821-8268-6602",
            "contactType": "customer service",
            "availableLanguage": "Indonesian"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Ruko Santorini Komplek KGV 2 Blok A1 No 6, Pinayungan, Telukjambe Timur",
            "addressLocality": "Karawang",
            "addressRegion": "Jawa Barat",
            "postalCode": "41360",
            "addressCountry": "ID"
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

function addOpenGraphTags() {
    const ogTags = [
        { property: 'og:title', content: 'PT. Energi Persada - Solusi Energi Terbarukan' },
        { property: 'og:description', content: 'Perusahaan nasional yang bergerak di bidang pengembangan dan pemanfaatan energi terbarukan, khususnya energi hidro (Hydro Energy).' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:image', content: window.location.origin + '/images/og-image.jpg' }, // Assuming og-image.jpg will be in images folder
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'PT. Energi Persada - Solusi Energi Terbarukan' },
        { name: 'twitter:description', content: 'Perusahaan nasional yang bergerak di bidang pengembangan dan pemanfaatan energi terbarukan, khususnya energi hidro (Hydro Energy).' }
    ];
    ogTags.forEach(tag => {
        const meta = document.createElement('meta');
        if (tag.property) meta.setAttribute('property', tag.property);
        if (tag.name) meta.setAttribute('name', tag.name);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
    });
}
