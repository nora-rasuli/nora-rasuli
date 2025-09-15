/**
 * Homepage rendering functionality
 */

import {
  $,
  $$,
  createElement,
  truncate,
  debounce,
  unique,
  sortBy,
  handleError,
} from "./utils.js";

class HomepageRenderer {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.categories = [];
    this.searchTerm = "";
    this.selectedCategory = "";

    this.init();
  }

  async init() {
    try {
      await this.loadProjects();
      this.setupFilters();
      this.renderProjects();
      this.bindEvents();
    } catch (error) {
      handleError(error, "initializing homepage");
      this.showErrorState();
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
      this.filteredProjects = [...this.projects];

      // Sort projects by year (descending), then by title
      this.projects = sortBy(this.projects, "year", "desc");
      this.filteredProjects = [...this.projects];

      // Extract unique categories from tags
      this.categories = unique(
        this.projects.flatMap((project) => project.tags || [])
      ).sort();
    } catch (error) {
      console.error("Error loading projects:", error);
      throw error;
    }
  }

  setupFilters() {
    const categoryFilter = $("#category-filter");
    const searchFilter = $("#search-filter");

    if (!categoryFilter || !searchFilter) return;

    // Populate category filter
    categoryFilter.innerHTML = '<option value="">All Projects</option>';
    this.categories.forEach((category) => {
      const option = createElement("option", {
        value: category,
        textContent: category,
      });
      categoryFilter.appendChild(option);
    });
  }

  bindEvents() {
    const categoryFilter = $("#category-filter");
    const searchFilter = $("#search-filter");

    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        this.selectedCategory = e.target.value;
        this.filterProjects();
      });
    }

    if (searchFilter) {
      const debouncedSearch = debounce((e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.filterProjects();
      }, 300);

      searchFilter.addEventListener("input", debouncedSearch);
    }
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter((project) => {
      // Category filter
      if (
        this.selectedCategory &&
        !project.tags?.includes(this.selectedCategory)
      ) {
        return false;
      }

      // Search filter
      if (this.searchTerm) {
        const searchableText = [
          project.title,
          project.subtitle,
          project.overview,
          ...(project.stack || []),
          ...(project.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(this.searchTerm)) {
          return false;
        }
      }

      return true;
    });

    this.renderProjects();
    this.updateResultsCount();
  }

  updateResultsCount() {
    const grid = $("#projects-grid");
    if (!grid) return;

    // Remove existing count if any
    const existingCount = $(".projects__count");
    if (existingCount) {
      existingCount.remove();
    }

    // Add results count
    const count = this.filteredProjects.length;
    const total = this.projects.length;
    const countElement = createElement("div", {
      className: "projects__count",
      textContent: `Showing ${count} of ${total} projects`,
    });

    countElement.style.cssText = `
      text-align: center;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-4);
    `;

    grid.parentNode.insertBefore(countElement, grid);
  }

  renderProjects() {
    const grid = $("#projects-grid");
    if (!grid) return;

    // Clear existing content
    grid.innerHTML = "";

    if (this.filteredProjects.length === 0) {
      this.renderNoResults();
      return;
    }

    // Render project cards
    this.filteredProjects.forEach((project) => {
      const card = this.createProjectCard(project);
      grid.appendChild(card);
    });
  }

  createProjectCard(project) {
    const card = createElement("article", {
      className: "card",
      "data-project-slug": project.slug,
    });

    // Card image
    const imageContainer = createElement("div", {
      className: "card__image-container",
    });

    const image = createElement("img", {
      className: "card__image",
      src: project.thumbnail || "/assets/placeholder-project.jpg",
      alt: `${project.title} project thumbnail`,
      loading: "lazy",
      width: "400",
      height: "200",
    });

    imageContainer.appendChild(image);

    // Card content
    const content = createElement("div", {
      className: "card__content",
    });

    // Title and subtitle
    const title = createElement("h3", {
      className: "card__title",
      textContent: project.title,
    });

    const subtitle = createElement("p", {
      className: "card__subtitle",
      textContent: project.subtitle || truncate(project.overview || "", 80),
    });

    // Description
    const description = createElement("p", {
      className: "card__description",
      textContent: truncate(project.overview || "", 120),
    });

    // Tags
    const tagsContainer = createElement("div", {
      className: "card__tags",
    });

    const displayTags = (project.tags || []).slice(0, 4);
    displayTags.forEach((tag) => {
      const tagElement = createElement("span", {
        className: "tag",
        textContent: tag,
      });
      tagsContainer.appendChild(tagElement);
    });

    // Show more tags indicator if there are more than 4
    if ((project.tags || []).length > 4) {
      const moreTag = createElement("span", {
        className: "tag tag--more",
        textContent: `+${(project.tags || []).length - 4} more`,
      });
      tagsContainer.appendChild(moreTag);
    }

    // Actions
    const actions = createElement("div", {
      className: "card__actions",
    });

    // Primary action - View Case Study
    const primaryAction = createElement("a", {
      className: "button button--primary card__action",
      href: `projects/${project.slug}.html`,
      textContent: "View Case Study",
    });

    // Secondary actions
    const secondaryActions = createElement("div", {
      className: "card__secondary-actions",
    });

    if (project.links?.live) {
      const liveLink = createElement("a", {
        className: "button button--secondary card__action",
        href: project.links.live,
        target: "_blank",
        rel: "noopener noreferrer",
        textContent: "Live Demo",
      });
      secondaryActions.appendChild(liveLink);
    }

    if (project.links?.repo) {
      const repoLink = createElement("a", {
        className: "button button--secondary card__action",
        href: project.links.repo,
        target: "_blank",
        rel: "noopener noreferrer",
        textContent: "Code",
      });
      secondaryActions.appendChild(repoLink);
    }

    // Assemble card
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(description);
    content.appendChild(tagsContainer);
    content.appendChild(actions);

    actions.appendChild(primaryAction);
    if (secondaryActions.children.length > 0) {
      actions.appendChild(secondaryActions);
    }

    card.appendChild(imageContainer);
    card.appendChild(content);

    return card;
  }

  renderNoResults() {
    const grid = $("#projects-grid");
    if (!grid) return;

    const noResults = createElement("div", {
      className: "projects__no-results",
      innerHTML: `
        <div style="text-align: center; padding: var(--space-12);">
          <h3 style="margin-bottom: var(--space-4); color: var(--color-text-muted);">
            No projects found
          </h3>
          <p style="color: var(--color-text-muted); margin-bottom: var(--space-6);">
            Try adjusting your search or filter criteria
          </p>
          <button class="button button--primary" onclick="this.clearFilters()">
            Clear Filters
          </button>
        </div>
      `,
    });

    // Add clear filters functionality
    noResults.clearFilters = () => {
      const categoryFilter = $("#category-filter");
      const searchFilter = $("#search-filter");

      if (categoryFilter) categoryFilter.value = "";
      if (searchFilter) searchFilter.value = "";

      this.selectedCategory = "";
      this.searchTerm = "";
      this.filterProjects();
    };

    grid.appendChild(noResults);
  }

  showErrorState() {
    const grid = $("#projects-grid");
    if (!grid) return;

    grid.innerHTML = `
      <div style="text-align: center; padding: var(--space-12);">
        <h3 style="margin-bottom: var(--space-4); color: var(--color-error);">
          Unable to load projects
        </h3>
        <p style="color: var(--color-text-muted); margin-bottom: var(--space-6);">
          Please check your internet connection and try again
        </p>
        <button class="button button--primary" onclick="location.reload()">
          Retry
        </button>
      </div>
    `;
  }

  // Public method to refresh projects
  async refresh() {
    try {
      await this.loadProjects();
      this.setupFilters();
      this.renderProjects();
    } catch (error) {
      handleError(error, "refreshing projects");
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HomepageRenderer();
});

// Export for use in other modules
export default HomepageRenderer;
