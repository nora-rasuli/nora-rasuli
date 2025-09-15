/**
 * Project detail page rendering functionality
 */

import {
  $,
  $$,
  createElement,
  getSlugFromUrl,
  handleError,
  sortBy,
} from "./utils.js";
import seo from "./seo.js";

class ProjectRenderer {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.currentIndex = -1;

    this.init();
  }

  async init() {
    try {
      await this.loadProjects();
      const slug = getSlugFromUrl();

      if (!slug) {
        this.showNotFound();
        return;
      }

      this.currentProject = this.findProjectBySlug(slug);

      if (!this.currentProject) {
        this.showNotFound();
        return;
      }

      this.currentIndex = this.projects.findIndex((p) => p.slug === slug);
      this.renderProject();
      this.setupNavigation();
      this.setupTableOfContents();
    } catch (error) {
      handleError(error, "initializing project page");
      this.showError();
    }
  }

  async loadProjects() {
    try {
      // Try multiple possible paths for GitHub Pages compatibility
      const possiblePaths = [
        "/data/projects.json",
        "./data/projects.json",
        "data/projects.json",
        "/projects.json",
        "./projects.json",
        "projects.json",
        "/nora-rasuli/data/projects.json",
      ];

      let response = null;
      let lastError = null;

      for (const path of possiblePaths) {
        try {
          console.log(`Trying to load projects from: ${path}`);
          response = await fetch(path);
          if (response.ok) {
            console.log(`Successfully loaded projects from: ${path}`);
            break;
          }
        } catch (err) {
          console.log(`Failed to load from ${path}:`, err.message);
          lastError = err;
        }
      }

      if (!response || !response.ok) {
        throw new Error(
          `HTTP error! status: ${
            response?.status || "Network error"
          }. Tried paths: ${possiblePaths.join(", ")}`
        );
      }

      const data = await response.json();
      this.projects = data.projects || [];

      // Sort projects by year (descending), then by title
      this.projects = sortBy(this.projects, "year", "desc");
    } catch (error) {
      console.error("Error loading projects:", error);
      throw error;
    }
  }

  findProjectBySlug(slug) {
    return this.projects.find((project) => project.slug === slug);
  }

  renderProject() {
    if (!this.currentProject) return;

    // Update SEO
    seo.generateProjectSEO(this.currentProject);

    // Render header
    this.renderHeader();

    // Render sections
    this.renderOverview();
    this.renderProblemGoals();
    this.renderResearchUX();
    this.renderDesign();
    this.renderBuild();
    this.renderDemoCode();
    this.renderOutcomes();
    this.renderGallery();

    // Show/hide sections based on available data
    this.toggleSections();
  }

  renderHeader() {
    const project = this.currentProject;

    // Update title
    const title = $("#project-title");
    if (title) title.textContent = project.title;

    // Update subtitle
    const subtitle = $("#project-subtitle");
    if (subtitle) subtitle.textContent = project.subtitle || "";

    // Update meta information
    const role = $("#project-role");
    if (role) role.textContent = project.role || "";

    const year = $("#project-year");
    if (year) year.textContent = project.year || "";

    const status = $("#project-status");
    if (status) status.textContent = project.status || "";

    // Render tags
    this.renderTags();

    // Render links
    this.renderLinks();

    // Render hero image
    this.renderHeroImage();
  }

  renderTags() {
    const container = $("#project-tags");
    if (!container || !this.currentProject.tags) return;

    container.innerHTML = "";

    this.currentProject.tags.forEach((tag) => {
      const tagElement = createElement("span", {
        className: "tag",
        textContent: tag,
      });
      container.appendChild(tagElement);
    });
  }

  renderLinks() {
    const container = $("#project-links");
    if (!container || !this.currentProject.links) return;

    container.innerHTML = "";

    const links = this.currentProject.links;

    if (links.live) {
      const liveLink = createElement("a", {
        className: "button button--primary",
        href: links.live,
        target: "_blank",
        rel: "noopener noreferrer",
        textContent: "Live Demo",
      });
      container.appendChild(liveLink);
    }

    if (links.repo) {
      const repoLink = createElement("a", {
        className: "button button--secondary",
        href: links.repo,
        target: "_blank",
        rel: "noopener noreferrer",
        textContent: "View Code",
      });
      container.appendChild(repoLink);
    }

    if (links.figma) {
      const figmaLink = createElement("a", {
        className: "button button--secondary",
        href: links.figma,
        target: "_blank",
        rel: "noopener noreferrer",
        textContent: "Figma",
      });
      container.appendChild(figmaLink);
    }
  }

  renderHeroImage() {
    const container = $("#project-hero-image");
    if (!container) return;

    if (this.currentProject.heroImage) {
      const img = createElement("img", {
        src: this.currentProject.heroImage,
        alt: `${this.currentProject.title} hero image`,
        loading: "lazy",
      });
      container.appendChild(img);
    } else {
      container.innerHTML =
        '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: var(--color-surface); color: var(--color-text-muted);">No image available</div>';
    }
  }

  renderOverview() {
    const container = $("#overview-content");
    if (!container || !this.currentProject.overview) return;

    container.innerHTML = `<p>${this.currentProject.overview}</p>`;
  }

  renderProblemGoals() {
    const problemContent = $("#problem-text");
    const goalsContent = $("#goals-text");
    const section = $("#problem-goals");

    if (!section) return;

    let hasContent = false;

    // Render problem
    if (problemContent && this.currentProject.problem) {
      if (Array.isArray(this.currentProject.problem)) {
        problemContent.innerHTML =
          "<ul>" +
          this.currentProject.problem
            .map((item) => `<li>${item}</li>`)
            .join("") +
          "</ul>";
      } else {
        problemContent.innerHTML = `<p>${this.currentProject.problem}</p>`;
      }
      $("#problem-content").style.display = "block";
      hasContent = true;
    }

    // Render goals
    if (goalsContent && this.currentProject.goals) {
      goalsContent.innerHTML =
        "<ul>" +
        this.currentProject.goals.map((goal) => `<li>${goal}</li>`).join("") +
        "</ul>";
      $("#goals-content").style.display = "block";
      hasContent = true;
    }

    if (hasContent) {
      section.style.display = "block";
    }
  }

  renderResearchUX() {
    const container = $("#research-content");
    const section = $("#research-ux");

    if (!section) return;

    if (container && this.currentProject.research) {
      if (Array.isArray(this.currentProject.research)) {
        container.innerHTML =
          "<ul>" +
          this.currentProject.research
            .map((item) => `<li>${item}</li>`)
            .join("") +
          "</ul>";
      } else {
        container.innerHTML = `<p>${this.currentProject.research}</p>`;
      }
      section.style.display = "block";
    }
  }

  renderDesign() {
    const container = $("#design-content");
    const section = $("#design");

    if (!section) return;

    if (container && this.currentProject.design) {
      let content = "";

      if (this.currentProject.design.description) {
        content += `<p>${this.currentProject.design.description}</p>`;
      }

      if (
        this.currentProject.design.images &&
        this.currentProject.design.images.length > 0
      ) {
        content += '<div class="gallery">';
        this.currentProject.design.images.forEach((image) => {
          content += `
            <div class="gallery__item">
              <img src="${image.src}" alt="${
            image.alt
          }" class="gallery__image" loading="lazy">
              ${
                image.caption
                  ? `<div class="gallery__caption">${image.caption}</div>`
                  : ""
              }
            </div>
          `;
        });
        content += "</div>";
      }

      container.innerHTML = content;
      section.style.display = "block";
    }
  }

  renderBuild() {
    const container = $("#build-content");
    const section = $("#build");

    if (!section) return;

    if (container && this.currentProject.build) {
      let content = "";

      if (this.currentProject.build.description) {
        content += `<p>${this.currentProject.build.description}</p>`;
      }

      if (
        this.currentProject.build.features &&
        this.currentProject.build.features.length > 0
      ) {
        content += "<ul>";
        this.currentProject.build.features.forEach((feature) => {
          content += `<li>${feature}</li>`;
        });
        content += "</ul>";
      }

      container.innerHTML = content;
      section.style.display = "block";
    }
  }

  renderDemoCode() {
    const container = $("#demo-content");
    const section = $("#demo-code");

    if (!section) return;

    if (container && this.currentProject.demo) {
      container.innerHTML = `<p>${this.currentProject.demo}</p>`;
      section.style.display = "block";
    }
  }

  renderOutcomes() {
    const container = $("#outcomes-content");
    const section = $("#outcomes");

    if (!section) return;

    if (
      container &&
      this.currentProject.outcomes &&
      this.currentProject.outcomes.length > 0
    ) {
      let content = '<div class="outcomes">';

      this.currentProject.outcomes.forEach((outcome) => {
        if (typeof outcome === "object" && outcome.label && outcome.value) {
          content += `
            <div class="outcome-metric">
              <div class="outcome-metric__value">${outcome.value}</div>
              <div class="outcome-metric__label">${outcome.label}</div>
            </div>
          `;
        }
      });

      content += "</div>";
      container.innerHTML = content;
      section.style.display = "block";
    }
  }

  renderGallery() {
    const container = $("#gallery-content");
    const section = $("#gallery");

    if (!section) return;

    if (
      container &&
      this.currentProject.gallery &&
      this.currentProject.gallery.length > 0
    ) {
      let content = '<div class="gallery">';

      this.currentProject.gallery.forEach((image) => {
        content += `
          <div class="gallery__item">
            <img src="${image.src}" alt="${
          image.alt
        }" class="gallery__image" loading="lazy">
            ${
              image.caption
                ? `<div class="gallery__caption">${image.caption}</div>`
                : ""
            }
          </div>
        `;
      });

      content += "</div>";
      container.innerHTML = content;
      section.style.display = "block";
    }
  }

  toggleSections() {
    const sections = $$(".project-section");
    sections.forEach((section) => {
      const hasContent = section
        .querySelector(".project-section__content")
        ?.textContent.trim();
      if (!hasContent) {
        section.style.display = "none";
      }
    });
  }

  setupTableOfContents() {
    const tocList = $("#toc-list");
    if (!tocList) return;

    const sections = $$(
      '.project-section[style*="block"], .project-section:not([style*="none"])'
    );

    tocList.innerHTML = "";

    sections.forEach((section, index) => {
      const title = section.querySelector(".project-section__title");
      if (!title) return;

      const id = section.id || `section-${index}`;
      section.id = id;

      const link = createElement("a", {
        className: "toc__link",
        href: `#${id}`,
        textContent: title.textContent,
      });

      const item = createElement("li", {
        className: "toc__item",
      });

      item.appendChild(link);
      tocList.appendChild(item);
    });

    // Add scroll spy functionality
    this.setupScrollSpy();
  }

  setupScrollSpy() {
    const tocLinks = $$(".toc__link");
    if (tocLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const link = $(`.toc__link[href="#${id}"]`);

            // Remove active class from all links
            tocLinks.forEach((l) => l.classList.remove("toc__link--active"));

            // Add active class to current link
            if (link) {
              link.classList.add("toc__link--active");
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    // Observe all sections
    const sections = $$(".project-section[id]");
    sections.forEach((section) => observer.observe(section));
  }

  setupNavigation() {
    const navFooter = $("#project-nav-footer");
    if (!navFooter || this.projects.length <= 1) return;

    const prevLink = $("#prev-project");
    const nextLink = $("#next-project");
    const prevTitle = $("#prev-project-title");
    const nextTitle = $("#next-project-title");

    // Previous project
    if (this.currentIndex > 0) {
      const prevProject = this.projects[this.currentIndex - 1];
      prevLink.href = `${prevProject.slug}.html`;
      prevTitle.textContent = prevProject.title;
    } else {
      prevLink.style.display = "none";
    }

    // Next project
    if (this.currentIndex < this.projects.length - 1) {
      const nextProject = this.projects[this.currentIndex + 1];
      nextLink.href = `${nextProject.slug}.html`;
      nextTitle.textContent = nextProject.title;
    } else {
      nextLink.style.display = "none";
    }

    navFooter.style.display = "block";
  }

  showNotFound() {
    const main = $(".main");
    if (!main) return;

    main.innerHTML = `
      <div class="error-page">
        <div class="error-page__container">
          <h1 class="error-page__title">404</h1>
          <h2 class="error-page__subtitle">Project Not Found</h2>
          <p class="error-page__description">
            The project you're looking for doesn't exist or has been moved.
          </p>
          <div class="error-page__actions">
            <a href="../" class="button button--primary">Go Home</a>
            <a href="../#projects" class="button button--secondary">View Projects</a>
          </div>
        </div>
      </div>
    `;
  }

  showError() {
    const main = $(".main");
    if (!main) return;

    main.innerHTML = `
      <div class="error-page">
        <div class="error-page__container">
          <h1 class="error-page__title">Error</h1>
          <h2 class="error-page__subtitle">Something went wrong</h2>
          <p class="error-page__description">
            Unable to load the project. Please try again later.
          </p>
          <div class="error-page__actions">
            <a href="../" class="button button--primary">Go Home</a>
            <button onclick="location.reload()" class="button button--secondary">Retry</button>
          </div>
        </div>
      </div>
    `;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProjectRenderer();
});

// Export for use in other modules
export default ProjectRenderer;
