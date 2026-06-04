# Mermaid Render

A free, browser-based Mermaid diagram renderer — for when you want to preview, share, and export diagrams without paying for a subscription or hosted service.

Paste Mermaid source, pick a theme, and get shareable links plus SVG and high-resolution PNG export (1×, 2×, or 4×). Everything runs in your browser; nothing is sent to a backend.

The production app is plain static hosting. GitHub Pages does not need Node.js, Bun, or a server at runtime; Bun is only used by GitHub Actions to build the static files.

## Local Development

```bash
bun install
bun run dev
```

## Static Build

```bash
bun run build:pages
```

This writes a GitHub Pages-ready site to `dist/`, including:

- `index.html`
- bundled CSS and JS assets with relative paths
- `.nojekyll`
- `404.html` fallback for static hosts

## Deploy To GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set `Build and deployment -> Source` to `GitHub Actions`.
4. Push to `main` or run the `Deploy GitHub Pages` workflow manually.

The app is client-side only on GitHub Pages. It does not call APIs at runtime; Mermaid rendering, PNG export, SVG export, and shareable URLs all run in the browser.
