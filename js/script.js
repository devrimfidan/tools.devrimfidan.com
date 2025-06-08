// Fetch data from Google Sheet using Google Apps Script
const fetchTools = async () => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycby4XnZkKuVgnU0a1nMpqj-UtRhmznnUGG8-LSVP8siXDQNNkPXNdkriL2qE67nQJHWN/exec');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tools data:', error);
        return [];
    }
};

// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
    // Show skeleton loading screen
    const toolContainer = document.getElementById("tool-container");
    
    // Function to create multiple skeleton cards
    function createSkeletonCards(count) {
        let cards = '';
        for (let i = 0; i < count; i++) {
            cards += `
                <div class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full animate-pulse">
                    <div>
                        <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div class="mt-4 flex justify-between items-end">
                        <div class="flex items-center">
                            <div class="flex space-x-1">
                                ${Array(5).fill('<div class="w-4 h-4 rounded-full bg-gray-200"></div>').join('')}
                            </div>
                            <div class="ml-2 w-6 h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            `;
        }
        return cards;
    }
    
    // Make sure toolContainer has the proper grid class before inserting skeletons
    toolContainer.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    
    // Create skeleton screen with multiple skeleton cards
    toolContainer.innerHTML = createSkeletonCards(9); // 9 skeleton cards should cover initial view
    
    // Fetch the tools data from Google Apps Script
    const toolsData = await fetchTools();
    
    if (!toolsData || toolsData.length === 0) {
        toolContainer.innerHTML = `
            <div class="col-span-full text-center py-10">
                <p class="text-xl text-gray-600">Unable to load tools data. Please try again later.</p>
            </div>
        `;
        return;
    }
    
    // Function to create multiple skeleton cards
    function createSkeletonCards(count) {
        let cards = '';
        for (let i = 0; i < count; i++) {
            cards += `
                <div class="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full animate-pulse">
                    <div>
                        <div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div class="mt-4 flex justify-between items-end">
                        <div class="flex items-center">
                            <div class="flex space-x-1">
                                ${Array(5).fill('<div class="w-4 h-4 rounded-full bg-gray-200"></div>').join('')}
                            </div>
                            <div class="ml-2 w-6 h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div class="w-5 h-5 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            `;
        }
        return cards;
    }

    // Get references to various DOM elements
    // Note: toolContainer is already defined above
    const categoryList = document.getElementById("category-list");
    const searchInput = document.getElementById("search");
    const sortOptions = document.getElementById("sort-options");
    const pricingFilterElement = document.getElementById("pricing-filter"); 
    const ratingFilterElement = document.getElementById("rating-filter");
    const gridViewBtn = document.getElementById("grid-view");
    const listViewBtn = document.getElementById("list-view");
    
    // Store all tools from the fetched data
    let allTools = toolsData; // Use the data from Google Apps Script
    // Use a Set to store unique categories
    let categories = new Set();

    // Add Google Sheet link button to the UI
    const addGoogleSheetButton = () => {
        const controlArea = gridViewBtn.parentElement;
        
        // Create a new button for Google Sheet
        const googleSheetBtn = document.createElement('button');
        googleSheetBtn.className = 'ml-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100 focus:outline-none hidden sm:block'; // Add hidden sm:block to hide on mobile
        googleSheetBtn.title = 'Open data source in Google Sheets';
        googleSheetBtn.innerHTML = '<i class="fas fa-table text-green-600"></i>';
        
        // Add event listener to open Google Sheet in a new window
        googleSheetBtn.addEventListener('click', () => {
            window.open('https://docs.google.com/spreadsheets/d/1ZW6uYVdT_csRpKVTBnIoUA2FKGd5JDM73SCwZD7l3QI/edit?usp=sharing', '_blank');
        });
        
        // Add the button to the control area
        controlArea.appendChild(googleSheetBtn);
    };

    /**
     * Generates HTML for star ratings based on a numeric rating.
     * @param {number} rating - The numerical rating of the tool.
     * @returns {string} HTML string representing the stars.
     */
    function generateStars(rating) {
        let fullStars = Math.floor(rating);
        let halfStar = rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt text-yellow-400"></i>' : '';
        // Calculate empty stars, ensuring it's not negative
        let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        emptyStars = Math.max(0, emptyStars); // Ensure emptyStars is not less than 0

        return '<span class="stars text-yellow-400">' +
            '<i class="fas fa-star"></i>'.repeat(fullStars) +
            halfStar +
            '<i class="far fa-star"></i>'.repeat(emptyStars) +
            '</span>';
    }

    /**
     * Determines the pricing tier ('free' or 'paid') based on the pricing string.
     * @param {string} pricingString - The pricing information string for a tool.
     * @returns {string} 'free' or 'paid'.
     */
    function getPricingTier(pricingString) {
        if (!pricingString) return 'paid';
        
        const pricingLower = pricingString.toLowerCase();
        // If "free" is present and it's the only option or the first in a list (e.g., "Free/Pro")
        if (pricingLower.includes('free')) {
            // If "free" is the only tier or listed first like "Free" or "Free/Pro"
            if (pricingLower.split('/').length === 1 || pricingLower.startsWith('free')) {
                 return 'free';
            }
            // If "free" is present but not the primary/only option (e.g., "Pro/Free")
            return 'paid'; 
        }
        // If "free" is not mentioned, it's considered 'paid'
        return 'paid';
    }
    
    /**
     * Renders the tool cards to the DOM based on current filters and sort order.
     */
    function renderTools() {
        // Clear the existing tool cards
        toolContainer.innerHTML = "";
        
        // Get current filter and search values
        const filterCategory = getCurrentCategoryFilter(); 
        const searchQuery = searchInput.value.toLowerCase();
        const sortType = sortOptions?.value || "rating-desc";
        const pricingFilterValue = pricingFilterElement?.value || 'all'; 
        const ratingFilterValue = ratingFilterElement?.value || 'all';   

        // Filter the tools based on all criteria
        let filteredTools = allTools.filter(tool => {
            // Match search query against tool name
            const nameMatch = tool.name.toLowerCase().includes(searchQuery);
            
            // Match category - ensure categories is an array
            const toolCategories = Array.isArray(tool.categories) ? 
                tool.categories : 
                (typeof tool.categories === 'string' ? tool.categories.split(',').map(c => c.trim()) : []);
            
            const categoryMatch = !filterCategory || 
                                 filterCategory === "All" || 
                                 toolCategories.includes(filterCategory);
            
            // Pricing Filter Logic
            const toolPricingTier = getPricingTier(tool.pricing);
            const pricingMatch = pricingFilterValue === 'all' || toolPricingTier === pricingFilterValue;

            // Rating Filter Logic
            let ratingMatch = true;
            if (ratingFilterValue !== 'all') {
                const minRating = parseInt(ratingFilterValue);
                const toolRating = parseFloat(tool.rating) || 0;
                ratingMatch = toolRating >= minRating;
            }
            
            // Return true if all conditions are met
            return nameMatch && categoryMatch && pricingMatch && ratingMatch;
        });

        // Sort the filtered tools
        filteredTools.sort((a, b) => {
            const ratingA = parseFloat(a.rating) || 0;
            const ratingB = parseFloat(b.rating) || 0;
            
            if (sortType === "rating-desc") return ratingB - ratingA;
            if (sortType === "rating-asc") return ratingA - ratingB;
            if (sortType === "name-asc") return a.name.localeCompare(b.name);
            if (sortType === "name-desc") return b.name.localeCompare(a.name);
            return 0; // Default: no change in order
        });

        // Display a message if no tools match the filters
        if (filteredTools.length === 0) {
            toolContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 py-10">No tools match your current filters.</p>';
        } else {
            // Create and append a card for each filtered tool
            filteredTools.forEach(tool => {
                const toolCard = document.createElement("div");
                toolCard.className = "bg-white p-4 rounded-lg shadow-md flex flex-col justify-between h-full";
                // Tool card HTML structure
                toolCard.innerHTML = `
                    <div>
                        <h2 class="text-xl font-bold"><a href="${tool.url}" target="_blank" class="text-blue-500 hover:underline">${tool.name}</a></h2>
                        <p class="text-gray-600 mt-1 text-sm">${tool.description || 'No description available'}</p>
                    </div>
                    <div class="mt-4 flex justify-between items-end">
                        <div class="rating-section flex items-center">
                            ${generateStars(parseFloat(tool.rating) || 0)}
                            <span class="rating-number ml-2 text-sm text-gray-600">${(parseFloat(tool.rating) || 0).toFixed(1)}</span>
                        </div>
                        <div class="pricing-section text-gray-600 text-sm">
                            ${tool.pricing && tool.pricing.toLowerCase().includes("free") ? '<i class="fas fa-hand-holding-usd pricing-icon-free" title="Free tier available"></i>' : ''}
                            ${tool.pricing && (tool.pricing.toLowerCase().includes("pro") || tool.pricing.toLowerCase().includes("plus") || tool.pricing.toLowerCase().includes("standard") || tool.pricing.toLowerCase().includes("team") || tool.pricing.toLowerCase().includes("business")) && !tool.pricing.toLowerCase().includes("enterprise") ? '<i class="fas fa-crown pricing-icon-premium" title="Paid tier"></i>' : ''}
                            ${tool.pricing && tool.pricing.toLowerCase().includes("enterprise") ? '<i class="fas fa-building pricing-icon-enterprise" title="Enterprise tier"></i>' : ''}
                        </div>
                    </div>
                `;
                toolContainer.appendChild(toolCard);
            });
        }
    }

    /**
     * Populates the category list in the sidebar.
     */
    function populateCategories() {
        // Add "All" as the default category
        categories.add("All");
        
        // Extract all unique categories from the tools data
        allTools.forEach(tool => {
            // Handle both string and array formats for categories
            const toolCategories = Array.isArray(tool.categories) ? 
                tool.categories : 
                (typeof tool.categories === 'string' ? tool.categories.split(',').map(c => c.trim()) : []);
                
            toolCategories.forEach(category => {
                if (category && category.trim() !== '') {
                    categories.add(category.trim());
                }
            });
        });
        
        categoryList.innerHTML = ''; // Clear existing categories before populating
        
        // Create a list item and link for each category
        Array.from(categories).sort().forEach(category => {
            const categoryItem = document.createElement("li");
            const categoryLink = document.createElement("a");
            // Create a URL-friendly hash for the category
            categoryLink.href = `#${category.toLowerCase().replace(/\s+/g, '-')}`; 
            categoryLink.textContent = category;
            categoryLink.className = "block p-2 rounded hover:bg-gray-700"; // Tailwind classes for styling
            
            // Add event listener to filter tools when a category is clicked
            categoryLink.addEventListener("click", (e) => {
                // Remove active state from all category links
                document.querySelectorAll('#category-list a').forEach(link => link.classList.remove('bg-gray-600', 'font-semibold'));
                // Add active state to the clicked category link
                categoryLink.classList.add('bg-gray-600', 'font-semibold');
                renderTools(); // Re-render tools with the new category filter
            });
            categoryItem.appendChild(categoryLink);
            categoryList.appendChild(categoryItem);
        });
    }
    
    /**
     * Gets the currently selected category filter.
     * @returns {string|null} The name of the active category, or null if "All" or no category is selected.
     */
    function getCurrentCategoryFilter() {
        const activeCategoryLink = categoryList.querySelector('a.bg-gray-600');
        if (activeCategoryLink) {
            const categoryName = activeCategoryLink.textContent;
            return categoryName === "All" ? null : categoryName;
        }
        return null; // Default to no specific category filter (effectively "All")
    }

    // Add event listeners for search, sort, and filter controls
    searchInput.addEventListener("input", renderTools);
    sortOptions?.addEventListener("change", renderTools);
    pricingFilterElement.addEventListener("change", renderTools); 
    ratingFilterElement.addEventListener("change", renderTools);   

    // Event listener for grid view button
    gridViewBtn?.addEventListener("click", () => {
        toolContainer.classList.remove("flex", "flex-col"); // Remove flex classes for list view
        toolContainer.classList.add("grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-3"); // Add grid classes
    });

    // Event listener for list view button
    listViewBtn?.addEventListener("click", () => {
        toolContainer.classList.remove("grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-3"); // Remove grid classes
        toolContainer.classList.add("flex", "flex-col"); // Add flex classes for list view
        // Ensure children of flex container take full width in list view
        Array.from(toolContainer.children).forEach(child => {
             child.style.width = '100%'; // Or use Tailwind class `w-full` if preferred
        });
    });

    // Initial setup calls
    populateCategories(); // Populate the category filter list
    addGoogleSheetButton(); // Add the Google Sheet link button

    // Handle hash changes for category filtering (e.g., direct links like index.html#ui-ux)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1); // Get category from URL hash
        let foundCategory = false;
        document.querySelectorAll('#category-list a').forEach(link => {
            if (link.getAttribute('href') === `#${hash}`) {
                link.click(); // Simulate a click to apply the filter and active state
                foundCategory = true;
            }
        });
        // If hash doesn't match any category, default to "All"
        if (!foundCategory) {
            const allCategoryLink = Array.from(categoryList.querySelectorAll('a')).find(a => a.textContent === "All");
            if (allCategoryLink) {
                allCategoryLink.click();
            }
        }
    });

    // Trigger initial category filter based on URL hash on page load, or default to "All"
    if (window.location.hash && window.location.hash !== "#") {
         const initialHash = window.location.hash.substring(1);
         let initialCategoryFound = false;
         document.querySelectorAll('#category-list a').forEach(link => {
            if (link.getAttribute('href') === `#${initialHash}`) {
                link.classList.add('bg-gray-600', 'font-semibold'); // Set active state
                initialCategoryFound = true;
            }
        });
        if (!initialCategoryFound) { // If hash is invalid, select "All"
            const allCategoryLink = Array.from(categoryList.querySelectorAll('a')).find(a => a.textContent === "All");
            if (allCategoryLink) {
                allCategoryLink.classList.add('bg-gray-600', 'font-semibold');
            }
        }
    } else {
        // Select "All" category by default if no hash is present
        const allCategoryLink = Array.from(categoryList.querySelectorAll('a')).find(a => a.textContent === "All");
        if (allCategoryLink) {
            allCategoryLink.classList.add('bg-gray-600', 'font-semibold');
        }
    }
    
    renderTools(); // Initial render of tools
});
