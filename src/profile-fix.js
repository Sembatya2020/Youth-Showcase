// Add these functions to your existing profile-fix.js file

// Fix for home page buttons
function fixHomePageButtons() {
    console.log('Fixing home page buttons');
    
    // Only run on home page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      const getStartedBtn = document.querySelector('.hero-buttons .primary-btn');
      const learnMoreBtn = document.querySelector('.hero-buttons .secondary-btn');
      
      if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
          // Check if user is logged in
          const user = localStorage.getItem('cys_user');
          if (user) {
            // If logged in, go to upload page
            window.location.href = '/html/upload.html';
          } else {
            // If not logged in, open signup modal
            const signupModal = document.getElementById('signupModal');
            if (signupModal) signupModal.classList.add('active');
          }
        });
      }
      
      if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
          // Scroll to "How It Works" section
          const howItWorksSection = document.querySelector('.how-it-works');
          if (howItWorksSection) {
            howItWorksSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    }
  }
  
  // Fix for explore page
  function fixExplorePage() {
    console.log('Fixing explore page');
    
    // Only run on explore page
    if (window.location.pathname.includes('explore.html')) {
      const portfolioGrid = document.querySelector('.portfolio-grid');
      const loadingSpinner = document.querySelector('.loading-spinner');
      
      if (!portfolioGrid) return;
      
      // Get portfolios from localStorage
      let portfolios = [];
      const portfoliosJson = localStorage.getItem('cys_portfolios');
      
      if (portfoliosJson) {
        try {
          portfolios = JSON.parse(portfoliosJson);
        } catch (error) {
          console.error('Error parsing portfolios data:', error);
        }
      }
      
      // If no portfolios found, create sample data
      if (!portfolios || portfolios.length === 0) {
        createSampleData();
        const newPortfoliosJson = localStorage.getItem('cys_portfolios');
        if (newPortfoliosJson) {
          portfolios = JSON.parse(newPortfoliosJson);
        }
      }
      
      // Remove loading spinner
      if (loadingSpinner) {
        loadingSpinner.remove();
      }
      
      // Display portfolios
      portfolios.forEach(portfolio => {
        const portfolioItem = createPortfolioItem(portfolio);
        portfolioGrid.appendChild(portfolioItem);
      });
    }
  }
  
  // Fix for events page
  function fixEventsPage() {
    console.log('Fixing events page');
    
    // Only run on events page
    if (window.location.pathname.includes('events.html')) {
      const eventsGrid = document.querySelector('.events-grid');
      const loadingSpinner = document.querySelector('.loading-spinner');
      
      if (!eventsGrid) return;
      
      // Get events from localStorage
      let events = [];
      const eventsJson = localStorage.getItem('cys_events');
      
      if (eventsJson) {
        try {
          events = JSON.parse(eventsJson);
        } catch (error) {
          console.error('Error parsing events data:', error);
        }
      }
      
      // If no events found, create sample data
      if (!events || events.length === 0) {
        createSampleEvents();
        const newEventsJson = localStorage.getItem('cys_events');
        if (newEventsJson) {
          events = JSON.parse(newEventsJson);
        }
      }
      
      // Remove loading spinner
      if (loadingSpinner) {
        loadingSpinner.remove();
      }
      
      // Display events
      events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
      });
    }
  }
  
  // Create sample events data
  function createSampleEvents() {
    console.log('Creating sample events data');
    
    const sampleEvents = [
      {
        id: "event_1",
        title: "Digital Art Workshop",
        description: "Learn digital art techniques from professional artists.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: "Virtual Event - Zoom",
        category: "Workshop",
        tags: ["Digital Art", "Learning", "Virtual"],
        organizer: "Creative Arts Association",
        imageUrl: "https://picsum.photos/600/400?random=4",
        attendees: 15,
        maxAttendees: 50,
        isFeatured: true
      },
      {
        id: "event_2",
        title: "Youth Art Exhibition",
        description: "Showcase featuring artwork from talented young creators.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Community Art Gallery, 123 Main St",
        category: "Exhibition",
        tags: ["Exhibition", "Art", "Youth"],
        organizer: "Youth Art Foundation",
        imageUrl: "https://picsum.photos/600/400?random=5",
        attendees: 30,
        maxAttendees: 100,
        isFeatured: true
      },
      {
        id: "event_3",
        title: "Creative Writing Workshop",
        description: "Develop your writing skills with professional guidance.",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        location: "Public Library, Conference Room B",
        category: "Workshop",
        tags: ["Writing", "Workshop", "Learning"],
        organizer: "Writers Guild",
        imageUrl: "https://picsum.photos/600/400?random=6",
        attendees: 12,
        maxAttendees: 20,
        isFeatured: false
      }
    ];
    
    localStorage.setItem('cys_events', JSON.stringify(sampleEvents));
  }
  
  // Create event card element
  function createEventCard(event) {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    eventCard.innerHTML = `
      <img src="${event.imageUrl || 'https://picsum.photos/600/400?random=' + Math.floor(Math.random() * 100)}" alt="${event.title}" class="event-image">
      <div class="event-details">
        <span class="event-date">${formattedDate}, ${formattedTime}</span>
        <h3 class="event-title">${event.title}</h3>
        <p class="event-location">${event.location}</p>
        <p class="event-description">${event.description.substring(0, 120)}${event.description.length > 120 ? '...' : ''}</p>
        <div class="event-footer">
          <span class="event-category">${event.category}</span>
          <span class="event-attendees">${event.attendees || 0} attending</span>
        </div>
      </div>
    `;
    
    return eventCard;
  }
  
  // Run fixes for all pages
  fixHomePageButtons();
  fixExplorePage();
  fixEventsPage();