# Nora Rasuli — Frontend Portfolio

A modern, whitespace-driven frontend engineering portfolio built with HTML, CSS, and JavaScript. It supports dark/light mode, responsive design, accessible navigation, and an automated workflow to generate individual project pages from a JSON config.

## Features

- 🎨 **Clean, modern design**: whitespace-driven, professional aesthetic
- 🌙 **Dark/light mode**: persisted via `localStorage`, system-preference aware
- 📱 **Responsive**: works across mobile, tablet, and desktop
- 🚀 **Dynamic project loading**: reads from `projects.json` with local fallback
- 🔄 **Automated page generation**: `generate-projects.js` builds project pages
- ♿ **Accessible**: keyboard navigation, focus states, ARIA affordances
- ⚡ **Vanilla stack**: HTML/CSS/JS without frameworks

## Project structure

```
/
├── index.html              # Homepage
├── projects.json           # Project configuration
├── generate-projects.js    # Project page generator (Node)
├── projects/               # Individual project pages
│   ├── project-1.html
│   ├── project-2.html
│   └── ...
├── assets/                 # Images, icons, fonts
│   └── favicon.svg
├── styles/                 # CSS files
│   ├── base.css           # Base styles, layout, components
│   └── theme.css          # Theme tokens + project page styles
└── scripts/               # JavaScript files
    ├── main.js            # Homepage + project page logic
    ├── darkmode.js        # Dark mode toggle and persistence
    └── navigation.js      # Smooth scroll, focus, keyboard navigation
├── 404.html               # Nice 404 with project suggestions
├── serve.py               # Local dev server with CORS headers
```

## Getting started

### Option 1: Local development server (recommended)

1. **Clone or download** this repository
2. **Start the development server**:

   ```bash
   # Using Python helper (recommended)
   python3 serve.py

   # Or using Node.js (simple HTTP server)
   npm run serve

   # Or using PHP
   php -S localhost:8000
   ```

3. **Open** http://localhost:8000 in your browser
4. **Customize** `projects.json` (schema below)
5. **Generate project pages** from the template:
   ```bash
   node generate-projects.js
   ```

### Option 2: Open files directly

1. **Clone or download** this repository
2. **Open `index.html`** directly in your browser
   - Note: Due to browser CORS, dynamic JSON fetch will fail and the app will
     use built-in fallback projects. Use a local server for full functionality.

## Adding new projects

### Method 1: Edit `projects.json`

1. Open `projects.json`
2. Add a new project object:
   ```json
   {
     "id": "project-5",
     "title": "My New Project",
     "description": "A description of my project",
     "tagline": "Optional short tagline",
     "image": "assets/project-5.jpg",
     "url": "projects/project-5.html",
     "technologies": ["HTML", "CSS", "JavaScript"],
     "features": ["Feature 1", "Feature 2", "Feature 3"],
     "problem": "Optional problem statement",
     "research": "Optional research summary",
     "design": "Optional design notes or Figma link",
     "development": "Optional development details",
     "outcome": "Optional outcome/impact",
     "improvements": "Optional future work",
     "figmaLink": "https://figma.com/...",
     "githubLink": "https://github.com/...",
     "liveDemo": "https://..."
   }
   ```
3. Run `node generate-projects.js` to generate/update the project page

### Method 2: Use the generator CLI

```bash
# Add a new project (minimal)
node generate-projects.js add "Project Title" "Project Description"

# Add with technologies/features (comma-separated)
node generate-projects.js add "Project Title" "Project Description" "HTML,CSS,JS" "Feature1,Feature2"

# Remove a project
node generate-projects.js remove project-id
```

## Customization

### Styling

- **Colors/themes**: `styles/theme.css` custom properties (light/dark)
- **Layout/components**: `styles/base.css`
- **Project page**: `styles/theme.css` under project section styles

### Content

- **Projects**: Edit `projects.json` then run the generator
- **Homepage**: `index.html` (projects injected at runtime or via generator)
- **Navigation/accessibility**: `scripts/navigation.js`
- **Dark mode**: `scripts/darkmode.js` (persists theme and listens to system)

### 404 page

- `404.html` is styled and includes project suggestions loaded from `projects.json`.
- Helpful for GitHub Pages and general UX when a route/file is missing.

### JSON loading and fallbacks

- When served over `file://`, browsers block cross-origin `fetch` of `projects.json`.
- The app falls back to built-in sample projects in `main.js` so the UI still renders.
- Use a local server (`python3 serve.py` or `npm run serve`) for full data loading.

## Browser support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance

- Targeting: 95+ Lighthouse, <50KB core CSS/JS, <1s FCP on fast 3G
- Accessibility: aims for WCAG 2.1 AA with keyboard/focus support

## Deployment

- Static hosting ready (GitHub Pages, Netlify, Vercel static).
- For GitHub Pages user/org site or project site, include `404.html` to improve navigation.
- If deploying as a project site, update `package.json` `homepage` and repo fields.

## Scripts

- `npm run serve` — start a simple HTTP server at http://localhost:8000
- `npm run generate` — generate project pages from `projects.json`
- `npm run add-project` — CLI entry to add a project
- `npm run remove-project` — CLI entry to remove a project

## License

MIT License — feel free to use this template for your own portfolio.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally (`python3 serve.py`)
5. Submit a pull request

---

Built with ❤️ by Nora Rasuli using HTML, CSS, and JavaScript
