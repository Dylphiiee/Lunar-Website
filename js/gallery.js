// Gallery Functionality - Simplified Version
document.addEventListener('DOMContentLoaded', function() {
    const memoryButtonsGrid = document.querySelector('.memory-buttons-grid');
    const photoFullscreen = document.getElementById('photoFullscreen');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const fullscreenTitle = document.getElementById('fullscreenTitle');
    const photoLoading = document.getElementById('photoLoading');
    const prevFullscreen = document.getElementById('prevFullscreen');
    const nextFullscreen = document.getElementById('nextFullscreen');
    const closeFullscreen = document.getElementById('closeFullscreen');
    const currentPhotoIndex = document.getElementById('currentPhotoIndex');
    const totalPhotos = document.getElementById('totalPhotos');
    
    let memories = [];
    let currentIndex = 0;
    
    // Load memories from JSON data
    function loadMemories() {
        try {
            const memoriesData = document.getElementById('memoriesData');
            if (memoriesData) {
                const data = JSON.parse(memoriesData.textContent);
                memories = data.memories;
                renderMemoryButtons();
            }
        } catch (error) {
            console.error('Error loading memories:', error);
            // Fallback to default memories
            memories = getDefaultMemories();
            renderMemoryButtons();
        }
    }
    
    // Default memories
    function getDefaultMemories() {
        const defaultMemories = [];
        for (let i = 1; i <= 9; i++) {
            defaultMemories.push({
                id: `memory${i}`,
                title: `Memory ${i}`,
                image: `gallery/memory${i}.jpg`
            });
        }
        return defaultMemories;
    }
    
    // Render memory buttons
    function renderMemoryButtons() {
        if (!memoryButtonsGrid) return;
        
        memoryButtonsGrid.innerHTML = '';
        
        memories.forEach((memory, index) => {
            const button = createMemoryButton(memory, index);
            memoryButtonsGrid.appendChild(button);
        });
        
        // Update total photos count
        if (totalPhotos) {
            totalPhotos.textContent = memories.length;
        }
    }
    
    // Create a memory button element
    function createMemoryButton(memory, index) {
        const button = document.createElement('div');
        button.className = 'memory-button fade-in';
        button.dataset.index = index;
        
        // Set animation delay
        button.style.animationDelay = `${index * 0.05}s`;
        
        button.innerHTML = `
            <div class="memory-icon">
                <i class="fas fa-image"></i>
            </div>
            <h3>${memory.title}</h3>
        `;
        
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.memory-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show photo in fullscreen
            showPhoto(index);
        });
        
        return button;
    }
    
    // Show photo in fullscreen
    function showPhoto(index) {
        if (index < 0 || index >= memories.length) return;
        
        currentIndex = index;
        const memory = memories[index];
        
        // Update UI
        fullscreenTitle.textContent = memory.title;
        currentPhotoIndex.textContent = index + 1;
        
        // Show fullscreen and loading
        photoFullscreen.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (photoLoading) {
            photoLoading.style.display = 'flex';
        }
        
        // Set photo source (simulate loading)
        setTimeout(() => {
            fullscreenImage.src = memory.image;
            fullscreenImage.alt = memory.title;
            
            // Hide loading when image loads
            fullscreenImage.onload = () => {
                if (photoLoading) {
                    photoLoading.style.display = 'none';
                }
            };
            
            // Handle image error
            fullscreenImage.onerror = () => {
                if (photoLoading) {
                    photoLoading.style.display = 'none';
                }
                // Use placeholder if image doesn't exist
                fullscreenImage.src = `https://via.placeholder.com/800x600/1a0b2a/8a2be2?text=${encodeURIComponent(memory.title)}`;
                fullscreenImage.alt = 'Memory placeholder';
            };
        }, 500);
        
        // Update navigation buttons
        updateNavigationButtons();
    }
    
    // Update navigation buttons state
    function updateNavigationButtons() {
        if (prevFullscreen) {
            prevFullscreen.disabled = currentIndex === 0;
        }
        
        if (nextFullscreen) {
            nextFullscreen.disabled = currentIndex === memories.length - 1;
        }
    }
    
    // Navigation functions
    function showPrevPhoto() {
        if (currentIndex > 0) {
            currentIndex--;
            showPhoto(currentIndex);
            
            // Update active button
            updateActiveButton();
        }
    }
    
    function showNextPhoto() {
        if (currentIndex < memories.length - 1) {
            currentIndex++;
            showPhoto(currentIndex);
            
            // Update active button
            updateActiveButton();
        }
    }
    
    function updateActiveButton() {
        document.querySelectorAll('.memory-button').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === currentIndex);
        });
    }
    
    function closeFullscreenView() {
        photoFullscreen.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Remove active class from all buttons
        document.querySelectorAll('.memory-button').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // Event Listeners
    if (prevFullscreen) {
        prevFullscreen.addEventListener('click', showPrevPhoto);
    }
    
    if (nextFullscreen) {
        nextFullscreen.addEventListener('click', showNextPhoto);
    }
    
    if (closeFullscreen) {
        closeFullscreen.addEventListener('click', closeFullscreenView);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (photoFullscreen.classList.contains('active')) {
            e.preventDefault();
            
            if (e.key === 'ArrowLeft') {
                showPrevPhoto();
            } else if (e.key === 'ArrowRight') {
                showNextPhoto();
            } else if (e.key === 'Escape') {
                closeFullscreenView();
            }
        }
    });
    
    // Close fullscreen when clicking outside image
    photoFullscreen.addEventListener('click', function(e) {
        if (e.target === this) {
            closeFullscreenView();
        }
    });
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    photoFullscreen.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    photoFullscreen.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next photo
                showNextPhoto();
            } else {
                // Swipe right - previous photo
                showPrevPhoto();
            }
        }
    }
    
    // Initialize
    loadMemories();
    
    // Add hover effect to memory buttons
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.memory-button')) {
            const button = e.target.closest('.memory-button');
            const icon = button.querySelector('.memory-icon i');
            
            // Add subtle animation to icon
            if (icon && !button.classList.contains('active')) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.memory-button')) {
            const button = e.target.closest('.memory-button');
            const icon = button.querySelector('.memory-icon i');
            
            // Reset icon if not active
            if (icon && !button.classList.contains('active')) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    });
});