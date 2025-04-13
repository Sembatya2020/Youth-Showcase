// Explore page functionality

import { fetchData } from '../utils/api.js';
import { getFromLocalStorage, saveToLocalStorage } from '../utils/storage.js';

// Default export function to initialize explore page
export default function initializeExplorePage() {
  // Initialize variables
  let portfolios = [];
  let filteredPortfolios = [];
  let currentFilters = {
    category: 'all',
    tags: [],
    search: ''
  };

  // DOM elements
  const portfolioGrid = document.querySelector('.portfolio-grid');
  const categoryFilters = document.querySelector('.category-filters');
  const tagFilters = document.querySelector('.tag-filters');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  // Load portfolios
  async function loadPortfolios() {
    try {
      // Try to get from localStorage first
      let cachedPortfolios = getFromLocalStorage('portfolios');
      
      if (!cachedPortfolios) {
        // If not in localStorage, fetch from API/JSON
        portfolios = await fetchData('/public/data/portfolios.json');
        saveToLocalStorage('portfolios', portfolios);
      } else {
        portfolios = cachedPortfolios;
      }
      
      // Initialize filters
      initializeFilters();
      
      // Apply initial filtering
      applyFilters();
      
    } catch (error) {
      console.error('Error loading portfolios:', error);
      displayErrorMessage('Failed to load content. Please try again later.');
    }
  }

  // Initialize filter options
  function initializeFilters() {
    // Extract unique categories
    const categories = ['all', ...new Set(portfolios.map(p => p.category))];
    
    // Extract unique tags
    const tags = [...new Set(portfolios.flatMap(p => p.tags))];
    
    // Populate category filters
    if (categoryFilters) {
      categoryFilters.innerHTML = '';
      
      categories.forEach(category => {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'category-filter';
        filterBtn.dataset.category = category;
        filterBtn.textContent = category === 'all' ? 'All Categories' : category;
        
        // Set active class on 'all' by default
        if (category === 'all') {
          filterBtn.classList.add('active');
        }
        
        // Add click event listener
        filterBtn.addEventListener('click', () => {
          // Update active state
          document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
          });
          filterBtn.classList.add('active');
          
          // Update current filters
          currentFilters.category = category;
          
          // Apply filters
          applyFilters();
        });
        
        categoryFilters.appendChild(filterBtn);
      });
    }
    
    // Populate tag filters
    if (tagFilters) {
      tagFilters.innerHTML = '';
      
      tags.forEach(tag => {
        const tagBtn = document.createElement('button');
        tagBtn.className = 'tag-filter';
        tagBtn.dataset.tag = tag;
        tagBtn.textContent = tag;
        
        // Add click event listener
        tagBtn.addEventListener('click', () => {
          // Toggle active state
          tagBtn.classList.toggle('active');
          
          // Update current filters
          if (tagBtn.classList.contains('active')) {
            currentFilters.tags.push(tag);
          } else {
            currentFilters.tags = currentFilters.tags.filter(t => t !== tag);
          }
          
          // Apply filters
          applyFilters();
        });
        
        tagFilters.appendChild(tagBtn);
      });
    }
    
    // Initialize search input
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        currentFilters.search = searchInput.value.trim().toLowerCase();
        applyFilters();
      });
    }
    
    // Initialize sort select
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        applyFilters();
      });
    }
  }

  // Apply filters and display results
  function applyFilters() {
    // Filter portfolios based on current filters
    filteredPortfolios = portfolios.filter(portfolio => {
      // Filter by category
      if (currentFilters.category !== 'all' && portfolio.category !== currentFilters.category) {
        return false;
      }
      
      // Filter by tags
      if (currentFilters.tags.length > 0) {
        const hasMatchingTag = currentFilters.tags.some(tag => portfolio.tags.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }
      
      // Filter by search
      if (currentFilters.search) {
        const searchText = currentFilters.search.toLowerCase();
        const matchesSearch = 
          portfolio.title.toLowerCase().includes(searchText) ||
          portfolio.description.toLowerCase().includes(searchText) ||
          portfolio.creator.toLowerCase().includes(searchText);
          
        if (!matchesSearch) {
          return false;
        }
      }
      
      return true;
    });
    
    // Sort filtered portfolios
    if (sortSelect) {
      const sortOption = sortSelect.value;
      
      switch (sortOption) {
        case 'newest':
          filteredPortfolios.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          filteredPortfolios.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'popular':
          filteredPortfolios.sort((a, b) => b.likes - a.likes);
          break;
        case 'az':
          filteredPortfolios.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'za':
          filteredPortfolios.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }
    }
    
    // Display filtered portfolios
    displayPortfolios(filteredPortfolios);
    
    // Update result count
    updateResultCount(filteredPortfolios.length);
  }

  // Display portfolios in the grid
  function displayPortfolios(portfoliosToDisplay) {
    if (!portfolioGrid) return;
    
    // Clear existing content
    portfolioGrid.innerHTML = '';
    
    if (portfoliosToDisplay.length === 0) {
      // Display no results message
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <p>No results found. Try adjusting your filters.</p>
      `;
      portfolioGrid.appendChild(noResults);
      return;
    }
    
    // Create and append portfolio items
    portfoliosToDisplay.forEach(portfolio => {
      const portfolioItem = createPortfolioItem(portfolio);
      portfolioGrid.appendChild(portfolioItem);
    });
  }

  // Create a portfolio item element
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
    
    // Generate HTML based on portfolio category/type
    let contentPreview = '';
    
    switch (portfolio.category) {
      case 'Visual Art':
        contentPreview = `<img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="portfolio-image">`;
        break;
      case 'Music':
        contentPreview = `
          <div class="portfolio-image-container">
            <img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="portfolio-image">
            <div class="audio-overlay">
              <button class="play-btn" data-audio="${portfolio.audioUrl}">
                <i class="play-icon"></i>
              </button>
            </div>
          </div>
        `;
        break;
      case 'Writing':
        contentPreview = `
          <div class="portfolio-text-preview">
            <p>${portfolio.content.substring(0, 150)}...</p>
          </div>
        `;
        break;
      case 'Film':
      case 'Performance':
        contentPreview = `
          <div class="portfolio-image-container">
            <img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="portfolio-image">
            <div class="video-overlay">
              <button class="play-btn" data-video="${portfolio.videoUrl}">
                <i class="play-icon"></i>
              </button>
            </div>
          </div>
        `;
        break;
      default:
        contentPreview = `<img src="${portfolio.imageUrl}" alt="${portfolio.title}" class="portfolio-image">`;
    }
    
    // Build item HTML
    item.innerHTML = `
      <div class="portfolio-content">
        ${contentPreview}
        <div class="portfolio-info">
          <h3 class="portfolio-title">${portfolio.title}</h3>
          <p class="portfolio-creator">By ${portfolio.creator}</p>
          <p class="portfolio-category">${portfolio.category}</p>
          <div class="portfolio-tags">
            ${portfolio.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <p class="portfolio-date">Posted on ${formattedDate}</p>
          <div class="portfolio-stats">
            <span class="likes-count"><i class="heart-icon"></i> ${portfolio.likes}</span>
            <span class="comments-count"><i class="comment-icon"></i> ${portfolio.comments ? portfolio.comments.length : 0}</span>
          </div>
        </div>
      </div>
    `;
    
    // Add click event to view the portfolio details
    item.addEventListener('click', () => {
      // Navigate to portfolio detail page
      window.location.href = `/html/portfolio.html?id=${portfolio.id}`;
    });
    
    // Add event listeners for media playback buttons
    const playBtn = item.querySelector('.play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent navigation when clicking play button
        
        if (playBtn.dataset.audio) {
          playAudio(playBtn.dataset.audio);
        } else if (playBtn.dataset.video) {
          openVideoPlayer(playBtn.dataset.video, portfolio.title);
        }
      });
    }
    
    return item;
  }

  // Update result count
  function updateResultCount(count) {
    const resultCount = document.querySelector('.result-count');
    if (resultCount) {
      resultCount.textContent = `${count} ${count === 1 ? 'result' : 'results'} found`;
    }
  }

  // Play audio function
  function playAudio(audioUrl) {
    // Create audio player modal
    const audioPlayerModal = document.createElement('div');
    audioPlayerModal.className = 'modal audio-player-modal active';
    
    audioPlayerModal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <audio controls autoplay src="${audioUrl}"></audio>
      </div>
    `;
    
    document.body.appendChild(audioPlayerModal);
    
    // Add event listener to close modal
    const closeBtn = audioPlayerModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      audioPlayerModal.remove();
    });
    
    // Close modal when clicking outside content
    audioPlayerModal.addEventListener('click', (e) => {
      if (e.target === audioPlayerModal) {
        audioPlayerModal.remove();
      }
    });
  }

  // Open video player function
  function openVideoPlayer(videoUrl, title) {
    // Create video player modal
    const videoPlayerModal = document.createElement('div');
    videoPlayerModal.className = 'modal video-player-modal active';
    
    videoPlayerModal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <h3>${title}</h3>
        <video controls autoplay src="${videoUrl}"></video>
      </div>
    `;
    
    document.body.appendChild(videoPlayerModal);
    
    // Add event listener to close modal
    const closeBtn = videoPlayerModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      videoPlayerModal.remove();
    });
    
    // Close modal when clicking outside content
    videoPlayerModal.addEventListener('click', (e) => {
      if (e.target === videoPlayerModal) {
        videoPlayerModal.remove();
      }
    });
  }

  // Display error message
  function displayErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    if (portfolioGrid) {
      portfolioGrid.innerHTML = '';
      portfolioGrid.appendChild(errorElement);
    }
  }

  // Initialize page
  loadPortfolios();

  // Return public methods
  return {
    refreshPortfolios: loadPortfolios,
    applyFilters
  };
}