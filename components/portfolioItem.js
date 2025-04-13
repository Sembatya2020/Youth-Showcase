// Portfolio Item Component

import { getCurrentUser } from '../utils/auth.js';
import { updateData } from '../utils/api.js';

/**
 * Create a portfolio item element
 * @param {Object} portfolio - The portfolio data
 * @param {Object} options - Options for customizing the portfolio item
 * @param {boolean} options.isDetailed - Whether to show detailed view
 * @param {boolean} options.showActions - Whether to show action buttons
 * @returns {HTMLElement} The created portfolio item element
 */
export function createPortfolioItem(portfolio, options = {}) {
  const { isDetailed = false, showActions = false } = options;
  
  // Create portfolio item container
  const portfolioItem = document.createElement('div');
  portfolioItem.className = 'portfolio-item';
  portfolioItem.dataset.id = portfolio.id;
  
  // Get current user
  const currentUser = getCurrentUser();
  const isOwner = currentUser && currentUser.id === portfolio.userId;
  
  // Format date
  const createdDate = new Date(portfolio.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Generate appropriate content preview based on category
  let contentPreview = generateContentPreview(portfolio, isDetailed);
  
  // Generate tags HTML
  const tagsHtml = portfolio.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  
  // Generate base HTML structure
  portfolioItem.innerHTML = `
    <div class="portfolio-content">
      ${contentPreview}
      <div class="portfolio-info">
        <h3 class="portfolio-title">${portfolio.title}</h3>
        <p class="portfolio-creator">By <a href="/html/profile.html?id=${portfolio.userId}" class="creator-link">${portfolio.creator}</a></p>
        <p class="portfolio-category">${portfolio.category}</p>
        ${isDetailed ? `<p class="portfolio-description">${portfolio.description}</p>` : ''}
        
        <div class="portfolio-tags">
          ${tagsHtml}
        </div>
        
        <p class="portfolio-date">Posted on ${formattedDate}</p>
        
        <div class="portfolio-interactions">
          <button class="like-button ${portfolio.isLiked ? 'liked' : ''}" data-id="${portfolio.id}">
            <i class="heart-icon"></i> <span class="like-count">${portfolio.likes || 0}</span>
          </button>
          
          <button class="comment-button" data-id="${portfolio.id}">
            <i class="comment-icon"></i> <span class="comment-count">${portfolio.comments ? portfolio.comments.length : 0}</span>
          </button>
          
          <button class="share-button" data-id="${portfolio.id}">
            <i class="share-icon"></i>
          </button>
        </div>
        
        ${showActions && isOwner ? `
          <div class="portfolio-actions">
            <button class="edit-button" data-id="${portfolio.id}">Edit</button>
            <button class="delete-button" data-id="${portfolio.id}">Delete</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  // Add event listeners
  addEventListeners(portfolioItem, portfolio);
  
  return portfolioItem;
}

/**
 * Generate content preview based on portfolio category
 * @param {Object} portfolio - The portfolio data
 * @param {boolean} isDetailed - Whether to show detailed view
 * @returns {string} HTML for the content preview
 */
function generateContentPreview(portfolio, isDetailed) {
  const imageSize = isDetailed ? 'portfolio-image-large' : 'portfolio-image';
  
  switch (portfolio.category) {
    case 'Visual Art':
      return `<img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="${imageSize}">`;
      
    case 'Music':
      return `
        <div class="portfolio-media-container">
          <img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="${imageSize}">
          <div class="audio-overlay">
            <button class="play-audio-btn" data-audio="${portfolio.audioUrl}">
              <i class="play-icon"></i>
            </button>
          </div>
        </div>
      `;
      
    case 'Writing':
      if (isDetailed) {
        return `
          <div class="writing-content">
            ${portfolio.content || '<p class="placeholder-text">Content not available</p>'}
          </div>
        `;
      } else {
        return `
          <div class="portfolio-text-preview">
            <p>${portfolio.content ? portfolio.content.substring(0, 150) + '...' : 'Click to read'}</p>
          </div>
        `;
      }
      
    case 'Film':
    case 'Performance':
      return `
        <div class="portfolio-media-container">
          <img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="${imageSize}">
          <div class="video-overlay">
            <button class="play-video-btn" data-video="${portfolio.videoUrl}">
              <i class="play-icon"></i>
            </button>
          </div>
        </div>
      `;
      
    default:
      return `<img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="${imageSize}">`;
  }
}

/**
 * Add event listeners to portfolio item
 * @param {HTMLElement} itemElement - The portfolio item element
 * @param {Object} portfolio - The portfolio data
 */
function addEventListeners(itemElement, portfolio) {
  // Get elements
  const likeButton = itemElement.querySelector('.like-button');
  const commentButton = itemElement.querySelector('.comment-button');
  const shareButton = itemElement.querySelector('.share-button');
  const editButton = itemElement.querySelector('.edit-button');
  const deleteButton = itemElement.querySelector('.delete-button');
  const creatorLink = itemElement.querySelector('.creator-link');
  const audioButton = itemElement.querySelector('.play-audio-btn');
  const videoButton = itemElement.querySelector('.play-video-btn');
  
  // Add click handler for the whole item (navigation to detail page)
  itemElement.addEventListener('click', (e) => {
    // Don't navigate if clicking on buttons or links
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    
    window.location.href = `/html/portfolio.html?id=${portfolio.id}`;
  });
  
  // Stop propagation for creator link to allow navigation
  if (creatorLink) {
    creatorLink.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Like button handler
  if (likeButton) {
    likeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      handleLikeToggle(likeButton, portfolio);
    });
  }
  
  // Comment button handler
  if (commentButton) {
    commentButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `/html/portfolio.html?id=${portfolio.id}&showComments=true`;
    });
  }
  
  // Share button handler
  if (shareButton) {
    shareButton.addEventListener('click', (e) => {
      e.stopPropagation();
      handleShare(portfolio);
    });
  }
  
  // Edit button handler
  if (editButton) {
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `/html/upload.html?edit=${portfolio.id}`;
    });
  }
  
  // Delete button handler
  if (deleteButton) {
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDelete(portfolio);
    });
  }
  
  // Audio play button handler
  if (audioButton) {
    audioButton.addEventListener('click', (e) => {
      e.stopPropagation();
      playAudio(audioButton.dataset.audio, portfolio.title);
    });
  }
  
  // Video play button handler
  if (videoButton) {
    videoButton.addEventListener('click', (e) => {
      e.stopPropagation();
      playVideo(videoButton.dataset.video, portfolio.title);
    });
  }
}

