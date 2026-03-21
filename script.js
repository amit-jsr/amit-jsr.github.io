const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const reveals = document.querySelectorAll('.reveal');
const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const projectSliderTrack = document.getElementById('projectSliderTrack');
const projectPrevBtn = document.getElementById('projectPrevBtn');
const projectNextBtn = document.getElementById('projectNextBtn');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

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

let sliderIndex = 0;
let projectSliderIndex = 0;

function getVisibleCards() {
  if (window.innerWidth <= 860) return 1;
  if (window.innerWidth <= 1120) return 2;
  return 3;
}

function updateSlider() {
  const cards = sliderTrack.children.length;
  const visible = getVisibleCards();
  const maxIndex = Math.max(0, cards - visible);
  sliderIndex = Math.max(0, Math.min(sliderIndex, maxIndex));

  const gap = window.innerWidth <= 1120 ? 20 : 20;
  const viewportWidth = sliderTrack.parentElement.clientWidth;
  const cardWidth = visible === 1 ? viewportWidth : (viewportWidth - gap * (visible - 1)) / visible;
  sliderTrack.style.transform = `translateX(-${sliderIndex * (cardWidth + gap)}px)`;

  // Update button states
  prevBtn.disabled = sliderIndex === 0;
  nextBtn.disabled = sliderIndex === maxIndex;
  
  // Update button styling
  if (prevBtn.disabled) {
    prevBtn.style.opacity = '.5';
    prevBtn.style.cursor = 'not-allowed';
    prevBtn.classList.remove('active-btn');
  } else {
    prevBtn.style.opacity = '1';
    prevBtn.style.cursor = 'pointer';
  }
  
  if (nextBtn.disabled) {
    nextBtn.style.opacity = '.5';
    nextBtn.style.cursor = 'not-allowed';
    nextBtn.classList.remove('active-btn');
  } else {
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor = 'pointer';
    nextBtn.classList.add('active-btn');
  }
}

function updateProjectSlider() {
  const cards = projectSliderTrack.children.length;
  const visible = getVisibleCards();
  const maxIndex = Math.max(0, cards - visible);
  projectSliderIndex = Math.max(0, Math.min(projectSliderIndex, maxIndex));

  const gap = window.innerWidth <= 1120 ? 20 : 20;
  const viewportWidth = projectSliderTrack.parentElement.clientWidth;
  const cardWidth = visible === 1 ? viewportWidth : (viewportWidth - gap * (visible - 1)) / visible;
  projectSliderTrack.style.transform = `translateX(-${projectSliderIndex * (cardWidth + gap)}px)`;

  // Update button states
  projectPrevBtn.disabled = projectSliderIndex === 0;
  projectNextBtn.disabled = projectSliderIndex === maxIndex;
  
  // Update button styling
  if (projectPrevBtn.disabled) {
    projectPrevBtn.style.opacity = '.5';
    projectPrevBtn.style.cursor = 'not-allowed';
    projectPrevBtn.classList.remove('active-btn');
  } else {
    projectPrevBtn.style.opacity = '1';
    projectPrevBtn.style.cursor = 'pointer';
  }
  
  if (projectNextBtn.disabled) {
    projectNextBtn.style.opacity = '.5';
    projectNextBtn.style.cursor = 'not-allowed';
    projectNextBtn.classList.remove('active-btn');
  } else {
    projectNextBtn.style.opacity = '1';
    projectNextBtn.style.cursor = 'pointer';
    projectNextBtn.classList.add('active-btn');
  }
}

prevBtn?.addEventListener('click', () => {
  if (sliderIndex > 0) {
    sliderIndex -= 1;
    updateSlider();
  }
});

nextBtn?.addEventListener('click', () => {
  const cards = sliderTrack.children.length;
  const visible = getVisibleCards();
  const maxIndex = Math.max(0, cards - visible);
  
  if (sliderIndex < maxIndex) {
    sliderIndex += 1;
    updateSlider();
  }
});

projectPrevBtn?.addEventListener('click', () => {
  if (projectSliderIndex > 0) {
    projectSliderIndex -= 1;
    updateProjectSlider();
  }
});

projectNextBtn?.addEventListener('click', () => {
  const cards = projectSliderTrack.children.length;
  const visible = getVisibleCards();
  const maxIndex = Math.max(0, cards - visible);
  
  if (projectSliderIndex < maxIndex) {
    projectSliderIndex += 1;
    updateProjectSlider();
  }
});

window.addEventListener('resize', () => {
  updateSlider();
  updateProjectSlider();
});

window.addEventListener('load', () => {
  updateSlider();
  updateProjectSlider();
});

// Add keyboard navigation for slider
document.addEventListener('keydown', (e) => {
  const achievementSection = document.getElementById('achievements');
  const rect = achievementSection?.getBoundingClientRect();
  
  // Only handle arrow keys if achievements section is in view
  if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevBtn?.click();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextBtn?.click();
    }
  }
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

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name').trim();
  const email = data.get('email').trim();
  const subject = data.get('subject').trim();
  const message = data.get('message').trim();

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

  const mailto = `mailto:jaiswaramit96@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  )}`;
  
  if (formStatus) {
    formStatus.textContent = 'Opening your email app...';
    formStatus.style.color = '#10b981';
  }
  
  // Small delay for better UX
  setTimeout(() => {
    window.location.href = mailto;
  }, 500);
});
