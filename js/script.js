// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Hero Image Slider
let heroIndex = 0;
const heroSlider = document.querySelector('.hero-slider');
const heroPrevBtn = document.querySelector('.hero-btn.prev');
const heroNextBtn = document.querySelector('.hero-btn.next');
const heroPlayPauseBtn = document.querySelector('.hero-btn.play-pause');
let heroPlaying = true;
let heroInterval;

function goToHeroSlide(index) {
    if (index < 0) index = 1;
    if (index > 1) index = 0;
    heroSlider.style.transform = `translateX(-${index * 100}%)`;
    heroIndex = index;
}

function startHeroAutoSlide() {
    heroInterval = setInterval(() => {
        goToHeroSlide(heroIndex + 1);
    }, 5000);
}

function stopHeroAutoSlide() {
    clearInterval(heroInterval);
}

heroPrevBtn.addEventListener('click', () => {
    goToHeroSlide(heroIndex - 1);
});

heroNextBtn.addEventListener('click', () => {
    goToHeroSlide(heroIndex + 1);
});

heroPlayPauseBtn.addEventListener('click', () => {
    if (heroPlaying) {
        stopHeroAutoSlide();
        heroPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        startHeroAutoSlide();
        heroPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    heroPlaying = !heroPlaying;
});

// Start autoplay on load
startHeroAutoSlide();

// Testimonial Slider (Clients Say Section)
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentIndex = 0;
const slideWidth = slides[0].clientWidth;

function goToSlide(index) {
    if (index < 0) {
        index = slides.length - 1;
    } else if (index >= slides.length) {
        index = 0;
    }
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
    currentIndex = index;
}

prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
});

// Auto slide every 5 seconds
setInterval(() => {
    goToSlide(currentIndex + 1);
}, 5000);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Scroll Animations
function checkScroll() {
    const elements = document.querySelectorAll('.grid-item, .section-title');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }
    });
}

document.querySelectorAll('.grid-item, .section-title').forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);



// FAQ Accordion Functionality
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length > 0) {
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields');
      return;
    }
    
    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
  });
}


// Account Management System
class AccountSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupTabs();
    this.setupForms();
    this.loadUserData();
  }

  // Setup account tabs
  setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabId + 'Tab').classList.add('active');
      });
    });
  }

  // Setup form submissions
  setupForms() {
    const profileForm = document.getElementById('profileForm');
    const securityForm = document.getElementById('securityForm');
    const preferencesForm = document.getElementById('preferencesForm');

    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProfile();
      });
    }

    if (securityForm) {
      securityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSecurity();
      });
    }

    if (preferencesForm) {
      preferencesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.savePreferences();
      });
    }
  }

  // Load user data from auth system
  loadUserData() {
    const auth = window.auth;
    if (auth && auth.getCurrentUser()) {
      const user = auth.getCurrentUser();
      
      // Populate profile form
      const firstNameInput = document.getElementById('accountFirstName');
      const lastNameInput = document.getElementById('accountLastName');
      const emailInput = document.getElementById('accountEmail');

      if (firstNameInput) firstNameInput.value = user.firstName || '';
      if (lastNameInput) lastNameInput.value = user.lastName || '';
      if (emailInput) emailInput.value = user.email || '';
    }
  }

  // Save profile information
  saveProfile() {
    const formData = {
      firstName: document.getElementById('accountFirstName').value,
      lastName: document.getElementById('accountLastName').value,
      email: document.getElementById('accountEmail').value,
      phone: document.getElementById('accountPhone').value,
      bio: document.getElementById('accountBio').value
    };

    // Simulate API call
    this.showLoading('Saving profile...');
    
    setTimeout(() => {
      // Update auth user data
      const auth = window.auth;
      if (auth && auth.getCurrentUser()) {
        const user = auth.getCurrentUser();
        user.firstName = formData.firstName;
        user.lastName = formData.lastName;
        user.email = formData.email;
        auth.saveUser(user);
      }

      this.hideLoading();
      this.showSuccess('Profile updated successfully!');
    }, 1000);
  }

  // Save security settings
  saveSecurity() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    const twoFactorAuth = document.getElementById('twoFactorAuth').checked;

    if (newPassword && newPassword !== confirmPassword) {
      this.showError('New passwords do not match');
      return;
    }

    this.showLoading('Updating security settings...');
    
    setTimeout(() => {
      this.hideLoading();
      this.showSuccess('Security settings updated successfully!');
      
      // Clear password fields
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmNewPassword').value = '';
    }, 1000);
  }

  // Save preferences
  savePreferences() {
    const preferences = {
      emailNotifications: document.getElementById('emailNotifications').checked,
      courseUpdates: document.getElementById('courseUpdates').checked,
      marketingEmails: document.getElementById('marketingEmails').checked,
      autoPlay: document.getElementById('autoPlay').checked,
      downloadable: document.getElementById('downloadable').checked
    };

    this.showLoading('Saving preferences...');
    
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('techma_preferences', JSON.stringify(preferences));
      this.hideLoading();
      this.showSuccess('Preferences saved successfully!');
    }, 800);
  }

  // Utility functions
  showLoading(message = 'Loading...') {
    // You can implement a loading spinner here
    console.log(message);
  }

  hideLoading() {
    // Hide loading spinner
  }

  showSuccess(message) {
    alert(message); // In real app, use a toast notification
  }

  showError(message) {
    alert(message); // In real app, use a toast notification
  }
}

// Initialize account system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AccountSystem();
});