# OD Socials — website

Static site. No build step, no framework, no npm install. Plain HTML, CSS and JS.

## Open in VS Code

1. Unzip this folder.
2. In VS Code: File → Open Folder → select this folder.
3. Install the **Live Server** extension (VS Code will prompt you — it is in `.vscode/extensions.json`).
4. Right-click `index.html` → **Open with Live Server**.

The site opens at http://127.0.0.1:5500. Edits save-and-refresh live.

Opening `index.html` by double-clicking also works, but Live Server is better —
some browsers block local file access for scripts.

## Pages

| File                 | Page            |
| -------------------- | --------------- |
| `index.html`         | Homepage        |
| `social-media.html`  | Social Media    |
| `website.html`       | Website         |
| `ai-automation.html` | AI Automation   |
| `consultation.html`  | Consultation    |
| `privacy.html`       | Privacy Policy  |
| `404.html`           | Not found       |

## Shared files

| File           | What it does                                                        |
| -------------- | ------------------------------------------------------------------- |
| `support.js`   | Rendering runtime. Every page loads it first. **Do not edit.**       |
| `od-motion.js` | Shared motion engine — scroll reveals, counters, tilt, magnetic hover. |
| `images/`      | All photography, logos and client marks.                             |

## Editing content

Each page is one self-contained file. Text and layout live in the `<x-dc>`
block near the top; data (stats, service lists, FAQ copy) lives in the
`renderVals()` function in the `<script>` block at the bottom.

To change a stat, search the page for the number — e.g. `"99%"` on `index.html` —
and edit it in place.

## Publishing

Drag this entire folder onto https://app.netlify.com/drop. Live in under a minute.

Cloudflare Pages (Direct Upload) and Vercel accept the same folder.
For traditional hosting, upload the folder's **contents** into `public_html` over FTP.

Keep the structure intact: `index.html` must sit at the top level alongside
`images/`, `od-motion.js` and `support.js`.
