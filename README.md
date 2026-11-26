# folio.

folio. is a product development studio website built with semantic HTML, CSS and vanilla JavaScript.

## Site structure

### Pages
- `index.html` — Official homepage and live product directory.
- `projects.html` — Project catalogue.
- `project.html` — Individual project detail pages, rendered from the project data in `app.js`.
- `brand.html`, `about.html`, `news.html`, `contact.html`, `play.html` — Main brand, newsroom and experience pages.
- `account.html` — folio ID interface.
- Supporting pages include policy, privacy, FAQ, sitemap, status, timeline, releases, gallery, history and technical pages.

### Shared assets
- `styles.css` — Original site styles and shared components.
- `home-ui.css` — Homepage-specific visual layer.
- `responsive.css` — Shared responsive rules, spacing system, navigation, cards and control styling for desktop, tablet and mobile.
- `app.js` — Shared navigation, project data, filters and page interactions.
- `folio-next-v2.js` — Supplemental search, sharing and site utilities.
- `folio-next.css` — Supplemental UI styles for those utilities.
- `folio-quality.js` — Quality and interaction helpers.
- `sw.js` — Service worker. HTML navigation is network-first; CSS and JavaScript are revalidated before falling back to cache.
- `favicon.svg`, `folio-id-icon.svg`, `folio.webmanifest` — Site identity and install metadata.

## Responsive design principles

- Desktop: full navigation and multi-column content layouts.
- Tablet: touch-friendly controls and compact two-column content layouts.
- Mobile: safe-area-aware spacing, accessible menu controls, readable type, and simplified content grids.
- Buttons and controls should retain visible focus states and usable touch targets.
- Respect `prefers-reduced-motion`.

## Editing guidance

1. Keep page content in its relevant HTML file.
2. Keep site-wide behavior in `app.js`.
3. Keep shared responsive spacing and control rules in `responsive.css`.
4. Keep homepage-only presentation in `home-ui.css`.
5. Avoid adding page-specific copies of shared navigation or global button rules.
6. Preserve existing links, project IDs, local storage keys and app behavior when adjusting presentation.
7. After changing scripts or styles, update the relevant version query string in page references and the service-worker cache list.

## GitHub Pages

The site is published from the `main` branch at the repository root:
`https://u5kq.github.io/folio.jp/`

## Publishing and privacy

- External social links should only be enabled after the official profile URL has been confirmed.
- The contact form must clearly disclose its delivery method; it does not imply server-side delivery unless a backend is configured.
- Do not publish private contact details, real user records or personal data in public project pages.
- QR PAY is a demo/UI project and should not be described as processing real payments unless a compliant payment backend is implemented and verified.
