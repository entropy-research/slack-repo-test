document.addEventListener('DOMContentLoaded', () => {
    // Penguin image URLs for the gallery
    const penguinImages = [
        {
            url: "https://images.unsplash.com/photo-1598439210625-358c27a14b9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Emperor Penguins in Antarctica"
        },
        {
            url: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Adelie Penguin on Ice"
        },
        {
            url: "https://images.unsplash.com/photo-1549093497-93a18821d217?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "King Penguin Colony"
        },
        {
            url: "https://images.unsplash.com/photo-1596979240348-7c1b780c9a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Gentoo Penguin Jumping"
        },
        {
            url: "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Little Blue Penguin"
        },
        {
            url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            caption: "Penguin Family"
        }
    ];
    
    // More penguin images for the "Show Me More Penguins" button
    const morePenguinImages = [
        "https://images.unsplash.com/photo-1598439210625-358c27a14b9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1596979240348-7c1b780c9a3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ];

    // Penguin facts for random display
    const penguinFacts = [
        "There are 18 species of penguins in the world.",
        "The Emperor Penguin is the tallest of all penguin species, reaching heights of up to 4 feet tall.",
        "Penguins can drink sea water because they have a special gland that filters out the salt.",
        "The smallest penguin species is the Little Blue Penguin, standing just 16 inches tall.",
        "Penguins' distinctive black and white coloring is a form of camouflage called countershading.",
        "Some penguin species can leap 6-9 feet out of the water when swimming.",
        "Penguins spend up to 75% of their lives in the water.",
        "The Emperor Penguin can dive deeper than any other bird, reaching depths of over 1,800 feet.",
        "Penguins have a special gland that produces oil to make their feathers waterproof.",
        "Most penguin species mate for life."
    ];
    
    // DOM elements
    const penguinBtn = document.getElementById('penguinBtn');
    const mainPenguin = document.getElementById('mainPenguin');
    const penguinGallery = document.getElementById('penguinGallery');
    
    // Initialize the gallery
    function initGallery() {
        penguinGallery.innerHTML = '';
        
        penguinImages.forEach(penguin => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = penguin.url;
            img.alt = penguin.caption;
            
            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.textContent = penguin.caption;
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(caption);
            penguinGallery.appendChild(galleryItem);
        
            // Add click event to show a random penguin fact
            galleryItem.addEventListener('click', showRandomPenguinFact);
        });
    }
    
    // Show a random penguin fact when a gallery image is clicked
    function showRandomPenguinFact() {
        const randomFact = penguinFacts[Math.floor(Math.random() * penguinFacts.length)];
        
        // Create and show a fact popup
        const factPopup = document.createElement('div');
        factPopup.className = 'fact-popup';
        factPopup.innerHTML = `
            <div class="fact-popup-content">
                <h3>🐧 Penguin Fact! 🐧</h3>
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

    // Change the main penguin image when button is clicked
    let currentImageIndex = 0;
    penguinBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % morePenguinImages.length;
        mainPenguin.src = morePenguinImages[currentImageIndex];
        
        // Add a fun animation
        mainPenguin.style.transition = 'transform 0.5s ease';
        mainPenguin.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            mainPenguin.style.transform = 'scale(1)';
        }, 500);
        
        // Change button text occasionally
        if (Math.random() > 0.7) {
            const buttonTexts = [
                "More Penguins Please!",
                "I Love Penguins!",
                "Another Penguin!",
                "Penguins Are Awesome!",
                "Show Me More!"
            ];
            penguinBtn.textContent = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
        }
    });
    
    // Add a "waddle" effect to the penguin image on hover
    mainPenguin.addEventListener('mouseover', () => {
        let waddleCount = 0;
        const waddleInterval = setInterval(() => {
            mainPenguin.style.transform = waddleCount % 2 === 0 ? 'rotate(2deg)' : 'rotate(-2deg)';
            waddleCount++;
            
            if (waddleCount > 6) {
                clearInterval(waddleInterval);
                mainPenguin.style.transform = 'rotate(0deg)';
            }
        }, 200);
    });

    // Initialize the gallery when the page loads
    initGallery();
    
    // Add a fun welcome message
    console.log("🐧 Welcome to Penguin Paradise! 🐧");
});