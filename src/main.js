// Function to initialize modals
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const loginBtn = document.querySelector('.login-btn');
  const signupBtn = document.querySelector('.signup-btn');
  
  // Add event listeners for opening modals
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      openModal('loginModal');
    });
  }
  
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      openModal('signupModal');
    });
  }
  
  // Close modal when clicking outside content
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
  
  // Create modal content if it doesn't exist
  createLoginModalContent();
  createSignupModalContent();
}

// Function to open a modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
}

// Function to close a modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Make these functions available globally
window.openModal = openModal;
window.closeModal = closeModal;

// Function to create login modal content
function createLoginModalContent() {
  const loginModal = document.getElementById('loginModal');
  if (!loginModal || loginModal.querySelector('.modal-content')) return;

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
  
  loginModal.appendChild(modalContent);
  
  // Add event listeners
  const closeBtn = modalContent.querySelector('.close-modal');
  const switchToSignup = modalContent.querySelector('.switch-to-signup');
  const loginForm = modalContent.querySelector('#loginForm');
  
  closeBtn.addEventListener('click', () => closeModal('loginModal'));
  
  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('loginModal');
    openModal('signupModal');
  });
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
  });
}

// Function to create signup modal content
function createSignupModalContent() {
  const signupModal = document.getElementById('signupModal');
  if (!signupModal || signupModal.querySelector('.modal-content')) return;
  
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
  
  signupModal.appendChild(modalContent);
  
  // Add event listeners
  const closeBtn = modalContent.querySelector('.close-modal');
  const switchToLogin = modalContent.querySelector('.switch-to-login');
  const signupForm = modalContent.querySelector('#signupForm');
  
  closeBtn.addEventListener('click', () => closeModal('signupModal'));
  
  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('signupModal');
    openModal('loginModal');
  });
  
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSignup();
  });
}

// Function to handle login form submission
async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // For this example, we'll use a simple authentication
  // In a real application, you would use a secure API
  try {
    const { login } = await import('../utils/auth.js');
    
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    // Attempt login
    const user = await login(email, password);
    
    // Success - close modal and reload page
    closeModal('loginModal');
    window.location.reload();
    
  } catch (error) {
    // Display error message
    alert(error.message || 'Login failed. Please try again.');
    
    // Reset button
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
  }
}

// Function to handle signup form submission
async function handleSignup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  // Check if passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }
  
  // For this example, we'll use a simple registration
  // In a real application, you would use a secure API
  try {
    const { register } = await import('../utils/auth.js');
    
    // Show loading state
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    // Attempt registration
    const user = await register(name, email, password);
    
    // Success - close modal and reload page
    closeModal('signupModal');
    window.location.reload();
    
  } catch (error) {
    // Display error message
    alert(error.message || 'Registration failed. Please try again.');
    
    // Reset button
    const submitBtn = document.querySelector('#signupForm button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign Up';
  }
}

// Function to update UI for logged-in user
function updateUIForLoggedInUser(user) {
  // Get the auth buttons container
  const authButtons = document.querySelector('.auth-buttons');
  
  if (!authButtons) {
    console.error('Auth buttons container not found');
    return;
  }
  
  console.log('Updating UI for user:', user);
  
  // Replace login/signup buttons with user menu
  authButtons.innerHTML = `
    <div class="user-menu">
      <div class="user-avatar">
        <img src="${user.avatar || '/public/images/default-avatar.png'}" alt="${user.name}">
      </div>
      <span class="user-name">${user.name}</span>
      <div class="dropdown-menu">
        <a href="/html/profile.html" class="dropdown-item">My Profile</a>
        <a href="/html/upload.html" class="dropdown-item">Upload Work</a>
        <a href="#" class="dropdown-item logout-btn">Log Out</a>
      </div>
    </div>
  `;
  
  // Add dropdown toggle behavior
  const userMenu = authButtons.querySelector('.user-menu');
  if (userMenu) {
    userMenu.addEventListener('click', (e) => {
      userMenu.classList.toggle('active');
      e.stopPropagation();
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
      
      // Clear user data
      localStorage.removeItem('cys_user');
      localStorage.removeItem('cys_auth_token');
      
      // Reload page to update UI
      window.location.reload();
    });
  }
}



document.addEventListener('DOMContentLoaded', () => {
  // If you have this function defined elsewhere
  initModals();       // This initializes your login/signup modals
  // Any other initialization functions can go here...
});
