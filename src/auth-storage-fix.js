// Improved Auth Fix with Proper Storage
// Add this script tag to your HTML pages to fix login/signup functionality

document.addEventListener('DOMContentLoaded', () => {
    // Get auth buttons and modals
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      updateUIForLoggedInUser(currentUser);
    }
    
    // Add event listeners to buttons
    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', () => {
        // Create login modal content if it doesn't exist
        if (!loginModal.querySelector('.modal-content')) {
          createLoginModalContent();
        }
        // Show the modal
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    }
    
    if (signupBtn && signupModal) {
      signupBtn.addEventListener('click', () => {
        // Create signup modal content if it doesn't exist
        if (!signupModal.querySelector('.modal-content')) {
          createSignupModalContent();
        }
        // Show the modal
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
    }
    
    // Create login modal content
    function createLoginModalContent() {
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
          <div class="form-error" style="display: none; color: red; margin-bottom: 10px;"></div>
          <button type="submit" class="primary-btn">Log In</button>
        </form>
        <p class="form-footer">Don't have an account? <a href="#" class="switch-to-signup">Sign Up</a></p>
      `;
      
      loginModal.appendChild(modalContent);
      
      // Add event listeners
      const closeBtn = modalContent.querySelector('.close-modal');
      const switchToSignup = modalContent.querySelector('.switch-to-signup');
      const loginForm = modalContent.querySelector('#loginForm');
      
      closeBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
      });
      
      // Close when clicking outside
      loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
          loginModal.classList.remove('active');
          document.body.style.overflow = ''; // Restore scrolling
        }
      });
      
      switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
      });
      
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
      });
    }
    
    // Create signup modal content
    function createSignupModalContent() {
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
          <div class="form-error" style="display: none; color: red; margin-bottom: 10px;"></div>
          <button type="submit" class="primary-btn">Sign Up</button>
        </form>
        <p class="form-footer">Already have an account? <a href="#" class="switch-to-login">Log In</a></p>
      `;
      
      signupModal.appendChild(modalContent);
      
      // Add event listeners
      const closeBtn = modalContent.querySelector('.close-modal');
      const switchToLogin = modalContent.querySelector('.switch-to-login');
      const signupForm = modalContent.querySelector('#signupForm');
      
      closeBtn.addEventListener('click', () => {
        signupModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
      });
      
      // Close when clicking outside
      signupModal.addEventListener('click', (e) => {
        if (e.target === signupModal) {
          signupModal.classList.remove('active');
          document.body.style.overflow = ''; // Restore scrolling
        }
      });
      
      switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
      });
      
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignup();
      });
    }
    
    // Get current user from localStorage
    function getCurrentUser() {
      try {
        const userJson = localStorage.getItem('cys_user');
        return userJson ? JSON.parse(userJson) : null;
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    }
    
    // Update UI for logged in user
    function updateUIForLoggedInUser(user) {
      const authButtons = document.querySelector('.auth-buttons');
      
      if (!authButtons) return;
      
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
          
          // Clear user data from localStorage
          localStorage.removeItem('cys_user');
          localStorage.removeItem('cys_auth_token');
          
          // Reload page to update UI
          window.location.reload();
        });
      }
    }
    
    // Handle login submission
    async function handleLogin() {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorElement = document.querySelector('#loginForm .form-error');
      
      if (errorElement) {
        errorElement.style.display = 'none';
      }
      
      if (!email || !password) {
        showFormError('loginForm', 'Please fill in all fields');
        return;
      }
      
      try {
        // Show loading state
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        // Get users from localStorage
        let users = getStoredUsers();
        
        // Find user with matching email
        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // Check password (this is not secure, just for demo purposes)
        if (user.password !== password) {
          throw new Error('Invalid password');
        }
        
        // Create a copy without the password to store in session
        const { password: _, ...userWithoutPassword } = user;
        
        // Save user info and token to localStorage
        localStorage.setItem('cys_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('cys_auth_token', `token_${Date.now()}`);
        
        // Close modal
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update UI or reload page
        updateUIForLoggedInUser(userWithoutPassword);
        
      } catch (error) {
        console.error('Login error:', error);
        showFormError('loginForm', error.message || 'Login failed. Please try again.');
        
        // Reset button
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
      }
    }
    
    // Handle signup submission
    async function handleSignup() {
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      
      if (!name || !email || !password || !confirmPassword) {
        showFormError('signupForm', 'Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        showFormError('signupForm', 'Passwords do not match');
        return;
      }
      
      try {
        // Show loading state
        const submitBtn = document.querySelector('#signupForm button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        
        // Get existing users
        let users = getStoredUsers();
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
          throw new Error('Email already in use');
        }
        
        // Create new user
        const newUser = {
          id: `user_${Date.now()}`,
          name,
          email,
          password,
          createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save updated users array
        localStorage.setItem('cys_users', JSON.stringify(users));
        
        // Create a copy without the password to store in session
        const { password: _, ...userWithoutPassword } = newUser;
        
        // Save user to session
        localStorage.setItem('cys_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('cys_auth_token', `token_${Date.now()}`);
        
        // Close modal
        signupModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update UI or reload page
        updateUIForLoggedInUser(userWithoutPassword);
        
      } catch (error) {
        console.error('Signup error:', error);
        showFormError('signupForm', error.message || 'Signup failed. Please try again.');
        
        // Reset button
        const submitBtn = document.querySelector('#signupForm button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up';
      }
    }
    
    // Show form error message
    function showFormError(formId, message) {
      const errorElement = document.querySelector(`#${formId} .form-error`);
      
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      } else {
        // Fallback to alert if error element not found
        alert(message);
      }
    }
    
    // Get users from localStorage
    function getStoredUsers() {
      try {
        // Check localStorage for users
        const storedUsers = localStorage.getItem('cys_users');
        
        if (storedUsers) {
          return JSON.parse(storedUsers);
        }
        
        // If no users exist yet, initialize with demo user
        const initialUsers = [
          {
            id: 'user_1',
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'password123',
            createdAt: new Date().toISOString()
          }
        ];
        
        // Save initial users to localStorage
        localStorage.setItem('cys_users', JSON.stringify(initialUsers));
        
        return initialUsers;
      } catch (error) {
        console.error('Error getting stored users:', error);
        return [];
      }
    }
    
    // Add CSS styles for user dropdown and modal if not already present
    function addRequiredStyles() {
      if (!document.getElementById('auth-fix-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'auth-fix-styles';
        styleTag.textContent = `
          /* User Menu Styles */
          .user-menu {
            position: relative;
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 10px;
          }
          
          .user-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            border-radius: 5px;
            min-width: 180px;
            display: none;
            z-index: 100;
          }
          
          .user-menu.active .dropdown-menu {
            display: block;
          }
          
          .dropdown-item {
            display: block;
            padding: 10px 15px;
            color: #333;
            text-decoration: none;
          }
          
          .dropdown-item:hover {
            background-color: #f5f5f5;
          }
          
          /* Modal Styles (if not already present) */
          .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            justify-content: center;
            align-items: center;
          }
          
          .modal.active {
            display: flex;
          }
          
          .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 450px;
            position: relative;
          }
          
          .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
          }
        `;
        document.head.appendChild(styleTag);
      }
    }
    
    // Add required styles
    addRequiredStyles();
  });