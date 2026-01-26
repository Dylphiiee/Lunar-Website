// Contact Page Functionality - Simplified Version
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const platformItems = document.querySelectorAll('.platform-item');
    
    // Add click handlers to platform items
    platformItems.forEach(item => {
        item.addEventListener('click', function() {
            const platform = this.querySelector('.platform-handle').textContent;
            copyToClipboard(platform);
        });
    });
    
    // Message Form Submission
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('senderName').value.trim(),
                email: document.getElementById('senderEmail').value.trim(),
                subject: document.getElementById('messageSubject').value.trim(),
                message: document.getElementById('messageContent').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // Validate form
            if (validateForm(formData)) {
                // Show loading state
                const submitBtn = messageForm.querySelector('.submit-message-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate sending email (in real app, this would be an API call)
                setTimeout(() => {
                    // Create mailto link with form data
                    const mailtoLink = createMailtoLink(formData);
                    
                    // Open user's email client
                    window.location.href = mailtoLink;
                    
                    // Show success message
                    showSuccessMessage();
                    
                    // Reset form
                    messageForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }
        });
    }
    
    // Form validation
    function validateForm(data) {
        const errors = [];
        
        if (!data.name) {
            errors.push('Name is required');
            highlightError('senderName');
        }
        
        if (!data.email) {
            errors.push('Email is required');
            highlightError('senderEmail');
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
            highlightError('senderEmail');
        }
        
        if (!data.subject) {
            errors.push('Subject is required');
            highlightError('messageSubject');
        }
        
        if (!data.message) {
            errors.push('Message is required');
            highlightError('messageContent');
        } else if (data.message.length < 10) {
            errors.push('Message should be at least 10 characters');
            highlightError('messageContent');
        }
        
        if (errors.length > 0) {
            showNotification(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }
    
    function highlightError(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#ff6b6b';
            field.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
            
            // Remove error highlight after 3 seconds
            setTimeout(() => {
                field.style.borderColor = '';
                field.style.boxShadow = '';
            }, 3000);
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Create mailto link with form data
    function createMailtoLink(formData) {
        const recipient = 'dylphiiee@gmail.com';
        const subject = encodeURIComponent(`[Lunar Community] ${formData.subject}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Subject: ${formData.subject}\n\n` +
            `Message:\n${formData.message}\n\n` +
            `---\nSent from Lunar Community Website`
        );
        
        return `mailto:${recipient}?subject=${subject}&body=${body}`;
    }
    
    // Show success message
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message active';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Message Prepared!</h3>
            <p>Your email client will open with the message ready to send to <strong>dylphiiee@gmail.com</strong>.</p>
            <p>Just click "Send" in your email client to complete the process.</p>
        `;
        
        // Insert after form
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.appendChild(successMessage);
            
            // Remove message after 10 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 10000);
        }
    }
    
    // Copy to clipboard function
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(`Copied to clipboard: ${text}`, 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy to clipboard', 'error');
        });
    }
    
    // Show notification function
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 30px;
                background: var(--surface-blur);
                backdrop-filter: blur(20px);
                border-radius: 10px;
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 4000;
                border: 1px solid rgba(138, 43, 226, 0.2);
                box-shadow: var(--shadow-soft);
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                max-width: 400px;
            }
            
            .notification-success {
                border-left: 4px solid #25D366;
            }
            
            .notification-error {
                border-left: 4px solid #ff6b6b;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                color: var(--text-primary);
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success .notification-content i {
                color: #25D366;
            }
            
            .notification-error .notification-content i {
                color: #ff6b6b;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.5rem;
                cursor: pointer;
                line-height: 1;
                width: 30px;
        height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: var(--transition-fast);
            }
            
            .notification-close:hover {
                background: rgba(138, 43, 226, 0.1);
                color: var(--text-primary);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.remove();
            });
        }
    }
    
    // Add hover effects to platform items
    platformItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            const icon = this.querySelector('.platform-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.platform-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Add click feedback to platform items
    platformItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.background = 'rgba(138, 43, 226, 0.2)';
            setTimeout(() => {
                this.style.background = '';
            }, 300);
        });
    });
    
    // Form input focus effects
    const formInputs = document.querySelectorAll('.message-form input, .message-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});