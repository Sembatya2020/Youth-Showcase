// Create a new file called button-fix.js and add this code

document.addEventListener('DOMContentLoaded', () => {
    // Fix navigation buttons on homepage
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
          if (typeof openModal === 'function') {
            openModal('signupModal');
          } else {
            // Fallback if openModal isn't available
            const signupModal = document.getElementById('signupModal');
            if (signupModal) signupModal.classList.add('active');
          }
        }
      });
    }
    
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', () => {
        // Scroll to "How It Works" section
        const howItWorksSection = document.querySelector('.how-it-works');
        if (howItWorksSection) {
          howItWorksSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback if section not found on current page
          window.location.href = '/#how-it-works';
        }
      });
    }
  });