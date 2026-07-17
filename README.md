# Ladera Health Watch: website

This is the source code for the Ladera Health Watch website: a static site
built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).
Nothing on this site collects or stores health data. The health survey is an
embedded/linked Google Form, and there is no server or database.

Before launch, see **[TODO.md](./TODO.md)** for everything the group still
needs to supply (survey link, volunteer form, contact email, photos, and so
on). Everything there is also marked `TODO` in the code itself.

## 1. Preview the site on your own computer

You'll need [Node.js](https://nodejs.org) installed (any recent version, 22
or newer). Then, in a terminal, from this folder:

```sh
npm install    # only needed the first time, or after pulling new changes
npm run dev
```

This starts a local preview at `http://localhost:4321`. Open that address in
your browser. The page updates automatically as files change. Press
`Ctrl+C` in the terminal to stop it.

## 2. Deploying the site

The site builds to plain HTML/CSS/JS, so it can be hosted anywhere that
serves static files. The easiest options are **Netlify** or **Vercel**: both
have a free tier and both work the same way:

1. Push this project to a GitHub repository (ask a technical volunteer for
   help with this step if you haven't used git/GitHub before).
2. Go to [netlify.com](https://www.netlify.com) or [vercel.com](https://vercel.com),
   sign up, and choose "Import from GitHub" (wording varies slightly by
   provider).
3. Select this repository. The build settings should be auto-detected as an
   Astro project:
   - **Build command:** `npm run build`
   - **Output/publish directory:** `dist`
4. Click deploy. You'll get a temporary `*.netlify.app` or `*.vercel.app`
   address you can share immediately to test.

## 3. Pointing the purchased domain

Once you have a deploy working on the temporary address above:

1. In Netlify or Vercel's dashboard, find **Domain settings** (sometimes
   called "Custom domains") for this project.
2. Add the domain you already purchased.
3. The dashboard will show you 1–2 DNS records to add (usually a `CNAME` or an
   `A` record). Log into wherever the domain was purchased (GoDaddy,
   Namecheap, Google Domains, etc.), find its DNS settings, and add the
   records exactly as shown.
4. DNS changes can take anywhere from a few minutes to a few hours to take
   effect. Netlify/Vercel will show a green checkmark once it's live.
5. Also update `site:` in `astro.config.mjs` and the `Sitemap:` line in
   `public/robots.txt` to match the final domain. Search results and social
   media link previews depend on this being correct.

## 4. Adding a News & Updates post

No coding required. Every post is one markdown (`.md`) file in
`src/content/news/`.

1. Copy any existing file in that folder as a starting point, for example
   `src/content/news/2026-05-12-registry-request-filed.md`.
2. Rename the copy to something like `2026-08-01-my-new-update.md` (the date
   at the front is just for sorting; it doesn't have to match the filename
   exactly, but keeping them in sync is the least confusing).
3. Edit the frontmatter (the part between the `---` lines) at the top:
   - `title`: the headline
   - `date`: the real date, as `YYYY-MM-DD`
   - `summary`: one or two sentences shown in the list view
   - `type`: `update` for a post written by the group, or `press` for a link
     to outside news coverage
   - `sourceName` and `externalUrl`: only needed when `type` is `press`
4. Write the body of the post below the second `---` line, in plain text or
   [markdown](https://www.markdownguide.org/basic-syntax/) (`**bold**`,
   `[link text](https://example.com)`, etc.).
5. Save the file, and either run `npm run dev` to preview it locally, or push
   to GitHub. Netlify/Vercel will rebuild the site automatically and the new
   post will appear on `/news/`.

**Please keep every post consistent with the group's framing:** no naming
affected children or families, no claiming a cancer cluster has been found,
no accusing any person/product/company/agency of causing cancer. See the
"About Ladera Health Watch" section on `/get-involved/` on the live site for
the exact language to reuse if in doubt.

## Project structure

```
src/
  site.config.ts:      site name, tagline, and every external link/placeholder (the TODOs)
  content/news/:       one .md file per News & Updates post
  content.config.ts:   the schema those files must follow
  components/:         Header, Footer, the "What We Know" Ledger, etc.
  layouts/BaseLayout.astro: shared <head>, SEO/OG tags, header/footer wrapper
  pages/:              one file per page/route
public/:               favicon, robots.txt, the generated OG share image (og.png)
scripts/generate-og.mjs: regenerates public/og.png (run with `npm run og`)
```

## Updating the Open Graph share image

`public/og.png` is the image that shows up when a link to this site is shared
on Facebook or elsewhere. It's generated from the site's own colors and
fonts, not a photo, so it never goes stale on its own, but you should
regenerate it any time the headline, tagline, or `src/styles/global.css`
color tokens change:

```sh
npm run og
```

After deploying a change to this image, see "Validating the share image after
deploy" below. Facebook caches OG images aggressively and won't show the new
one until you force it to re-check.

### Validating the share image after deploy

Do this after the *first* deploy, and again any time you change `og.png` or
any page's title/description:

1. Go to [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug).
2. Paste in the live page URL (start with the homepage).
3. Click **"Scrape Again"**. Facebook caches OG images aggressively, so if you
   skip this step it can keep showing an old or missing image for days even
   after the live site is correct.
4. Confirm the preview shows the right title, description, and the `og.png`
   card, not a blank/broken image.
5. Repeat for any other page you expect people to share directly (e.g.
   `/survey/`, `/what-we-know/`).

## Analytics

No analytics are included by default: nothing tracks visitors out of the
box. If the group later wants basic, privacy-respecting visitor counts
without tracking individuals, [Plausible](https://plausible.io) is a good
option:

1. Create a Plausible account and add this site's domain.
2. Add the single `<script>` tag Plausible gives you into
   `src/layouts/BaseLayout.astro`, just before `</head>`.

That's it: no cookie banner is required for Plausible's default setup since
it doesn't use cookies or collect personal data.
