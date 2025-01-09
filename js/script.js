// Load tools from JSON
async function loadTools() {
  try {
    const response = await fetch('./data/tools.json');
    const data = await response.json();
    
    const cardContainer = document.getElementById("cards");
    cardContainer.innerHTML = ''; // Clear existing cards
    
    data.tools.forEach(tool => {
      const stars = generateStars(tool.rating);
      const pricingIcons = generatePricingIcons(tool.pricing);
      const cardHTML = `
        <li class="card ${tool.categories.join(' ')}" data-rating="${tool.rating}">
          <div class="card-content">
            <div class="card-title">
              <h3><a target="_blank" class="service-title" href="${tool.url}">${tool.name}</a></h3>
            </div>
            <div class="card-body">
              ${tool.description}
            </div>
            <div class="rating">
              <div class="rating-pricing-container">
                <div class="rating-section">
                  <span class="stars">${stars}</span>
                  <span class="rating-number">${tool.rating.toFixed(1)}</span>
                </div>
                <div class="pricing-section">
                  ${pricingIcons}
                </div>
              </div>
            </div>
          </div>
        </li>
      `;
      cardContainer.innerHTML += cardHTML;
    });

    // Apply initial sort
    sortCards(document.getElementById('sort-select').value);
  } catch (error) {
    console.error('Error loading tools:', error);
  }
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHTML = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

// Generate pricing icons HTML
function generatePricingIcons(pricing) {
  let icons = '';
  
  if (pricing.toLowerCase().includes('free')) {
    icons += '<i class="fas fa-dollar-sign pricing-icon-free" title="Free tier available"></i>';
  }
  if (pricing.toLowerCase().includes('pro') || 
      pricing.toLowerCase().includes('premium') || 
      pricing.toLowerCase().includes('business') || 
      pricing.toLowerCase().includes('plus') || 
      pricing.toLowerCase().includes('standard')) {
    icons += '<i class="fas fa-crown pricing-icon-premium" title="Premium tier"></i>';
  }
  if (pricing.toLowerCase().includes('enterprise')) {
    icons += '<i class="fas fa-building pricing-icon-enterprise" title="Enterprise tier"></i>';
  }
  
  return icons;
}

// Sort cards
function sortCards(sortType) {
  const cardContainer = document.getElementById("cards");
  const cards = Array.from(cardContainer.children);
  
  cards.sort((a, b) => {
    switch(sortType) {
      case 'rating-high':
        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
      case 'rating-low':
        return parseFloat(a.dataset.rating) - parseFloat(b.dataset.rating);
      case 'name':
        const nameA = a.querySelector('.service-title').textContent.toLowerCase();
        const nameB = b.querySelector('.service-title').textContent.toLowerCase();
        return nameA.localeCompare(nameB);
      default:
        return 0;
    }
  });
  
  cards.forEach(card => cardContainer.appendChild(card));
}

// Initialize
window.addEventListener('load', () => {
  loadTools();
  handleFilterClick();
});

window.addEventListener('hashchange', handleFilterClick);