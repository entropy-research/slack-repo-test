document.addEventListener('DOMContentLoaded', () => {
    // Fish image URLs for the gallery
    const fishImages = [
        {
            url: "https://images.unsplash.com/photo-1598439210625-358c27a14b9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Whale Shark in the Ocean"
        },
        {
            url: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Clownfish in Coral Reef"
        },
        {
            url: "https://images.unsplash.com/photo-1549093497-93a18821d217?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "School of Tropical Fish"
        },
        {
            url: "https://images.unsplash.com/photo-1596979240348-7c1b780c9a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Angelfish Swimming"
        },
        {
            url: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Colorful Betta Fish"
        },
        {
            url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Fish Family"
        }
    ];
    
    // More fish images for the "Show Me More Fish" button
    const moreFishImages = [
        "https://images.unsplash.com/photo-1598439210625-358c27a14b9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596979240348-7c1b780c9a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ];

    // Fish facts for random display
    const fishFacts = [
        "There are over 33,000 species of fish in the world.",
        "The Whale Shark is the largest fish species, growing up to 40 feet long.",
        "Fish can taste with their entire bodies, not just their mouths.",
        "The smallest fish species is the Paedocypris, measuring just 7.9mm in length.",
        "Many fish have color-changing abilities to help with camouflage.",
        "Some fish species can leap up to 10 feet out of the water when swimming.",
        "Fish are the oldest vertebrate group, dating back over 500 million years.",
        "The Mariana snailfish can live at depths of over 26,000 feet.",
        "Fish have specialized scales that help them move efficiently through water.",
        "Some species of fish can change their gender during their lifetime."
    ];
    
    // DOM elements
    const fishBtn = document.getElementById('fishBtn');
    const mainFish = document.getElementById('mainFish');
    const fishGallery = document.getElementById('fishGallery');
    
    // Initialize the gallery
    function initGallery() {
        fishGallery.innerHTML = '';
        
        fishImages.forEach(fish => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = fish.url;
            img.alt = fish.caption;
            
            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.textContent = fish.caption;
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(caption);
            fishGallery.appendChild(galleryItem);
        
            // Add click event to show a random fish fact
            galleryItem.addEventListener('click', showRandomFishFact);
        });
    }
    
    // Show a random fish fact when a gallery image is clicked
    function showRandomFishFact() {
        const randomFact = fishFacts[Math.floor(Math.random() * fishFacts.length)];
        
        // Create and show a fact popup
        const factPopup = document.createElement('div');
        factPopup.className = 'fact-popup';
        factPopup.innerHTML = `
            <div class="fact-popup-content">
                <h3>🐟 Fish Fact! 🐟</h3>
                <p>${randomFact}</p>
                <button class="close-popup">Close</button>
            </div>
        `;
        
        document.body.appendChild(factPopup);
            
        // Style the popup
        const popupStyle = document.createElement('style');
        popupStyle.textContent = `
            .fact-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .fact-popup-content {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                max-width: 400px;
                text-align: center;
            }
            .close-popup {
                margin-top: 15px;
            }
        `;
        document.head.appendChild(popupStyle);
        
        // Add close functionality
        const closeBtn = factPopup.querySelector('.close-popup');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(factPopup);
        });
    }

    // Change the main fish image when button is clicked
    let currentImageIndex = 0;
    fishBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % moreFishImages.length;
        mainFish.src = moreFishImages[currentImageIndex];
        
        // Add a fun animation
        mainFish.style.transition = 'transform 0.5s ease';
        mainFish.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            mainFish.style.transform = 'scale(1)';
        }, 500);
        
        // Change button text occasionally
        if (Math.random() > 0.7) {
            const buttonTexts = [
                "More Fish Please!",
                "I Love Fish!",
                "Another Fish!",
                "Fish Are Awesome!",
                "Show Me More!"
            ];
            fishBtn.textContent = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
        }
    });
    
    // Add a "swim" effect to the fish image on hover
    mainFish.addEventListener('mouseover', () => {
        let swimCount = 0;
        const swimInterval = setInterval(() => {
            mainFish.style.transform = swimCount % 2 === 0 ? 'translateX(5px)' : 'translateX(-5px)';
            swimCount++;
            
            if (swimCount > 6) {
                clearInterval(swimInterval);
                mainFish.style.transform = 'translateX(0)';
            }
        }, 200);
    });

    // Initialize the gallery when the page loads
    initGallery();
    
    // Add a fun welcome message
    console.log("🐟 Welcome to Fish Paradise! 🐟");
});