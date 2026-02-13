/**
 * Security Utilities
 * 
 * This module provides functions for input validation and sanitization
 * to prevent XSS attacks and ensure data integrity.
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} The escaped text
 */
export function escapeHtml(text) {
    if (typeof text !== 'string') {
        return text;
    }

    const map = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '&#039;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Sanitizes a string by removing potentially dangerous content
 * @param {string} text - The text to sanitize
 * @returns {string} The sanitized text
 */
export function sanitizeString(text) {
    if (typeof text !== 'string') {
        return text;
    }

    // Remove script tags and event handlers
    let sanitized = text
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '');

    return sanitized.trim();
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates a phone number (supports international formats)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') {
        return false;
    }

    // Allow digits, spaces, hyphens, plus sign, and parentheses
    const phoneRegex = /^[\d\s\-+()]{10,20}$/;
    return phoneRegex.test(phone.trim());
}

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidUrl(url) {
    if (typeof url !== 'string') {
        return false;
    }

    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

/**
 * Validates text length
 * @param {string} text - The text to validate
 * @param {number} minLength - Minimum length (inclusive)
 * @param {number} maxLength - Maximum length (inclusive)
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidLength(text, minLength, maxLength) {
    if (typeof text !== 'string') {
        return false;
    }

    const trimmed = text.trim();
    return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Validates a number is within a range
 * @param {number} value - The value to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidNumber(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

/**
 * Sanitizes and validates a contact form
 * @param {Object} formData - The form data to validate
 * @returns {Object} { valid: boolean, errors: Object, sanitized: Object }
 */
export function validateContactForm(formData) {
    const errors = {};
    const sanitized = {};

    // Validate and sanitize name
    if (!formData.name || typeof formData.name !== 'string') {
        errors.name = 'Name is required';
    } else if (!isValidLength(formData.name, 2, 100)) {
        errors.name = 'Name must be between 2 and 100 characters';
    } else {
        sanitized.name = sanitizeString(formData.name.trim());
    }

    // Validate and sanitize email
    if (!formData.email || typeof formData.email !== 'string') {
        errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    } else {
        sanitized.email = formData.email.trim().toLowerCase();
    }

    // Validate and sanitize phone (optional)
    if (formData.phone && formData.phone.trim()) {
        if (!isValidPhone(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        } else {
            sanitized.phone = formData.phone.trim();
        }
    }

    // Validate and sanitize subject
    if (!formData.subject || typeof formData.subject !== 'string') {
        errors.subject = 'Subject is required';
    } else if (!isValidLength(formData.subject, 3, 200)) {
        errors.subject = 'Subject must be between 3 and 200 characters';
    } else {
        sanitized.subject = sanitizeString(formData.subject.trim());
    }

    // Validate and sanitize message
    if (!formData.message || typeof formData.message !== 'string') {
        errors.message = 'Message is required';
    } else if (!isValidLength(formData.message, 10, 5000)) {
        errors.message = 'Message must be between 10 and 5000 characters';
    } else {
        sanitized.message = sanitizeString(formData.message.trim());
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        sanitized,
    };
}

/**
 * Sanitizes and validates a product form
 * @param {Object} formData - The form data to validate
 * @returns {Object} { valid: boolean, errors: Object, sanitized: Object }
 */
export function validateProductForm(formData) {
    const errors = {};
    const sanitized = {};

    // Validate and sanitize name
    if (!formData.name || typeof formData.name !== 'string') {
        errors.name = 'Product name is required';
    } else if (!isValidLength(formData.name, 2, 200)) {
        errors.name = 'Product name must be between 2 and 200 characters';
    } else {
        sanitized.name = sanitizeString(formData.name.trim());
    }

    // Validate and sanitize category
    if (!formData.category || typeof formData.category !== 'string') {
        errors.category = 'Category is required';
    } else if (!isValidLength(formData.category, 2, 100)) {
        errors.category = 'Category must be between 2 and 100 characters';
    } else {
        sanitized.category = sanitizeString(formData.category.trim());
    }

    // Validate and sanitize description
    if (!formData.description || typeof formData.description !== 'string') {
        errors.description = 'Description is required';
    } else if (!isValidLength(formData.description, 10, 2000)) {
        errors.description = 'Description must be between 10 and 2000 characters';
    } else {
        sanitized.description = sanitizeString(formData.description.trim());
    }

    // Validate price (optional)
    if (formData.price && formData.price.trim()) {
        if (!isValidNumber(formData.price, 0, 999999.99)) {
            errors.price = 'Please enter a valid price';
        } else {
            sanitized.price = parseFloat(formData.price);
        }
    } else {
        sanitized.price = null;
    }

    // Validate in_stock
    sanitized.in_stock = formData.in_stock === true || formData.in_stock === 'true';

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        sanitized,
    };
}

/**
 * Truncates text to a maximum length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} The truncated text
 */
export function truncateText(text, maxLength) {
    if (typeof text !== 'string') {
        return text;
    }

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Removes null and undefined values from an object
 * @param {Object} obj - The object to clean
 * @returns {Object} The cleaned object
 */
export function cleanObject(obj) {
    const cleaned = {};
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            cleaned[key] = obj[key];
        }
    }
    return cleaned;
}

