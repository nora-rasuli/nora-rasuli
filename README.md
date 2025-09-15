# Nora Rasuli - Portfolio Website

A modern, accessible portfolio website built with vanilla HTML, CSS, and JavaScript. Features a clean design, dark/light mode, and an easy content management system for adding new projects.

## 🚀 Quick Start

### Running Locally

1. **Simple Method (Recommended)**

   ```bash
   # Open index.html directly in your browser
   open index.html
   ```

2. **With Local Server (if CORS blocks JSON loading)**

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (if you have it)
   npx serve .

   # Then visit http://localhost:8000
   ```

### Adding a New Project

Adding a new project takes less than 2 minutes:

1. **Add Project Images** (Optional)

   ```bash
   # Create project directory
   mkdir assets/projects/your-project-slug

   # Add your images
   # - hero.jpg (1200x630px recommended)
   # - thumbnail.jpg (400x200px recommended)
   # - design-*.jpg (any size)
   # - gallery-*.jpg (any size)
   ```

2. **Add Project Data**
   Edit `/data/projects.json` and add a new project object:

   ```json
   {
     "slug": "your-project-slug",
     "title": "Your Project Title",
     "subtitle": "Brief project description",
     "status": "Live",
     "year": 2024,
     "role": "Your Role",
     "stack": ["React", "TypeScript", "Node.js"],
     "tags": ["Web App", "React", "Full Stack"],
     "heroImage": "/assets/projects/your-project-slug/hero.jpg",
     "thumbnail": "/assets/projects/your-project-slug/thumbnail.jpg",
     "links": {
       "live": "https://your-project.com",
       "repo": "https://github.com/your-username/your-project",
       "figma": "https://figma.com/design/your-project"
     },
     "overview": "Detailed project description...",
     "problem": "What problem did this solve?",
     "goals": ["Goal 1", "Goal 2", "Goal 3"],
     "research": "Research and discovery process...",
     "design": {
       "description": "Design approach and decisions...",
       "images": [
         {
           "src": "/assets/projects/your-project-slug/design-1.jpg",
           "alt": "Design image description",
           "caption": "Optional caption"
         }
       ]
     },
     "build": {
       "description": "Technical implementation details...",
       "features": ["Feature 1", "Feature 2", "Feature 3"]
     },
     "demo": "Demo instructions and credentials...",
     "outcomes": [
       {
         "label": "Metric Name",
         "value": "+25%"
       }
     ],
     "gallery": [
       {
         "src": "/assets/projects/your-project-slug/gallery-1.jpg",
         "alt": "Gallery image description",
         "caption": "Optional caption"
       }
     ]
   }
   ```

3. **Create Project Page**

   ```bash
   # Copy the template
   cp projects/template.html projects/your-project-slug.html
   ```

4. **Commit and Deploy**
   ```bash
   git add .
   git commit -m "Add new project: Your Project Title"
   git push
   ```

That's it! The homepage will automatically show your new project, and the detail page will be available at `/projects/your-project-slug.html`.

## 🎨 Customization

### Colors and Typography

Edit `/styles/tokens.css` to customize:

- Color palette (light and dark themes)
- Typography scale and font families
- Spacing, border radius, and shadows
- Breakpoints and container sizes

### Layout and Components

Edit `/styles/components.css` to customize:

- Button styles and variants
- Card layouts and hover effects
- Grid systems and responsive behavior
- Navigation and footer styles

### Content and Branding

1. **Personal Information**

   - Update name, role, and bio in `index.html`
   - Update contact links and social media
   - Replace favicon and social preview images

2. **SEO and Meta Tags**
   - Update Open Graph and Twitter Card data
   - Modify JSON-LD structured data
   - Customize page titles and descriptions

## 🚀 Deployment

### GitHub Pages

1. **Repository Setup**

   ```bash
   # Create repository named: your-username.github.io
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-username.github.io.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**

   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - Save

3. **Custom Domain** (Optional)
   - Add `CNAME` file with your domain
   - Configure DNS records as per GitHub instructions

### Other Hosting Providers

This is a static site that works with any hosting provider:

- Netlify (drag & drop deployment)
- Vercel (connect GitHub repository)
- AWS S3 + CloudFront
- Any web server serving static files

## 📁 Project Structure

```
/
├── index.html              # Homepage
├── 404.html               # Error page
├── projects/
│   ├── template.html      # Project detail template
│   └── *.html            # Individual project pages
├── styles/
│   ├── tokens.css        # Design tokens (colors, typography, spacing)
│   ├── main.css          # Global styles and layout
│   ├── components.css    # Reusable component styles
│   └── themes.css        # Light/dark theme styles
├── scripts/
│   ├── utils.js          # Utility functions
│   ├── theme-toggle.js   # Dark/light mode functionality
│   ├── render-home.js    # Homepage rendering
│   ├── render-project.js # Project page rendering
│   └── seo.js           # SEO and meta tag management
├── data/
│   └── projects.json     # Project data (your content)
└── assets/
    ├── projects/         # Project images
    ├── favicon.ico       # Site favicon
    └── social-preview.*  # Social media preview images
```

## ♿ Accessibility & SEO

### Built-in Features

- **Accessibility (WCAG 2.1 AA)**

  - Semantic HTML5 structure
  - Proper heading hierarchy
  - Alt text for all images
  - Keyboard navigation support
  - Focus indicators
  - Screen reader announcements
  - Color contrast compliance

- **SEO Optimization**

  - Dynamic meta tags per page
  - Open Graph and Twitter Cards
  - JSON-LD structured data
  - Semantic HTML markup
  - Fast loading and performance

- **Performance**
  - No external dependencies
  - Optimized images and lazy loading
  - Minimal JavaScript footprint
  - CSS and JS minification ready

### Testing Checklist

- [ ] Lighthouse score ≥ 95 (Performance, Accessibility, SEO)
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Mobile responsive design
- [ ] Dark/light mode toggle works
- [ ] All links are functional
- [ ] No console errors

## 🛠️ Development

### Adding New Features

1. **New Component Styles**

   - Add to `/styles/components.css`
   - Follow existing naming conventions
   - Include hover and focus states

2. **New JavaScript Functionality**

   - Add to appropriate script file
   - Use ES6 modules for organization
   - Include error handling

3. **New Page Types**
   - Create HTML template
   - Add routing logic if needed
   - Update navigation

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you have questions or need help:

- Create an issue on GitHub
- Check the documentation above
- Review the code comments

---

**Happy coding!** 🎉
