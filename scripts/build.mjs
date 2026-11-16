// Generates the static pages of metemlabs.com from data/publications.json:
// the home page, publications/index.html, one page per publication and
// sitemap.xml. Run: node scripts/build.mjs  (output is committed as is;
// Vercel serves the folder without a build step).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SITE = 'https://metemlabs.com';
const CONTACT = 'contact@metemlabs.com';
const YEAR = 2026;
const pubs = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/publications.json'), 'utf8'));

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const OG_IMAGE = `${SITE}/images/og.png?v=3`;
const OG_ALT = 'Metem Labs. Research Toward Digital Minds.';
const ORG = { '@type': 'ResearchOrganization', name: 'Metem Labs', url: `${SITE}/`, logo: `${SITE}/favicon-512x512.png`, email: CONTACT };
const jsonLd = (o) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...o }).replace(/</g, '\\u003c')}</script>`;

// Header: same as metem.org's (SharedHeader + MenuPanel), without Donate.
// Desktop (> 900px): logo | Publications  Contact. At or below 900px:
// a MENU/CLOSE button and its dropdown panel.
const NAV = [
  { label: 'Publications', href: '/publications/' },
  { label: 'Contact', href: `mailto:${CONTACT}` },
];
const header = (current) => {
  const link = (cls) => (p) => `<a class="${cls}${p.href === current ? ' on' : ''}" href="${p.href}"${p.href === current ? ' aria-current="page"' : ''}>${p.label}</a>`;
  return `<header class="hdr" id="hdr">
  <div class="hdr-in">
    <a class="logo" href="/" aria-label="Metem Labs — home">METEM <span>LABS</span></a>
    <nav class="hdr-wide" aria-label="Main"><span class="hdr-sep" aria-hidden="true"></span>${NAV.map(link('hdr-link')).join('')}</nav>
    <button class="hdr-narrow menu-btn" id="menu-btn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="menu-panel"><span class="mb"><span class="mb-close">CLOSE</span><span class="mb-menu">MENU</span></span></button>
  </div>
