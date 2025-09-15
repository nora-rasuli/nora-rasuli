/**
 * Theme toggle functionality
 */

import { storage, $ } from "./utils.js";

class ThemeToggle {
  constructor() {
    this.themeToggle = $(".theme-toggle");
    this.themeIcon = $(".theme-toggle__icon");
    this.currentTheme = this.getInitialTheme();

    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
  }

  getInitialTheme() {
    // Check localStorage first
    const savedTheme = storage.get("theme");
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    // Default to light
    return "light";
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    storage.set("theme", theme);
    this.updateIcon();
  }

  updateIcon() {
    if (!this.themeIcon) return;

    // Update icon based on current theme
    this.themeIcon.textContent = this.currentTheme === "dark" ? "☀️" : "🌙";

    // Update aria-label
    this.themeToggle.setAttribute(
      "aria-label",
      this.currentTheme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);

    // Announce theme change to screen readers
    this.announceThemeChange(newTheme);
  }

  announceThemeChange(theme) {
    const message = `Switched to ${theme} mode`;

    // Create a temporary element for screen reader announcement
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  bindEvents() {
    if (!this.themeToggle) return;

    // Click event
    this.themeToggle.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Keyboard event
    this.themeToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        // Only update if user hasn't manually set a preference
        const savedTheme = storage.get("theme");
        if (!savedTheme) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
    }
  }

  // Public method to get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Public method to set theme programmatically
  setThemeProgrammatically(theme) {
    if (theme === "dark" || theme === "light") {
      this.setTheme(theme);
    }
  }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeToggle();
});

// Export for use in other modules
export default ThemeToggle;
