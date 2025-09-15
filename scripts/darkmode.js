// Dark mode functionality
class DarkMode {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
    this.updateToggleIcon();
  }

  getStoredTheme() {
    return localStorage.getItem("theme");
  }

  getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.currentTheme = theme;
    localStorage.setItem("theme", theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
    this.updateToggleIcon();
    this.animateToggle();
  }

  updateToggleIcon() {
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector(".theme-icon");
      if (icon) {
        icon.textContent = this.currentTheme === "dark" ? "☀️" : "🌙";
      }
    }
  }

  animateToggle() {
    if (this.themeToggle) {
      this.themeToggle.style.transform = "scale(0.9)";
      setTimeout(() => {
        this.themeToggle.style.transform = "scale(1)";
      }, 150);
    }
  }

  setupEventListeners() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? "dark" : "light");
          this.updateToggleIcon();
        }
      });

    // Keyboard accessibility
    if (this.themeToggle) {
      this.themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }
}

// Initialize dark mode when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DarkMode();
});
