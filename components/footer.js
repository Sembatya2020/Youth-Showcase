// Footer component

/**
 * Initialize footer component
 * @param {HTMLElement} footerElement - The footer element to initialize
 */
export function initializeFooter(footerElement) {
    if (!footerElement) return;
    
    // Add current year to copyright text
    updateCopyrightYear(footerElement);
    
    // Initialize social media links
    initializeSocialLinks(footerElement);
    
    // Add newsletter form functionality if present
    initializeNewsletterForm(footerElement);
  }
  
  /**
   * Update copyright year to current year
   * @param {HTMLElement} footerElement - The footer element
   */
  function updateCopyrightYear(footerElement) {
    const copyrightElement = footerElement.querySelector('.copyright p');
    
    if (copyrightElement) {
      const currentYear = new Date().getFullYear();
      copyrightElement.textContent = copyrightElement.textContent.replace(/\d{4}/, currentYear);
    }
  }
  
  /**
   * Initialize social media links
   * @param {HTMLElement} footerElement - The footer element
   */
  function initializeSocialLinks(footerElement) {
    const socialLinks = footerElement.querySelector('.social-links');
    
    if (!socialLinks) return;
    
    // If social links are empty, add default links
    if (socialLinks.children.length === 0) {
      socialLinks.innerHTML = `
        <a href="#" class="social-link instagram" aria-label="Instagram"><i class="instagram-icon"></i></a>
        <a href="#" class="social-link twitter" aria-label="Twitter"><i class="twitter-icon"></i></a>
        <a href="#" class="social-link facebook" aria-label="Facebook"><i class="facebook-icon"></i></a>
        <a href="#" class="social-link youtube" aria-label="YouTube"><i class="youtube-icon"></i></a>
      `;
    }
    
    // Add click handler for social links (for analytics in a real application)
    const links = socialLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get platform name from class
        const classList = Array.from(link.classList);
        const platform = classList.find(cls => cls !== 'social-link');
        
        // In a real app, you would track this click
        console.log(`Social link clicked: ${platform}`);
        
        // Open link in new window (in this demo, we just show an alert)
        alert(`This would open the ${platform} page in a real application.`);
      });
    });
  }
  
  /**
   * Initialize newsletter signup form
   * @param {HTMLElement} footerElement - The footer element
   */
  function initializeNewsletterForm(footerElement) {
    const newsletterForm = footerElement.querySelector('.newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      
      if (!emailInput || !emailInput.value.trim()) {
        showNewsletterMessage(newsletterForm, 'Please enter a valid email address', 'error');
        return;
      }
      
      // In a real app, you would send this to your API
      // For this demo, we'll just show a success message
      
      // Show loading state
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';
      
      // Simulate API call
      setTimeout(() => {
        // Reset form
        newsletterForm.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
        
        // Show success message
        showNewsletterMessage(newsletterForm, 'Thank you for subscribing!', 'success');
      }, 1000);
    });
  }
  
  /**
   * Show message in newsletter form
   * @param {HTMLFormElement} form - The newsletter form
   * @param {string} message - The message to display
   * @param {string} type - The message type ('success' or 'error')
   */
  function showNewsletterMessage(form, message, type = 'success') {
    // Remove any existing message
    const existingMessage = form.querySelector('.newsletter-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `newsletter-message ${type}-message`;
    messageElement.textContent = message;
    
    // Add message to form
    form.appendChild(messageElement);
    
    // Auto-remove message after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        messageElement.remove();
      }, 5000);
    }
  }
  
  /**
   * Add back-to-top button functionality
   * @param {HTMLElement} footerElement - The footer element
   */
  export function addBackToTopButton(footerElement) {
    // Check if button already exists
    if (document.querySelector('.back-to-top')) return;
    
    // Create back-to-top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = `<i class="arrow-up-icon"></i>`;
    
    // Add button to body
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }