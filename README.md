# TAB Explorer — Landing Page

Official landing page website for **TAB Explorer**, the file-explorer-style tab manager extension for Google Chrome.

- **Live Production Domain:** [https://tabexplorer.site](https://tabexplorer.site)
- **Chrome Web Store:** [TAB Explorer Extension](https://chromewebstore.google.com/detail/ijcnikejbjffhcnblofckaihgchkiged?utm_source=item-share-cb)
- **Extension Repository:** [https://github.com/Iyuu8/TAB-Explorer](https://github.com/Iyuu8/TAB-Explorer)

---

## Tech Stack

- **Framework:** React 19 + Create React App
- **Styling:** Modern CSS with custom properties & glassmorphism design tokens
- **Animations:** Framer Motion
- **Icons:** Lucide React & Custom SVG Chrome / Brand Assets
- **Analytics:** Privacy-friendly Umami Analytics scoped to `tabexplorer.site`
- **Hosting / Deployment:** Configured for Vercel / Static hosting with custom domain `tabexplorer.site`

---

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Bundles the app in production mode with minification and assets scoped to `https://tabexplorer.site`. Output is generated in the `build/` directory.

### `npm test`
Launches the test runner.

---

## Domain & SEO Configuration

- **Domain:** `tabexplorer.site`
- **Canonical URL:** `https://tabexplorer.site/`
- **CNAME:** Provided in `public/CNAME`
- **Sitemap:** Provided in `public/sitemap.xml`
- **Robots.txt:** Configured in `public/robots.txt`
- **Social Sharing:** Open Graph and Twitter Card tags with absolute URLs pointing to `https://tabexplorer.site`
- **Structured Data:** JSON-LD schema for `SoftwareApplication`