/**
 * Handle like button toggle
 * @param {HTMLElement} likeButton - The like button element
 * @param {Object} portfolio - The portfolio data
 */
async function handleLikeToggle(likeButton, portfolio) {
  try {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      showLoginRequiredMessage('like this work');
      return;
    }
    
    // Toggle like state
    const isLiked = likeButton.classList.contains('liked');
    const likeCountElement = likeButton.querySelector('.like-count');
    const currentLikes = parseInt(likeCountElement.textContent);
    
    // Update UI immediately for responsive feel
    if (isLiked) {
      likeButton.classList.remove('liked');
      likeCountElement.textContent = currentLikes - 1;
    } else {
      likeButton.classList.add('liked');
      likeCountElement.textContent = currentLikes + 1;
    }
    
    // In a real app, this would be an API call
    // For this demo, we'll update the portfolio in localStorage
    const updatedLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update portfolio data
    await updateData('/public/data/portfolios.json', portfolio.id, {
      likes: updatedLikes,
      isLiked: !isLiked
    });
    
  } catch (error) {
    console.error('Error toggling like:', error);
    
    // Revert UI changes on error
    const isLiked = likeButton.classList.contains('liked');
    const likeCountElement = likeButton.querySelector('.like-count');
    const currentLikes = parseInt(likeCountElement.textContent);
    
    if (isLiked) {
      likeButton.classList.remove('liked');
      likeCountElement.textContent = currentLikes - 1;
    } else {
      likeButton.classList.add('liked');
      likeCountElement.textContent = currentLikes + 1;
    }
    
    showToast('Failed to update like. Please try again.', 'error');
  }
}

