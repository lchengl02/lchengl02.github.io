// Set current year
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Load default tab (about)
  loadTab('about');
});

// Tab switching function
function showTab(tabName) {
  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Add active class to clicked tab
  event.target.classList.add('active');
  
  // Load the tab content
  loadTab(tabName);
}

// Load tab content from separate HTML files
function loadTab(tabName) {
  const contentArea = document.getElementById('content-area');
  
  // Show loading state
  contentArea.innerHTML = '<div style="text-align: center; padding: 50px;">Loading...</div>';
  
  // Fetch the tab content
  fetch(`pages/${tabName}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Page not found');
      }
      return response.text();
    })
    .then(html => {
      contentArea.innerHTML = html;
      contentArea.classList.add('active');
    })
    .catch(error => {
      console.error('Error loading page:', error);
      contentArea.innerHTML = `<div style="text-align: center; padding: 50px; color: #999;">Content coming soon...</div>`;
    });
}
