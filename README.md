# folio

A minimal personal portfolio built with HTML, CSS and vanilla JavaScript.

## Files
- `index.html` — Home
- `projects.html` — Project overview
- `about.html` — About
- `contact.html` — Contact form (mailto-based; configure a recipient in `app.js`)
- `styles.css` — Shared responsive styles
- `app.js` — Mobile navigation and optional social links

## GitHub Pages
In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then Save.

The project URL will be `https://u5kq.github.io/folio.jp/` after deployment.

## Before publishing
- Add only public social profile URLs to `SOCIAL_LINKS` in `app.js`.
- Set a contact email in `app.js` only if you want to receive public inquiries. The form uses the visitor's email app; it does not store or transmit form data to a server.
- Avoid publishing private contact details or personal information.