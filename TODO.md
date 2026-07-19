# TODO before launch

Everything below is also marked `TODO` directly in the code, so you can find it
by searching the project for the word `TODO`. On macOS/Linux, from this
folder, run:

```
grep -rn "TODO" src public astro.config.mjs
```

## Must supply before launch

- [ ] **Site name**: currently "Ladera Health Watch" in `src/site.config.ts` (`SITE_NAME`). Change it there once the group finalizes the name; every page pulls from this one place.
- [x] **Domain**: set to `https://ladera-health-watch.onrender.com` in `astro.config.mjs` (`site:`), `src/site.config.ts` (`SITE_URL`), `public/robots.txt` (the `Sitemap:` line), and `public/llms.txt` (the page URLs). Update all four again once a custom domain is attached. See README section 2 and 3.
- [x] **Health survey form URL**: set in `src/site.config.ts` (`SURVEY_FORM_URL`).
- [x] **Volunteer sign-up form URL**: set in `src/site.config.ts` (`VOLUNTEER_FORM_URL`).
- [x] **Contact email**: set in `src/site.config.ts` (`CONTACT_EMAIL`) to `laderahealthwatch@gmail.com`.
- [x] **Facebook group URL**: set in `src/site.config.ts` (`FACEBOOK_GROUP_URL`).
- [ ] **LARMAC IPM/spray notices page URL**: confirm `LARMAC_IPM_NOTICES_URL` in `src/site.config.ts` (laderalife.com's structure may change).
- [ ] **NBC Los Angeles article URL**: `externalUrl` in `src/content/news/2026-07-01-nbc-los-angeles-coverage.md`. Add any other press coverage as additional files in the same format.
- [ ] **Photos**: every `ImageSlot` placeholder needs a real resident-contributed photo. Search for `ImageSlot` in `src/pages/` to find each one, and see "Photo placeholder" captions on the built pages.
- [x] **OG share image**: `public/og.png` (1200×630) is generated from the site's own colors and fonts by `npm run og`. Re-run that command any time the headline, tagline, or design tokens change.

## Nice to have, not blocking

- [ ] Decide whether to add privacy-respecting analytics (see README for how to add Plausible).
- [ ] Add real content to the Community Map page once a mapping approach is chosen.
- [ ] Double check the timeline dates on `/what-we-know/` stay accurate as the effort progresses.

## Getting found by search engines and AI tools

The technical side (sitemap, structured data, robots.txt, llms.txt) is already
in place. Two things only a human can do:

- [ ] Submit the sitemap (`/sitemap-index.xml`) to
      [Google Search Console](https://search.google.com/search-console) and
      [Bing Webmaster Tools](https://www.bing.com/webmasters) once the site
      is live on its final domain.
- [ ] Ask any press covering the group (NBC Los Angeles, future coverage) to
      link to the site rather than just naming it. Backlinks from real
      outlets are the biggest lever for both search ranking and whether AI
      tools cite the site as a source.
