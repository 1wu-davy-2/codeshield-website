import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { Icon } from "../components/ui.jsx";
import SEARCH_INDEX from "./searchIndex.json";
import { DOCS_NAV, docsHref, docsPage } from "./docsData.js";

function defaultResults() {
  const seen = new Set();
  const list = [];
  DOCS_NAV.forEach((group) => {
    group.items.forEach((item) => {
      if (item.anchor || seen.has(item.page)) return;
      seen.add(item.page);
      list.push({
        page: item.page,
        pageTitle: docsPage(item.page).title,
        group: group.title,
        title: docsPage(item.page).title,
        href: docsHref(item.page),
        kind: "page"
      });
    });
  });
  return list;
}

function score(entry, query) {
  const title = String(entry.title || "").toLowerCase();
  const pageTitle = String(entry.pageTitle || "").toLowerCase();
  const group = String(entry.group || "").toLowerCase();
  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (title.includes(query)) return 2;
  if (pageTitle.includes(query)) return 3;
  if (group.includes(query)) return 4;
  return -1;
}

export default function DocsSearch({ open, onClose }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return defaultResults();
    return SEARCH_INDEX.map((entry) => ({ entry, rank: score(entry, normalized) }))
      .filter((item) => item.rank !== -1)
      .sort(
        (left, right) =>
          left.rank - right.rank || String(left.entry.title).length - String(right.entry.title).length
      )
      .slice(0, 18)
      .map((item) => item.entry);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setSelected(0);
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    document.body.classList.add("docs-locked");
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.classList.remove("docs-locked");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    const node = listRef.current?.querySelectorAll(".search-result")[selected];
    node?.scrollIntoView({ block: "nearest" });
  }, [selected, results]);

  if (!open) return null;

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (results.length) setSelected((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length) setSelected((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[selected];
      if (target) {
        window.location.hash = target.href;
        onClose();
      }
    }
  };

  return (
    <div className="search-modal" role="presentation">
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-panel" role="dialog" aria-modal="true" aria-label={t("docs.search")}>
        <div className="search-head">
          <Icon name="search" className="icon icon-sm" />
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            value={query}
            placeholder={t("docs.searchPlaceholder")}
            autoComplete="off"
            spellCheck="false"
            aria-label={t("docs.search")}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd className="search-esc">Esc</kbd>
        </div>

        <div className="search-results" ref={listRef}>
          {results.length === 0 ? (
            <div className="search-empty">{t("docs.searchEmpty")}</div>
          ) : (
            results.map((entry, index) => {
              const path =
                entry.kind === "page"
                  ? `${entry.group} · ${t("docs.kindPage")}`
                  : `${entry.pageTitle} · ${entry.group}`;
              return (
                <a
                  key={`${entry.href}-${index}`}
                  className={`search-result${index === selected ? " is-selected" : ""}`}
                  href={entry.href}
                  onMouseEnter={() => setSelected(index)}
                  onClick={onClose}
                >
                  <span className="search-result-main">
                    <span className="search-result-title">{entry.title}</span>
                    <span className="search-result-path">{path}</span>
                  </span>
                </a>
              );
            })
          )}
        </div>

        <div className="search-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> {t("docs.hintSelect")}
          </span>
          <span>
            <kbd>Enter</kbd> {t("docs.hintOpen")}
          </span>
          <span>
            <kbd>Esc</kbd> {t("docs.hintClose")}
          </span>
        </div>
      </div>
    </div>
  );
}
