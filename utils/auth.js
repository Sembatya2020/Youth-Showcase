// Authentication utilities

// Constants
const AUTH_TOKEN_KEY = 'cys_auth_token';
const USER_KEY = 'cys_user';

// Initialize authentication
export function initAuth() {
  // Check if user is already logged in
  const token = getAuthToken();
  
  if (token) {
    // Validate token (in a real app, this would verify with server)
    // For now, we'll just check if it exists
    return true;
  }
  
  return false;
}

// Check login status
export function checkLoginStatus() {
  const user = getCurrentUser();
  const token = getAuthToken();
  
  if (user && token) {
    // Update UI for logged-in user
    updateUIForLoggedInUser(user);
    return true;
  }
  
  return false;
}

// Update UI for logged-in user
function updateUIForLoggedInUser(user) {
  const authButtons = document.querySelector('.auth-buttons');
  
  if (authButtons) {
    authButtons.innerHTML = `
      <div class="user-menu">
        <div class="user-avatar">
          <img src="${user.avatar || '/public/images/default-avatar.png'}" alt="${user.name}">
        </div>
        <span class="user-name">${user.name}</span>
        <div class="dropdown-menu">
          <a href="/html/profile.html">My Profile</a>
          <a href="/html/upload.html">Upload Work</a>
          <a href="#" id="logoutBtn">Log Out</a>
        </div>
      </div>
    `;
    
    // Add event listener for logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        window.location.reload();
      });
    }
    
    // Add event listener for dropdown toggle
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
      userMenu.addEventListener('click', () => {
        userMenu.classList.toggle('active');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) {
          userMenu.classList.remove('active');
        }
      });
    }
  }
}

// Login function
export async function login(email, password) {
  try {
    // In a real app, this would be an API call
    // For this example, we'll use simulated login
    
    // Get users from local JSON (in real app, this would be an API call)
    const response = await fetch('/public/data/users.json');
    const users = await response.json();
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, we would properly verify password
    // For this example, we'll simulate it
    // NEVER do password comparison like this in a real app
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    // Create fake JWT token
    const token = `fake_jwt_token_${Date.now()}`;
    
    // Save token and user to local storage
    saveAuthToken(token);
    saveCurrentUser(user);
    
    return user;
  } catch (error) {
    throw error;
  }
}

// Register function
export async function register(name, email, password) {
  try {
    // In a real app, this would be an API call
    // For this example, we'll use simulated registration
    
    // Get users from local JSON
    const response = await fetch('/public/data/users.json');
    const users = await response.json();
    
    // Check if user with email already exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In a real app, this would be hashed
      avatar: null,
      bio: '',
      createdAt: new Date().toISOString()
    };
    
    // In a real app, we would save this to database
    // For this example, we'll just simulate it
    
    // Create fake JWT token
    const token = `fake_jwt_token_${Date.now()}`;
    
    // Save token and user to local storage
    saveAuthToken(token);
    saveCurrentUser(newUser);
    
    return newUser;
  } catch (error) {
    throw error;
  }
}

// Logout function
export function logout() {
  // Clear auth token and user from local storage
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Get auth token from local storage
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Save auth token to local storage
function saveAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

// Get current user from local storage
export function getCurrentUser() {
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// Save current user to local storage
function saveCurrentUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}