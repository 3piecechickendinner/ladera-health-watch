// Central config for the site. Change SITE_NAME here once the group finalizes
// it: every page title, OG tag, and header pulls from this file.
// Anything marked TODO must be supplied before launch. See TODO.md at the repo root.

export const SITE_NAME = 'Ladera Health Watch';
export const SITE_TAGLINE = 'Asking reasonable questions. Requesting reasonable changes.';
export const SITE_DESCRIPTION =
  'A volunteer group of Ladera Ranch parents and residents gathering information on self-reported pediatric cancer cases, requesting a formal state health analysis, and working constructively with LARMAC on pesticide and herbicide use in common areas.';

// Temporary Render address. TODO: replace once a custom domain is attached
// (keep this in sync with `site:` in astro.config.mjs and the Sitemap line
// in public/robots.txt).
export const SITE_URL = 'https://ladera-health-watch.onrender.com';

export const SURVEY_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeDWdV0bKIk7hvJDlHqnbuPByQ8YTGctX7hvhVhvq0FC3gxVg/viewform';

export const VOLUNTEER_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfQRYig-IQ7e-6iE0aSLAUW-lP4a3a3l6v_AIZ3jLXU9bY7Pg/viewform';

export const CONTACT_EMAIL = 'laderahealthwatch@gmail.com';

export const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/186166214769732';

// Small credit line in the footer.
export const BUILDER_NAME = 'Databackfill';
export const BUILDER_URL = 'https://databackfill.com';

// Footer newsletter signup (NewsletterSignup.astro), shared Formspree
// account across the group's projects.
export const FORMSPREE_SIGNUP_ACTION = 'https://formspree.io/f/mnjepdzk';

// TODO: confirm current LARMAC IPM / spray-notice page URL (laderalife.com structure may change).
export const LARMAC_IPM_NOTICES_URL = 'https://www.laderalife.com/TODO-REPLACE-WITH-IPM-NOTICES-PATH';

// Nav is deliberately kept short for mobile readers arriving from Facebook.
// Home is reached via the site name in the header, not a nav item.
// Pesticide Notices lives on /what-we-know/ as a section; Community Map
// stays live at /map/ but is only linked from What We Know ("aggregate map
// coming soon"), not in nav.
export const NAV_LINKS = [
  { href: '/what-we-know/', label: 'What We Know' },
  { href: '/news/', label: 'News' },
  { href: '/survey/', label: 'Report a Case' },
  { href: '/get-involved/', label: 'Get Involved' },
  { href: '/about/', label: 'About' },
];
