# Stillform — Image Gallery

A responsive, editorial-style photography gallery created for the **CodeAlpha Frontend Development Internship**. Stillform presents a small visual journal of nature, architecture, travel and portrait photography, with category filters and an accessible full-screen viewer.

**Live demo:** [Stillform Image Gallery](https://saimanikantagit-blip.github.io/CodeAlpha_ImageGallery/)

## Features

- Eighteen photographs organized across four categories.
- In-page category filters with an active state and live image count.
- Full-screen image viewer with previous/next, wrapping navigation, title, category and position count.
- Escape, left/right arrow and touch-swipe controls; backdrop and close-button dismissal.
- Focus management and keyboard focus containment while the viewer is open.
- Responsive layouts, lazy-loaded gallery images and graceful image-load fallbacks.
- Reduced-motion support and visible keyboard focus styling.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

No framework, build step or backend is needed to deploy the site. Photographs are loaded from Unsplash over the internet; they are not stored in this repository. The typefaces are loaded from Google Fonts, with system fallbacks. Node.js and Playwright are development tools used for local serving and browser checks only.

## Project structure

```text
.
├── index.html
├── style.css
├── script.js
├── serve.js
├── tests/
│   └── gallery.spec.js
├── playwright.config.js
├── package.json
├── package-lock.json
└── README.md
```

## Run locally

With Node.js installed, run these commands from the project folder to start the local server:

```bash
npm start
```

Then visit `http://localhost:4173`. Alternatively, open `index.html` directly in a modern browser.

## Browser checks

Install the development dependencies and Playwright's Chromium browser once:

```bash
npm install
npx playwright install chromium
```

Run the automated desktop and mobile browser checks with:

```bash
npm test
```

The checks cover responsive grids at desktop, tablet and mobile widths; automated axe-core WCAG 2.1 AA audits of the page and open viewer; all 18 remote images; category filters and counts; lightbox navigation and wraparound; keyboard controls and focus containment; Escape and backdrop closing; focus restoration; background scrolling; broken-image fallbacks; and mobile overflow/touch navigation.

## Deploy to GitHub Pages

1. Create a GitHub repository named `CodeAlpha_ImageGallery`.
2. Add and push these four files to the repository's `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for the Pages deployment to finish. The site will be available at `https://<your-username>.github.io/CodeAlpha_ImageGallery/`.

All asset and document links are relative or external, so the static site works from a repository subpath.

## Screenshots

To add project screenshots, capture the site at desktop and mobile widths, save the images in a new `screenshots/` directory, then add Markdown image links here, for example:

```markdown
![Stillform gallery on desktop](screenshots/desktop.png)
![Stillform gallery on mobile](screenshots/mobile.png)
```

## CodeAlpha internship project

**Project:** Image Gallery  
**Program:** CodeAlpha Frontend Development Internship  
**Stack:** HTML5, CSS3 and vanilla JavaScript

The gallery demonstrates responsive frontend layout, accessible interactions, filtering, image presentation and keyboard-friendly dialog behavior.
