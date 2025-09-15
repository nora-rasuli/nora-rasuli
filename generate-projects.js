#!/usr/bin/env node

/**
 * Portfolio Project Generator
 *
 * This script automatically generates project pages from the projects.json configuration file.
 * It reads the projects data and creates individual HTML pages for each project.
 *
 * Usage: node generate-projects.js
 */

const fs = require("fs");
const path = require("path");

class ProjectGenerator {
  constructor() {
    this.projectsPath = path.join(__dirname, "projects.json");
    this.templatePath = path.join(
      __dirname,
      "projects",
      "project-template.html"
    );
    this.projectsDir = path.join(__dirname, "projects");
    this.projects = [];
  }

  async init() {
    try {
      console.log("🚀 Starting portfolio project generation...");

      await this.loadProjects();
      await this.generateProjectPages();
      await this.updateHomepage();

      console.log("✅ Portfolio generation completed successfully!");
      console.log(`📁 Generated ${this.projects.length} project pages`);
    } catch (error) {
      console.error("❌ Error generating portfolio:", error.message);
      process.exit(1);
    }
  }

  async loadProjects() {
    try {
      const data = fs.readFileSync(this.projectsPath, "utf8");
      const config = JSON.parse(data);
      this.projects = config.projects || [];

      if (this.projects.length === 0) {
        throw new Error("No projects found in projects.json");
      }

      console.log(
        `📋 Loaded ${this.projects.length} projects from configuration`
      );
    } catch (error) {
      throw new Error(`Failed to load projects: ${error.message}`);
    }
  }

  async generateProjectPages() {
    const template = fs.readFileSync(this.templatePath, "utf8");

    for (let i = 0; i < this.projects.length; i++) {
      const project = this.projects[i];
      const prevProject =
        this.projects[i > 0 ? i - 1 : this.projects.length - 1];
      const nextProject =
        this.projects[i < this.projects.length - 1 ? i + 1 : 0];

      const projectHtml = this.generateProjectHtml(
        template,
        project,
        prevProject,
        nextProject
      );
      const projectPath = path.join(this.projectsDir, `${project.id}.html`);

      fs.writeFileSync(projectPath, projectHtml);
      console.log(`📄 Generated ${project.id}.html`);
    }
  }

  generateProjectHtml(template, project, prevProject, nextProject) {
    return template
      .replace(/{{TITLE}}/g, project.title)
      .replace(/{{DESCRIPTION}}/g, project.description)
      .replace(/{{PROJECT_TITLE}}/g, project.title)
      .replace(/{{PROJECT_TAGLINE}}/g, project.tagline || "")
      .replace(/{{PROJECT_DESCRIPTION}}/g, project.description)
      .replace(/{{PROJECT_ICON}}/g, this.getProjectIcon(project.title))
      .replace(/{{PROBLEM_STATEMENT}}/g, project.problem || "")
      .replace(/{{RESEARCH_APPROACH}}/g, project.research || "")
      .replace(/{{DESIGN_FIGMA}}/g, project.design || "")
      .replace(/{{DEVELOPMENT_DETAILS}}/g, project.development || "")
      .replace(/{{OUTCOME_IMPACT}}/g, project.outcome || "")
      .replace(/{{IMPROVEMENTS}}/g, project.improvements || "")
      .replace(/{{FIGMA_LINK}}/g, project.figmaLink || "#")
      .replace(/{{GITHUB_LINK}}/g, project.githubLink || "#")
      .replace(
        /{{TECHNOLOGIES}}/g,
        this.generateTechnologiesHtml(project.technologies)
      )
      .replace(/{{PREV_TITLE}}/g, prevProject.title)
      .replace(/{{PREV_URL}}/g, `${prevProject.id}.html`)
      .replace(/{{NEXT_TITLE}}/g, nextProject.title)
      .replace(/{{NEXT_URL}}/g, `${nextProject.id}.html`);
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

  generateTechnologiesHtml(technologies) {
    if (!technologies || technologies.length === 0) return "";

    return technologies
      .map((tech) => `<span class="tech-tag-large">${tech}</span>`)
      .join("\n                        ");
  }

  generateFeaturesHtml(features) {
    if (!features || features.length === 0) return "";

    return features
      .map((feature) => `<li>${feature}</li>`)
      .join("\n                        ");
  }

  async updateHomepage() {
    const indexPath = path.join(__dirname, "index.html");
    let homepage = fs.readFileSync(indexPath, "utf8");

    // Generate projects HTML
    const projectsHtml = this.projects
      .map(
        (project, index) => `
            <div class="project-card" style="animation-delay: ${index * 0.1}s">
                <div class="project-image">
                    ${this.getProjectIcon(project.title)}
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
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

    // Replace the projects container content
    homepage = homepage.replace(
      /<section class="projects" id="projectsContainer">[\s\S]*?<\/section>/,
      `<section class="projects" id="projectsContainer">\n                ${projectsHtml}\n            </section>`
    );

    fs.writeFileSync(indexPath, homepage);
    console.log("🏠 Updated homepage with project data");
  }

  // Utility method to add a new project
  addProject(projectData) {
    const newProject = {
      id: projectData.id || `project-${this.projects.length + 1}`,
      title: projectData.title,
      description: projectData.description,
      image: projectData.image || `assets/${projectData.id}.jpg`,
      url: `projects/${projectData.id}.html`,
      technologies: projectData.technologies || [],
      features: projectData.features || [],
    };

    this.projects.push(newProject);
    this.saveProjects();
    console.log(`➕ Added new project: ${newProject.title}`);
  }

  // Utility method to remove a project
  removeProject(projectId) {
    const index = this.projects.findIndex((p) => p.id === projectId);
    if (index !== -1) {
      const project = this.projects.splice(index, 1)[0];
      this.saveProjects();
      console.log(`➖ Removed project: ${project.title}`);
    } else {
      console.log(`❌ Project with ID "${projectId}" not found`);
    }
  }

  saveProjects() {
    const config = { projects: this.projects };
    fs.writeFileSync(this.projectsPath, JSON.stringify(config, null, 2));
  }
}

// CLI interface
if (require.main === module) {
  const generator = new ProjectGenerator();

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "add":
      if (args.length < 2) {
        console.log(
          'Usage: node generate-projects.js add "Project Title" "Project Description"'
        );
        process.exit(1);
      }
      generator.addProject({
        title: args[1],
        description: args[2] || "A new project",
        technologies: args[3] ? args[3].split(",") : [],
        features: args[4] ? args[4].split(",") : [],
      });
      break;
    case "remove":
      if (args.length < 2) {
        console.log("Usage: node generate-projects.js remove project-id");
        process.exit(1);
      }
      generator.removeProject(args[1]);
      break;
    default:
      generator.init();
  }
}

module.exports = ProjectGenerator;
