#!/usr/bin/env python3
"""Port the standalone PyShield docs prototype into the CodeShield website.

Reads `PyShield/docs-site/*.html` (each page keeps its body inside
`<template id="page-content">`) and writes two JSON data files consumed by
`src/docs/*`:

  src/docs/content.json      page id -> { group, title, titleTag, description, html }
  src/docs/searchIndex.json  flattened search entries with in-site hrefs

The prototype keeps its content as plain HTML, so the port copies that HTML
verbatim instead of hand-rewriting 8 pages into JSX. Layout, navigation, TOC,
search and code-block chrome are re-implemented in React.

Usage:
    python scripts/port-docs.py
    python scripts/port-docs.py --source ../../PyShield/docs-site
"""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

DEFAULT_SOURCE = Path(__file__).resolve().parents[2] / "PyShield" / "docs-site"

PAGE_ORDER = [
    "index",
    "quick-start",
    "build",
    "runtime",
    "integrity",
    "licensing",
    "deploy",
    "security",
]

TEMPLATE_RE = re.compile(
    r'<template id="page-content">(.*?)</template>', re.S
)
BODY_RE = re.compile(r"<body([^>]*)>", re.S)
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S)
DESC_RE = re.compile(
    r'<meta name="description" content="(.*?)"', re.S
)
EYEBROW_RE = re.compile(r'<div class="doc-eyebrow">(.*?)</div>', re.S)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.S)
TAG_RE = re.compile(r"<[^>]+>")


def text_of(value: str) -> str:
    return html.unescape(TAG_RE.sub("", value)).strip()


def attr(attrs: str, name: str) -> str:
    match = re.search(rf'{name}="([^"]*)"', attrs)
    return match.group(1) if match else ""


def page_href(page_id: str) -> str:
    """In-site route for a docs page (hash router)."""
    return "#/docs" if page_id == "index" else f"#/docs/{page_id}"


def rewrite_href(href: str) -> str:
    """`build.html#cipher-suites` -> `#/docs/build#cipher-suites`."""
    page, _, anchor = href.partition("#")
    page_id = page.removesuffix(".html") or "index"
    route = page_href(page_id)
    return f"{route}#{anchor}" if anchor else route


def parse_page(path: Path) -> dict:
    source = path.read_text(encoding="utf-8")
    template = TEMPLATE_RE.search(source)
    if not template:
        raise SystemExit(f"no <template id=page-content> in {path}")
    body_attrs = attr(BODY_RE.search(source).group(1), "data-page")
    page_id = body_attrs or path.stem
    content = template.group(1).strip("\n")

    title_tag = text_of(TITLE_RE.search(source).group(1)) if TITLE_RE.search(source) else ""
    description = ""
    if DESC_RE.search(source):
        description = html.unescape(DESC_RE.search(source).group(1))
    eyebrow = text_of(EYEBROW_RE.search(content).group(1)) if EYEBROW_RE.search(content) else ""
    heading = text_of(H1_RE.search(content).group(1)) if H1_RE.search(content) else title_tag

    return page_id, {
        "id": page_id,
        "group": eyebrow,
        "title": heading,
        "titleTag": title_tag,
        "description": description,
        "html": content,
    }


def parse_search_index(path: Path) -> list[dict]:
    source = path.read_text(encoding="utf-8")
    payload = source[source.index("["): source.rindex("]") + 1]
    entries = json.loads(payload)
    result = []
    for entry in entries:
        href = entry.get("href", "")
        page = href.partition("#")[0].removesuffix(".html") or "index"
        item = dict(entry)
        item["page"] = page
        item["href"] = rewrite_href(href)
        result.append(item)
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--out", type=Path, default=Path(__file__).resolve().parents[1] / "src" / "docs")
    args = parser.parse_args()

    source: Path = args.source
    if not source.exists():
        raise SystemExit(f"docs prototype not found: {source}")

    pages = {}
    for page_id in PAGE_ORDER:
        path = source / f"{page_id}.html"
        if not path.exists():
            raise SystemExit(f"missing page: {path}")
        key, page = parse_page(path)
        if key != page_id:
            page["id"] = page_id
        pages[page_id] = page

    search = parse_search_index(source / "assets" / "search-index.js")

    out: Path = args.out
    out.mkdir(parents=True, exist_ok=True)
    (out / "content.json").write_text(
        json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (out / "searchIndex.json").write_text(
        json.dumps(search, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    total = sum(len(page["html"]) for page in pages.values())
    print(f"pages: {len(pages)}  html: {total / 1024:.1f} KB")
    print(f"search entries: {len(search)}")
    for page_id, page in pages.items():
        print(f"  {page_id:<12} {page['group']:<4} {page['title']}")


if __name__ == "__main__":
    main()
