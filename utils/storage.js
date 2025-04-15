// API utilities for fetching and managing data

import { getAuthToken } from './auth.js';

// Base URL for API requests
// In a real app, this would be your API domain
const BASE_URL = '';

// Function to fetch data
export async function fetchData(endpoint) {
  try {
    // In a real app with an API, you'd use BASE_URL + endpoint
    // For this example project, we'll read local JSON files
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

// Function to post data
export async function postData(endpoint, data) {
  try {
    // In a real app, this would be an API call
    // For this example, we'll simulate it and store in localStorage
    
    // Get auth token
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Parse endpoint name to determine what we're posting
    const resourceType = endpoint.split('/').pop().replace('.json', '');
    
    // Get existing data
    let existingData = [];
    try {
      const storedData = localStorage.getItem(`cys_${resourceType}`);
      if (storedData) {
        existingData = JSON.parse(storedData);
      } else {
        // Try to fetch initial data from JSON file
        const initialData = await fetchData(endpoint);
        existingData = initialData || [];
      }
    } catch (error) {
      console.warn('Could not load existing data, starting afresh');
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
    localStorage.setItem(`cys_${resourceType}`, JSON.stringify(existingData));
    
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
    
    // Get existing data
    let existingData = [];
    const storedData = localStorage.getItem(`cys_${resourceType}`);
    
    if (storedData) {
      existingData = JSON.parse(storedData);
    } else {
      // Try to fetch initial data from JSON file
      const initialData = await fetchData(endpoint);
      existingData = initialData || [];
    }
    
    // Find index of item to update
    const index = existingData.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with ID ${id} not found`);
    }
    
    // Update item
    existingData[index] = {
      ...existingData[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem(`cys_${resourceType}`, JSON.stringify(existingData));
    
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
    
    // Get existing data
    let existingData = [];
    const storedData = localStorage.getItem(`cys_${resourceType}`);
    
    if (storedData) {
      existingData = JSON.parse(storedData);
    } else {
      // Try to fetch initial data from JSON file
      const initialData = await fetchData(endpoint);
      existingData = initialData || [];
    }
    
    // Filter out item to delete
    const newData = existingData.filter(item => item.id !== id);
    
    // If no items were removed, item wasn't found
    if (newData.length === existingData.length) {
      throw new Error(`Item with ID ${id} not found`);
    }
    
    // Save back to localStorage
    localStorage.setItem(`cys_${resourceType}`, JSON.stringify(newData));
    
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
    
    // Try localStorage first
    const storedData = localStorage.getItem(`cys_${resourceType}`);
    
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