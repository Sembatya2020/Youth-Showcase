// Fixed API utilities for fetching and managing data

import { getAuthToken } from './auth.js';

// Base URL for API requests
// In a real app, this would be your API domain
const BASE_URL = '';

// Function to fetch data
export async function fetchData(endpoint) {
  try {
    // In a real app with an API, you'd use BASE_URL + endpoint
    // For this example project, we'll check localStorage first
    
    // Extract the resource type from the endpoint
    const resourceType = endpoint.split('/').pop().replace('.json', '');
    const localStorageKey = `cys_${resourceType}`;
    
    // Check if we have data in localStorage
    const localData = localStorage.getItem(localStorageKey);
    
    if (localData) {
      console.log(`Fetching ${resourceType} from localStorage`);
      return JSON.parse(localData);
    }
    
    // If not in localStorage, try to fetch from the JSON file
    console.log(`Fetching ${resourceType} from file:`, endpoint);
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save to localStorage for future use
    localStorage.setItem(localStorageKey, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    
    // If fetch fails, try to generate fallback data
    return generateFallbackData(endpoint);
  }
}

// Function to post data
export async function postData(endpoint, data) {
  try {
    // Get auth token
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Parse endpoint name to determine what we're posting
    const resourceType = endpoint.split('/').pop().replace('.json', '');
    const localStorageKey = `cys_${resourceType}`;
    
    // Get existing data from localStorage
    let existingData = [];
    const storedData = localStorage.getItem(localStorageKey);
    
    if (storedData) {
      existingData = JSON.parse(storedData);
    } else {
      // Try to fetch initial data from JSON file
      try {
        const initialData = await fetchData(endpoint);
        existingData = initialData || [];
      } catch (error) {
        console.warn('Could not load existing data, starting fresh');
      }
    }
    
    // Add new data with ID and timestamp
    const newItem = {
      ...data,
      id: data.id || `${resourceType}_${Date.now()}`,
      createdAt: data.createdAt || new Date().toISOString()
    };
    
    // Add to existing data
    existingData.push(newItem);
    
    // Save back to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(existingData));
    
    return newItem;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
}

// Function to update data
export async function updateData(endpoint, id, data) {
  try {
    // Get auth token
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Parse endpoint name to determine what we're updating
    const resourceType = endpoint.split('/').pop().replace('.json', '');
    const localStorageKey = `cys_${resourceType}`;
    
    // Get existing data from localStorage
    let existingData = [];
    const storedData = localStorage.getItem(localStorageKey);
    
    if (storedData) {
      existingData = JSON.parse(storedData);
    } else {
      // Try to fetch initial data from JSON file
      try {
        const initialData = await fetchData(endpoint);
        existingData = initialData || [];
      } catch (error) {
        throw new Error('No existing data found');
      }
    }
    
    // Find index of item to update
    const index = existingData.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with ID ${id} not found`);
    }
    
    // Update item (partial update)
    existingData[index] = {
      ...existingData[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(existingData));
    
    return existingData[index];
  } catch (error) {
    console.error(`Error updating data at ${endpoint}/${id}:`, error);
    throw error;
  }
}

// Function to delete data
export async function deleteData(endpoint, id) {
  try {
    // Get auth token
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Parse endpoint name to determine what we're deleting
    const resourceType = endpoint.split('/').pop().replace('.json', '');
    const localStorageKey = `cys_${resourceType}`;
    
    // Get existing data from localStorage
    let existingData = [];
    const storedData = localStorage.getItem(localStorageKey);
    
    if (storedData) {
      existingData = JSON.parse(storedData);
    } else {
      throw new Error('No existing data found');
    }
    
    // Filter out item to delete
    const newData = existingData.filter(item => item.id !== id);
    
    // If no items were removed, item wasn't found
    if (newData.length === existingData.length) {
      throw new Error(`Item with ID ${id} not found`);
    }
    
    // Save back to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(newData));
    
    return { deleted: true, id };
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}/${id}:`, error);
    throw error;
  }
}

// Function to get a single item
export async function getItem(endpoint, id) {
  try {
    // Parse endpoint name to determine what we're getting
    const resourceType = endpoint.split('/').pop().replace('.json', '');
    const localStorageKey = `cys_${resourceType}`;
    
    // Try localStorage first
    const storedData = localStorage.getItem(localStorageKey);
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const item = parsedData.find(item => item.id === id);
      
      if (item) {
        return item;
      }
    }
    
    // If not in localStorage or not found, try fetching from JSON file
    const allItems = await fetchData(endpoint);
    const item = allItems.find(item => item.id === id);
    
    if (!item) {
      throw new Error(`Item with ID ${id} not found`);
    }
    
    return item;
  } catch (error) {
    console.error(`Error getting item from ${endpoint}/${id}:`, error);
    throw error;
  }
}

// Generate fallback data for demonstration
function generateFallbackData(endpoint) {
  console.log(`Generating fallback data for ${endpoint}`);
  
  // Determine data type from endpoint
  const resourceType = endpoint.split('/').pop().replace('.json', '');
  
  // Generate appropriate fallback data
  switch (resourceType) {
    case 'portfolios':
      return [
        {
          id: "portfolio_1",
          userId: "user_1",
          creator: "Demo User",
          title: "Sample Artwork",
          description: "This is a sample artwork for demonstration purposes.",
          category: "Visual Art",
          tags: ["Digital Art", "Illustration", "Sample"],
          imageUrl: "https://picsum.photos/600/400?random=1",
          createdAt: new Date().toISOString(),
          likes: 15,
          comments: [
            {
              userId: "user_2",
              username: "Sample User",
              content: "This looks great!",
              createdAt: new Date().toISOString()
            }
          ]
        },
        {
          id: "portfolio_2",
          userId: "user_2",
          creator: "Creative Creator",
          title: "Music Composition",
          description: "A sample music track for demonstration.",
          category: "Music",
          tags: ["Electronic", "Demo", "Sample"],
          imageUrl: "https://picsum.photos/600/400?random=2",
          audioUrl: "https://example.com/sample-audio.mp3",
          createdAt: new Date().toISOString(),
          likes: 8,
          comments: []
        }
      ];
      
    case 'events':
      return [
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
        }
      ];
      
    case 'users':
      return [
        {
          id: "user_1",
          name: "Demo User",
          email: "demo@example.com",
          password: "password123",
          avatar: "https://i.pravatar.cc/150?img=1",
          bio: "This is a sample user for demonstration purposes.",
          createdAt: new Date().toISOString(),
          role: "user",
          skills: ["Digital Art", "Illustration", "Design"],
          socialLinks: {
            instagram: "demo_user",
            website: "example.com"
          }
        },
        {
          id: "user_2",
          name: "Creative Creator",
          email: "creator@example.com",
          password: "password123",
          avatar: "https://i.pravatar.cc/150?img=2",
          bio: "Music producer and digital artist.",
          createdAt: new Date().toISOString(),
          role: "user",
          skills: ["Music Production", "Composition", "Digital Art"],
          socialLinks: {
            soundcloud: "creative_sounds",
            instagram: "creative_creator"
          }
        }
      ];
      
    default:
      console.warn(`No fallback data available for ${resourceType}`);
      return [];
  }
}