// Loading Screen Animation
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const typewriterText = document.getElementById('typewriterText');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingBar = document.querySelector('.loading-bar');
    
    if (!loadingScreen || !typewriterText) return;
    
    const text = "LUNAR";
    let index = 0;
    let progress = 0;
    
    // Typewriter effect
    function typeWriter() {
        if (index < text.length) {
            typewriterText.innerHTML += text.charAt(index);
            index++;
            
            // Update progress
            progress = Math.min((index / text.length) * 80, 80);
            if (loadingProgress) {
                loadingProgress.style.width = `${progress}%`;
            }
            
            setTimeout(typeWriter, 150);
        } else {
            // After typing completes, fill remaining progress
            const fillProgress = setInterval(() => {
                if (progress < 100) {
                    progress += 2;
                    if (loadingProgress) {
                        loadingProgress.style.width = `${progress}%`;
                    }
                } else {
                    clearInterval(fillProgress);
                    
                    // Add completion animation
                    if (loadingBar) {
                        loadingBar.style.opacity = '0.5';
                    }
                    
                    // Hide loading screen after delay
                    setTimeout(() => {
                        loadingScreen.classList.add('fade-out');
                        
                        // Show content
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 800);
                    }, 500);
                }
            }, 50);
        }
    }
    
    // Start typewriter after a short delay
    setTimeout(typeWriter, 500);
    
    // Add wave animation to moon logo
    const moonShape = document.querySelector('.moon-shape');
    if (moonShape) {
        setInterval(() => {
            moonShape.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 5}px)`;
        }, 50);
    }
    
    // Add floating particles
    createFloatingParticles();
});

// Create floating particles for loading screen
function createFloatingParticles() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, var(--primary-purple), var(--accent-pink));
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: ${opacity};
            animation: float-particle ${duration}s linear infinite ${delay}s;
            z-index: 1;
        `;
        
        loadingScreen.appendChild(particle);
    }
    
    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100vh) translateX(20px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}