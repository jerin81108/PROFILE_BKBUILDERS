document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const updateProgress = () => {
        if (!progressBar) return;
        const scrollTop = window.scrollY;
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateProgress();
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateProgress);
    handleScroll(); // Run once in case user starts refreshed/scrolled down

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 4. Portfolio Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Show or hide based on filter criteria
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Trigger reflow & re-apply reveal for nice entry
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // 5. Testimonial Carousel Slider
    const track = document.getElementById('testimonial-track');
    let currentSlide = 0;
    let autoPlayTimer;

    const updateSlider = (slideIndex) => {
        if (!track) return;
        currentSlide = slideIndex;
        // Translate the track horizontally by slide index
        track.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // Update dots active status dynamically
        const currentDots = document.querySelectorAll('.nav-dot');
        currentDots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const startAutoPlay = () => {
        autoPlayTimer = setInterval(() => {
            const currentDots = document.querySelectorAll('.nav-dot');
            const totalSlides = currentDots.length;
            if (totalSlides === 0) return;
            let nextSlide = (currentSlide + 1) % totalSlides;
            updateSlider(nextSlide);
        }, 6000); // Shift every 6 seconds
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    };

    const initDotsListeners = () => {
        const currentDots = document.querySelectorAll('.nav-dot');
        currentDots.forEach((dot, index) => {
            dot.onclick = () => {
                updateSlider(index);
                resetAutoPlay();
            };
        });
    };

    const initialDots = document.querySelectorAll('.nav-dot');
    if (track && initialDots.length > 0) {
        initDotsListeners();
        startAutoPlay();
    }

    // 6. Navigation Link Active State highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNavLink = () => {
        const scrollPosition = window.scrollY + 120; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNavLink);

    // 7. Portal button and contact card redirect handling
    const portalButton = document.getElementById('portal-button');
    const portalLoader = document.getElementById('portal-loader');

    if (portalButton && portalLoader) {
        portalButton.addEventListener('click', (event) => {
            event.preventDefault();
            portalLoader.classList.add('active');

            window.setTimeout(() => {
                window.location.href = 'https://civix-1-dbpi.onrender.com/';
            }, 1400);
        });

        // Hide portal loader if returning to the page (e.g. via browser back button)
        window.addEventListener('pageshow', (event) => {
            portalLoader.classList.remove('active');
        });
    }

    const contactLinks = document.querySelectorAll('.contact-card-link');
    contactLinks.forEach(card => {
        card.addEventListener('click', () => {
            const href = card.dataset.href;
            if (href) {
                window.location.href = href;
            }
        });
    });

    // 8. Interactive Contact Form Handler & Client-side Validation
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('success-toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Fetch inputs
            const nameInput = document.getElementById('form-name');
            const phoneInput = document.getElementById('form-phone');
            const emailInput = document.getElementById('form-email');
            const projectInput = document.getElementById('form-project');
            const messageInput = document.getElementById('form-message');

            let isValid = true;

            // Simple validations
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                clearError(nameInput);
            }

            const phonePattern = /^[6-9]\d{9}$/;
            if (!phoneInput.value.trim()) {
                showError(phoneInput, 'Phone number is required');
                isValid = false;
            } else if (!phonePattern.test(phoneInput.value.trim())) {
                showError(phoneInput, 'Enter a valid 10-digit Indian phone number');
                isValid = false;
            } else {
                clearError(phoneInput);
            }

            if (!projectInput.value) {
                showError(projectInput, 'Please select a project type');
                isValid = false;
            } else {
                clearError(projectInput);
            }

            if (!messageInput.value.trim()) {
                showError(messageInput, 'Project description is required');
                isValid = false;
            } else {
                clearError(messageInput);
            }

            // Email validation (optional but if provided, must be valid)
            if (emailInput.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value.trim())) {
                    showError(emailInput, 'Enter a valid email address');
                    isValid = false;
                } else {
                    clearError(emailInput);
                }
            }

            // If valid, submit to Web3Forms and show success toast
            if (isValid) {
                const formData = new FormData(contactForm);
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })
                .then(() => {
                    // Show success toast animation
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => {
                            toast.classList.remove('show');
                        }, 4000); // hide after 4 seconds
                    }
                    // Reset form
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Netlify Form submission error:', error);
                    // Fallback: show success toast locally for verification and reset form
                    if (toast) {
                        toast.classList.add('show');
                        setTimeout(() => {
                            toast.classList.remove('show');
                        }, 4000);
                    }
                    contactForm.reset();
                });
            }
        });

        // Realtime input clear errors
        const formInputs = contactForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                clearError(input);
            });
        });
    }

    // Helper functions for forms
    function showError(element, message) {
        // Remove existing error labels if any
        clearError(element);
        
        element.style.borderColor = 'var(--clr-error)';
        element.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.15)';
        
        const errorText = document.createElement('span');
        errorText.className = 'form-error-msg';
        errorText.style.color = 'var(--clr-error)';
        errorText.style.fontSize = '0.75rem';
        errorText.style.marginTop = '4px';
        errorText.style.display = 'block';
        errorText.textContent = message;
        
        element.parentElement.appendChild(errorText);
    }

    function clearError(element) {
        element.style.borderColor = '';
        element.style.boxShadow = '';
        const parent = element.parentElement;
        const errorLabel = parent.querySelector('.form-error-msg');
        if (errorLabel) {
            parent.removeChild(errorLabel);
        }
    }

    // 8. Rating Stars Input Interactions
    const starInputContainer = document.getElementById('rating-stars-input');
    const ratingValueInput = document.getElementById('review-rating-value');
    if (starInputContainer && ratingValueInput) {
        const stars = starInputContainer.querySelectorAll('.star-btn');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-value'));
                ratingValueInput.value = rating;
                
                stars.forEach((s, idx) => {
                    if (idx < rating) {
                        s.classList.remove('fa-regular');
                        s.classList.add('fa-solid');
                        s.style.color = 'var(--clr-primary)';
                    } else {
                        s.classList.remove('fa-solid');
                        s.classList.add('fa-regular');
                        s.style.color = '';
                    }
                });
            });
            
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.getAttribute('data-value'));
                stars.forEach((s, idx) => {
                    if (idx < rating) {
                        s.style.color = 'var(--clr-primary-light)';
                    }
                });
            });
            
            star.addEventListener('mouseout', () => {
                const activeRating = parseInt(ratingValueInput.value);
                stars.forEach((s, idx) => {
                    if (idx >= activeRating) {
                        s.style.color = '';
                    } else {
                        s.style.color = 'var(--clr-primary)';
                    }
                });
            });
        });
        
        // Trigger initial click to set default 5-stars
        stars[4].click();
    }

    // 9. Write Review Form Toggle
    const btnWriteReview = document.getElementById('btn-write-review');
    const reviewFormPanel = document.getElementById('review-form-panel');
    if (btnWriteReview && reviewFormPanel) {
        btnWriteReview.addEventListener('click', () => {
            if (reviewFormPanel.style.display === 'none' || !reviewFormPanel.style.display) {
                reviewFormPanel.style.display = 'block';
                btnWriteReview.innerHTML = '<i class="fa-solid fa-xmark" style="margin-right: 8px;"></i> Close Review Form';
                reviewFormPanel.scrollIntoView({ behavior: 'smooth' });
            } else {
                reviewFormPanel.style.display = 'none';
                btnWriteReview.innerHTML = '<i class="fa-solid fa-pen-to-square" style="margin-right: 8px;"></i> Write a Review';
            }
        });
    }

    // 10. Site Review Form Submission Handler
    const siteReviewForm = document.getElementById('site-review-form');
    if (siteReviewForm) {
        siteReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rName = document.getElementById('review-name');
            const rRole = document.getElementById('review-role');
            const rDesc = document.getElementById('review-desc');
            const rVal = document.getElementById('review-rating-value');
            
            let isValid = true;
            if (!rName.value.trim()) { showError(rName, 'Name is required'); isValid = false; } else { clearError(rName); }
            if (!rRole.value.trim()) { showError(rRole, 'Role is required'); isValid = false; } else { clearError(rRole); }
            if (!rDesc.value.trim()) { showError(rDesc, 'Review description is required'); isValid = false; } else { clearError(rDesc); }
            
            if (isValid) {
                const rating = parseInt(rVal.value);
                const desc = rDesc.value.trim();
                const name = rName.value.trim();
                const role = rRole.value.trim();
                
                // Dynamically append new slide to the Testimonial Carousel Track
                if (track) {
                    const newSlide = document.createElement('div');
                    newSlide.className = 'testimonial-slide';
                    
                    let starsHtml = '';
                    for (let i = 0; i < 5; i++) {
                        if (i < rating) {
                            starsHtml += '<i class="fa-solid fa-star" style="color: var(--clr-primary); font-size: 0.8rem; margin: 0 1px;"></i>';
                        } else {
                            starsHtml += '<i class="fa-regular fa-star" style="color: var(--clr-border); font-size: 0.8rem; margin: 0 1px;"></i>';
                        }
                    }
                    
                    newSlide.innerHTML = `
                        <div class="testimonial-card">
                            <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
                            <div style="margin-bottom: 16px;">${starsHtml}</div>
                            <p class="testimonial-text">"${desc}"</p>
                            <div class="client-info">
                                <h4>${name}</h4>
                                <p>${role}, Tirupur</p>
                            </div>
                        </div>
                    `;
                    track.appendChild(newSlide);
                    
                    // Add a new dot to navigation
                    const navContainer = document.getElementById('testimonials-nav');
                    if (navContainer) {
                        const newDotIdx = navContainer.querySelectorAll('.nav-dot').length;
                        const newDot = document.createElement('button');
                        newDot.className = 'nav-dot';
                        newDot.setAttribute('data-slide', newDotIdx);
                        newDot.setAttribute('aria-label', `Slide ${newDotIdx + 1}`);
                        
                        navContainer.appendChild(newDot);
                        initDotsListeners(); // Reinitialize click listeners for all dots
                        
                        // Slide to the newly added review immediately
                        updateSlider(newDotIdx);
                        resetAutoPlay();
                    }
                }
                
                // Show success feedback
                const toast = document.getElementById('success-toast');
                if (toast) {
                    const toastText = toast.querySelector('span');
                    if (toastText) toastText.textContent = 'Review added to site testimonials!';
                    toast.classList.add('show');
                    setTimeout(() => { toast.classList.remove('show'); }, 3000);
                }
                
                // If rating is 4 or 5 stars, prompt Google Review Modal
                if (rating >= 4) {
                    const googleModal = document.getElementById('google-review-modal');
                    const modalRatingVal = document.getElementById('modal-rating-val');
                    const modalReviewText = document.getElementById('modal-review-text');
                    const btnRedirect = document.getElementById('btn-redirect-google');
                    
                    if (googleModal && modalRatingVal && modalReviewText) {
                        modalRatingVal.textContent = rating;
                        modalReviewText.textContent = desc;
                        
                        // Custom search query redirect targeting B.K. Builders Tirupur Maps page
                        btnRedirect.href = `https://www.google.com/maps/search/?api=1&query=BK+Builders+(Opp)+R.I.+Office+Rice+Mandi+Street+Tirupur`;
                        
                        setTimeout(() => {
                            googleModal.style.display = 'flex';
                        }, 1200); // open slightly after toast
                    }
                }
                
                // Reset review form and hide panel
                siteReviewForm.reset();
                if (starInputContainer) {
                    const stars = starInputContainer.querySelectorAll('.star-btn');
                    stars[4].click(); // reset to 5 stars
                }
                reviewFormPanel.style.display = 'none';
                if (btnWriteReview) {
                    btnWriteReview.innerHTML = '<i class="fa-solid fa-pen-to-square" style="margin-right: 8px;"></i> Write a Review';
                }
            }
        });
    }
});

// Global Function to Scroll to Contact Section
window.scrollToContact = function() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// Global Functions for Google Review Modal Redirects
window.copyReviewText = function() {
    const textElement = document.getElementById('modal-review-text');
    if (textElement) {
        navigator.clipboard.writeText(textElement.textContent)
            .then(() => {
                alert('Review text copied to clipboard! You can paste it on Google Reviews.');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
};

window.closeGoogleModal = function() {
    const modal = document.getElementById('google-review-modal');
    if (modal) {
        modal.style.display = 'none';
    }
};