/**
 * Handle share button click
 * @param {Object} portfolio - The portfolio data
 */
function handleShare(portfolio) {
  // Create share modal
  const shareModal = document.createElement('div');
  shareModal.className = 'modal share-modal active';
  
  // Create share URL
  const shareUrl = `${window.location.origin}/html/portfolio.html?id=${portfolio.id}`;
  
  // Generate modal content
  shareModal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2>Share this Work</h2>
      
      <div class="share-options">
        <button class="share-option" data-platform="facebook">
          <i class="facebook-icon"></i> Facebook
        </button>
        <button class="share-option" data-platform="twitter">
          <i class="twitter-icon"></i> Twitter
        </button>
        <button class="share-option" data-platform="pinterest">
          <i class="pinterest-icon"></i> Pinterest
        </button>
        <button class="share-option" data-platform="email">
          <i class="email-icon"></i> Email
        </button>
      </div>
      
      <div class="share-link">
        <p>Or copy this link:</p>
        <div class="copy-link-container">
          <input type="text" value="${shareUrl}" readonly>
          <button class="copy-link-btn">Copy</button>
        </div>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(shareModal);
  
  // Add event listeners
  const closeBtn = shareModal.querySelector('.close-modal');
  const shareOptions = shareModal.querySelectorAll('.share-option');
  const copyLinkBtn = shareModal.querySelector('.copy-link-btn');
  const linkInput = shareModal.querySelector('input');
  
  // Close modal
  closeBtn.addEventListener('click', () => {
    shareModal.remove();
  });
  
  // Close when clicking outside
  shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
      shareModal.remove();
    }
  });
  
  // Share options
  shareOptions.forEach(option => {
    option.addEventListener('click', () => {
      const platform = option.dataset.platform;
      
      // In a real app, this would open a share dialog
      // For this demo, we'll just show an alert
      alert(`This would share on ${platform} in a real application.`);
      
      // Close modal
      shareModal.remove();
    });
  });
  
  // Copy link
  copyLinkBtn.addEventListener('click', () => {
    linkInput.select();
    document.execCommand('copy');
    
    // Update button text
    const originalText = copyLinkBtn.textContent;
    copyLinkBtn.textContent = 'Copied!';
    
    // Reset after 2 seconds
    setTimeout(() => {
      copyLinkBtn.textContent = originalText;
    }, 2000);
  });
}

/**
 * Handle delete button click
 * @param {Object} portfolio - The portfolio data
 */
