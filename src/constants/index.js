/**
 * Application Constants
 * Centralized configuration values for the React Advanced Lab
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://jsonplaceholder.typicode.com",
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3,
};

// User Profile States (Exercise 1.1)
export const USER_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// Shopping Cart Actions (Exercise 1.2)
export const CART_LIMITS = {
  MAX_QUANTITY: 99,
  MIN_QUANTITY: 1,
  MAX_ITEMS: 50,
};

// Dashboard Configuration (Exercise 2.1)
export const DASHBOARD_CONFIG = {
  ITEMS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
};

// Modal Configuration (Exercise 3.2)
export const MODAL_CONFIG = {
  PORTAL_ID: "modal-root",
  ANIMATION_DELAY: 150,
  Z_INDEX: 1000,
};

// Form Validation (Exercise 4.1)
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  USERNAME_MIN_LENGTH: 3,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};
