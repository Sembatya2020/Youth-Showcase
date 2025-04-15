// Create a new file called portfolio-connection-fix.js

// This script ensures uploaded content shows up on the profile
(function() {
    console.log("Portfolio connection fix running");
    
    // Run this on both pages
    const currentPage = window.location.pathname;
    
    // For the upload page: Make sure data is properly saved
    if (currentPage.includes('upload.html')) {
      fixUploadSaving();
    }
    
    // For the profile page: Make sure data is properly loaded
    if (currentPage.includes('profile.html')) {
      fixProfileLoading();
    }
    
    // Fix upload saving functionality
    function fixUploadSaving() {
      console.log("Fixing upload saving...");
      const uploadForm = document.getElementById('uploadForm');
      
      if (!uploadForm) return;
      
      // Override the form submission
      uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Form submit intercepted");
        
        // Get current user
        const userJson = localStorage.getItem('cys_user');
        if (!userJson) {
          alert("You must be logged in to upload work");
          return;
        }
        
        const currentUser = JSON.parse(userJson);
        
        // Get form values
        const title = document.getElementById('workTitle').value;
        const description = document.getElementById('workDescription').value;
        const category = document.getElementById('workCategory').value;
        
        // Get tags (this is a simplified approach)
        const tagElements = document.querySelectorAll('.tag-item');
        const tags = Array.from(tagElements).map(el => el.textContent.trim());
        
        // Create a new portfolio item
        const newPortfolio = {
          id: 'portfolio_' + Date.now(),
          userId: currentUser.id,
          creator: currentUser.name,
          title: title,
          description: description,
          category: category,
          tags: tags.length > 0 ? tags : ["Sample"], // Fallback tags
          // Generate a random image URL as a placeholder
          imageUrl: 'https://picsum.photos/600/400?random=' + Math.floor(Math.random() * 1000),
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: []
        };
        
        // Save to localStorage - first get existing portfolios
        let portfolios = [];
        try {
          const portfoliosJson = localStorage.getItem('cys_portfolios');
          if (portfoliosJson) {
            portfolios = JSON.parse(portfoliosJson);
          }
        } catch (error) {
          console.error("Error parsing portfolios:", error);
        }
        
        // Add new item and save back
        portfolios.push(newPortfolio);
        localStorage.setItem('cys_portfolios', JSON.stringify(portfolios));
        
        // Show confirmation
        alert("Your work has been uploaded successfully!");
        
        // Force redirect to profile page
        window.location.href = "/html/profile.html";
      }, true); // Use capturing to ensure this runs first
    }
    
    // Fix profile loading functionality
    function fixProfileLoading() {
      console.log("Fixing profile loading...");
      
      // Wait a moment to ensure other scripts have run
      setTimeout(() => {
        // Get current user
        const userJson = localStorage.getItem('cys_user');
        if (!userJson) {
          console.log("No user logged in");
          return;
        }
        
        const currentUser = JSON.parse(userJson);
        
        // Get portfolios
        let portfolios = [];
        try {
          const portfoliosJson = localStorage.getItem('cys_portfolios');
          if (portfoliosJson) {
            portfolios = JSON.parse(portfoliosJson);
          }
        } catch (error) {
          console.error("Error parsing portfolios:", error);
        }
        
        // Filter for this user's portfolios
        const userPortfolios = portfolios.filter(p => p.userId === currentUser.id);
        console.log(`Found ${userPortfolios.length} portfolios for user ${currentUser.id}`);
        
        // Check if portfolio tab is empty or still showing loading
        const portfolioTab = document.getElementById('portfolioTab');
        const loadingSpinner = portfolioTab?.querySelector('.loading-spinner');
        
        if (loadingSpinner) {
          console.log("Removing loading spinner");
          loadingSpinner.remove();
        }
        
        // Check if portfolio grid exists
        let portfolioGrid = portfolioTab?.querySelector('.portfolio-grid');
        
        // If no grid, create one
        if (!portfolioGrid) {
          console.log("Creating portfolio grid");
          portfolioGrid = document.createElement('div');
          portfolioGrid.className = 'portfolio-grid';
          portfolioTab.appendChild(portfolioGrid);
        }
        
        // If user has portfolios, display them
        if (userPortfolios.length > 0) {
          console.log("Displaying user portfolios");
          
          // Clear existing items first
          portfolioGrid.innerHTML = '';
          
          // Add each portfolio item
          userPortfolios.forEach(portfolio => {
            const item = createPortfolioItem(portfolio);
            portfolioGrid.appendChild(item);
          });
          
          // Update counts in profile stats
          const portfolioCount = document.getElementById('portfolioCount');
          if (portfolioCount) {
            portfolioCount.textContent = userPortfolios.length;
          }
        } else {
          // No portfolios, show empty state
          console.log("No portfolios found");
          portfolioGrid.innerHTML = `
            <div class="empty-state">
              <p>You haven't uploaded any work yet.</p>
              <a href="/html/upload.html" class="primary-btn">Upload Your First Work</a>
            </div>
          `;
        }
      }, 500);
    }
    
    // Helper function to create portfolio item element
    function createPortfolioItem(portfolio) {
      const item = document.createElement('div');
      item.className = 'portfolio-item';
      
      // Format date
      const date = new Date(portfolio.createdAt);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
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
              <span class="likes-count">${portfolio.likes || 0} likes</span>
              <span class="comments-count">${portfolio.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>
      `;
      
      return item;
    }
  })();