#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
const write = (relativePath, content) => fs.writeFileSync(path.join(projectRoot, relativePath), content, 'utf8');

const pages = JSON.parse(read('build/pages.json'));
const navigation = JSON.parse(read('build/navigation.json'));

const layoutTemplate = read('templates/layout.html');
const headerTemplate = read('templates/partials/header.html');
const footerTemplate = read('templates/partials/footer.html');

const navByHref = new Map(navigation.header.map((item) => [item.href, item]));

const renderHeaderNav = (pageId) => navigation.header
  .map((item) => {
    const activeClass = item.activeOn.includes(pageId) ? ' class="active"' : '';
    return `          <li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
  })
  .join('\n');

const renderFooterColumns = () => navigation.footerColumns
  .map((column) => {
    const links = column
      .map((href) => {
        const item = navByHref.get(href);
        if (!item) {
          throw new Error(`Missing navigation item for href: ${href}`);
        }
        return `          <a href="${item.href}">${item.label}</a>`;
      })
      .join('\n');

    return `        <div class="footer-nav-column">\n${links}\n        </div>`;
  })
  .join('\n');

const renderStyleLinks = (styles) => styles
  .map((href) => `  <link rel="stylesheet" href="${href}">`)
  .join('\n');

const renderScriptLinks = (scripts) => scripts
  .map((src) => `  <script src="${src}"></script>`)
  .join('\n');

for (const page of pages) {
  const header = headerTemplate.replace('{{headerNavItems}}', renderHeaderNav(page.id));
  const footer = footerTemplate.replace('{{footerNavColumns}}', renderFooterColumns());
  const mainContent = read(page.content).trimEnd();

  const output = layoutTemplate
    .replace('{{metaDescription}}', page.description)
    .replace('{{pageTitle}}', page.title)
    .replace('{{styleLinks}}', renderStyleLinks(page.styles))
    .replace('{{header}}', header)
    .replace('{{mainContent}}', mainContent)
    .replace('{{footer}}', footer)
    .replace('{{scriptLinks}}', renderScriptLinks(page.scripts));

  write(page.output, output);
}

console.log(`Built ${pages.length} pages.`);
