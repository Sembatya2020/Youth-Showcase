// Create a file called json-fix.js and add this code

document.addEventListener('DOMContentLoaded', () => {
    console.log('JSON fix script loaded');
    
    // Force load sample data immediately
    loadSampleData();
    
    // Fix for events page
    if (window.location.pathname.includes('events.html')) {
      loadEventsData();
    }
    
    // Fix for explore page
    if (window.location.pathname.includes('explore.html')) {
      loadPortfoliosData();
    }
    
    function loadSampleData() {
      // Create sample events data
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
      
      // Create sample portfolios data
      const samplePortfolios = [
        {
          id: "portfolio_1",
          userId: "user_1",
          creator: "Alex Johnson",
          title: "Neon Dreams",
          description: "A series exploring urban nightlife through vibrant digital illustrations.",
          category: "Visual Art",
          tags: ["Digital Art", "Illustration", "Urban"],
          imageUrl: "https://picsum.photos/600/400?random=1",
          createdAt: "2023-03-15T18:30:00Z",
          likes: 42,
          comments: [
            {
              userId: "user_3",
              username: "Taylor Wong",
              content: "The colors in this series are incredible! Love how you captured the city lights.",
              createdAt: "2023-03-16T09:45:00Z"
            }
          ]
        },
        {
          id: "portfolio_2",
          userId: "user_2",
          creator: "Jamie Rivera",
          title: "Urban Frequencies",
          description: "An EP blending electronic beats with urban soundscapes recorded around the city.",
          category: "Music",
          tags: ["Electronic", "Hip-Hop", "Ambient"],
          imageUrl: "https://picsum.photos/600/400?random=2",
          createdAt: "2023-04-02T11:15:00Z",
          likes: 37,
          comments: []
        },
        {
          id: "portfolio_3",
          userId: "user_3",
          creator: "Taylor Wong",
          title: "Concrete Gardens",
          description: "A collection of poems exploring the intersection of nature and urban environments.",
          category: "Writing",
          tags: ["Poetry", "Urban", "Nature"],
          imageUrl: "https://picsum.photos/600/400?random=3",
          createdAt: "2023-03-28T09:40:00Z",
          likes: 29,
          comments: []
        }
      ];
      
      // Save to localStorage
      localStorage.setItem('cys_events', JSON.stringify(sampleEvents));
      localStorage.setItem('cys_portfolios', JSON.stringify(samplePortfolios));
      
      console.log('Sample data loaded:', {
        events: sampleEvents.length,
        portfolios: samplePortfolios.length
      });
    }
    
    function loadEventsData() {
      console.log('Loading events data');
      const eventsGrid = document.querySelector('.events-grid');
      const loadingSpinner = document.querySelector('.loading-spinner');
      
      // Get events from localStorage
      const eventsJson = localStorage.getItem('cys_events');
      if (!eventsJson) {
        console.error('No events data found');
        return;
      }
      
      try {
        const events = JSON.parse(eventsJson);
        console.log('Events loaded:', events.length);
        
        // Remove loading spinner
        if (loadingSpinner) {
          loadingSpinner.remove();
        }
        
        // Display events
        events.forEach(event => {
          const eventCard = createEventCard(event);
          eventsGrid.appendChild(eventCard);
        });
      } catch (error) {
        console.error('Error parsing events:', error);
      }
    }
    
    function loadPortfoliosData() {
      console.log('Loading portfolios data');
      const portfolioGrid = document.querySelector('.portfolio-grid');
      const loadingSpinner = document.querySelector('.loading-spinner');
      
      // Get portfolios from localStorage
      const portfoliosJson = localStorage.getItem('cys_portfolios');
      if (!portfoliosJson) {
        console.error('No portfolios data found');
        return;
      }
      
      try {
        const portfolios = JSON.parse(portfoliosJson);
        console.log('Portfolios loaded:', portfolios.length);
        
        // Remove loading spinner
        if (loadingSpinner) {
          loadingSpinner.remove();
        }
        
        // Display portfolios
        portfolios.forEach(portfolio => {
          const portfolioItem = createPortfolioItem(portfolio);
          portfolioGrid.appendChild(portfolioItem);
        });
      } catch (error) {
        console.error('Error parsing portfolios:', error);
      }
    }
    
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
    
    function createPortfolioItem(portfolio) {
      const item = document.createElement('div');
      item.className = 'portfolio-item';
      
      // Format date
      const createdDate = new Date(portfolio.createdAt);
      const formattedDate = createdDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      item.innerHTML = `
        <div class="portfolio-content">
          <img src="${portfolio.imageUrl || 'https://picsum.photos/600/400?random=' + Math.floor(Math.random() * 100)}" alt="${portfolio.title}" class="portfolio-image">
          <div class="portfolio-info">
            <h3 class="portfolio-title">${portfolio.title}</h3>
            <p class="portfolio-creator">By ${portfolio.creator}</p>
            <p class="portfolio-category">${portfolio.category}</p>
            <div class="portfolio-tags">
              ${portfolio.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <p class="portfolio-date">Posted on ${formattedDate}</p>
            <div class="portfolio-stats">
              <span class="likes-count"><i class="heart-icon"></i> ${portfolio.likes || 0}</span>
              <span class="comments-count"><i class="comment-icon"></i> ${portfolio.comments ? portfolio.comments.length : 0}</span>
            </div>
          </div>
        </div>
      `;
      
      return item;
    }
  });