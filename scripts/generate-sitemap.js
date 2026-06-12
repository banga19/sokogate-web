// Sitemap generator for SEO market pages
// Run: node scripts/generate-sitemap.js
const fs = require('fs');
const BASE_URL = 'https://sokogate.com';
const TODAY = new Date().toISOString().split("T")[0];

const PAGES = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/guinea', priority: '0.9', changefreq: 'monthly' },
    { url: '/senegal', priority: '0.9', changefreq: 'monthly' },
    { url: '/ghana', priority: '0.9', changefreq: 'monthly' },
    { url: '/cote-divoire', priority: '0.9', changefreq: 'monthly' },
    { url: '/cameroon', priority: '0.9', changefreq: 'monthly' },
    { url: '/sierra-leone', priority: '0.9', changefreq: 'monthly' },
    { url: '/kenya', priority: '0.9', changefreq: 'monthly' },
    { url: '/zimbabwe', priority: '0.9', changefreq: 'monthly' },
    { url: '/v2/login', priority: '0.8', changefreq: 'monthly' },
    { url: '/v2/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/v2/register', priority: '0.7', changefreq: 'monthly' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

// Ensure directory exists
if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap generated:', PAGES.length, 'pages');