</header>
<div class="menu-wrap" id="menu-panel" hidden><div class="menu-in"><div class="menu">${NAV.map(link('menu-link')).join('')}</div></div></div>
<script>
(function(){var h=document.getElementById('hdr'),b=document.getElementById('menu-btn'),m=document.getElementById('menu-panel');
function set(o){m.hidden=!o;b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close navigation menu':'Open navigation menu');b.classList.toggle('open',o);}
b.addEventListener('click',function(){set(m.hidden);});
document.addEventListener('mousedown',function(e){if(!m.hidden&&!e.target.closest('#menu-btn')&&!m.querySelector('.menu').contains(e.target))set(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
function sc(){h.classList.toggle('scrolled',window.scrollY>4);if(!m.hidden)set(false);}
window.addEventListener('scroll',sc,{passive:true});sc();})();
</script>`;
};

const page = ({ title, description, url, body, ld, type = 'website', current = null }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${SITE}${url}" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#E0E0E0" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${SITE}${url}" />
<meta property="og:type" content="${type}" />
<meta property="og:site_name" content="Metem Labs" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:image:secure_url" content="${OG_IMAGE}" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${esc(OG_ALT)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${OG_IMAGE}" />
${ld ? jsonLd(ld) : ''}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/style.css" />
</head>
<body>
${header(current)}
<main>
${body}
  <footer>Metem Labs © ${YEAR}</footer>
</main>
</body>
</html>
`;

const write = (rel, html) => {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
};

// Home
write('index.html', page({
  title: 'Metem Labs — Research Toward Digital Minds',
  description: 'Metem Labs is an R&D lab building the bricks of the digital mind: systems that carry not only what a person did and said, but how they feel.',
  url: '/',
  ld: { ...ORG, description: 'Metem Labs is an R&D lab building the bricks of the digital mind: systems that carry not only what a person did and said, but how they feel.' },
  body: `
  <h1>Research Toward Digital Minds.</h1>

  <section class="box">
    <p>We are building the bricks of the digital mind: systems that (1) capture how a person feels, not just what they did or said, (2) keep what makes that person who they are, (3) predict how they would feel about situations they have never met, (4) stay faithful to the person they come from.</p>
  </section>

  <section class="prose">
    <p>Our goal is to make a digital mind possible: one that carries not only a person's memories and words, but the way they weigh the world.</p>
    <p>Memories and language can be recorded. What makes someone irreplaceable lies beneath them: the weight they give to loyalty, their pet peeves, the precise texture of their stubbornness. Current AI research treats this layer as settled. It is not.</p>
    <p>We work on cognitive continuity, one brick at a time: representing how a person feels about things, learning it from real human answers, and predicting how they would feel where no answer exists yet.</p>
    <p>Every brick is measured before it is claimed.</p>
    <p>Our research also supports the Metem Foundation, which builds the open archive of human feelings: <a href="https://metem.org/">metem.org</a>.</p>
    <p>If this vision resonates with you, write to us: <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>
  </section>`,
}));

// Publications list
write('publications/index.html', page({
  title: 'Publications — Metem Labs',
  description: 'Research reviews from Metem Labs on memory, emotion and the self: what a digital mind would have to preserve.',
  url: '/publications/',
  current: '/publications/',
  ld: { '@type': 'CollectionPage', name: 'Publications — Metem Labs', url: `${SITE}/publications/`, publisher: ORG },
  body: `
  <h1>Publications</h1>
  <p class="back back-list"><a class="pill" href="/">← Home</a></p>
  <ul class="pubs">
${pubs.map((p) => `    <li><span class="pill">${esc(p.date)}</span><a class="t" href="/publications/${p.slug}/">${esc(p.title)}</a><p>${esc(p.description)}</p></li>`).join('\n')}
  </ul>`,
}));

// One page per publication. Bodies are our own HTML, exported from the
// previous site's database; inserted as is.
for (const p of pubs) {
  write(`publications/${p.slug}/index.html`, page({
    title: `${p.title} — Metem Labs`,
    description: p.description.length > 160 ? p.description.slice(0, 157).replace(/\s+\S*$/, '') + '…' : p.description,
    url: `/publications/${p.slug}/`,
    type: 'article',
    current: '/publications/',
    ld: { '@type': 'ScholarlyArticle', headline: p.title, description: p.description, datePublished: p.date.split('.').join('-'), url: `${SITE}/publications/${p.slug}/`, inLanguage: 'en', publisher: ORG, author: ORG },
    body: `
  <p class="back"><a class="pill" href="/publications/">← Publications</a></p>
  <header class="pub-head"><span class="pill">${esc(p.date)}</span><h1>${esc(p.title)}</h1></header>
  <article class="pub-body">${p.body}</article>`,
  }));
}

// Sitemap + robots
const urls = ['/', '/publications/', ...pubs.map((p) => `/publications/${p.slug}/`)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

write('llms.txt', `# Metem Labs

> Metem Labs is an R&D lab building the bricks of the digital mind: systems that carry not only what a person did and said, but how they feel.

Systems that (1) capture how a person feels, not just what they did or said, (2) keep what makes that person who they are, (3) predict how they would feel about situations they have never met, (4) stay faithful to the person they come from.

Memories and language can be recorded. What makes someone irreplaceable lies beneath them: the weight they give to loyalty, their pet peeves, the precise texture of their stubbornness. Metem Labs works on cognitive continuity: representing how a person feels about things, learning it from real human answers, and predicting how they would feel where no answer exists yet.

## Pages

- [Home](${SITE}/): What Metem Labs does.
- [Publications](${SITE}/publications/): Research reviews on memory, emotion and the self.

## Publications

${pubs.map((p) => `- [${p.title}](${SITE}/publications/${p.slug}/) (${p.date}): ${p.description}`).join('\n')}

## Related

- Metem Foundation (separate organisation; builds the open archive of human feelings): https://metem.org/

## Contact

- ${CONTACT}
`);

console.log(`built ${urls.length} pages`);
