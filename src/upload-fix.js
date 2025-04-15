// Add this function to your profile-fix.js file or create a new upload-fix.js file

// Fix for upload functionality
function fixUploadFunctionality() {
    console.log('Fixing upload functionality');
    
    // Only run on upload page
    if (!window.location.pathname.includes('upload.html')) return;
    
    const uploadForm = document.getElementById('uploadForm');
    if (!uploadForm) return;
    
    // Check if user is logged in
    let currentUser = null;
    try {
      const userJson = localStorage.getItem('cys_user');
      if (userJson) {
        currentUser = JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    if (!currentUser) {
      // Show login required message
      const uploadContainer = document.querySelector('.upload-container');
      if (uploadContainer) {
        uploadContainer.innerHTML = `
          <div class="login-required">
            <h2>Login Required</h2>
            <p>You need to be logged in to upload content.</p>
            <div class="login-buttons">
              <button class="primary-btn login-btn">Log In</button>
              <button class="secondary-btn signup-btn">Sign Up</button>
            </div>
          </div>
        `;
        
        // Add event listeners to buttons
        const loginBtn = uploadContainer.querySelector('.login-btn');
        const signupBtn = uploadContainer.querySelector('.signup-btn');
        
        if (loginBtn) {
          loginBtn.addEventListener('click', () => {
            const loginModal = document.getElementById('loginModal');
            if (loginModal) loginModal.classList.add('active');
          });
        }
        
        if (signupBtn) {
          signupBtn.addEventListener('click', () => {
            const signupModal = document.getElementById('signupModal');
            if (signupModal) signupModal.classList.add('active');
          });
        }
      }
      return;
    }
    
    // Initialize tags array
    let tagsArray = [];
    
    // Add event listener for tag input
    const tagInput = document.getElementById('tagInput');
    const tagContainer = document.getElementById('tagContainer');
    
    if (tagInput && tagContainer) {
      // Add tag on Enter key
      tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addTag();
        }
      });
      
      // Add tag on blur
      tagInput.addEventListener('blur', () => {
        if (tagInput.value.trim()) {
          addTag();
        }
      });
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
      
      // Create tag element
      const tagElement = document.createElement('div');
      tagElement.className = 'tag-item';
      tagElement.innerHTML = `
        ${tag}
        <span class="tag-remove">&times;</span>
      `;
      
      // Add remove event listener
      const removeBtn = tagElement.querySelector('.tag-remove');
      removeBtn.addEventListener('click', () => {
        // Remove from array
        tagsArray = tagsArray.filter(t => t !== tag);
        // Remove element
        tagElement.remove();
      });
      
      // Add to container
      tagContainer.insertBefore(tagElement, tagInput);
      
      // Clear input
      tagInput.value = '';
    }
    
    // Add event listener for file input
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    
    if (fileInput && previewContainer && previewPlaceholder) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          // Hide placeholder
          previewPlaceholder.style.display = 'none';
          
          // Remove existing preview
          const existingImg = previewContainer.querySelector('img');
          if (existingImg) existingImg.remove();
          
          // Create preview
          const img = document.createElement('img');
          img.src = URL.createObjectURL(fileInput.files[0]);
          previewContainer.appendChild(img);
        }
      });
    }
    
    // Add form submit handler
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Form submitted');
      
      // Get form values
      const titleInput = document.getElementById('workTitle');
      const descriptionInput = document.getElementById('workDescription');
      const categorySelect = document.getElementById('workCategory');
      
      if (!titleInput || !descriptionInput || !categorySelect) {
        console.error('Form fields not found');
        return;
      }
      
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      const category = categorySelect.value;
      
      // Validate form
      if (!title || !description || category === 'select') {
        alert('Please fill out all fields');
        return;
      }
      
      if (tagsArray.length === 0) {
        alert('Please add at least one tag');
        return;
      }
      
      // Create portfolio item
      const portfolioItem = {
        id: 'portfolio_' + Date.now(),
        userId: currentUser.id,
        creator: currentUser.name,
        title: title,
        description: description,
        category: category,
        tags: tagsArray,
        imageUrl: fileInput.files && fileInput.files[0] 
          ? 'https://picsum.photos/600/400?random=' + Math.floor(Math.random() * 100) 
          : 'https://picsum.photos/600/400?random=42',
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      
      console.log('Saving portfolio item:', portfolioItem);
      
      // Get existing portfolios
      let portfolios = [];
      try {
        const portfoliosJson = localStorage.getItem('cys_portfolios');
        if (portfoliosJson) {
          portfolios = JSON.parse(portfoliosJson);
        }
      } catch (error) {
        console.error('Error parsing portfolios:', error);
      }
      
      // Add new portfolio
      portfolios.push(portfolioItem);
      
      // Save to localStorage
      localStorage.setItem('cys_portfolios', JSON.stringify(portfolios));
      
      // Show success message
      alert('Your work has been published successfully!');
      
      // Redirect to profile page
      window.location.href = '/html/profile.html';
    });
    
    // Add cancel button handler
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel? Your changes will be lost.')) {
          window.location.href = '/html/profile.html';
        }
      });
    }
  }
  
  // Run the fix function
  document.addEventListener('DOMContentLoaded', fixUploadFunctionality);
  // Also try to run it immediately in case DOM is already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    fixUploadFunctionality();
  }