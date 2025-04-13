// Profile page functionality

import { fetchData, getItem } from '../utils/api.js';
import { getCurrentUser } from '../utils/auth.js';

// Default export function to initialize profile page
export default function initializeProfilePage() {
  // Get user ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  
  // If no ID in URL, check if current user is logged in
  let currentUser = null;
  let isCurrentUserProfile = false;
  
  if (!userId) {
    currentUser = getCurrentUser();
    
    if (currentUser) {
      // This is the current user's profile
      isCurrentUserProfile = true;
      loadUserProfile(currentUser.id);
    } else {
      // No user ID and not logged in, redirect to home
      window.location.href = '/';
    }
  } else {
    // Load the profile of the user with the specified ID
    loadUserProfile(userId);
  }
  
  // Initialize tabs
  initTabs();
  
  // Function to load user profile
  async function loadUserProfile(id) {
    try {
      let user;
      
      if (isCurrentUserProfile && currentUser) {
        // Use current user data if available
        user = currentUser;
      } else {
        // Fetch user data
        const users = await fetchData('/public/data/users.json');
        user = users.find(u => u.id === id);
        
        if (!user) {
          displayErrorMessage('User not found');
          return;
        }
      }
      
      // Display user profile
      displayUserProfile(user);
      
      // Load user's portfolios
      loadUserPortfolios(id);
      
    } catch (error) {
      console.error('Error loading user profile:', error);
      displayErrorMessage('Failed to load profile. Please try again later.');
    }
  }
  
  // Function to display user profile
  function displayUserProfile(user) {
    const profileContainer = document.querySelector('.profile-container');
    
    if (!profileContainer) return;
    
    // Format roles/skills
    const roleOrExpertise = user.role === 'mentor' ? 
      `Mentor (${user.expertise ? user.expertise.join(', ') : ''})` : 
      `Creator (${user.skills ? user.skills.join(', ') : ''})`;
    
    // Update profile content
    profileContainer.innerHTML = `
      <img src="${user.avatar || '/public/images/default-avatar.png'}" alt="${user.name}" class="profile-avatar">
      <div class="profile-info">
        <h1>${user.name}</h1>
        <p class="profile-role">${roleOrExpertise}</p>
        <p class="profile-bio">${user.bio || 'No bio available'}</p>
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-value" id="portfolioCount">0</div>
            <div class="stat-label">Works</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="likesCount">0</div>
            <div class="stat-label">Likes</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="commentsCount">0</div>
            <div class="stat-label">Comments</div>
          </div>
        </div>
        <div class="profile-social">
          ${generateSocialLinks(user.socialLinks)}
        </div>
        ${isCurrentUserProfile ? '<button class="secondary-btn edit-profile-btn">Edit Profile</button>' : ''}
      </div>
    `;
    
    // Add event listener for edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', openEditProfileModal);
    }
  }
  
  // Function to generate social media links
  function generateSocialLinks(socialLinks) {
    if (!socialLinks) return '';
    
    let linksHtml = '';
    
    // Map of social media platforms to icon classes (in a real app, you'd use proper icons)
    const platformIcons = {
      instagram: 'instagram-icon',
      twitter: 'twitter-icon',
      behance: 'behance-icon',
      youtube: 'youtube-icon',
      soundcloud: 'soundcloud-icon',
      spotify: 'spotify-icon',
      website: 'website-icon',
      medium: 'medium-icon',
      tiktok: 'tiktok-icon'
    };
    
    for (const [platform, username] of Object.entries(socialLinks)) {
      const iconClass = platformIcons[platform] || 'link-icon';
      linksHtml += `<a href="#" class="social-link ${iconClass}" title="${platform}"></a>`;
    }
    
    return linksHtml;
  }
  
  // Function to load user portfolios
  async function loadUserPortfolios(userId) {
    try {
      // Fetch portfolios
      const portfolios = await fetchData('/public/data/portfolios.json');
      
      // Filter portfolios by user ID
      const userPortfolios = portfolios.filter(p => p.userId === userId);
      
      // Update portfolio count
      const portfolioCountElement = document.getElementById('portfolioCount');
      if (portfolioCountElement) {
        portfolioCountElement.textContent = userPortfolios.length;
      }
      
      // Calculate total likes and comments
      const totalLikes = userPortfolios.reduce((sum, p) => sum + (p.likes || 0), 0);
      const totalComments = userPortfolios.reduce((sum, p) => sum + (p.comments ? p.comments.length : 0), 0);
      
      // Update likes and comments counts
      const likesCountElement = document.getElementById('likesCount');
      const commentsCountElement = document.getElementById('commentsCount');
      
      if (likesCountElement) likesCountElement.textContent = totalLikes;
      if (commentsCountElement) commentsCountElement.textContent = totalComments;
      
      // Display portfolios in the portfolio tab
      displayPortfolios(userPortfolios);
      
    } catch (error) {
      console.error('Error loading user portfolios:', error);
    }
  }
  
  // Function to display portfolios
  function displayPortfolios(portfolios) {
    const portfolioTab = document.getElementById('portfolioTab');
    
    if (!portfolioTab) return;
    
    if (portfolios.length === 0) {
      portfolioTab.innerHTML = `
        <div class="empty-state">
          <p>No works have been added yet.</p>
          ${isCurrentUserProfile ? '<a href="/html/upload.html" class="primary-btn">Add Your First Work</a>' : ''}
        </div>
      `;
      return;
    }
    
    // Create portfolio grid
    const portfolioGrid = document.createElement('div');
    portfolioGrid.className = 'portfolio-grid';
    
    // Add portfolio items
    portfolios.forEach(portfolio => {
      const portfolioItem = createPortfolioItem(portfolio);
      portfolioGrid.appendChild(portfolioItem);
    });
    
    // Clear tab content and add portfolio grid
    portfolioTab.innerHTML = '';
    portfolioTab.appendChild(portfolioGrid);
    
    // Add "Add New Work" button if current user's profile
    if (isCurrentUserProfile) {
      const addNewButton = document.createElement('div');
      addNewButton.className = 'add-new-container';
      addNewButton.innerHTML = `<a href="/html/upload.html" class="primary-btn">Add New Work</a>`;
      portfolioTab.appendChild(addNewButton);
    }
  }
  
  // Function to create portfolio item
  function createPortfolioItem(portfolio) {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    item.dataset.id = portfolio.id;
    
    // Format date
    const createdDate = new Date(portfolio.createdAt);
    const formattedDate = createdDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Build item HTML
    item.innerHTML = `
      <div class="portfolio-content">
        <img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="portfolio-image">
        <div class="portfolio-info">
          <h3 class="portfolio-title">${portfolio.title}</h3>
          <p class="portfolio-category">${portfolio.category}</p>
          <div class="portfolio-tags">
            ${portfolio.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <p class="portfolio-date">Posted on ${formattedDate}</p>
          <div class="portfolio-stats">
            <span class="likes-count"><i class="heart-icon"></i> ${portfolio.likes}</span>
            <span class="comments-count"><i class="comment-icon"></i> ${portfolio.comments ? portfolio.comments.length : 0}</span>
          </div>
          ${isCurrentUserProfile ? `
            <div class="portfolio-actions">
              <button class="edit-portfolio-btn" data-id="${portfolio.id}">Edit</button>
              <button class="delete-portfolio-btn" data-id="${portfolio.id}">Delete</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Add click event to view portfolio
    item.addEventListener('click', (e) => {
      // Don't navigate if clicking on action buttons
      if (e.target.closest('.portfolio-actions')) {
        return;
      }
      
      window.location.href = `/html/portfolio.html?id=${portfolio.id}`;
    });
    
    // Add event listeners for action buttons if current user's profile
    if (isCurrentUserProfile) {
      const editBtn = item.querySelector('.edit-portfolio-btn');
      const deleteBtn = item.querySelector('.delete-portfolio-btn');
      
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent navigation
          window.location.href = `/html/upload.html?edit=${portfolio.id}`;
        });
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent navigation
          confirmDeletePortfolio(portfolio.id, portfolio.title);
        });
      }
    }
    
    return item;
  }
  
  // Function to confirm portfolio deletion
  function confirmDeletePortfolio(portfolioId, portfolioTitle) {
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'modal confirm-modal active';
    
    confirmDialog.innerHTML = `
      <div class="modal-content">
        <h2>Delete Work</h2>
        <p>Are you sure you want to delete "${portfolioTitle}"? This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="secondary-btn cancel-btn">Cancel</button>
          <button class="danger-btn confirm-btn">Delete</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmDialog);
    
    // Add event listeners
    const cancelBtn = confirmDialog.querySelector('.cancel-btn');
    const confirmBtn = confirmDialog.querySelector('.confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
      confirmDialog.remove();
    });
    
    confirmBtn.addEventListener('click', () => {
      // Delete portfolio (in a real app, this would call your API)
      deletePortfolio(portfolioId);
      confirmDialog.remove();
    });
    
    // Close when clicking outside
    confirmDialog.addEventListener('click', (e) => {
      if (e.target === confirmDialog) {
        confirmDialog.remove();
      }
    });
  }
  
  // Function to delete portfolio
  async function deletePortfolio(portfolioId) {
    try {
      // In a real app, this would be an API call
      // For this example, we'll just simulate deletion
      
      // Show loading state
      const loadingToast = showToast('Deleting work...', 'loading');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove loading toast
      loadingToast.remove();
      
      // Show success message
      showToast('Work deleted successfully', 'success', 3000);
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      showToast('Failed to delete work', 'error', 3000);
    }
  }
  
  // Function to open edit profile modal
  function openEditProfileModal() {
    // Get current user data
    const user = getCurrentUser();
    
    if (!user) {
      showToast('You must be logged in to edit your profile', 'error', 3000);
      return;
    }
    
    // Create modal
    const editProfileModal = document.createElement('div');
    editProfileModal.className = 'modal edit-profile-modal active';
    
    // Skills/expertise fields based on user role
    const skillsField = user.role === 'mentor' ? 
      `
        <div class="form-group">
          <label for="userExpertise">Areas of Expertise (comma-separated)</label>
          <input type="text" id="userExpertise" value="${user.expertise ? user.expertise.join(', ') : ''}">
        </div>
      ` : 
      `
        <div class="form-group">
          <label for="userSkills">Skills (comma-separated)</label>
          <input type="text" id="userSkills" value="${user.skills ? user.skills.join(', ') : ''}">
        </div>
      `;
    
    // Social links fields
    const socialLinks = user.socialLinks || {};
    const socialLinksFields = `
      <h3>Social Media Links</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="instagram">Instagram</label>
          <input type="text" id="instagram" value="${socialLinks.instagram || ''}">
        </div>
        <div class="form-group">
          <label for="twitter">Twitter</label>
          <input type="text" id="twitter" value="${socialLinks.twitter || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="website">Website</label>
          <input type="text" id="website" value="${socialLinks.website || ''}">
        </div>
        <div class="form-group">
          <label for="other">Other Platform</label>
          <input type="text" id="other" value="${socialLinks.other || ''}">
        </div>
      </div>
    `;
    
    // Build modal content
    editProfileModal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <h2>Edit Profile</h2>
        <form id="editProfileForm">
          <div class="avatar-upload">
            <img src="${user.avatar || '/public/images/default-avatar.png'}" alt="${user.name}" class="preview-avatar">
            <button type="button" class="secondary-btn">Change Avatar</button>
            <input type="file" id="avatarInput" accept="image/*" style="display: none;">
          </div>
          
          <div class="form-group">
            <label for="userName">Name</label>
            <input type="text" id="userName" value="${user.name}" required>
          </div>
          
          <div class="form-group">
            <label for="userBio">Bio</label>
            <textarea id="userBio" rows="4">${user.bio || ''}</textarea>
          </div>
          
          ${skillsField}
          
          ${socialLinksFields}
          
          <div class="form-actions">
            <button type="button" class="secondary-btn cancel-btn">Cancel</button>
            <button type="submit" class="primary-btn">Save Changes</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(editProfileModal);
    
    // Add event listeners
    const closeBtn = editProfileModal.querySelector('.close-modal');
    const cancelBtn = editProfileModal.querySelector('.cancel-btn');
    const form = editProfileModal.querySelector('#editProfileForm');
    const avatarBtn = editProfileModal.querySelector('.avatar-upload .secondary-btn');
    const avatarInput = editProfileModal.querySelector('#avatarInput');
    
    // Close modal handlers
    const closeModal = () => editProfileModal.remove();
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close when clicking outside
    editProfileModal.addEventListener('click', (e) => {
      if (e.target === editProfileModal) {
        closeModal();
      }
    });
    
    // Avatar upload handler
    avatarBtn.addEventListener('click', () => {
      avatarInput.click();
    });
    
    avatarInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewAvatar = editProfileModal.querySelector('.preview-avatar');
          previewAvatar.src = e.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
    
    // Form submission handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      updateUserProfile(editProfileModal);
    });
  }
  
  // Function to update user profile
  function updateUserProfile(modal) {
    try {
      // Get current user
      let user = getCurrentUser();
      
      if (!user) {
        showToast('You must be logged in to update your profile', 'error', 3000);
        return;
      }
      
      // Get form values
      const name = modal.querySelector('#userName').value;
      const bio = modal.querySelector('#userBio').value;
      
      // Get skills or expertise based on user role
      let skills = [];
      let expertise = [];
      
      if (user.role === 'mentor') {
        const expertiseInput = modal.querySelector('#userExpertise').value;
        expertise = expertiseInput.split(',').map(item => item.trim()).filter(Boolean);
      } else {
        const skillsInput = modal.querySelector('#userSkills').value;
        skills = skillsInput.split(',').map(item => item.trim()).filter(Boolean);
      }
      
      // Get social links
      const socialLinks = {
        instagram: modal.querySelector('#instagram').value.trim(),
        twitter: modal.querySelector('#twitter').value.trim(),
        website: modal.querySelector('#website').value.trim(),
        other: modal.querySelector('#other').value.trim()
      };
      
      // Filter out empty social links
      Object.keys(socialLinks).forEach(key => {
        if (!socialLinks[key]) delete socialLinks[key];
      });
      
      // Get avatar
      const avatarPreview = modal.querySelector('.preview-avatar');
      const newAvatar = avatarPreview.src !== user.avatar ? avatarPreview.src : user.avatar;
      
      // Update user object
      const updatedUser = {
        ...user,
        name,
        bio,
        avatar: newAvatar,
        socialLinks
      };
      
      // Add skills or expertise based on role
      if (user.role === 'mentor') {
        updatedUser.expertise = expertise;
      } else {
        updatedUser.skills = skills;
      }
      
      // In a real app, this would be an API call
      // For this example, we'll just update local storage
      
      // Show loading state
      const loadingToast = showToast('Updating profile...', 'loading');
      
      // Simulate API call
      setTimeout(() => {
        // Save updated user to local storage
        localStorage.setItem('cys_user', JSON.stringify(updatedUser));
        
        // Remove loading toast
        loadingToast.remove();
        
        // Show success message
        showToast('Profile updated successfully', 'success', 3000);
        
        // Close modal
        modal.remove();
        
        // Refresh page to show updated profile
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error', 3000);
    }
  }
  
  // Function to initialize tabs
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  // Function to display error message
  function displayErrorMessage(message) {
    const profileSection = document.querySelector('.profile-section');
    
    if (profileSection) {
      profileSection.innerHTML = `
        <div class="container">
          <div class="error-message">
            <p>${message}</p>
            <a href="/" class="primary-btn">Go Home</a>
          </div>
        </div>
      `;
    }
  }
  
  // Function to show toast notification
  function showToast(message, type = 'info', duration = 0) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}-toast`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto remove after duration if specified
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, duration);
    }
    
    return toast;
  }
  
  // Return public methods
  return {
    refreshProfile: () => loadUserProfile(userId || currentUser.id)
  };
}