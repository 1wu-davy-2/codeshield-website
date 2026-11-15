/* Route helpers shared by the app shell and the docs bundle.
   Kept free of the docs payload so the marketing entry stays small. */

export const DOCS_PAGE_IDS = [
  "index",
  "quick-start",
  "build",
  "runtime",
  "integrity",
  "licensing",
  "deploy",
  "security"
];

export function isDocsPage(pageId) {
  return DOCS_PAGE_IDS.includes(pageId);
}

export function docsHref(pageId) {
  return pageId === "index" ? "#/docs" : `#/docs/${pageId}`;
}

export function docsPageHref(pageId, anchor) {
  return anchor ? `${docsHref(pageId)}#${anchor}` : docsHref(pageId);
}
