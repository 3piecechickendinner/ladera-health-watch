#!/usr/bin/env node
// Regenerates public/og.png: a purely typographic Open Graph share image built
// from an SVG using this site's own design tokens and typefaces, then
// rasterized with resvg (no browser, no network access required).
//
// Run with: npm run og

import { writeFile, mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import * as wawoff2 from 'wawoff2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Read SITE_NAME/SITE_URL out of site.config.ts as plain text rather than
// importing it. Native TypeScript import support varies across Node 22.x
// versions, and this script needs to run unmodified with a plain `node`
// command for non-developer volunteers (see README).
async function readSiteConfigValue(name) {
  const src = await readFile(path.join(ROOT, 'src', 'site.config.ts'), 'utf8');
  const match = src.match(new RegExp(`export const ${name}\\s*=\\s*\\n?\\s*'([^']+)'`));
  if (!match) throw new Error(`Could not find ${name} in src/site.config.ts`);
  return match[1];
}

const SITE_NAME = await readSiteConfigValue('SITE_NAME');
const SITE_URL = await readSiteConfigValue('SITE_URL');

// Design tokens, copied from src/styles/global.css (@theme block). Keep these
// two files in sync if the palette ever changes.
const COLORS = {
  paper100: '#eff0e7',
  oak900: '#212b1d',
  goldButton: '#a97726', // gold-600, reserved for buttons elsewhere
  gold700: '#8a611e', // gold-700, used for accent *text* on paper backgrounds
  sage300: '#b7c0ac',
  oak700: '#3a4a32',
  fog700: '#3d5860',
};

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 80;

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- 1. Load and decompress the fonts this site actually uses, from the
// @fontsource packages already in node_modules (no network fetch). resvg
// needs raw TTF/OTF, so woff2 is decompressed in memory with wawoff2 (pure
// JS/WASM) and written to a temp dir resvg can read from.
async function loadFont(pkg, file) {
  const woff2Path = path.join(ROOT, 'node_modules', '@fontsource', pkg, 'files', file);
  const woff2Buffer = await readFile(woff2Path);
  return Buffer.from(await wawoff2.decompress(woff2Buffer));
}

const fontJobs = [
  { pkg: 'zilla-slab', file: 'zilla-slab-latin-600-normal.woff2', out: 'zilla-slab-600.ttf' },
  { pkg: 'public-sans', file: 'public-sans-latin-400-normal.woff2', out: 'public-sans-400.ttf' },
  { pkg: 'public-sans', file: 'public-sans-latin-600-normal.woff2', out: 'public-sans-600.ttf' },
];

const tempDir = await mkdtemp(path.join(tmpdir(), 'ladera-og-fonts-'));

try {
  const fontFiles = [];
  for (const job of fontJobs) {
    const ttfBuffer = await loadFont(job.pkg, job.file);
    const outPath = path.join(tempDir, job.out);
    await writeFile(outPath, ttfBuffer);
    fontFiles.push(outPath);
  }

  // --- 2. Build the card copy.
  const domain = new URL(SITE_URL).hostname;
  const headlineLines = ['Ladera Health', 'Watch'];
  const subheadLines = [
    'A volunteer effort by Ladera Ranch',
    'parents and residents. Asking reasonable',
    'questions. Requesting reasonable changes.',
  ];

  // --- 3. The quiet signature device: an abstracted, low-contrast version of
  // the "What We Know" ledger (a vertical divider between two columns, each
  // headed by the same square/circle markers used on the real ledger,
  // followed by a few bar-shaped stand-ins for list rows). Confined to the
  // right third of the canvas (x: 800-1200), well clear of the text column.
  const zoneLeft = 800;
  const zoneRight = WIDTH - MARGIN; // 1120
  const dividerX = zoneLeft + (zoneRight - zoneLeft) / 2 + 15; // ~967
  const colAX = zoneLeft + 25; // ~825
  const colBX = dividerX + 25;
  const zoneTop = 150;
  const zoneBottom = 480;

  function barRows(x, colWidth, count) {
    const widths = [1, 0.72, 0.85, 0.55];
    let rows = '';
    for (let i = 0; i < count; i++) {
      const y = zoneTop + 46 + i * 42;
      const w = colWidth * widths[i % widths.length];
      rows += `<rect x="${x}" y="${y}" width="${w}" height="10" rx="2" fill="${COLORS.oak700}" opacity="0.10" />\n`;
    }
    return rows;
  }

  const colWidth = dividerX - 30 - colAX;

  const watermark = `
    <g>
      <line x1="${dividerX}" y1="${zoneTop}" x2="${dividerX}" y2="${zoneBottom}" stroke="${COLORS.sage300}" stroke-width="2" opacity="0.5" />
      <rect x="${colAX}" y="${zoneTop}" width="16" height="16" fill="${COLORS.goldButton}" opacity="0.35" />
      ${barRows(colAX, colWidth, 4)}
      <circle cx="${colBX + 8}" cy="${zoneTop + 8}" r="8" fill="none" stroke="${COLORS.fog700}" stroke-width="2.5" opacity="0.35" />
      ${barRows(colBX, colWidth, 3)}
    </g>
  `;

  // --- 4. Headline + subhead + domain line, all left-aligned in the text
  // safe zone (x: 80 to ~760, leaving clearance before the watermark third).
  const headlineSize = 108;
  const headlineLineHeight = 112;
  const headlineStartY = 210;

  const headlineSvg = headlineLines
    .map(
      (line, i) =>
        `<text x="${MARGIN}" y="${headlineStartY + i * headlineLineHeight}" font-family="Zilla Slab" font-weight="600" font-size="${headlineSize}" fill="${COLORS.oak900}">${escapeXml(line)}</text>`
    )
    .join('\n');

  const subheadSize = 30;
  const subheadLineHeight = 44;
  const subheadStartY = headlineStartY + (headlineLines.length - 1) * headlineLineHeight + 74;

  const subheadSvg = subheadLines
    .map(
      (line, i) =>
        `<text x="${MARGIN}" y="${subheadStartY + i * subheadLineHeight}" font-family="Public Sans" font-weight="400" font-size="${subheadSize}" fill="${COLORS.oak900}">${escapeXml(line)}</text>`
    )
    .join('\n');

  const domainY = HEIGHT - MARGIN;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.paper100}" />
  ${watermark}
  ${headlineSvg}
  ${subheadSvg}
  <text x="${MARGIN}" y="${domainY}" font-family="Public Sans" font-weight="600" font-size="26" letter-spacing="0.5" fill="${COLORS.gold700}">${escapeXml(domain)}</text>
</svg>
`.trim();

  // --- 5. Rasterize with resvg. loadSystemFonts is off so the result is
  // identical no matter whose machine (or CI) runs this script.
  const resvg = new Resvg(svg, {
    background: COLORS.paper100,
    fitTo: { mode: 'width', value: WIDTH },
    font: {
      loadSystemFonts: false,
      fontFiles,
      defaultFontFamily: 'Public Sans',
    },
  });

  const pngData = resvg.render().asPng();
  const outPath = path.join(ROOT, 'public', 'og.png');
  await writeFile(outPath, pngData);

  console.log(`Wrote ${path.relative(ROOT, outPath)} (${WIDTH}x${HEIGHT}) for ${SITE_NAME}.`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
