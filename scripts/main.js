// Main JavaScript functionality
class PortfolioApp {
  constructor() {
    this.projects = [];
    this.currentProjectIndex = 0;
    this.init();
  }

  async init() {
    try {
      await this.loadProjects();
      this.renderProjects();
      this.setupEventListeners();
    } catch (error) {
      console.error("Error initializing portfolio:", error);
      this.showError();
    }
  }

  async loadProjects() {
    try {
      const response = await fetch("projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.projects = data.projects || [];
    } catch (error) {
      console.error("Error loading projects:", error);
      // Fallback to hardcoded projects when fetch fails (CORS issue)
      this.projects = this.getFallbackProjects();
      console.log("Using fallback projects due to CORS restrictions");
    }
  }

  getFallbackProjects() {
    return [
      {
        id: "project-1",
        title: "E-Commerce Dashboard",
        description:
          "A comprehensive admin dashboard for managing e-commerce operations with real-time analytics, inventory management, and customer insights. Built with modern web technologies and responsive design principles.",
        image: "assets/project-1.jpg",
        url: "projects/project-1.html",
        technologies: ["HTML", "CSS", "JavaScript", "Chart.js"],
        features: [
          "Real-time analytics",
          "Responsive design",
          "Interactive charts",
          "Data visualization",
        ],
      },
      {
        id: "project-2",
        title: "Weather App",
        description:
          "A clean, intuitive weather application that provides current conditions and forecasts. Features location-based weather data, beautiful animations, and a minimal interface that focuses on essential information.",
        image: "assets/project-2.jpg",
        url: "projects/project-2.html",
        technologies: ["HTML", "CSS", "JavaScript", "Weather API"],
        features: [
          "Location-based data",
          "5-day forecast",
          "Beautiful animations",
          "Minimal design",
        ],
      },
      {
        id: "project-3",
        title: "Task Management Tool",
        description:
          "A productivity-focused task management application with drag-and-drop functionality, project organization, and team collaboration features. Designed for efficiency and ease of use.",
        image: "assets/project-3.jpg",
        url: "projects/project-3.html",
        technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
        features: [
          "Drag & drop",
          "Project organization",
          "Team collaboration",
          "Data persistence",
        ],
      },
      {
        id: "project-4",
        title: "Portfolio Website",
        description:
          "A responsive portfolio website showcasing creative work and professional experience. Features smooth animations, dark mode support, and optimized performance across all devices.",
        image: "assets/project-4.jpg",
        url: "projects/project-4.html",
        technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
        features: [
          "Responsive design",
          "Dark mode",
          "Smooth animations",
          "Performance optimized",
        ],
      },
    ];
  }

  renderProjects() {
    const container = document.getElementById("projectsContainer");
    if (!container) return;

    if (this.projects.length === 0) {
      container.innerHTML = '<div class="loading">No projects available</div>';
      return;
    }

    container.innerHTML = this.projects
      .map(
        (project, index) => `
            <div class="project-card" style="animation-delay: ${index * 0.1}s">
                <div class="project-image">
                    ${this.getProjectIcon(project.title)}
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-tagline">${project.tagline || ""}</p>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${
                          project.technologies
                            ? project.technologies
                                .map(
                                  (tech) =>
                                    `<span class="tech-tag">${tech}</span>`
                                )
                                .join("")
                            : ""
                        }
                    </div>
                    <a href="${
                      project.url
                    }" class="project-link">View Project</a>
                </div>
            </div>
        `
      )
      .join("");
  }

  getProjectIcon(title) {
    // Simple icon mapping based on project title
    const iconMap = {
      "E-Commerce": "🛒",
      Weather: "🌤️",
      "Task Management": "✅",
      Portfolio: "💼",
      Dashboard: "📊",
      App: "📱",
    };

    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.toLowerCase().includes(keyword.toLowerCase())) {
        return icon;
      }
    }
    return "🚀"; // Default icon
  }

  setupEventListeners() {
    // Add click handlers for project cards
    document.addEventListener("click", (e) => {
      const projectCard = e.target.closest(".project-card");
      if (projectCard) {
        const projectLink = projectCard.querySelector(".project-link");
        if (projectLink) {
          window.location.href = projectLink.href;
        }
      }
    });

    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const focusedCard = document.activeElement.closest(".project-card");
        if (focusedCard) {
          e.preventDefault();
          const projectLink = focusedCard.querySelector(".project-link");
          if (projectLink) {
            window.location.href = projectLink.href;
          }
        }
      }
    });
  }

  showError() {
    const container = document.getElementById("projectsContainer");
    if (container) {
      container.innerHTML = `
                <div class="error-message">
                    <h3>Unable to load projects</h3>
                    <p>Please check your connection and try again.</p>
                </div>
            `;
    }
  }
}