// ============================================
// CSRF Protection Utilities
// ============================================

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_LENGTH = 32;

/**
 * Generates a cryptographically secure random token
 * @returns {string} The generated token
 */
export function generateCSRFToken() {
    const array = new Uint8Array(CSRF_TOKEN_LENGTH);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        // Fallback for older browsers
        for (let i = 0; i < CSRF_TOKEN_LENGTH; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Gets or creates a CSRF token for the current session
 * @returns {string} The CSRF token
 */
export function getCSRFToken() {
    let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (!token) {
        token = generateCSRFToken();
        sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    }
    return token;
}

/**
 * Validates the request origin for CSRF protection
 * @returns {boolean} True if the request origin is valid
 */
export function validateRequestOrigin() {
    const allowedOrigins = [
        window.location.origin
    ];

    const origin = window.location.origin;
    return allowedOrigins.includes(origin);
}

/**
 * Creates headers with CSRF token for state-changing requests
 * @returns {Object} Headers object with CSRF token
 */
export function getCSRFHeaders() {
    return {
        'X-CSRF-Token': getCSRFToken()
    };
}

/**
 * Validates a CSRF token
 * @param {string} token - The token to validate
 * @returns {boolean} True if valid
 */
export function validateCSRFToken(token) {
    if (!token) return false;
    const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
    return token === storedToken;
}

/**
 * Clears the CSRF token (call on logout)
 */
export function clearCSRFToken() {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
}

// ============================================
// Password Strength Validation
// ============================================

/**
 * Calculates password strength score (0-100)
 * @param {string} password - The password to evaluate
 * @returns {number} Strength score (0-100)
 */
export function calculatePasswordStrength(password) {
    if (!password) return 0;

    let score = 0;
    const length = password.length;

    // Length scoring
    if (length >= 8) score += 20;
    if (length >= 12) score += 10;
    if (length >= 16) score += 10;

    // Character type scoring
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 25;

    // Penalty for common patterns
    if (/^[a-zA-Z]+$/.test(password)) score -= 10; // Only letters
    if (/^[0-9]+$/.test(password)) score -= 10; // Only numbers
    if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters

    return Math.max(0, Math.min(100, score));
}

/**
 * Gets password strength label
 * @param {string} password - The password to evaluate
 * @returns {Object} { label: string, color: string, score: number }
 */
export function getPasswordStrength(password) {
    const score = calculatePasswordStrength(password);

    if (score < 30) {
        return { label: 'Weak', color: 'red', score };
    } else if (score < 50) {
        return { label: 'Fair', color: 'orange', score };
    } else if (score < 70) {
        return { label: 'Good', color: 'yellow', score };
    } else if (score < 85) {
        return { label: 'Strong', color: 'green', score };
    } else {
        return { label: 'Very Strong', color: 'emerald', score };
    }
}

/**
 * Validates password meets minimum requirements
 * @param {string} password - The password to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validatePassword(password) {
    const errors = [];

    if (!password) {
        return { valid: false, errors: ['Password is required'] };
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
