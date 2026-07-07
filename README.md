# Luisa Mota — Portfolio

Static HTML portfolio. No build step required.

## Preview locally

From this folder, start a simple server:

```bash
cd Demo-Portfolio
python3 -m http.server 8770
```

Then open:

- Homepage — http://localhost:8770/
- Shapes catalog — http://localhost:8770/shapes-catalog.html

Stop the server with `Ctrl+C` in the terminal.

---

## Add a new project

### 1. Create a project folder

Use the project name in lowercase for the folder and files (e.g. `my-project/`).

```
my-project/
├── content.md          ← fill this in first
├── my-project.html     ← project detail page
├── my-project-card.jpg ← thumbnail for homepage (or .png)
└── my-project-moodboard.jpg  ← optional mood board image
```

Copy `Forma/content.md` or `Fairshare/content.md` as a starting template.

### 2. Fill in `content.md`

Top section (metadata):

| Field | Example |
|---|---|
| Title | Fairshare |
| Tagline | Harmony at home, divided fairly. |
| Role | Product Designer |
| Timeline | 2026 · 6 weeks |
| Tools and Technology | Figma, Cursor, Supabase |
| Published app | https://your-app-url.com (leave blank if none) |

Body sections (add text under each heading as you go):

- Overview, Challenge, Process, Sketching
- Visual Style Deployment → Mood board (`moodboard: filename.jpg`)
- AI-Assisted Deployment, Gallery, Deployment, Reflection

Empty sections stay hidden on the page until you add content.

### 3. Add images

- **Card image** — shown on the homepage and as the hero image on the detail page.
- **Mood board** — referenced in `content.md` (e.g. `moodboard: my-project-moodboard.jpg`).

Save images inside the project folder. Use `.jpg` or `.png`.

### 4. Create the detail page

Copy an existing project page (`Forma/forma.html` or `Fairshare/fairshare.html`) to `my-project/my-project.html`, then update:

- Title, tagline, metadata, and section copy from `content.md`
- Image paths and `alt` text
- CTA button — use **Open Published App** with the live URL (or remove if none)
- Previous / Next links at the bottom

**Shortcut:** Ask Cursor — *"Add a new project called [Name] using content.md"* — and point it at your filled-in `content.md`.

### 5. Add a card to the homepage

In `index.html`, duplicate a project card inside `.card-grid.card-grid--featured` and update:

- Link → `my-project/my-project.html`
- Card image path
- Badge (Active / Shipped), tag, title, short description, year

### 6. Check it

1. Start the local server (see above).
2. Open the homepage and click through to the new project.
3. Confirm images, links, and the published-app button all work.

---

## Quick reference

| Page | File |
|---|---|
| Homepage | `index.html` |
| Project detail | `{slug}/{slug}.html` |
| About | `About/about.html` |
| Contact | `Contact/contact.html` |
| Styles | `css/base.css`, `css/tokens.css` |
| Design rules | `../Projects/portfolio-ui/DESIGN.md` |

---

## Publish on GitHub

This site is static HTML — no build step. GitHub Pages can host it directly.

### 1. Create a repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name it (e.g. `portfolio` or `Demo-Portfolio`)
3. Leave it **empty** (no README, no .gitignore — this project already has them)
4. Click **Create repository**

### 2. Push this project

From this folder in Terminal:

```bash
cd Demo-Portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name.

### 3. Turn on GitHub Pages

1. Open your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Choose branch **main**, folder **/ (root)**, then **Save**
4. After a minute or two, your site will be live at:

   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Notes

- Folder names are **case-sensitive** on GitHub Pages (e.g. `Forma/`, `Fairshare/`, `About/`, `Contact/`).
- To update the live site, commit and push changes to `main`.
- A custom domain can be added later under **Settings → Pages → Custom domain**.