// Project page functionality
class ProjectPage {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.currentIndex = 0;
    this.init();
  }

  async init() {
    try {
      await this.loadProjects();
      this.setupProjectPage();
      this.setupNavigation();
    } catch (error) {
      console.error("Error initializing project page:", error);
    }
  }

  async loadProjects() {
    try {
      const response = await fetch("../projects.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.projects = data.projects || [];
    } catch (error) {
      console.error("Error loading projects:", error);
      // Fallback to hardcoded projects when fetch fails (CORS issue)
      this.projects = this.getFallbackProjects();
      console.log("Using fallback projects due to CORS restrictions");
    }
  }

  getFallbackProjects() {
    return [
      {
        id: "project-1",
        title: "E-Commerce Dashboard",
        description:
          "A comprehensive admin dashboard for managing e-commerce operations with real-time analytics, inventory management, and customer insights. Built with modern web technologies and responsive design principles.",
        image: "assets/project-1.jpg",
        url: "projects/project-1.html",
        technologies: ["HTML", "CSS", "JavaScript", "Chart.js"],
        features: [
          "Real-time analytics",
          "Responsive design",
          "Interactive charts",
          "Data visualization",
        ],
      },
      {
        id: "project-2",
        title: "Weather App",
        description:
          "A clean, intuitive weather application that provides current conditions and forecasts. Features location-based weather data, beautiful animations, and a minimal interface that focuses on essential information.",
        image: "assets/project-2.jpg",
        url: "projects/project-2.html",
        technologies: ["HTML", "CSS", "JavaScript", "Weather API"],
        features: [
          "Location-based data",
          "5-day forecast",
          "Beautiful animations",
          "Minimal design",
        ],
      },
      {
        id: "project-3",
        title: "Task Management Tool",
        description:
          "A productivity-focused task management application with drag-and-drop functionality, project organization, and team collaboration features. Designed for efficiency and ease of use.",
        image: "assets/project-3.jpg",
        url: "projects/project-3.html",
        technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
        features: [
          "Drag & drop",
          "Project organization",
          "Team collaboration",
          "Data persistence",
        ],
      },
      {
        id: "project-4",
        title: "Portfolio Website",
        description:
          "A responsive portfolio website showcasing creative work and professional experience. Features smooth animations, dark mode support, and optimized performance across all devices.",
        image: "assets/project-4.jpg",
        url: "projects/project-4.html",
        technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
        features: [
          "Responsive design",
          "Dark mode",
          "Smooth animations",
          "Performance optimized",
        ],
      },
    ];
  }

  setupProjectPage() {
    const projectId = this.getProjectIdFromUrl();
    this.currentIndex = this.projects.findIndex((p) => p.id === projectId);

    if (this.currentIndex === -1) {
      this.showProjectNotFound();
      return;
    }

    this.currentProject = this.projects[this.currentIndex];
    this.renderProject();
  }

  getProjectIdFromUrl() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();
    return filename.replace(".html", "");
  }

  renderProject() {
    if (!this.currentProject) return;

    // Update page title
    document.title = `${this.currentProject.title} - Portfolio`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = this.currentProject.description;
    }

    // Render project content
    const container = document.querySelector(".project-content");
    if (container) {
      container.innerHTML = `
                <!-- Project Overview -->
                <section class="project-overview">
                    <h1 class="project-title">${this.currentProject.title}</h1>
                    <p class="project-tagline">${
                      this.currentProject.tagline || ""
                    }</p>
                    <p class="project-description">${
                      this.currentProject.description
                    }</p>
                    <div class="project-links">
                        <a href="${
                          this.currentProject.figmaLink || "#"
                        }" class="project-link" target="_blank" rel="noopener">
                            <span class="link-icon">🎨</span>
                            View Figma Design
                        </a>
                        <a href="${
                          this.currentProject.githubLink || "#"
                        }" class="project-link" target="_blank" rel="noopener">
                            <span class="link-icon">💻</span>
                            View on GitHub
                        </a>
                    </div>
                </section>

                <!-- Problem Statement -->
                <section class="project-section">
                    <h2 class="section-title">Problem Statement</h2>
                    <p class="section-content">${
                      this.currentProject.problem || ""
                    }</p>
                </section>

                <!-- Research & Approach -->
                <section class="project-section">
                    <h2 class="section-title">Research & Approach</h2>
                    <p class="section-content">${
                      this.currentProject.research || ""
                    }</p>
                </section>

                <!-- Design & Figma -->
                <section class="project-section">
                    <h2 class="section-title">Design & Figma</h2>
                    <p class="section-content">${
                      this.currentProject.design || ""
                    }</p>
                    <div class="project-image-large">
                        ${this.getProjectIcon(this.currentProject.title)}
                    </div>
                </section>

                <!-- Development -->
                <section class="project-section">
                    <h2 class="section-title">Development</h2>
                    <p class="section-content">${
                      this.currentProject.development || ""
                    }</p>
                    <div class="technologies-section">
                        <h3>Technologies Used</h3>
                        <div class="technologies-list">
                            ${
                              this.currentProject.technologies
                                ? this.currentProject.technologies
                                    .map(
                                      (tech) =>
                                        `<span class="tech-tag-large">${tech}</span>`
                                    )
                                    .join("")
                                : ""
                            }
                        </div>
                    </div>
                </section>

                <!-- Outcome & Impact -->
                <section class="project-section">
                    <h2 class="section-title">Outcome & Impact</h2>
                    <p class="section-content">${
                      this.currentProject.outcome || ""
                    }</p>
                    <div class="improvements-section">
                        <h3>Future Improvements</h3>
                        <p>${this.currentProject.improvements || ""}</p>
                    </div>
                </section>
            `;
    }

    this.updateNavigation();
  }

  getProjectIcon(title) {
    const iconMap = {
      "E-Commerce": "🛒",
      Weather: "🌤️",
      "Task Management": "✅",
      Portfolio: "💼",
      Dashboard: "📊",
      App: "📱",
    };

    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (title.toLowerCase().includes(keyword.toLowerCase())) {
        return icon;
      }
    }
    return "🚀";
  }

  setupNavigation() {
    const prevButton = document.querySelector(".nav-button.prev");
    const nextButton = document.querySelector(".nav-button.next");

    if (prevButton) {
      prevButton.addEventListener("click", () => this.navigateToProject(-1));
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => this.navigateToProject(1));
    }
  }

  updateNavigation() {
    const prevButton = document.querySelector(".nav-button.prev");
    const nextButton = document.querySelector(".nav-button.next");

    if (prevButton) {
      const prevIndex =
        this.currentIndex > 0
          ? this.currentIndex - 1
          : this.projects.length - 1;
      const prevProject = this.projects[prevIndex];
      prevButton.href = prevProject ? `${prevProject.id}.html` : "#";
      prevButton.textContent = `Previous: ${
        prevProject ? prevProject.title : "None"
      }`;
    }

    if (nextButton) {
      const nextIndex =
        this.currentIndex < this.projects.length - 1
          ? this.currentIndex + 1
          : 0;
      const nextProject = this.projects[nextIndex];
      nextButton.href = nextProject ? `${nextProject.id}.html` : "#";
      nextButton.textContent = `Next: ${
        nextProject ? nextProject.title : "None"
      }`;
    }
  }

  navigateToProject(direction) {
    const newIndex =
      direction === 1
        ? (this.currentIndex + 1) % this.projects.length
        : (this.currentIndex - 1 + this.projects.length) % this.projects.length;

    const newProject = this.projects[newIndex];
    if (newProject) {
      window.location.href = `${newProject.id}.html`;
    }
  }

  showProjectNotFound() {
    const container = document.querySelector(".project-content");
    if (container) {
      container.innerHTML = `
                <div class="error-message">
                    <h1>Project Not Found</h1>
                    <p>The requested project could not be found.</p>
                    <a href="../index.html" class="back-button">← Back to Home</a>
                </div>
            `;
    }
  }
}

// Initialize the appropriate app based on the current page
document.addEventListener("DOMContentLoaded", () => {
  const isProjectPage = window.location.pathname.includes("/projects/");

  if (isProjectPage) {
    window.portfolioApp = new ProjectPage();
  } else {
    window.portfolioApp = new PortfolioApp();
  }
});
