/**
 * Validation utilities for forms and data
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Phone number validation regex
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Validation rules for react-hook-form
 */
export const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: EMAIL_REGEX,
      message: "Please enter a valid email address",
    },
  },
  
  password: {
    required: "Password is required",
    pattern: {
      value: PASSWORD_REGEX,
      message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    },
  },
  
  confirmPassword: (password) => ({
    required: "Please confirm your password",
    validate: (value) => value === password || "Passwords do not match",
  }),
  
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    maxLength: {
      value: 50,
      message: "Name must be less than 50 characters",
    },
  },
  
  title: {
    required: "Title is required",
    minLength: {
      value: 3,
      message: "Title must be at least 3 characters",
    },
    maxLength: {
      value: 100,
      message: "Title must be less than 100 characters",
    },
  },
  
  description: {
    required: "Description is required",
    minLength: {
      value: 10,
      message: "Description must be at least 10 characters",
    },
    maxLength: {
      value: 1000,
      message: "Description must be less than 1000 characters",
    },
  },
  
  url: {
    pattern: {
      value: URL_REGEX,
      message: "Please enter a valid URL",
    },
  },
  
  phone: {
    pattern: {
      value: PHONE_REGEX,
      message: "Please enter a valid phone number",
    },
  },
  
  siteName: {
    required: "Site name is required",
    pattern: {
      value: /^[a-zA-Z0-9-]+$/,
      message: "Site name can only contain letters, numbers, and hyphens",
    },
    minLength: {
      value: 3,
      message: "Site name must be at least 3 characters",
    },
    maxLength: {
      value: 30,
      message: "Site name must be less than 30 characters",
    },
  },
};

/**
 * Validate individual fields
 */
export const validateField = (value, rules) => {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      return result;
    }
  }
  return true;
};

/**
 * Common validation functions
 */
export const validators = {
  isEmail: (value) => EMAIL_REGEX.test(value) || "Invalid email format",
  isPassword: (value) => PASSWORD_REGEX.test(value) || "Password does not meet requirements",
  isUrl: (value) => !value || URL_REGEX.test(value) || "Invalid URL format",
  isPhone: (value) => !value || PHONE_REGEX.test(value) || "Invalid phone number",
  minLength: (min) => (value) => 
    !value || value.length >= min || `Must be at least ${min} characters`,
  maxLength: (max) => (value) => 
    !value || value.length <= max || `Must be less than ${max} characters`,
  required: (value) => !!value || "This field is required",
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Validate file uploads
 */
export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    required = false,
  } = options;

  if (required && !file) {
    return "File is required";
  }

  if (!file) return true;

  if (file.size > maxSize) {
    return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`;
  }

  return true;
};