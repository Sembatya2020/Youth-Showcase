// Header component

import { getCurrentUser, logout } from '../utils/auth.js';

/**
 * Initialize header component
 * @param {HTMLElement} headerElement - The header element to initialize
 */
export function initializeHeader(headerElement) {
  if (!headerElement) return;
  
  // Get current user
  const currentUser = getCurrentUser();
  
  // Update auth section based on login status
  updateAuthSection(headerElement, currentUser);
  
  // Add event listener for mobile menu
  const mobileMenuBtn = headerElement.querySelector('.mobile-menu-btn');
  const mainNav = headerElement.querySelector('.main-nav');
  
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
  }
  
  // Add scroll event for header styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      headerElement.classList.add('scrolled');
    } else {
      headerElement.classList.remove('scrolled');
    }
  });
  
  // Set active nav item based on current page
  setActiveNavItem(headerElement);
}

/**
 * Update the auth section of the header based on login status
 * @param {HTMLElement} headerElement - The header element
 * @param {Object|null} user - The current user object or null if not logged in
 */
export function updateAuthSection(headerElement, user) {
  const authButtons = headerElement.querySelector('.auth-buttons');
  
  if (!authButtons) return;
  
  if (user) {
    // User is logged in, show user menu
    authButtons.innerHTML = `
      <div class="user-menu">
        <div class="user-avatar">
          <img src="${user.avatar || '/public/images/default-avatar.jpg'}" alt="${user.name}">
        </div>
        <span class="user-name">${user.name}</span>
        <div class="dropdown-menu">
          <a href="/html/profile.html" class="dropdown-item">My Profile</a>
          <a href="/html/upload.html" class="dropdown-item">Upload Work</a>
          <a href="#" class="dropdown-item logout-btn">Log Out</a>
        </div>
      </div>
    `;
    
    // Add dropdown toggle
    const userMenu = authButtons.querySelector('.user-menu');
    if (userMenu) {
      userMenu.addEventListener('click', (e) => {
        userMenu.classList.toggle('active');
        e.stopPropagation(); // Prevent document click from immediately closing it
      });
      
      // Close dropdown when clicking elsewhere
      document.addEventListener('click', () => {
        userMenu.classList.remove('active');
      });
    }
    
    // Add logout handler
    const logoutBtn = authButtons.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
      });
    }
  } else {
    // User is not logged in, show login/signup buttons
    authButtons.innerHTML = `
      <button class="login-btn">Log In</button>
      <button class="signup-btn">Sign Up</button>
    `;
    
    // Add event listeners for login/signup
    const loginBtn = authButtons.querySelector('.login-btn');
    const signupBtn = authButtons.querySelector('.signup-btn');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        openAuthModal('loginModal');
      });
    }
    
    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        openAuthModal('signupModal');
      });
    }
  }
}

/**
 * Handle user logout
 */
function handleLogout() {
  // Confirm logout
  if (confirm('Are you sure you want to log out?')) {
    // Log the user out
    logout();
    
    // Reload the page
    window.location.reload();
  }
}

/**
 * Open authentication modal
 * @param {string} modalId - The ID of the modal to open
 */
function openAuthModal(modalId) {
  const modal = document.getElementById(modalId);
  
  if (!modal) {
    // If modal not found, redirect to home with query param
    window.location.href = `/?${modalId === 'loginModal' ? 'login' : 'signup'}=true`;
    return;
  }
  
  // Check if modal has content
  if (!modal.querySelector('.modal-content')) {
    // Create modal content if it doesn't exist
    if (modalId === 'loginModal') {
      createLoginModalContent(modal);
    } else {
      createSignupModalContent(modal);
    }
  }
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  
  // Add event listener to close when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeAuthModal(modalId);
    }
  });
}

/**
 * Create login modal content
 * @param {HTMLElement} modal - The modal element
 */
function createLoginModalContent(modal) {
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  modalContent.innerHTML = `
    <button class="close-modal">&times;</button>
    <h2>Log In</h2>
    <form id="loginForm">
      <div class="form-group">
        <label for="loginEmail">Email</label>
        <input type="email" id="loginEmail" required>
      </div>
      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" id="loginPassword" required>
      </div>
      <button type="submit" class="primary-btn">Log In</button>
    </form>
    <p class="form-footer">Don't have an account? <a href="#" class="switch-to-signup">Sign Up</a></p>
  `;
  
  modal.appendChild(modalContent);
  
  // Add event listeners
  const closeBtn = modalContent.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => closeAuthModal('loginModal'));
  
  const switchToSignup = modalContent.querySelector('.switch-to-signup');
  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeAuthModal('loginModal');
    openAuthModal('signupModal');
  });
  
  const loginForm = modalContent.querySelector('#loginForm');
  loginForm.addEventListener('submit', handleLogin);
}

