// Data Loading Fix Script
// Add this script to ensure sample data displays correctly

document.addEventListener('DOMContentLoaded', () => {
    // Check if we need to initialize sample data
    if (!localStorage.getItem('cys_portfolios') && !localStorage.getItem('cys_events')) {
      console.log('Initializing sample data...');
      initializeSampleData();
    }
    
    // Initialize sample data in localStorage
    async function initializeSampleData() {
      try {
        // Load sample portfolios
        const portfolios = await fetchSampleData('portfolios');
        if (portfolios && portfolios.length > 0) {
          localStorage.setItem('cys_portfolios', JSON.stringify(portfolios));
          console.log('Sample portfolios loaded:', portfolios.length);
        }
        
        // Load sample events
        const events = await fetchSampleData('events');
        if (events && events.length > 0) {
          localStorage.setItem('cys_events', JSON.stringify(events));
          console.log('Sample events loaded:', events.length);
        }
        
        // Load sample users
        const users = await fetchSampleData('users');
        if (users && users.length > 0) {
          // Only save if we don't already have users
          if (!localStorage.getItem('cys_users')) {
            localStorage.setItem('cys_users', JSON.stringify(users));
            console.log('Sample users loaded:', users.length);
          }
        }
      } catch (error) {
        console.error('Error initializing sample data:', error);
      }
    }
    
    // Fetch sample data from JSON files
    async function fetchSampleData(dataType) {
      try {
        // Try multiple potential paths to find the data
        const possiblePaths = [
          `/public/data/${dataType}.json`,
          `/data/${dataType}.json`,
          `/${dataType}.json`,
          `/src/data/${dataType}.json`
        ];
        
        // Try each path until we find the data
        for (const path of possiblePaths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              return await response.json();
            }
          } catch (e) {
            // Continue to next path
          }
        }
        
        // If we reach here, we couldn't load from files
        // Generate fallback data
        return generateFallbackData(dataType);
      } catch (error) {
        console.error(`Error fetching ${dataType}:`, error);
        return generateFallbackData(dataType);
      }
    }
    
    // Generate fallback sample data if JSON files can't be loaded
    function generateFallbackData(dataType) {
      console.log(`Generating fallback ${dataType} data...`);
      
      switch (dataType) {
        case 'portfolios':
          return [
            {
              "id": "portfolio_1",
              "userId": "user_1",
              "creator": "Demo User",
              "title": "Sample Artwork",
              "description": "This is a sample artwork for demonstration purposes.",
              "category": "Visual Art",
              "tags": ["Digital Art", "Illustration", "Sample"],
              "imageUrl": "https://picsum.photos/600/400?random=1",
              "createdAt": new Date().toISOString(),
              "likes": 15,
              "comments": [
                {
                  "userId": "user_2",
                  "username": "Sample User",
                  "content": "This looks great!",
                  "createdAt": new Date().toISOString()
                }
              ]
            },
            {
              "id": "portfolio_2",
              "userId": "user_2",
              "creator": "Creative Creator",
              "title": "Music Composition",
              "description": "A sample music track for demonstration.",
              "category": "Music",
              "tags": ["Electronic", "Demo", "Sample"],
              "imageUrl": "https://picsum.photos/600/400?random=2",
              "audioUrl": "https://example.com/sample-audio.mp3",
              "createdAt": new Date().toISOString(),
              "likes": 8,
              "comments": []
            },
            {
              "id": "portfolio_3",
              "userId": "user_3",
              "creator": "Writer Person",
              "title": "Short Story",
              "description": "A brief story for demonstration purposes.",
              "category": "Writing",
              "tags": ["Fiction", "Story", "Sample"],
              "imageUrl": "https://picsum.photos/600/400?random=3",
              "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non magna velit. Maecenas ac ultricies massa. Suspendisse potenti.",
              "createdAt": new Date().toISOString(),
              "likes": 12,
              "comments": []
            }
          ];
          
        case 'events':
          return [
            {
              "id": "event_1",
              "title": "Digital Art Workshop",
              "description": "Learn digital art techniques from professional artists.",
              "date": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
              "endDate": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours after start
              "location": "Virtual Event - Zoom",
              "category": "Workshop",
              "tags": ["Digital Art", "Learning", "Virtual"],
              "organizer": "Creative Arts Association",
              "imageUrl": "https://picsum.photos/600/400?random=4",
              "attendees": 15,
              "maxAttendees": 50,
              "isFeatured": true
            },
            {
              "id": "event_2",
              "title": "Youth Art Exhibition",
              "description": "Showcase featuring artwork from talented young creators.",
              "date": new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
              "endDate": new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 1 week after start
              "location": "Community Art Gallery, 123 Main St",
              "category": "Exhibition",
              "tags": ["Exhibition", "Art", "Youth"],
              "organizer": "Youth Art Foundation",
              "imageUrl": "https://picsum.photos/600/400?random=5",
              "attendees": 30,
              "maxAttendees": 100,
              "isFeatured": true
            },
            {
              "id": "event_3",
              "title": "Creative Writing Workshop",
              "description": "Develop your writing skills with professional guidance.",
              "date": new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
              "endDate": new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours after start
              "location": "Public Library, Conference Room B",
              "category": "Workshop",
              "tags": ["Writing", "Workshop", "Learning"],
              "organizer": "Writers Guild",
              "imageUrl": "https://picsum.photos/600/400?random=6",
              "attendees": 12,
              "maxAttendees": 20,
              "isFeatured": false
            }
          ];
          
        case 'users':
          return [
            {
              "id": "user_1",
              "name": "Demo User",
              "email": "demo@example.com",
              "password": "password123",
              "avatar": "https://i.pravatar.cc/150?img=1",
              "bio": "This is a sample user for demonstration purposes.",
              "createdAt": new Date().toISOString(),
              "role": "user",
              "skills": ["Digital Art", "Illustration", "Design"],
              "socialLinks": {
                "instagram": "demo_user",
                "website": "example.com"
              }
            },
            {
              "id": "user_2",
              "name": "Creative Creator",
              "email": "creator@example.com",
              "password": "password123",
              "avatar": "https://i.pravatar.cc/150?img=2",
              "bio": "Music producer and digital artist.",
              "createdAt": new Date().toISOString(),
              "role": "user",
              "skills": ["Music Production", "Composition", "Digital Art"],
              "socialLinks": {
                "soundcloud": "creative_sounds",
                "instagram": "creative_creator"
              }
            },
            {
              "id": "user_3",
              "name": "Writer Person",
              "email": "writer@example.com",
              "password": "password123",
              "avatar": "https://i.pravatar.cc/150?img=3",
              "bio": "Writer and poet exploring various themes.",
              "createdAt": new Date().toISOString(),
              "role": "user",
              "skills": ["Creative Writing", "Poetry", "Storytelling"],
              "socialLinks": {
                "twitter": "writer_tweets",
                "website": "writersite.com"
              }
            },
            {
              "id": "mentor_1",
              "name": "Mentor Expert",
              "email": "mentor@example.com",
              "password": "password123",
              "avatar": "https://i.pravatar.cc/150?img=4",
              "bio": "Professional artist with over 10 years of experience.",
              "createdAt": new Date().toISOString(),
              "role": "mentor",
              "expertise": ["Visual Art", "Drawing", "Painting"],
              "socialLinks": {
                "instagram": "mentor_art",
                "website": "mentorexpert.com"
              }
            }
          ];
          
        default:
          return [];
      }
    }
    
    // API utility to override the fetch function if needed
    function createFetchOverride() {
      // Store the original fetch
      const originalFetch = window.fetch;
      
      // Override fetch to intercept calls to data files
      window.fetch = async function(url, options) {
        // Check if this is a request for our data files
        if (typeof url === 'string' && url.includes('/data/') && 
            (url.includes('portfolios.json') || url.includes('events.json') || url.includes('users.json'))) {
          
          // Extract the data type from the URL
          const urlParts = url.split('/');
          const filename = urlParts[urlParts.length - 1];
          const dataType = filename.replace('.json', '');
          
          // Check if we have this data in localStorage
          const localData = localStorage.getItem(`cys_${dataType}`);
          
          if (localData) {
            console.log(`Serving ${dataType} from localStorage`);
            
            // Create a mock response
            return Promise.resolve({
              ok: true,
              status: 200,
              json: async () => JSON.parse(localData)
            });
          }
        }
        
        // Otherwise, use the original fetch
        return originalFetch.apply(window, arguments);
      };
    }
    
    // Apply fetch override to intercept data requests
    createFetchOverride();
    
    // Expose data utility functions globally if needed
    window.cysDataUtils = {
      refreshData: initializeSampleData,
      clearData: () => {
        localStorage.removeItem('cys_portfolios');
        localStorage.removeItem('cys_events');
        console.log('Sample data cleared');
      }
    };
  });