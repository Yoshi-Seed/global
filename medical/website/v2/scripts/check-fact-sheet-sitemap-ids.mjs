#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('medical/website/v2');
const dataPath = path.join(baseDir, 'js/fact-sheets-data.js');
const sitemapPath = path.join(baseDir, 'sitemap.xml');

const dataSource = fs.readFileSync(dataPath, 'utf8');
const sitemapSource = fs.readFileSync(sitemapPath, 'utf8');

const factSheetsBlock = dataSource.match(/window\.FACT_SHEETS\s*=\s*\[(.*?)\];\s*window\.REPORT_SUMMARIES/s);
if (!factSheetsBlock) {
  console.error('Could not locate window.FACT_SHEETS block in fact-sheets-data.js');
  process.exit(1);
}

const factSheetsSection = factSheetsBlock[1];
const idMatches = [...factSheetsSection.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
const relatedBlocks = [...factSheetsSection.matchAll(/\brelated:\s*\[([^\]]*)\]/g)].map((m) => m[1]);
const relatedIds = relatedBlocks.flatMap((block) => [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]));

const dataIds = new Set(idMatches);
const sitemapIds = new Set(
  [...sitemapSource.matchAll(/fact-sheet\.html\?id=([a-z0-9-]+)/g)].map((m) => m[1])
);

const missingInSitemap = [...dataIds].filter((id) => !sitemapIds.has(id));
const extraInSitemap = [...sitemapIds].filter((id) => !dataIds.has(id));
const relatedMissing = [...new Set(relatedIds)].filter((id) => !dataIds.has(id));

if (missingInSitemap.length || extraInSitemap.length || relatedMissing.length) {
  if (missingInSitemap.length) {
    console.error(`IDs defined in fact-sheets-data.js but missing in sitemap.xml: ${missingInSitemap.join(', ')}`);
  }
  if (extraInSitemap.length) {
    console.error(`IDs present in sitemap.xml but not in fact-sheets-data.js: ${extraInSitemap.join(', ')}`);
  }
  if (relatedMissing.length) {
    console.error(`IDs referenced in related[] but not defined in fact-sheets-data.js: ${relatedMissing.join(', ')}`);
  }
  process.exit(1);
}

console.log(`Fact Sheet ID check passed. ${dataIds.size} data IDs match sitemap IDs, and all related[] references are valid.`);