/**
 * Create signup modal content
 * @param {HTMLElement} modal - The modal element
 */
function createSignupModalContent(modal) {
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  modalContent.innerHTML = `
    <button class="close-modal">&times;</button>
    <h2>Sign Up</h2>
    <form id="signupForm">
      <div class="form-group">
        <label for="signupName">Full Name</label>
        <input type="text" id="signupName" required>
      </div>
      <div class="form-group">
        <label for="signupEmail">Email</label>
        <input type="email" id="signupEmail" required>
      </div>
      <div class="form-group">
        <label for="signupPassword">Password</label>
        <input type="password" id="signupPassword" required>
      </div>
      <div class="form-group">
        <label for="signupConfirmPassword">Confirm Password</label>
        <input type="password" id="signupConfirmPassword" required>
      </div>
      <button type="submit" class="primary-btn">Sign Up</button>
    </form>
    <p class="form-footer">Already have an account? <a href="#" class="switch-to-login">Log In</a></p>
  `;
  
  modal.appendChild(modalContent);
  
  // Add event listeners
  const closeBtn = modalContent.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => closeAuthModal('signupModal'));
  
  const switchToLogin = modalContent.querySelector('.switch-to-login');
  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeAuthModal('signupModal');
    openAuthModal('loginModal');
  });
  
  const signupForm = modalContent.querySelector('#signupForm');
  signupForm.addEventListener('submit', handleSignup);
}

/**
 * Close authentication modal
 * @param {string} modalId - The ID of the modal to close
 */
function closeAuthModal(modalId) {
  const modal = document.getElementById(modalId);
  
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

/**
 * Handle login form submission
 * @param {Event} e - The form submit event
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  
  if (!emailInput || !passwordInput) return;
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Basic validation
  if (!email || !password) {
    showFormError(e.target, 'Please fill in all fields');
    return;
  }
  
  try {
    // Get login function from auth module
    const { login } = await import('../utils/auth.js');
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    // Attempt login
    const user = await login(email, password);
    
    // Success
    closeAuthModal('loginModal');
    
    // Reload page to update UI
    window.location.reload();
    
  } catch (error) {
    console.error('Login error:', error);
    showFormError(e.target, error.message || 'Login failed. Please try again.');
    
    // Reset button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
  }
}

/**
 * Handle signup form submission
 * @param {Event} e - The form submit event
 */
async function handleSignup(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('signupName');
  const emailInput = document.getElementById('signupEmail');
  const passwordInput = document.getElementById('signupPassword');
  const confirmPasswordInput = document.getElementById('signupConfirmPassword');
  
  if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) return;
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    showFormError(e.target, 'Please fill in all fields');
    return;
  }
  
  // Password match validation
  if (password !== confirmPassword) {
    showFormError(e.target, 'Passwords do not match');
    return;
  }
  
  try {
    // Get register function from auth module
    const { register } = await import('../utils/auth.js');
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    // Attempt registration
    const user = await register(name, email, password);
    
    // Success
    closeAuthModal('signupModal');
    
    // Reload page to update UI
    window.location.reload();
    
  } catch (error) {
    console.error('Registration error:', error);
    showFormError(e.target, error.message || 'Registration failed. Please try again.');
    
    // Reset button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign Up';
  }
}

/**
 * Show error message in form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The error message to display
 */
function showFormError(form, message) {
  // Remove any existing error
  const existingError = form.querySelector('.form-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error element
  const errorElement = document.createElement('div');
  errorElement.className = 'form-error';
  errorElement.textContent = message;
  
  // Add error to form
  form.insertBefore(errorElement, form.querySelector('button[type="submit"]'));
}

/**
 * Set active nav item based on current page
 * @param {HTMLElement} headerElement - The header element
 */
function setActiveNavItem(headerElement) {
  const currentPath = window.location.pathname;
  const navLinks = headerElement.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    // Remove active class from all links
    link.classList.remove('active');
    
    // Get the link path
    const linkPath = new URL(link.href).pathname;
    
    // Check if current path starts with link path (excluding home page)
    if (linkPath !== '/' && currentPath.startsWith(linkPath)) {
      link.classList.add('active');
    } else if (linkPath === '/' && currentPath === '/') {
      // Special case for home page
      link.classList.add('active');
    }
  });
}