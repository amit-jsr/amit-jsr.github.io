const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const reveals = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Project list and detail management
const projectListItems = document.querySelectorAll('.project-list-item');
const projectDetails = document.querySelectorAll('.project-detail');

// Add entrance animations on page load
window.addEventListener('load', () => {
  // Set current year in footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
  // Animate hero section elements with stagger
  const heroElements = document.querySelectorAll('.hero .reveal');
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, index * 100);
  });
});

const storedTheme = localStorage.getItem('portfolio-theme');
if (storedTheme === 'dark') {
  body.classList.add('dark');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark');
  const dark = body.classList.contains('dark');
  localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
  themeToggle.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

menuToggle?.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// Smooth scroll to sections when clicking nav links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    navMenu.classList.remove('open');
    
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 82; // Header height
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) el.classList.add('visible');
      });

      navLinks.forEach(link => link.classList.remove('active'));
      const current = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (current) current.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(section => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

reveals.forEach(el => revealObserver.observe(el));

// Project selection handler
projectListItems.forEach(item => {
  item.addEventListener('click', () => {
    const projectId = item.getAttribute('data-project');
    
    // Check if already active
    if (item.classList.contains('active')) return;
    
    // Update active state on list items
    projectListItems.forEach(listItem => listItem.classList.remove('active'));
    item.classList.add('active');
    
    // Deterministic switch: remove active from all, then activate selected
    projectDetails.forEach(detail => detail.classList.remove('active'));

    const newProject = document.getElementById(projectId);
    if (newProject) {
      newProject.classList.add('active');

      // On mobile/tablet, scroll to project details
      if (window.innerWidth <= 1120) {
        const container = document.querySelector('.project-details-container');
        container?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
});

// Add subtle parallax effect to hero card
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const heroCard = document.querySelector('.hero-card');
      if (heroCard) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.05; // Reduced from 0.3 to 0.05 for minimal movement
        heroCard.style.transform = `translateY(${rate}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
});

// Scroll to top button
const scrollTopBtn = document.querySelector('.scroll-top');
scrollTopBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name').trim();
  const email = data.get('email').trim();
  const subject = data.get('subject').trim();
  const message = data.get('message').trim();
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  // Clear previous status
  if (formStatus) formStatus.textContent = '';

  // Validate all fields
  if (!name || !email || !subject || !message) {
    if (formStatus) {
      formStatus.textContent = 'Please fill out all fields.';
      formStatus.style.color = '#ef4444';
    }
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    if (formStatus) {
      formStatus.textContent = 'Please enter a valid email address.';
      formStatus.style.color = '#ef4444';
    }
    return;
  }

  // Disable button while sending
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
  if (formStatus) { formStatus.textContent = ''; }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '37ac4820-0f57-442a-9d0f-415ef8d46584',
        name, email, subject, message,
        from_name: 'Portfolio Enquiry',
        botcheck: ''
      })
    });

    const result = await res.json();

    if (result.success) {
      if (formStatus) {
        formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
        formStatus.style.color = '#10b981';
      }
      contactForm.reset();
      // Auto-clear success message after 5s
      setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 5000);
    } else {
      throw new Error(result.message);
    }
  } catch {
    if (formStatus) {
      formStatus.textContent = '❌ Something went wrong. Please try again.';
      formStatus.style.color = '#ef4444';
    }
  } finally {
    // Re-enable button
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
  }
});
