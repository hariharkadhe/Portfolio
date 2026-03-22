document.addEventListener('DOMContentLoaded', () => {
    // Lucide Icons
    if (window.lucide) lucide.createIcons();

    // Custom Cursor
    const cursor = document.getElementById('cursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const easing = 0.15;
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor Interactions
    const interactiveElements = document.querySelectorAll('a, button, .premium-card, .project-card, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-active'));
    });

    // Floating Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 2.5rem';
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.padding = '1.5rem 3rem';
            navbar.style.background = 'rgba(15, 23, 42, 0.4)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Reveal animations on scroll (Disabled for visibility check)
    /*
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('section, .premium-card, .project-card');
    revealElements.forEach((el, index) => {
        el.classList.add('hide');
        observer.observe(el);
    });
    */

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = theme === 'dark' ? 'sun' : 'moon';
        themeToggle.innerHTML = `<i data-lucide="${icon}" size="20"></i>`;
        if (window.lucide) lucide.createIcons();
    }

    // 3D Tilt Effect
    const tiltElements = document.querySelectorAll('.premium-card, .glass-3d');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (centerY - y) / 10;
            const rotateY = (x - centerX) / 10;
            
            el.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translateY(0) rotateX(0) rotateY(0)`;
        });
    });

    // Form submission handling connected to FormSubmit AJAX
    const form = document.querySelector('#contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameEl = form.querySelector('input[type="text"]');
            const emailEl = form.querySelector('input[type="email"]');
            const messageEl = form.querySelector('textarea');
            
            const name = nameEl ? nameEl.value : '';
            const email = emailEl ? emailEl.value : '';
            const message = messageEl ? messageEl.value : '';

            if (!name || !email || !message) {
                alert("Please fill all fields before sending.");
                return;
            }

            const btn = form.querySelector('button');
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            fetch("https://formsubmit.co/ajax/hariharkadhe2@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                btn.innerHTML = 'Message Sent! ✨';
                btn.style.background = '#10b981'; // Success Green
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = ''; // Revert to gradient via class
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(error => {
                console.error("Error sending message:", error);
                btn.innerHTML = 'Failed to Send';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // View All Posts Logic
    const viewAllBtn = document.getElementById('view-all-posts-btn');
    const hiddenPosts = document.querySelectorAll('.hidden-post');
    
    if (viewAllBtn && hiddenPosts.length > 0) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Loop through and reveal each hidden post with a staggering effect
            hiddenPosts.forEach((post, index) => {
                post.style.display = 'flex';
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                post.style.transition = `all 0.5s ease ${index * 0.1}s`;
                
                // Force a browser reflow so the transition triggers
                post.offsetHeight; 
                
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            });
            
            // Hide the button permanently since all posts are visible
            viewAllBtn.style.display = 'none';
        });
    }
});
