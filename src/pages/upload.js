// Upload page functionality

import { fetchData, postData, updateData, getItem } from '../utils/api.js';
import { getCurrentUser } from '../utils/auth.js';

// Default export function to initialize upload page
export default function initializeUploadPage() {
  // Check if user is logged in
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    // Redirect to login if not logged in
    showLoginRequired();
    return;
  }
  
  // Variables
  let isEditing = false;
  let portfolioId = null;
  let fileToUpload = null;
  let tagsArray = [];
  
  // DOM elements
  const uploadForm = document.getElementById('uploadForm');
  const titleInput = document.getElementById('workTitle');
  const descriptionInput = document.getElementById('workDescription');
  const categorySelect = document.getElementById('workCategory');
  const tagInput = document.getElementById('tagInput');
  const tagContainer = document.getElementById('tagContainer');
  const fileInput = document.getElementById('fileInput');
  const previewContainer = document.getElementById('previewContainer');
  const previewPlaceholder = document.getElementById('previewPlaceholder');
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  // Check if editing existing portfolio item
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('edit')) {
    portfolioId = urlParams.get('edit');
    isEditing = true;
    loadPortfolioForEditing(portfolioId);
    document.querySelector('.page-header h1').textContent = 'Edit Your Work';
    submitBtn.textContent = 'Update Work';
  }
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Function to load portfolio for editing
  async function loadPortfolioForEditing(id) {
    try {
      const portfolio = await getItem('/public/data/portfolios.json', id);
      
      // Check if portfolio belongs to current user
      if (portfolio.userId !== currentUser.id) {
        showError('You do not have permission to edit this work');
        return;
      }
      
      // Populate form fields
      titleInput.value = portfolio.title;
      descriptionInput.value = portfolio.description;
      categorySelect.value = portfolio.category;
      
      // Load tags
      tagsArray = [...portfolio.tags];
      renderTags();
      
      // Show preview image
      if (portfolio.imageUrl) {
        previewPlaceholder.style.display = 'none';
        const previewImg = document.createElement('img');
        previewImg.src = portfolio.imageUrl;
        previewImg.alt = portfolio.title;
        previewContainer.appendChild(previewImg);
      }
      
    } catch (error) {
      console.error('Error loading portfolio for editing:', error);
      showError('Could not load the work for editing. Please try again.');
    }
  }
  
  // Function to initialize event listeners
  function initializeEventListeners() {
    // Form submission
    if (uploadForm) {
      uploadForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Cancel button
    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Confirm cancellation
        if (confirm('Are you sure you want to cancel? Your changes will not be saved.')) {
          window.location.href = isEditing ? `/html/portfolio.html?id=${portfolioId}` : '/html/explore.html';
        }
      });
    }
    
    // Tag input
    if (tagInput) {
      // Add tag on Enter key
      tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addTag();
        }
      });
      
      // Add tag on blur (when input loses focus)
      tagInput.addEventListener('blur', addTag);
      
      // Add focus/blur styling to container
      tagInput.addEventListener('focus', () => {
        tagContainer.classList.add('focused');
      });
      
      tagInput.addEventListener('blur', () => {
        tagContainer.classList.remove('focused');
      });
    }
    
    // File input
    if (fileInput) {
      fileInput.addEventListener('change', handleFileSelection);
    }
  }
  
  // Function to handle form submission
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Create or update portfolio object
    const portfolioData = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      category: categorySelect.value,
      tags: tagsArray,
      userId: currentUser.id,
      creator: currentUser.name,
      createdAt: new Date().toISOString()
    };
    
    // Add file data (in a real app, this would be handled by file upload API)
    if (fileToUpload) {
      // This is a simplified placeholder for file upload
      // In a real app, you would upload the file to a server
      portfolioData.imageUrl = URL.createObjectURL(fileToUpload);
    } else if (isEditing) {
      // Keep existing image URL if editing and no new file selected
      const existingPortfolio = await getItem('/public/data/portfolios.json', portfolioId);
      portfolioData.imageUrl = existingPortfolio.imageUrl;
    } else {
      // Placeholder image for demo
      portfolioData.imageUrl = '/public/images/placeholder.jpg';
    }
    
    try {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = isEditing ? 'Updating...' : 'Publishing...';
      
      // Create or update portfolio
      let result;
      
      if (isEditing) {
        // Update existing portfolio
        result = await updateData('/public/data/portfolios.json', portfolioId, portfolioData);
      } else {
        // Create new portfolio
        result = await postData('/public/data/portfolios.json', portfolioData);
      }
      
      // Show success message
      showSuccess(isEditing ? 'Work updated successfully!' : 'Work published successfully!');
      
      // Redirect to portfolio page
      setTimeout(() => {
        window.location.href = `/html/portfolio.html?id=${result.id}`;
      }, 1500);
      
    } catch (error) {
      console.error('Error saving work:', error);
      showError('Failed to save your work. Please try again.');
      
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = isEditing ? 'Update Work' : 'Publish Work';
    }
  }
  
  // Function to validate form
  function validateForm() {
    // Clear previous error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());
    
    let isValid = true;
    
    // Validate title
    if (!titleInput.value.trim()) {
      showFieldError(titleInput, 'Please enter a title for your work');
      isValid = false;
    }
    
    // Validate description
    if (!descriptionInput.value.trim()) {
      showFieldError(descriptionInput, 'Please enter a description for your work');
      isValid = false;
    }
    
    // Validate category
    if (!categorySelect.value || categorySelect.value === 'select') {
      showFieldError(categorySelect, 'Please select a category for your work');
      isValid = false;
    }
    
    // Validate tags
    if (tagsArray.length === 0) {
      showFieldError(tagContainer, 'Please add at least one tag for your work');
      isValid = false;
    }
    
    // Validate file (only required for new uploads)
    if (!isEditing && !fileToUpload) {
      showFieldError(previewContainer, 'Please upload an image for your work');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Function to show field error
  function showFieldError(element, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    element.parentNode.appendChild(errorElement);
    element.classList.add('error');
  }
  
  // Function to handle file selection
  function handleFileSelection(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showError('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }
    
    // Store file for upload
    fileToUpload = file;
    
    // Show preview
    previewPlaceholder.style.display = 'none';
    
    // Clear existing preview
    const existingPreview = previewContainer.querySelector('img');
    if (existingPreview) {
      existingPreview.remove();
    }
    
    // Create preview image
    const previewImg = document.createElement('img');
    previewImg.src = URL.createObjectURL(file);
    previewImg.onload = () => {
      URL.revokeObjectURL(previewImg.src); // Free memory
    };
    previewContainer.appendChild(previewImg);
  }
  
  // Function to add a tag
  function addTag() {
    const tag = tagInput.value.trim();
    
    if (!tag) return;
    
    // Check if tag already exists
    if (tagsArray.includes(tag)) {
      tagInput.value = '';
      return;
    }
    
    // Add tag to array
    tagsArray.push(tag);
    
    // Clear input
    tagInput.value = '';
    
    // Render tags
    renderTags();
  }
  
  // Function to render tags
  function renderTags() {
    // Clear existing tags except input
    const existingTags = tagContainer.querySelectorAll('.tag-item');
    existingTags.forEach(tag => tag.remove());
    
    // Create and append tag elements
    tagsArray.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.className = 'tag-item';
      tagElement.innerHTML = `
        ${tag}
        <span class="tag-remove">&times;</span>
      `;
      
      // Add remove event
      const removeBtn = tagElement.querySelector('.tag-remove');
      removeBtn.addEventListener('click', () => removeTag(tag));
      
      // Insert before the input
      tagContainer.insertBefore(tagElement, tagInput);
    });
  }
  
  // Function to remove a tag
  function removeTag(tagToRemove) {
    tagsArray = tagsArray.filter(tag => tag !== tagToRemove);
    renderTags();
  }
  
  // Function to show login required message
  function showLoginRequired() {
    const uploadSection = document.querySelector('.upload-section');
    
    if (uploadSection) {
      uploadSection.innerHTML = `
        <div class="container">
          <div class="login-required">
            <h2>Login Required</h2>
            <p>You need to be logged in to upload your creative work.</p>
            <button class="primary-btn login-btn">Log In</button>
            <button class="secondary-btn signup-btn">Sign Up</button>
          </div>
        </div>
      `;
      
      // Add event listeners for login/signup buttons
      const loginBtn = uploadSection.querySelector('.login-btn');
      const signupBtn = uploadSection.querySelector('.signup-btn');
      
      if (loginBtn) {
        loginBtn.addEventListener('click', () => {
          // Open login modal
          const loginModal = document.getElementById('loginModal');
          if (loginModal && typeof openModal === 'function') {
            openModal('loginModal');
          } else {
            window.location.href = '/?login=true';
          }
        });
      }
      
      if (signupBtn) {
        signupBtn.addEventListener('click', () => {
          // Open signup modal
          const signupModal = document.getElementById('signupModal');
          if (signupModal && typeof openModal === 'function') {
            openModal('signupModal');
          } else {
            window.location.href = '/?signup=true';
          }
        });
      }
    }
  }
  
  // Function to show error message
  function showError(message) {
    const errorToast = document.createElement('div');
    errorToast.className = 'toast error-toast';
    errorToast.textContent = message;
    
    document.body.appendChild(errorToast);
    
    // Show toast
    setTimeout(() => {
      errorToast.classList.add('show');
    }, 10);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      errorToast.classList.remove('show');
      setTimeout(() => {
        errorToast.remove();
      }, 300);
    }, 3000);
  }
  
  // Function to show success message
  function showSuccess(message) {
    const successToast = document.createElement('div');
    successToast.className = 'toast success-toast';
    successToast.textContent = message;
    
    document.body.appendChild(successToast);
    
    // Show toast
    setTimeout(() => {
      successToast.classList.add('show');
    }, 10);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      successToast.classList.remove('show');
      setTimeout(() => {
        successToast.remove();
      }, 300);
    }, 3000);
  }
  
  // Return public methods
  return {
    addTag,
    validateForm
  };
}