function handleDelete(portfolio) {
  // Create confirmation modal
  const confirmModal = document.createElement('div');
  confirmModal.className = 'modal confirm-modal active';
  
  confirmModal.innerHTML = `
    <div class="modal-content">
      <h2>Delete Work</h2>
      <p>Are you sure you want to delete "${portfolio.title}"?</p>
      <p>This action cannot be undone.</p>
      
      <div class="modal-actions">
        <button class="secondary-btn cancel-btn">Cancel</button>
        <button class="danger-btn confirm-btn">Delete</button>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(confirmModal);
  
  // Add event listeners
  const cancelBtn = confirmModal.querySelector('.cancel-btn');
  const confirmBtn = confirmModal.querySelector('.confirm-btn');
  
  // Cancel button
  cancelBtn.addEventListener('click', () => {
    confirmModal.remove();
  });
  
  // Close when clicking outside
  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
      confirmModal.remove();
    }
  });
  
  // Confirm button
  confirmBtn.addEventListener('click', async () => {
    try {
      // Show loading
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Deleting...';
      
      // In a real app, this would be an API call
      // For this demo, we'll just simulate deletion
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal
      confirmModal.remove();
      
      // Show success message
      showToast('Work deleted successfully', 'success');
      
      // Remove the portfolio item from the DOM
      const portfolioItem = document.querySelector(`.portfolio-item[data-id="${portfolio.id}"]`);
      if (portfolioItem) {
        portfolioItem.remove();
      }
      
      // If on portfolio detail page, redirect to profile
      if (window.location.pathname.includes('portfolio.html')) {
        window.location.href = '/html/profile.html';
      }
      
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      confirmModal.remove();
      showToast('Failed to delete work. Please try again.', 'error');
    }
  });
}

/**
 * Play audio in a modal
 * @param {string} audioUrl - URL of the audio file
 * @param {string} title - Title of the work
 */
function playAudio(audioUrl, title) {
  // Create audio player modal
  const audioModal = document.createElement('div');
  audioModal.className = 'modal audio-modal active';
  
  audioModal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2>${title}</h2>
      <div class="audio-player">
        <audio controls src="${audioUrl}"></audio>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(audioModal);
  
  // Auto play audio
  const audio = audioModal.querySelector('audio');
  audio.play();
  
  // Add event listeners
  const closeBtn = audioModal.querySelector('.close-modal');
  
  // Close modal
  closeBtn.addEventListener('click', () => {
    audio.pause();
    audioModal.remove();
  });
  
  // Close when clicking outside
  audioModal.addEventListener('click', (e) => {
    if (e.target === audioModal) {
      audio.pause();
      audioModal.remove();
    }
  });
}

/**
 * Play video in a modal
 * @param {string} videoUrl - URL of the video file
 * @param {string} title - Title of the work
 */
function playVideo(videoUrl, title) {
  // Create video player modal
  const videoModal = document.createElement('div');
  videoModal.className = 'modal video-modal active';
  
  videoModal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2>${title}</h2>
      <div class="video-player">
        <video controls src="${videoUrl}"></video>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(videoModal);
  
  // Auto play video
  const video = videoModal.querySelector('video');
  video.play();
  
  // Add event listeners
  const closeBtn = videoModal.querySelector('.close-modal');
  
  // Close modal
  closeBtn.addEventListener('click', () => {
    video.pause();
    videoModal.remove();
  });
  
  // Close when clicking outside
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      video.pause();
      videoModal.remove();
    }
  });
}

/**
 * Show login required message
 * @param {string} action - The action requiring login
 */
function showLoginRequiredMessage(action) {
  // Create login modal
  const loginModal = document.createElement('div');
  loginModal.className = 'modal login-required-modal active';
  
  loginModal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <h2>Login Required</h2>
      <p>You need to be logged in to ${action}.</p>
      
      <div class="modal-actions">
        <button class="primary-btn login-btn">Log In</button>
        <button class="secondary-btn signup-btn">Sign Up</button>
      </div>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(loginModal);
  
  // Add event listeners
  const closeBtn = loginModal.querySelector('.close-modal');
  const loginBtn = loginModal.querySelector('.login-btn');
  const signupBtn = loginModal.querySelector('.signup-btn');
  
  // Close modal
  closeBtn.addEventListener('click', () => {
    loginModal.remove();
  });
  
  // Close when clicking outside
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.remove();
    }
  });
  
  // Login button
  loginBtn.addEventListener('click', () => {
    loginModal.remove();
    
    // Open login modal
    const mainLoginModal = document.getElementById('loginModal');
    if (mainLoginModal) {
      mainLoginModal.classList.add('active');
    } else {
      window.location.href = '/?login=true';
    }
  });
  
  // Signup button
  signupBtn.addEventListener('click', () => {
    loginModal.remove();
    
    // Open signup modal
    const mainSignupModal = document.getElementById('signupModal');
    if (mainSignupModal) {
      mainSignupModal.classList.add('active');
    } else {
      window.location.href = '/?signup=true';
    }
  });
}

/**
 * Show toast notification
 * @param {string} message - The message to show
 * @param {string} type - The type of toast (success, error, info)
 */
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}-toast`;
  toast.textContent = message;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Show toast (with animation)
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}