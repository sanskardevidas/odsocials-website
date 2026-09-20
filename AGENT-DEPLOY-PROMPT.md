# Deployment Prompt — OD Socials Website

Copy everything below the line into the AI assistant you're working with.

---

You are helping me deploy a static website. I am the account owner and I will be sitting
with you the whole time.

**Hard rule: ask for my explicit permission before every single step.**
Before each action, tell me (1) exactly what you are about to do, (2) which files or
settings it will change, and (3) whether it is reversible. Then stop and wait for me to
say "yes" or "go". Never batch two steps together. Never delete, overwrite, or force-push
anything without asking first. If something looks different from what you expected,
stop and describe what you see instead of guessing.

## What the site is

A **pure static HTML website** — no framework, no build step, no npm install.
It is 6 HTML pages plus one JS file and an images folder:

- `index.html` (home)
- `social-media.html`
- `website.html`
- `ai-automation.html`
- `consultation.html`
- `privacy.html`
- `support.js`
- `images/` (all site images)
- `README.md`

These files live in a folder called `deploy/` that I will give you. The contents of
`deploy/` must end up at the **root** of the GitHub repo, not inside a subfolder.

## Accounts and destinations

- GitHub account: `sanskardevidas`
- Repo: `sanskardevidas/odsocials`, branch `main`
- Host: Vercel
- Custom domain: `www.odsocials.com` (registrar login is mine; I will do DNS myself
  if you tell me the exact records)

## Step 1 — Inspect the repo (read only)

Ask permission, then look at the current contents of `sanskardevidas/odsocials`.
Report back: what files exist, whether there is an old Vite/React app in there
(`package.json`, `vite.config.js`, `src/`, etc.), and what the default branch is.
Do not change anything yet.

## Step 2 — Back up and clear the old project

The repo currently holds an old Vite/React project. It will conflict with the static
site, so it has to go.

Ask permission first. Then:
1. Create a branch called `backup-old-vite` from the current `main` so nothing is
   lost, and confirm to me that it exists.
2. On `main`, remove the old app files (`src/`, `public/`, `package.json`,
   `package-lock.json`, `vite.config.*`, `index.html` if it is the Vite one,
   `node_modules` if committed, any config files belonging to the old build).
3. Show me the exact list of files you intend to delete and wait for my approval
   before committing.
4. Commit with the message: `Remove old Vite project`.

## Step 3 — Upload the new site

Ask permission first. Then add all contents of my `deploy/` folder to the root of
`main`, preserving the `images/` folder structure. Commit message:
`Deploy OD Socials website`. Push to `main`.

After pushing, confirm to me that the repo root now contains exactly the 6 HTML
files, `support.js`, `images/`, and `README.md`, and nothing left over from the
old project.

## Step 4 — Connect Vercel

Walk me through this one click at a time, waiting for me after each:
1. Go to vercel.com and sign in with GitHub.
2. New Project → import `sanskardevidas/odsocials`.
3. Framework Preset: **Other** (explicitly not Next.js, not Vite).
4. Build Command: **leave blank**.
5. Output Directory: **leave blank** (root).
6. Install Command: **leave blank**.
7. Deploy.

When the deploy finishes, give me the temporary `*.vercel.app` URL and ask me to
open it. Then check with me that every page loads, all images appear, and the nav
links between pages work. If anything 404s, diagnose before moving on — the usual
cause is files sitting in a subfolder instead of the repo root.

## Step 5 — Custom domain

Ask permission first. Then in Vercel: Settings → Domains → add `www.odsocials.com`
and also `odsocials.com` (set the apex to redirect to www, or the reverse if Vercel
recommends it).

Copy out the **exact** DNS records Vercel shows me — record type, name, and value,
character for character. Do not paraphrase them. I will enter them at my registrar
myself. Then tell me what to expect: propagation usually takes a few hours and can
take up to 48, and Vercel issues the SSL certificate automatically once DNS resolves.

## Step 6 — Final check

Once the domain resolves, ask me to load `https://www.odsocials.com` and confirm
together: all 6 pages, images, internal links, and that the padlock (HTTPS) shows.
Report anything broken with the specific file and line rather than re-uploading
everything.

## Things not to do

- Do not run a build step, add a framework, or "modernize" the HTML.
- Do not reformat, minify, or edit the contents of any HTML, JS, or image file.
- Do not add analytics, tracking, meta tags, or dependencies I did not ask for.
- Do not force-push.
- Do not touch the `backup-old-vite` branch after creating it.
