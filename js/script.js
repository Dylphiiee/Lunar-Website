// Main JavaScript File for Lunar Community Website

// DOM Elements
const navMenu = document.getElementById('navMenu');
const menuToggle = document.getElementById('menuToggle');
const pageLoader = document.getElementById('pageLoader');
const joinBtn = document.getElementById('joinBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const navLinks = document.querySelectorAll('.nav-link');
const currentPage = window.location.pathname.split('/').pop();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lunar Community Website loaded');
    
    // Initialize components
    initNavigation();
    initModals();
    initPageLoader();
    initActiveNav();
    initWaveBackground();
    initAnimations();
    
    // Hide page loader after everything is loaded
    setTimeout(() => {
        if (pageLoader) {
            pageLoader.classList.remove('active');
        }
    }, 500);
});

// Navigation Menu Toggle
function initNavigation() {
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

// Modal Functions
function initModals() {
    // Join Modal
    if (joinBtn && modalOverlay && closeModal) {
        joinBtn.addEventListener('click', openJoinModal);
        closeModal.addEventListener('click', closeJoinModal);
        
        // Close modal when clicking outside
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeJoinModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeJoinModal();
            }
        });
    }
}

function openJoinModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeJoinModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Page Loader for Navigation
function initPageLoader() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const currentHref = window.location.pathname.split('/').pop();
            
            // Only show loader if navigating to a different page
            if (href !== currentHref && href !== '#' && !href.includes('#')) {
                e.preventDefault();
                
                // Show loader
                if (pageLoader) {
                    pageLoader.classList.add('active');
                }
                
                // Navigate after delay
                setTimeout(() => {
                    window.location.href = href;
                }, 800);
            }
        });
    });
}

// Set Active Navigation
function initActiveNav() {
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Handle index.html vs empty
        if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        } 
        // Handle other pages
        else if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Wave Background Animation Enhancement
function initWaveBackground() {
    const waves = document.querySelectorAll('.wave');
    
    // Add random movement to waves
    waves.forEach((wave, index) => {
        // Randomize animation duration slightly
        const duration = 15 + (index * 3) + (Math.random() * 5);
        wave.style.animationDuration = `${duration}s`;
        
        // Randomize delay
        const delay = -(index * 3) - (Math.random() * 3);
        wave.style.animationDelay = `${delay}s`;
    });
}

// Initialize Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.feature, .value-item, .platform-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add scroll-based navbar effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (navbar) {
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(10, 10, 20, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(10, 10, 20, 0.8)';
                navbar.style.backdropFilter = 'blur(20px)';
            }
            
            // Hide navbar on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn, .platform-btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Utility Functions
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Export functions for use in other modules
window.Lunar = {
    openJoinModal,
    closeJoinModal,
    initNavigation,
    initPageLoader
};