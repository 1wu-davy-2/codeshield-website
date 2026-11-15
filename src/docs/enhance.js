/* Turns the ported HTML body into renderable markup:
   stable heading ids, in-site anchor links, TOC data and code-block chrome. */

import { docsHref } from "./docsData.js";

const PY_KEYWORDS = new Set(
  (
    "from import def class return if elif else for while in not and or True False None " +
    "with as raise try except finally lambda yield pass break continue global nonlocal " +
    "assert del async await is true false null"
  ).split(" ")
);

const PLAIN_LANGS = new Set([
  "text",
  "tree",
  "plain",
  "output",
  "ini",
  "toml",
  "yaml"
]);

const TOKEN_RE =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\/\/[^\n]*|--?[A-Za-z][\w-]*|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b)/g;

const COPY_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char];
  });
}

function slugify(value) {
  return (
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function highlight(source, language) {
  const lang = (language || "text").toLowerCase();
  if (PLAIN_LANGS.has(lang)) return escapeHtml(source);

  let output = "";
  let lastIndex = 0;
  let match;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(source))) {
    output += escapeHtml(source.slice(lastIndex, match.index));
    const token = match[0];
    let className = "";
    if (token.charAt(0) === '"' || token.charAt(0) === "'") className = "tok-string";
    else if (token.charAt(0) === "#") className = "tok-comment";
    else if (token.slice(0, 2) === "//") className = "tok-comment";
    else if (/^--?[A-Za-z]/.test(token)) className = "tok-flag";
    else if (/^\d/.test(token)) className = "tok-number";
    else if (PY_KEYWORDS.has(token)) className = "tok-keyword";
    output += className
      ? `<span class="${className}">${escapeHtml(token)}</span>`
      : escapeHtml(token);
    lastIndex = match.index + token.length;
  }

  // Bash-style comments and the leading `#` line of generated stubs read better
  // when the whole line is dimmed, so the generic pass above is enough here.
  output += escapeHtml(source.slice(lastIndex));
  return output;
}

function rewriteLink(href) {
  if (!href) return href;
  if (href.startsWith("#") || /^[a-z]+:/i.test(href)) return href;
  const [path, anchor] = href.split("#");
  const pageId = path.replace(/^\.\//, "").replace(/\.html$/, "") || "index";
  return anchor ? `${docsHref(pageId)}#${anchor}` : docsHref(pageId);
}

function buildCodeBlock(document, pre, fileName, language) {
  if (pre.closest(".code-block")) return;
  const code = pre.querySelector("code") || pre;
  const raw = code.textContent;
  if (pre.dataset.highlight !== "off") {
    code.innerHTML = highlight(raw, language);
  }

  const block = document.createElement("div");
  block.className = "code-block";

  const header = document.createElement("div");
  header.className = "code-header";
  header.innerHTML =
    (fileName ? `<span class="code-file">${escapeHtml(fileName)}</span>` : "") +
    `<span class="code-lang">${escapeHtml(language)}</span>` +
    `<button class="copy-btn" type="button" data-copy aria-label="复制代码">${COPY_ICON}<span data-copy-label>复制</span></button>`;

  pre.parentNode.insertBefore(block, pre);
  block.appendChild(header);
  block.appendChild(pre);
}

/**
 * @param {string} rawHtml body markup of a docs page
 * @param {string} pageId current page id, used to build in-site heading links
 * @returns {{ html: string, toc: { id: string, level: number, text: string }[] }}
 */
export function enhanceHtml(rawHtml, pageId) {
  const host = document.createElement("div");
  host.innerHTML = rawHtml;

  host.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!/\.html(#.*)?$/.test(href)) return;
    link.setAttribute("href", rewriteLink(href));
  });

  const used = new Set();
  const toc = [];

  host.querySelectorAll("h2, h3").forEach((heading) => {
    const text = heading.textContent.trim();
    let id = heading.id;
    if (!id) {
      id = slugify(text);
      const base = id;
      let index = 2;
      while (used.has(id) || document.getElementById(id)) id = `${base}-${index++}`;
    }
    heading.id = id;
    used.add(id);
    toc.push({ id, level: Number(heading.tagName.slice(1)), text });

    const anchor = document.createElement("a");
    anchor.className = "anchor";
    anchor.href = `${docsHref(pageId)}#${id}`;
    anchor.textContent = "#";
    anchor.setAttribute("aria-label", "链接到本节");
    heading.prepend(anchor);
  });

  host.querySelectorAll("pre[data-file], pre[data-lang]").forEach((pre) => {
    buildCodeBlock(document, pre, pre.dataset.file || "", (pre.dataset.lang || "text").toLowerCase());
  });

  return { html: host.innerHTML, toc };
}
