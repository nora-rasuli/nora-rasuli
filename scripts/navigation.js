// Navigation functionality
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
  }

  setupSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }

  setupKeyboardNavigation() {
    // Add keyboard navigation for project cards
    document.addEventListener("keydown", (e) => {
      const projectCards = Array.from(
        document.querySelectorAll(".project-card")
      );
      const currentIndex = projectCards.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % projectCards.length;
          projectCards[nextIndex].focus();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          const prevIndex =
            (currentIndex - 1 + projectCards.length) % projectCards.length;
          projectCards[prevIndex].focus();
          break;
        case "Home":
          e.preventDefault();
          projectCards[0].focus();
          break;
        case "End":
          e.preventDefault();
          projectCards[projectCards.length - 1].focus();
          break;
      }
    });
  }

  setupFocusManagement() {
    // Make project cards focusable
    document.addEventListener("DOMContentLoaded", () => {
      const projectCards = document.querySelectorAll(".project-card");
      projectCards.forEach((card) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute(
          "aria-label",
          `View ${
            card.querySelector(".project-title")?.textContent || "project"
          }`
        );
      });
    });

    // Add focus styles
    const style = document.createElement("style");
    style.textContent = `
            .project-card:focus {
                outline: 2px solid var(--accent-color);
                outline-offset: 2px;
            }
            
            .theme-toggle:focus {
                outline: 2px solid var(--accent-color);
                outline-offset: 2px;
            }
            
            .nav-button:focus {
                outline: 2px solid var(--accent-color);
                outline-offset: 2px;
            }
        `;
    document.head.appendChild(style);
  }

  // Utility method to navigate to a specific project
  static navigateToProject(projectId) {
    const project = window.portfolioApp?.projects?.find(
      (p) => p.id === projectId
    );
    if (project) {
      window.location.href = project.url;
    }
  }

  // Utility method to go back to home
  static goHome() {
    window.location.href = "index.html";
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Navigation();
});
