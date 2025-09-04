// Job Application Form - JavaScript

// Global variables
let selectedRating = 0;
let experienceYears = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

// Initialize all form functionality
function initializeForm() {
    setupRatingSystem();
    setupExperienceControls();
    setupFileUploads();
    setupFormSubmission();
    setupFormValidation();
}

// Rating system for English language ability
function setupRatingSystem() {
    const ratingNumbers = document.querySelectorAll('.rating-number');
    const englishLevelInput = document.getElementById('englishLevelInput');
    
    ratingNumbers.forEach((number, index) => {
        number.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectRating(rating);
        });
        
        number.addEventListener('mouseenter', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightRating(rating);
        });
    });
    
    // Reset highlighting when mouse leaves rating area
    document.getElementById('englishRating').addEventListener('mouseleave', function() {
        highlightRating(selectedRating);
    });
}

function selectRating(rating) {
    selectedRating = rating;
    const englishLevelInput = document.getElementById('englishLevelInput');
    englishLevelInput.value = rating;
    highlightRating(rating);
}

function highlightRating(rating) {
    const ratingNumbers = document.querySelectorAll('.rating-number');
    ratingNumbers.forEach((number, index) => {
        if (index + 1 <= rating) {
            number.classList.add('selected');
        } else {
            number.classList.remove('selected');
        }
    });
}

// Experience controls (+/- buttons)
function setupExperienceControls() {
    const experienceInput = document.getElementById('experienceInput');
    const minusBtn = document.getElementById('experienceMinus');
    const plusBtn = document.getElementById('experiencePlus');
    
    // Set initial value
    experienceInput.value = experienceYears;
    
    minusBtn.addEventListener('click', function() {
        if (experienceYears > 0) {
            experienceYears--;
            updateExperienceInput();
        }
    });
    
    plusBtn.addEventListener('click', function() {
        if (experienceYears < 50) { // Max 50 years
            experienceYears++;
            updateExperienceInput();
        }
    });
    
    // Allow manual input
    experienceInput.addEventListener('input', function() {
        const value = parseInt(this.value) || 0;
        if (value >= 0 && value <= 50) {
            experienceYears = value;
        }
    });
    
    // Validate input on blur
    experienceInput.addEventListener('blur', function() {
        updateExperienceInput();
    });
}

function updateExperienceInput() {
    const experienceInput = document.getElementById('experienceInput');
    experienceInput.value = experienceYears;
}

// File upload handlers
function setupFileUploads() {
    setupDocumentUpload();
    setupResumeUpload();
    setupDragAndDrop();
}

function setupDocumentUpload() {
    const documentsInput = document.getElementById('documents');
    const documentsUploadArea = documentsInput.parentElement;
    
    documentsInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const uploadTitle = documentsUploadArea.querySelector('.upload-title');
            const uploadSubtitle = documentsUploadArea.querySelector('.upload-subtitle');
            
            if (files.length === 1) {
                uploadTitle.textContent = files[0].name;
                uploadSubtitle.textContent = `File selected: ${formatFileSize(files[0].size)}`;
            } else {
                uploadTitle.textContent = `${files.length} files selected`;
                uploadSubtitle.textContent = 'Multiple documents uploaded';
            }
            
            documentsUploadArea.style.borderColor = '#4a90e2';
            documentsUploadArea.style.backgroundColor = '#f0f7ff';
        }
    });
}

function setupResumeUpload() {
    const resumeInput = document.getElementById('resume');
    const resumeUploadArea = resumeInput.parentElement;
    
    resumeInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const uploadTitle = resumeUploadArea.querySelector('.upload-title');
            const uploadSubtitle = resumeUploadArea.querySelector('.upload-subtitle');
            
            uploadTitle.textContent = files[0].name;
            uploadSubtitle.textContent = `Resume uploaded: ${formatFileSize(files[0].size)}`;
            
            resumeUploadArea.style.borderColor = '#4a90e2';
            resumeUploadArea.style.backgroundColor = '#f0f7ff';
        }
    });
}

function setupDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#4a90e2';
            this.style.backgroundColor = '#f0f7ff';
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            if (!this.contains(e.relatedTarget)) {
                this.style.borderColor = '#ccc';
                this.style.backgroundColor = '#fafbfc';
            }
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ccc';
            this.style.backgroundColor = '#fafbfc';
            
            const files = e.dataTransfer.files;
            const input = this.querySelector('input[type="file"]');
            
            if (files.length > 0 && input) {
                // Create a new FileList-like object
                const dt = new DataTransfer();
                for (let file of files) {
                    dt.items.add(file);
                }
                input.files = dt.files;
                
                // Trigger change event
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('jobApplicationForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (fieldName === 'height' && value) {
        // Validate height format (e.g., 175cm, 5'8", etc.)
        if (!/^\d+(\.\d+)?\s*(cm|m|ft|in|'|")?$/i.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid height (e.g., 175cm, 5\'8")';
        }
    } else if (fieldName === 'weight' && value) {
        // Validate weight format (e.g., 70kg, 155lbs, etc.)
        if (!/^\d+(\.\d+)?\s*(kg|lbs|lb)?$/i.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid weight (e.g., 70kg, 155lbs)';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Form submission
function setupFormSubmission() {
    const form = document.getElementById('jobApplicationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateForm() {
    const form = document.getElementById('jobApplicationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isFormValid = true;
    
    // Clear previous error messages
    document.querySelectorAll('.form-error, .form-success').forEach(msg => msg.remove());
    
    // Validate all required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Check if English rating is selected
    if (selectedRating === 0) {
        showFormMessage('Please select your English language ability rating.', 'error');
        isFormValid = false;
    }
    
    // Scroll to first error if any
    if (!isFormValid) {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isFormValid;
}

function submitForm() {
    const form = document.getElementById('jobApplicationForm');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    
    // Add English rating to form data
    formData.append('englishRating', selectedRating);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showFormMessage('Application submitted successfully! We will contact you soon.', 'success');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Optional: Reset form
        // form.reset();
        // resetFormState();
        
    }, 2000);
}

function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-${type}`;
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

function resetFormState() {
    selectedRating = 0;
    experienceYears = 0;
    
    // Reset rating display
    document.querySelectorAll('.rating-number').forEach(number => {
        number.classList.remove('selected');
    });
    
    // Reset experience input
    updateExperienceInput();
    
    // Reset upload areas
    document.querySelectorAll('.upload-area').forEach(area => {
        const title = area.querySelector('.upload-title');
        const subtitle = area.querySelector('.upload-subtitle');
        
        title.textContent = 'Browse Files';
        subtitle.textContent = 'Drag and drop files here';
        
        area.style.borderColor = '#ccc';
        area.style.backgroundColor = '#fafbfc';
    });
    
    // Remove error styling
    document.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });
    
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.remove();
    });
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Additional features
function setupKeyboardNavigation() {
    // Add keyboard navigation for rating system
    const ratingNumbers = document.querySelectorAll('.rating-number');
    
    ratingNumbers.forEach((number, index) => {
        number.setAttribute('tabindex', '0');
        
        number.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const rating = parseInt(this.getAttribute('data-rating'));
                selectRating(rating);
            } else if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                ratingNumbers[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < ratingNumbers.length - 1) {
                e.preventDefault();
                ratingNumbers[index + 1].focus();
            }
        });
    });
}

// Initialize keyboard navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupKeyboardNavigation();
});

// Form auto-save functionality (optional)
function setupAutoSave() {
    const form = document.getElementById('jobApplicationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            saveFormData();
        }, 1000));
    });
}

function saveFormData() {
    const form = document.getElementById('jobApplicationForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add rating data
    data.englishRating = selectedRating;
    data.experience = experienceYears;
    
    // Save to sessionStorage (temporary storage)
    try {
        sessionStorage.setItem('jobApplicationDraft', JSON.stringify(data));
    } catch (e) {
        console.warn('Unable to save form data:', e);
    }
}

function loadFormData() {
    try {
        const savedData = sessionStorage.getItem('jobApplicationDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Restore form fields
            Object.entries(data).forEach(([key, value]) => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'radio') {
                        const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else {
                        field.value = value;
                    }
                }
            });
            
            // Restore rating
            if (data.englishRating) {
                selectRating(parseInt(data.englishRating));
            }
            
            // Restore experience
            if (data.experience) {
                experienceYears = parseInt(data.experience);
                updateExperienceInput();
            }
        }
    } catch (e) {
        console.warn('Unable to load saved form data:', e);
    }
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize auto-save and load saved data
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave();
    loadFormData();
});