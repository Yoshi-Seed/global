import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const FACT_SHEETS_PATH = resolve("js/fact-sheets-data.js");
const SITEMAP_PATH = resolve("sitemap.xml");

function getFactSheetIds(content) {
  const ids = new Set();
  const idRegex = /id:\s*"([^"]+)"/g;
  let match;

  while ((match = idRegex.exec(content)) !== null) {
    ids.add(match[1]);
  }

  return ids;
}

function getSitemapFactSheetIds(content) {
  const ids = new Set();
  const locRegex = /<loc>([^<]*fact-sheet\.html\?id=([^<]+))<\/loc>/g;
  let match;

  while ((match = locRegex.exec(content)) !== null) {
    ids.add(match[2]);
  }

  return ids;
}

function difference(sourceSet, targetSet) {
  return [...sourceSet].filter((item) => !targetSet.has(item));
}

const [factSheetsContent, sitemapContent] = await Promise.all([
  readFile(FACT_SHEETS_PATH, "utf8"),
  readFile(SITEMAP_PATH, "utf8"),
]);

const factSheetIds = getFactSheetIds(factSheetsContent);
const sitemapIds = getSitemapFactSheetIds(sitemapContent);

const missingInSitemap = difference(factSheetIds, sitemapIds);
const unknownInSitemap = difference(sitemapIds, factSheetIds);

if (missingInSitemap.length === 0 && unknownInSitemap.length === 0) {
  console.log(
    `Content validation passed. ${factSheetIds.size} IDs are consistent.`,
  );
  process.exit(0);
}

console.error("Content validation failed.");

if (missingInSitemap.length > 0) {
  console.error(`- IDs missing in sitemap.xml: ${missingInSitemap.join(", ")}`);
}

if (unknownInSitemap.length > 0) {
  console.error(
    `- Unknown IDs found in sitemap.xml: ${unknownInSitemap.join(", ")}`,
  );
}

process.exit(1);
