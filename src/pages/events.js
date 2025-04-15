// Events page functionality

import { fetchData, getItem } from '../utils/api.js';
import { getCurrentUser } from '../utils/auth.js';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage.js';

// Default export function to initialize events page
export default function initializeEventsPage() {
  // Variables
  let events = [];
  let filteredEvents = [];
  let currentFilters = {
    category: 'all',
    timeframe: 'upcoming',
    search: ''
  };
  
  // Current user
  const currentUser = getCurrentUser();
  
  // DOM elements
  const eventsGrid = document.querySelector('.events-grid');
  const categoryFilters = document.querySelector('.category-filters');
  const timeframeFilters = document.querySelector('.timeframe-filters');
  const searchInput = document.getElementById('eventSearchInput');
  const noEventsMessage = document.querySelector('.no-events');
  
  // Check if viewing a specific event
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('id')) {
    loadEventDetails(urlParams.get('id'));
  } else {
    // Load events list
    loadEvents();
  }
  
  // Function to load events
  async function loadEvents() {
    try {
      // Try to get from localStorage first
      let cachedEvents = getFromLocalStorage('events');
      
      if (!cachedEvents) {
        // If not in localStorage, fetch from API/JSON
        events = await fetchData('/public/data/events.json');
        saveToLocalStorage('events', events);
      } else {
        events = cachedEvents;
      }
      
      // Initialize filters
      initializeFilters();
      
      // Apply initial filtering
      applyFilters();
      
    } catch (error) {
      console.error('Error loading events:', error);
      displayErrorMessage('Failed to load events. Please try again later.');
    }
  }
  
  // Function to load a specific event's details
  async function loadEventDetails(eventId) {
    try {
      // Get the event
      const event = await getItem('/public/data/events.json', eventId);
      
      if (!event) {
        displayErrorMessage('Event not found');
        return;
      }
      
      // Hide the events grid section
      const eventsSection = document.querySelector('.events-section');
      if (eventsSection) {
        eventsSection.style.display = 'none';
      }
      
      // Show the event detail section
      const eventDetailSection = document.createElement('section');
      eventDetailSection.className = 'event-detail-section';
      
      // Format dates
      const eventDate = new Date(event.date);
      const eventEndDate = event.endDate ? new Date(event.endDate) : null;
      
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      let dateTimeDisplay = `${formattedDate} at ${formattedTime}`;
      
      if (eventEndDate) {
        // Check if it's the same day
        if (eventDate.toDateString() === eventEndDate.toDateString()) {
          // Same day, just show ending time
          const endTime = eventEndDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          dateTimeDisplay += ` to ${endTime}`;
        } else {
          // Different days, show full end date/time
          const endDateFormatted = eventEndDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
          
          const endTimeFormatted = eventEndDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          
          dateTimeDisplay += ` to ${endDateFormatted} at ${endTimeFormatted}`;
        }
      }
      
      // Calculate attendance status
      const isAttending = event.attendees && Array.isArray(event.attendeeIds) && 
                          currentUser && event.attendeeIds.includes(currentUser.id);
      
      // Create event detail content
      eventDetailSection.innerHTML = `
        <div class="container">
          <div class="event-detail-header">
            <a href="/html/events.html" class="back-link">← Back to Events</a>
            <span class="event-category">${event.category}</span>
          </div>
          
          <div class="event-detail-content">
            <div class="event-detail-main">
              <h1>${event.title}</h1>
              
              <div class="event-detail-meta">
                <div class="event-date-time">
                  <i class="calendar-icon"></i>
                  <span>${dateTimeDisplay}</span>
                </div>
                
                <div class="event-location">
                  <i class="location-icon"></i>
                  <span>${event.location}</span>
                </div>
                
                <div class="event-organizer">
                  <i class="organizer-icon"></i>
                  <span>Organized by ${event.organizer}</span>
                </div>
              </div>
              
              <div class="event-detail-description">
                <h2>About this event</h2>
                <p>${event.description}</p>
              </div>
              
              <div class="event-tags">
                ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </div>
            
            <div class="event-detail-sidebar">
              <div class="event-sidebar-card">
                <div class="attendee-count">
                  <span class="count">${event.attendees || 0}</span>
                  <span class="label">people attending</span>
                </div>
                
                <div class="remaining-spots">
                  ${event.maxAttendees ? 
                    `<span>${event.maxAttendees - (event.attendees || 0)} spots remaining</span>` : 
                    '<span>Unlimited spots</span>'}
                </div>
                
                <button class="primary-btn attend-btn ${isAttending ? 'attending' : ''}" data-event-id="${event.id}">
                  ${isAttending ? 'Attending' : 'Attend Event'}
                </button>
                
                <div class="event-actions">
                  <button class="secondary-btn share-btn">Share</button>
                  <button class="secondary-btn save-btn">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add event detail section to the page
      const mainContent = document.querySelector('main');
      mainContent.appendChild(eventDetailSection);
      
      // Add event listeners
      const attendBtn = eventDetailSection.querySelector('.attend-btn');
      const shareBtn = eventDetailSection.querySelector('.share-btn');
      const saveBtn = eventDetailSection.querySelector('.save-btn');
      
      if (attendBtn) {
        attendBtn.addEventListener('click', () => toggleAttendance(event, attendBtn));
      }
      
      if (shareBtn) {
        shareBtn.addEventListener('click', () => shareEvent(event));
      }
      
      if (saveBtn) {
        saveBtn.addEventListener('click', () => saveEvent(event));
      }
      
    } catch (error) {
      console.error('Error loading event details:', error);
      displayErrorMessage('Failed to load event details. Please try again later.');
    }
  }
  
  // Function to initialize filters
  function initializeFilters() {
    if (!categoryFilters || !timeframeFilters || !searchInput) return;
    
    // Extract unique categories
    const categories = ['all', ...new Set(events.map(e => e.category))];
    
    // Create category filters
    categoryFilters.innerHTML = '';
    categories.forEach(category => {
      const filterBtn = document.createElement('button');
      filterBtn.className = 'category-filter';
      filterBtn.dataset.category = category;
      filterBtn.textContent = category === 'all' ? 'All Categories' : category;
      
      // Set active state
      if (category === currentFilters.category) {
        filterBtn.classList.add('active');
      }
      
      // Add click event
      filterBtn.addEventListener('click', () => {
        // Update UI
        categoryFilters.querySelectorAll('.category-filter').forEach(btn => {
          btn.classList.remove('active');
        });
        filterBtn.classList.add('active');
        
        // Update filter and apply
        currentFilters.category = category;
        applyFilters();
      });
      
      categoryFilters.appendChild(filterBtn);
    });
    
    // Initialize timeframe filters
    timeframeFilters.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        // Update UI
        timeframeFilters.querySelectorAll('button').forEach(b => {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        
        // Update filter and apply
        currentFilters.timeframe = btn.dataset.timeframe;
        applyFilters();
      });
    });
    
    // Initialize search input
    searchInput.addEventListener('input', () => {
      currentFilters.search = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }
  
  // Function to apply filters
  function applyFilters() {
    if (!events.length) return;
    
    // Filter events
    filteredEvents = events.filter(event => {
      // Filter by category
      if (currentFilters.category !== 'all' && event.category !== currentFilters.category) {
        return false;
      }
      
      // Filter by timeframe
      const eventDate = new Date(event.date);
      const now = new Date();
      
      if (currentFilters.timeframe === 'upcoming' && eventDate < now) {
        return false;
      } else if (currentFilters.timeframe === 'past' && eventDate >= now) {
        return false;
      }
      
      // Filter by search
      if (currentFilters.search) {
        const searchText = currentFilters.search.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(searchText);
        const matchDescription = event.description.toLowerCase().includes(searchText);
        const matchLocation = event.location.toLowerCase().includes(searchText);
        const matchOrganizer = event.organizer.toLowerCase().includes(searchText);
        
        if (!(matchTitle || matchDescription || matchLocation || matchOrganizer)) {
          return false;
        }
      }
      
      return true;
    });
    
    // Sort events by date
    filteredEvents.sort((a, b) => {
      if (currentFilters.timeframe === 'past') {
        // For past events, sort newest first
        return new Date(b.date) - new Date(a.date);
      } else {
        // For upcoming events, sort by date ascending
        return new Date(a.date) - new Date(b.date);
      }
    });
    
    // Display filtered events
    displayEvents(filteredEvents);
  }
  
  // Function to display events
  function displayEvents(eventsToDisplay) {
    if (!eventsGrid) return;
    
    // Clear events grid
    eventsGrid.innerHTML = '';
    
    // Show/hide no events message
    if (noEventsMessage) {
      if (eventsToDisplay.length === 0) {
        noEventsMessage.style.display = 'block';
      } else {
        noEventsMessage.style.display = 'none';
      }
    }
    
    // Create and append event cards
    eventsToDisplay.forEach(event => {
      const eventCard = createEventCard(event);
      eventsGrid.appendChild(eventCard);
    });
  }
  
  // Function to create event card
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
    
    // Check if event is featured
    if (event.isFeatured) {
      eventCard.classList.add('featured');
    }
    
    // Build card HTML
    eventCard.innerHTML = `
      <img src="${event.imageUrl || '/public/images/event-placeholder.jpg'}" alt="${event.title}" class="event-image">
      <div class="event-details">
        <span class="event-date">${formattedDate}, ${formattedTime}</span>
        <h3 class="event-title">${event.title}</h3>
        <p class="event-location">${event.location}</p>
        <p class="event-description">${event.description.substring(0, 40)}${event.description.length > 40 ? '...' : ''}</p>
        <div class="event-footer">
          <span class="event-category">${event.category}</span>
          <span class="event-attendees">${event.attendees || 0} attending</span>
        </div>
      </div>
    `;
    
    // Add click event to view details
    eventCard.addEventListener('click', () => {
      window.location.href = `/html/events.html?id=${event.id}`;
    });
    
    return eventCard;
  }
  
  // Function to toggle event attendance
  function toggleAttendance(event, button) {
    if (!currentUser) {
      showLoginRequiredMessage();
      return;
    }
    
    // In a real app, this would make an API call
    // For this demo, we'll update the event in localStorage
    
    try {
      // Clone the events array
      const updatedEvents = [...events];
      
      // Find the event to update
      const eventIndex = updatedEvents.findIndex(e => e.id === event.id);
      
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      // Check if user is already attending
      if (!updatedEvents[eventIndex].attendeeIds) {
        updatedEvents[eventIndex].attendeeIds = [];
      }
      
      const isAttending = updatedEvents[eventIndex].attendeeIds.includes(currentUser.id);
      
      if (isAttending) {
        // Remove attendance
        updatedEvents[eventIndex].attendeeIds = updatedEvents[eventIndex].attendeeIds.filter(id => id !== currentUser.id);
        updatedEvents[eventIndex].attendees = (updatedEvents[eventIndex].attendees || 1) - 1;
        
        // Update button
        button.textContent = 'Attend Event';
        button.classList.remove('attending');
        
        showToast('You are no longer attending this event');
      } else {
        // Check if event is full
        if (updatedEvents[eventIndex].maxAttendees && 
            updatedEvents[eventIndex].attendees >= updatedEvents[eventIndex].maxAttendees) {
          showToast('Sorry, this event is full', 'error');
          return;
        }
        
        // Add attendance
        updatedEvents[eventIndex].attendeeIds.push(currentUser.id);
        updatedEvents[eventIndex].attendees = (updatedEvents[eventIndex].attendees || 0) + 1;
        
        // Update button
        button.textContent = 'Attending';
        button.classList.add('attending');
        
        showToast('You are now attending this event', 'success');
      }
      
      // Save updated events
      saveToLocalStorage('events', updatedEvents);
      events = updatedEvents;
      
      // Update the displayed attendee count
      const attendeeCountElement = document.querySelector('.attendee-count .count');
      if (attendeeCountElement) {
        attendeeCountElement.textContent = updatedEvents[eventIndex].attendees || 0;
      }
      
      // Update remaining spots
      const remainingSpotsElement = document.querySelector('.remaining-spots span');
      if (remainingSpotsElement && updatedEvents[eventIndex].maxAttendees) {
        const remaining = updatedEvents[eventIndex].maxAttendees - updatedEvents[eventIndex].attendees;
        remainingSpotsElement.textContent = `${remaining} spots remaining`;
      }
      
    } catch (error) {
      console.error('Error updating attendance:', error);
      showToast('Failed to update attendance', 'error');
    }
  }
  
  // Function to share event
  function shareEvent(event) {
    // In a real app, this would use the Web Share API or create share links
    // For this demo, we'll show a simple modal
    
    const shareModal = document.createElement('div');
    shareModal.className = 'modal share-modal active';
    
    const eventUrl = `${window.location.origin}/html/events.html?id=${event.id}`;
    
    shareModal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <h2>Share this Event</h2>
        <div class="share-options">
          <button class="share-option facebook">Facebook</button>
          <button class="share-option twitter">Twitter</button>
          <button class="share-option email">Email</button>
        </div>
        <div class="share-link">
          <p>Or copy this link:</p>
          <div class="copy-link-container">
            <input type="text" readonly value="${eventUrl}">
            <button class="copy-btn">Copy</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Add event listeners
    const closeBtn = shareModal.querySelector('.close-modal');
    const copyBtn = shareModal.querySelector('.copy-btn');
    
    closeBtn.addEventListener('click', () => {
      shareModal.remove();
    });
    
    copyBtn.addEventListener('click', () => {
      const linkInput = shareModal.querySelector('input');
      linkInput.select();
      document.execCommand('copy');
      
      // Change button text temporarily
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
    
    // Close when clicking outside
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        shareModal.remove();
      }
    });
  }
  
  // Function to save event
  function saveEvent(event) {
    if (!currentUser) {
      showLoginRequiredMessage();
      return;
    }
    
    // In a real app, this would make an API call
    // For this demo, we'll just show a success message
    
    showToast('Event saved to your calendar', 'success');
  }
  
  // Function to show login required message
  function showLoginRequiredMessage() {
    const loginModal = document.createElement('div');
    loginModal.className = 'modal login-required-modal active';
    
    loginModal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <h2>Login Required</h2>
        <p>You need to be logged in to perform this action.</p>
        <div class="modal-actions">
          <button class="primary-btn login-btn">Log In</button>
          <button class="secondary-btn signup-btn">Sign Up</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(loginModal);
    
    // Add event listeners
    const closeBtn = loginModal.querySelector('.close-modal');
    const loginBtn = loginModal.querySelector('.login-btn');
    const signupBtn = loginModal.querySelector('.signup-btn');
    
    closeBtn.addEventListener('click', () => {
      loginModal.remove();
    });
    
    loginBtn.addEventListener('click', () => {
      loginModal.remove();
      // Open login modal
      const mainLoginModal = document.getElementById('loginModal');
      if (mainLoginModal && typeof openModal === 'function') {
        openModal('loginModal');
      } else {
        window.location.href = '/?login=true';
      }
    });
    
    signupBtn.addEventListener('click', () => {
      loginModal.remove();
      // Open signup modal
      const mainSignupModal = document.getElementById('signupModal');
      if (mainSignupModal && typeof openModal === 'function') {
        openModal('signupModal');
      } else {
        window.location.href = '/?signup=true';
      }
    });
    
    // Close when clicking outside
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.remove();
      }
    });
  }
  
  // Function to display error message
  function displayErrorMessage(message) {
    if (eventsGrid) {
      eventsGrid.innerHTML = `
        <div class="error-message">
          <p>${message}</p>
        </div>
      `;
    }
  }
  
  // Function to show toast notification
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}-toast`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
  
  // Return public methods
  return {
    refreshEvents: loadEvents
  };
}