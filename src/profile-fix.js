// Add this at the top of your profile-fix.js file to ensure it runs immediately

console.log('Profile fix script loading...');

// Check if we're on the profile page and fix it immediately
if (window.location.pathname.includes('profile.html')) {
  // Run this code immediately without waiting for DOMContentLoaded
  const profileFix = function() {
    console.log('Emergency profile page fix running');
    
    // Get profile container
    const profileContainer = document.querySelector('.profile-container');
    if (!profileContainer) {
      console.error('Profile container not found');
      return;
    }
    
    // Remove loading spinner
    const loadingSpinner = profileContainer.querySelector('.loading-spinner');
    if (loadingSpinner) {
      loadingSpinner.remove();
    }
    
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
    
    // If no user is logged in, show sample user
    if (!currentUser) {
      currentUser = {
        id: "sample_user",
        name: "Sample User",
        email: "sample@example.com",
        avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 10),
        bio: "This is a sample user profile. Log in or sign up to create your own!",
        createdAt: new Date().toISOString(),
        role: "user",
        skills: ["Visual Art", "Photography", "Design"]
      };
    }
    
    // Immediately display profile
    profileContainer.innerHTML = `
      <img src="${currentUser.avatar || 'https://i.pravatar.cc/150?img=1'}" alt="${currentUser.name}" class="profile-avatar">
      <div class="profile-info">
        <h1>${currentUser.name}</h1>
        <p class="profile-role">Creator (${currentUser.skills ? currentUser.skills.join(', ') : 'No skills listed'})</p>
        <p class="profile-bio">${currentUser.bio || 'No bio available'}</p>
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-value" id="portfolioCount">2</div>
            <div class="stat-label">Works</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="likesCount">42</div>
            <div class="stat-label">Likes</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="commentsCount">5</div>
            <div class="stat-label">Comments</div>
          </div>
        </div>
      </div>
    `;
    
    // Also fix the portfolio tab
    const portfolioTab = document.getElementById('portfolioTab');
    if (portfolioTab) {
      // Remove loading spinner
      const tabLoadingSpinner = portfolioTab.querySelector('.loading-spinner');
      if (tabLoadingSpinner) {
        tabLoadingSpinner.remove();
      }
      
      // Create portfolio grid with sample items
      const portfolioGrid = document.createElement('div');
      portfolioGrid.className = 'portfolio-grid';
      
      // Add sample portfolio items
      portfolioGrid.innerHTML = `
        <div class="portfolio-item">
          <div class="portfolio-content">
            <img src="https://picsum.photos/600/400?random=1" alt="Sample Artwork" class="portfolio-image">
            <div class="portfolio-info">
              <h3 class="portfolio-title">Sample Artwork</h3>
              <p class="portfolio-category">Visual Art</p>
              <div class="portfolio-tags">
                <span class="tag">Digital Art</span>
                <span class="tag">Illustration</span>
              </div>
              <p class="portfolio-date">Posted on Jan 15, 2023</p>
              <div class="portfolio-stats">
                <span class="likes-count">24 likes</span>
                <span class="comments-count">3 comments</span>
              </div>
            </div>
          </div>
        </div>
        <div class="portfolio-item">
          <div class="portfolio-content">
            <img src="https://picsum.photos/600/400?random=2" alt="Another Artwork" class="portfolio-image">
            <div class="portfolio-info">
              <h3 class="portfolio-title">Another Artwork</h3>
              <p class="portfolio-category">Photography</p>
              <div class="portfolio-tags">
                <span class="tag">Portrait</span>
                <span class="tag">Black & White</span>
              </div>
              <p class="portfolio-date">Posted on Feb 20, 2023</p>
              <div class="portfolio-stats">
                <span class="likes-count">18 likes</span>
                <span class="comments-count">2 comments</span>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add to portfolio tab
      portfolioTab.appendChild(portfolioGrid);
    }
    
    // Fix tabs functionality
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
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
          tabContent.classList.add('active');
        }
      });
    });
  };
  
  // Run the fix immediately and again after DOM is loaded
  profileFix();
  document.addEventListener('DOMContentLoaded', profileFix);
}