// Enhanced About Page JavaScript with Advanced Animations

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const contactForm = document.getElementById('about-contact-form');
    const teamMembers = document.querySelectorAll('.team-member');
    const missionValues = document.querySelectorAll('.mission-value');
    const processSteps = document.querySelectorAll('.process-step');
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dot');

    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            // In a real application, you would send this data to a server
            // For this demo, we'll simulate a successful submission
            simulateFormSubmission();
        });
    }

    // SpotlightCard functionality - reusable function
    function applySpotlightEffect(elements, spotlightColor = 'rgba(255, 255, 255, 0.25)', hoverSelector = null) {
        if (elements.length > 0) {
            elements.forEach(element => {
                // Add spotlight class
                element.classList.add('card-spotlight');

                // Mouse move handler for spotlight effect
                const handleMouseMove = (e) => {
                    const rect = element.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    element.style.setProperty('--mouse-x', `${x}px`);
                    element.style.setProperty('--mouse-y', `${y}px`);
                    element.style.setProperty('--spotlight-color', spotlightColor);
                };

                // Add event listeners
                element.addEventListener('mousemove', handleMouseMove);

                // Optional hover effect for specific elements
                if (hoverSelector) {
                    element.addEventListener('mouseenter', function () {
                        const hoverElement = this.querySelector(hoverSelector);
                        if (hoverElement) {
                            hoverElement.style.opacity = '1';
                        }
                    });

                    element.addEventListener('mouseleave', function () {
                        const hoverElement = this.querySelector(hoverSelector);
                        if (hoverElement) {
                            hoverElement.style.opacity = '0';
                        }
                    });
                }
            });
        }
    }

    // Enhanced tilt animation function for team members
    function applyTiltEffect(elements) {
        elements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.2s ease-out';
            });

            element.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Smooth tilt calculation
                const rotateX = (y - centerY) / 12;
                const rotateY = (centerX - x) / 12;
                
                // Enhanced transform with perspective
                this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                
                // Update spotlight position
                this.style.setProperty('--mouse-x', `${x}px`);
                this.style.setProperty('--mouse-y', `${y}px`);
            });

            element.addEventListener('mouseleave', function() {
                this.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }

    // Apply spotlight effect to all card components

    // Team members - Apply tilt and spotlight effects
    applySpotlightEffect(teamMembers, 'rgba(255, 255, 255, 0.15)');
    applyTiltEffect(teamMembers);

    // Mission values with green spotlight
    applySpotlightEffect(missionValues, 'rgba(67, 206, 162, 0.25)');

    // Process steps with blue spotlight
    applySpotlightEffect(processSteps, 'rgba(108, 99, 255, 0.3)');

    // Testimonials with warm spotlight
    applySpotlightEffect(testimonials, 'rgba(255, 255, 255, 0.2)');

    // Testimonial slider functionality
    let currentSlide = 0;
    const totalSlides = testimonialSlides.length;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show the current slide
        if (testimonialSlides[index]) {
            testimonialSlides[index].style.display = 'block';
        }

        // Add active class to current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }

        // Update current slide index
        currentSlide = index;
    }

    // Function to show next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Function to show previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Add event listeners to navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    // Add event listeners to dots
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });
    }

    // Auto-advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance when hovering over testimonials
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', function () {
            clearInterval(slideInterval);
        });

        testimonialContainer.addEventListener('mouseleave', function () {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Initialize the slider
    if (testimonialSlides.length > 0) {
        showSlide(0);
    }

    // Function to simulate form submission
    function simulateFormSubmission() {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate API delay
        setTimeout(() => {
            // Reset form
            contactForm.reset();

            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
        }, 1500);
    }

    // Enhanced Scroll Animation System with Intersection Observer
    function initEnhancedScrollAnimations() {
        const observerOptions = {
            threshold: [0.1, 0.3, 0.5],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay for multiple elements
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        
                        // Trigger additional effects
                        if (entry.target.classList.contains('mission-value')) {
                            triggerMissionValueEffect(entry.target);
                        }
                        
                        if (entry.target.classList.contains('team-member')) {
                            triggerTeamMemberEffect(entry.target);
                        }
                    }, delay);
                }
            });
        }, observerOptions);

        // Enhanced element animation mapping
        const elementsToAnimate = [
            { selector: '.about-hero-image', class: 'scroll-animate-bounce' },
            { selector: '.about-content h2', class: 'scroll-animate-text' },
            { selector: '.about-content p', class: 'scroll-animate-left' },
            { selector: '.about-image', class: 'scroll-animate-morph' },
            { selector: '.mission-container h2', class: 'scroll-animate-text' },
            { selector: '.mission-value', class: 'scroll-animate-bounce stagger-animation' },
            { selector: '.about-team h2', class: 'scroll-animate-text' },
            { selector: '.team-member', class: 'scroll-animate-scale stagger-animation' },
            { selector: '.about-process h2', class: 'scroll-animate-text' },
            { selector: '.process-step', class: 'scroll-animate-bounce stagger-animation' },
            { selector: '.about-testimonials h2', class: 'scroll-animate-text' },
            { selector: '.testimonial', class: 'scroll-animate-scale' },
            { selector: '.about-contact h2', class: 'scroll-animate-text' },
            { selector: '.contact-item', class: 'scroll-animate-left stagger-animation' },
            { selector: '.contact-form', class: 'scroll-animate-right' }
        ];

        elementsToAnimate.forEach(({ selector, class: className }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add(className);
                
                // Add staggered delays
                if (className.includes('stagger-animation')) {
                    element.dataset.delay = index * 100;
                }
                
                observer.observe(element);
            });
        });
    }

    // Mission Value Special Effects
    function triggerMissionValueEffect(element) {
        const icon = element.querySelector('i');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'iconFloat 3s ease-in-out infinite';
            }, 300);
        }
    }

    // Team Member Special Effects
    function triggerTeamMemberEffect(element) {
        const image = element.querySelector('.member-image img');
        if (image) {
            setTimeout(() => {
                image.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    image.style.transform = 'scale(1)';
                }, 200);
            }, 400);
        }
    }

    // Enhanced Testimonial Slider with Better Animations
    function initEnhancedTestimonialSlider() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const dots = document.querySelectorAll('.testimonial-dot');
        
        let currentSlide = 0;
        let isAnimating = false;

        function showSlide(index, direction = 'next') {
            if (isAnimating) return;
            isAnimating = true;

            const currentSlideEl = slides[currentSlide];
            const nextSlideEl = slides[index];

            // Animate out current slide
            currentSlideEl.style.animation = direction === 'next' ? 
                'slideInFromLeft 0.5s ease-out reverse' : 
                'slideInFromRight 0.5s ease-out reverse';

            setTimeout(() => {
                currentSlideEl.classList.remove('active');
                currentSlideEl.style.display = 'none';
                
                // Animate in next slide
                nextSlideEl.style.display = 'block';
                nextSlideEl.style.animation = direction === 'next' ? 
                    'slideInFromRight 0.5s ease-out' : 
                    'slideInFromLeft 0.5s ease-out';
                nextSlideEl.classList.add('active');
                
                // Update dots
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
                
                currentSlide = index;
                
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            }, 250);
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next, 'next');
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev, 'prev');
        }

        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index !== currentSlide) {
                    const direction = index > currentSlide ? 'next' : 'prev';
                    showSlide(index, direction);
                }
            });
        });

        // Auto-advance with pause on hover
        let autoSlide = setInterval(nextSlide, 5000);
        
        const container = document.querySelector('.testimonials-container');
        if (container) {
            container.addEventListener('mouseenter', () => clearInterval(autoSlide));
            container.addEventListener('mouseleave', () => {
                autoSlide = setInterval(nextSlide, 5000);
            });
        }

        // Initialize first slide
        if (slides.length > 0) {
            slides[0].classList.add('active');
            slides[0].style.display = 'block';
            if (dots[0]) dots[0].classList.add('active');
        }
    }

    // Magnetic Effect for Interactive Elements
    function initMagneticEffect() {
        // Include team members for magnetic effect
        const magneticElements = document.querySelectorAll('.team-member, .mission-value, .process-step');
        
        magneticElements.forEach(element => {
            element.classList.add('magnetic');
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                element.style.setProperty('--mouse-x', `${moveX}px`);
                element.style.setProperty('--mouse-y', `${moveY}px`);
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.setProperty('--mouse-x', '0px');
                element.style.setProperty('--mouse-y', '0px');
            });
        });
    }

    // Text Typing Animation
    function initTypingAnimation() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                } else {
                    element.style.borderRight = 'none';
                }
            };
            
            // Start typing when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    // Initialize all enhanced animations
    initEnhancedScrollAnimations();
    initEnhancedTestimonialSlider();
    initMagneticEffect();
    initTypingAnimation();
    
    // Parallax effect for sections (subtle)
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.about-mission, .about-process');
        
        function updateParallax() {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.1; // Much more subtle parallax
            
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + window.scrollY;
                const elementHeight = rect.height;
                const windowHeight = window.innerHeight;
                
                // Only apply parallax when element is in viewport
                if (rect.top < windowHeight && rect.bottom > 0) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            });
        }

        // Use requestAnimationFrame for smooth animation
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', () => {
            requestTick();
            ticking = false;
        });
    }

    // Smooth scroll for internal links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Enhanced image loading with animation
    function initImageAnimations() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.complete) {
                img.classList.add('image-loading');
                img.addEventListener('load', () => {
                    img.classList.remove('image-loading');
                    img.style.animation = 'fadeInUp 0.6s ease-out';
                });
            }
        });
    }

    // Counter animation for numbers (if any)
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Initialize all animations
    initScrollAnimations();
    initParallaxEffect();
    initSmoothScroll();
    initImageAnimations();
    animateCounters();

    // Add scroll progress indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), #6c63ff);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    initScrollProgress();

    // Floating Action Button functionality
    function initFloatingActionButton() {
        const floatingBtn = document.getElementById('scrollToTop');
        
        if (floatingBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    floatingBtn.classList.add('show');
                } else {
                    floatingBtn.classList.remove('show');
                }
            });

            // Smooth scroll to top
            floatingBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Enhanced hover effects for interactive elements
    function initEnhancedHoverEffects() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('button, .btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Mouse cursor trail effect (optional, subtle)
    function initCursorTrail() {
        const trail = [];
        const trailLength = 10;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / trailLength};
                transition: all 0.1s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }

        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateTrail() {
            trail.forEach((dot, index) => {
                const nextDot = trail[index + 1] || { offsetLeft: mouseX, offsetTop: mouseY };
                
                dot.style.left = nextDot.offsetLeft + 'px';
                dot.style.top = nextDot.offsetTop + 'px';
            });
            
            trail[0].style.left = mouseX + 'px';
            trail[0].style.top = mouseY + 'px';
            
            requestAnimationFrame(updateTrail);
        }
        
        // Only enable on desktop
        if (window.innerWidth > 768) {
            updateTrail();
        }
    }

    // Initialize all new features
    initFloatingActionButton();
    initEnhancedHoverEffects();
    
    // Optional: Enable cursor trail (uncomment if desired)
    // initCursorTrail();
});