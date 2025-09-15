/**
 * Utility functions for the portfolio website
 */

// DOM helpers
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

// Create element with attributes and content
export const createElement = (tag, attributes = {}, content = "") => {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      element.className = value;
    } else if (key === "innerHTML") {
      element.innerHTML = value;
    } else if (key === "textContent") {
      element.textContent = value;
    } else if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });

  if (content) {
    element.innerHTML = content;
  }

  return element;
};

// Truncate text to specified length
export const truncate = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

// Get URL parameters
export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
};

// Get slug from URL path
export const getSlugFromUrl = () => {
  const path = window.location.pathname;
  const segments = path.split("/").filter((segment) => segment);

  // Handle /projects/{slug}.html pattern
  if (segments[0] === "projects" && segments[1]) {
    return segments[1].replace(".html", "");
  }

  // Handle /projects/{slug}/ pattern
  if (segments[0] === "projects" && segments[1]) {
    return segments[1];
  }

  return null;
};

// Debounce function
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

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Generate unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Check if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Smooth scroll to element
export const scrollToElement = (element, offset = 0) => {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

// Lazy load images
export const lazyLoadImages = () => {
  const images = $$("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
};

// Accessibility helpers
export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
};

// Announce to screen readers
export const announceToScreenReader = (message) => {
  const announcement = createElement("div", {
    "aria-live": "polite",
    "aria-atomic": "true",
    className: "sr-only",
    textContent: message,
  });

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    announceToScreenReader("Copied to clipboard");
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    return false;
  }
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Error writing to localStorage:", error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error removing from localStorage:", error);
      return false;
    }
  },
};

// Error handling
export const handleError = (error, context = "") => {
  console.error(`Error ${context}:`, error);

  // Show user-friendly error message
  const errorMessage = createElement("div", {
    className: "error-message",
    textContent: "Something went wrong. Please try again later.",
  });

  errorMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-error);
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    z-index: 1000;
    max-width: 300px;
  `;

  document.body.appendChild(errorMessage);

  setTimeout(() => {
    if (errorMessage.parentNode) {
      errorMessage.parentNode.removeChild(errorMessage);
    }
  }, 5000);
};

// Performance helpers
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// URL helpers
export const buildUrl = (path, params = {}) => {
  const url = new URL(path, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Array helpers
export const unique = (array) => [...new Set(array)];

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// String helpers
export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};
