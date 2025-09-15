/**
 * SEO utilities for dynamic meta tag management
 */

import { $, createElement } from "./utils.js";

class SEO {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  /**
   * Update page title
   */
  updateTitle(title) {
    document.title = title;
  }

  /**
   * Update meta description
   */
  updateDescription(description) {
    this.updateMetaTag("description", description);
  }

  /**
   * Update Open Graph tags
   */
  updateOpenGraph(data) {
    const { title, description, image, url, type = "website" } = data;

    this.updateMetaTag("og:title", title);
    this.updateMetaTag("og:description", description);
    this.updateMetaTag("og:image", image);
    this.updateMetaTag("og:url", url);
    this.updateMetaTag("og:type", type);
  }

  /**
   * Update Twitter Card tags
   */
  updateTwitterCard(data) {
    const {
      title,
      description,
      image,
      url,
      card = "summary_large_image",
    } = data;

    this.updateMetaTag("twitter:card", card);
    this.updateMetaTag("twitter:title", title);
    this.updateMetaTag("twitter:description", description);
    this.updateMetaTag("twitter:image", image);
    this.updateMetaTag("twitter:url", url);
  }

  /**
   * Update JSON-LD structured data
   */
  updateJSONLD(data) {
    const existingScript = $("#json-ld");
    if (existingScript) {
      existingScript.textContent = JSON.stringify(data, null, 2);
    } else {
      const script = createElement("script", {
        type: "application/ld+json",
        id: "json-ld",
        textContent: JSON.stringify(data, null, 2),
      });
      document.head.appendChild(script);
    }
  }

  /**
   * Update a specific meta tag
   */
  updateMetaTag(property, content) {
    if (!content) return;

    // Handle both name and property attributes
    const selectors = [
      `meta[name="${property}"]`,
      `meta[property="${property}"]`,
    ];

    let metaTag = null;
    for (const selector of selectors) {
      metaTag = $(selector);
      if (metaTag) break;
    }

    if (metaTag) {
      metaTag.setAttribute("content", content);
    } else {
      // Create new meta tag
      const attribute =
        property.startsWith("og:") || property.startsWith("twitter:")
          ? "property"
          : "name";
      metaTag = createElement("meta", {
        [attribute]: property,
        content: content,
      });
      document.head.appendChild(metaTag);
    }
  }

  /**
   * Generate project-specific SEO data
   */
  generateProjectSEO(project) {
    const title = `${project.title} - Nora Rasuli`;
    const description =
      project.overview ||
      project.subtitle ||
      `A project by Nora Rasuli: ${project.title}`;
    const image = project.heroImage
      ? `${this.baseUrl}${project.heroImage}`
      : `${this.baseUrl}/assets/social-preview.jpg`;
    const url = `${this.baseUrl}/projects/${project.slug}.html`;

    // Update basic meta tags
    this.updateTitle(title);
    this.updateDescription(description);

    // Update Open Graph
    this.updateOpenGraph({
      title,
      description,
      image,
      url,
      type: "article",
    });

    // Update Twitter Card
    this.updateTwitterCard({
      title,
      description,
      image,
      url,
    });

    // Update JSON-LD
    this.updateJSONLD({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: description,
      author: {
        "@type": "Person",
        name: "Nora Rasuli",
        url: this.baseUrl,
      },
      url: url,
      image: image,
      dateCreated: project.year ? `${project.year}-01-01` : undefined,
      keywords: project.tags ? project.tags.join(", ") : undefined,
      about: project.overview,
      ...(project.links?.live && {
        mainEntityOfPage: {
          "@type": "WebPage",
          url: project.links.live,
        },
      }),
    });
  }

  /**
   * Generate homepage SEO data
   */
  generateHomepageSEO() {
    const title = "Nora Rasuli - Frontend/UI Engineer";
    const description =
      "Frontend/UI Engineer specializing in modern web development, user experience design, and accessible interfaces. View my portfolio and case studies.";
    const image = `${this.baseUrl}/assets/social-preview.jpg`;
    const url = this.baseUrl;

    // Update basic meta tags
    this.updateTitle(title);
    this.updateDescription(description);

    // Update Open Graph
    this.updateOpenGraph({
      title,
      description,
      image,
      url,
      type: "website",
    });

    // Update Twitter Card
    this.updateTwitterCard({
      title,
      description,
      image,
      url,
    });

    // Update JSON-LD
    this.updateJSONLD({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Nora Rasuli",
      jobTitle: "Frontend/UI Engineer",
      url: url,
      sameAs: [
        "https://github.com/nora-rasuli",
        "https://linkedin.com/in/nora-rasuli",
      ],
      knowsAbout: [
        "Frontend Development",
        "User Experience Design",
        "Accessibility",
        "React",
        "TypeScript",
        "Design Systems",
      ],
    });
  }

  /**
   * Generate 404 page SEO data
   */
  generate404SEO() {
    const title = "Page Not Found - Nora Rasuli";
    const description = "The page you're looking for doesn't exist.";

    this.updateTitle(title);
    this.updateDescription(description);

    this.updateOpenGraph({
      title,
      description,
      image: `${this.baseUrl}/assets/social-preview.jpg`,
      url: `${this.baseUrl}/404.html`,
      type: "website",
    });
  }

  /**
   * Add canonical URL
   */
  addCanonicalUrl(url) {
    let canonical = $('link[rel="canonical"]');
    if (!canonical) {
      canonical = createElement("link", {
        rel: "canonical",
        href: url,
      });
      document.head.appendChild(canonical);
    } else {
      canonical.setAttribute("href", url);
    }
  }

  /**
   * Add robots meta tag
   */
  addRobots(content = "index, follow") {
    this.updateMetaTag("robots", content);
  }

  /**
   * Add viewport meta tag (if not present)
   */
  ensureViewport() {
    let viewport = $('meta[name="viewport"]');
    if (!viewport) {
      viewport = createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      });
      document.head.appendChild(viewport);
    }
  }

  /**
   * Add language attribute
   */
  addLanguage(lang = "en") {
    document.documentElement.setAttribute("lang", lang);
  }

  /**
   * Initialize basic SEO
   */
  init() {
    this.ensureViewport();
    this.addLanguage();
    this.addRobots();
  }
}

// Create global instance
const seo = new SEO();

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  seo.init();
});

// Export for use in other modules
export default seo;
