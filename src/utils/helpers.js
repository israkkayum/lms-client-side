import { FILE_LIMITS, ERROR_MESSAGES } from "./constants";

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {string} type - Type of file (image, video, document)
 * @returns {object} Validation result
 */
export const validateFile = (file, type = "document") => {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  const typeConfig = {
    image: {
      maxSize: FILE_LIMITS.IMAGE_MAX_SIZE,
      allowedTypes: FILE_LIMITS.ALLOWED_IMAGE_TYPES,
    },
    video: {
      maxSize: FILE_LIMITS.VIDEO_MAX_SIZE,
      allowedTypes: FILE_LIMITS.ALLOWED_VIDEO_TYPES,
    },
    document: {
      maxSize: FILE_LIMITS.DOCUMENT_MAX_SIZE,
      allowedTypes: FILE_LIMITS.ALLOWED_DOCUMENT_TYPES,
    },
  };

  const config = typeConfig[type];
  if (!config) {
    return { isValid: false, error: "Invalid file type configuration" };
  }

  if (file.size > config.maxSize) {
    return {
      isValid: false,
      error: `${ERROR_MESSAGES.FILE_TOO_LARGE} Maximum size: ${formatFileSize(
        config.maxSize
      )}`,
    };
  }

  if (!config.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate reading time for content
 * @param {string} content - HTML content
 * @returns {number} Reading time in minutes
 */
export const calculateReadTime = (content) => {
  const plainText = content.replace(/<[^>]*>/g, "");
  const words = plainText.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(words / 200); // 200 words per minute
  return Math.max(1, readTimeMinutes);
};

/**
 * Format date in a consistent way
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 8) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Check if user has permission
 * @param {object} user - User object
 * @param {string} resource - Resource being accessed
 * @param {string} action - Action being performed
 * @returns {boolean} Whether user has permission
 */
export const hasPermission = (user, resource, action) => {
  // Basic permission logic - can be extended
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === "admin") return true;
  
  // Teachers can manage their own content
  if (user.profileType === "teacher" && action === "manage") return true;
  
  // Students can view content they're enrolled in
  if (user.profileType === "student" && action === "view") return true;
  
  return false;
};

/**
 * Create a safe image URL from base64 data
 * @param {string} base64Data - Base64 image data
 * @param {string} fallbackUrl - Fallback URL if data is invalid
 * @returns {string} Safe image URL
 */
export const createSafeImageUrl = (base64Data, fallbackUrl = "/default-avatar.png") => {
  if (!base64Data) return fallbackUrl;
  
  try {
    // Check if it's already a data URL
    if (base64Data.startsWith("data:")) {
      return base64Data;
    }
    
    // Create data URL from base64
    return `data:image/png;base64,${base64Data}`;
  } catch (error) {
    console.warn("Invalid base64 image data:", error);
    return fallbackUrl;
  }
};

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 422:
      return data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }
};