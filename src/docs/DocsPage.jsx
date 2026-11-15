import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { Icon } from "../components/ui.jsx";
import { copyToClipboard } from "../lib/hooks.js";
import { enhanceHtml } from "./enhance.js";
import DocsSearch from "./DocsSearch.jsx";
import {
  DOCS_GITHUB,
  DOCS_NAV,
  DOCS_VERSION,
  docsHref,
  docsPage,
  docsPageHref,
  docsPageSequence
} from "./docsData.js";

function useSubbarOffset() {
  return useCallback(() => {
    const subbar = document.querySelector(".docs-subbar");
    const bottom = subbar?.getBoundingClientRect().bottom ?? 0;
    return (bottom || 124) + 18;
  }, []);
}

export default function DocsPage({ pageId, anchor }) {
  const { t, lang } = useI18n();
  const page = docsPage(pageId);
  const { html, toc } = useMemo(() => enhanceHtml(page.html, page.id), [page]);
  const [activeId, setActiveId] = useState(() => toc[0]?.id || "");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const articleRef = useRef(null);
  const offsetFor = useSubbarOffset();

  const sequence = useMemo(() => docsPageSequence(), []);
  const pageIndex = sequence.findIndex((item) => item.page === page.id);
  const previous = pageIndex > 0 ? sequence[pageIndex - 1] : null;
  const next = pageIndex >= 0 && pageIndex < sequence.length - 1 ? sequence[pageIndex + 1] : null;

  const hasAnchorItem = (group) =>
    group.items.some((item) => item.page === page.id && item.anchor && item.anchor === anchor);

  // Keep the document title page-aware while the docs view is mounted.
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") || "";
    document.title = `${page.title} · CodeShield`;
    if (meta && page.description) meta.setAttribute("content", page.description);
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription) meta.setAttribute("content", previousDescription);
    };
  }, [page.title, page.description]);

  // Jump to the requested section (or the top of the page) after navigation.
  // `behavior: "auto"` would follow the site's smooth scroll-behavior, so the
  // jump temporarily disables it to land exactly on the section.
  useEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    if (anchor) {
      const target = document.getElementById(anchor);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - offsetFor();
        window.scrollTo(0, Math.max(0, top));
        setActiveId(anchor);
        root.style.scrollBehavior = previousBehavior;
        return undefined;
      }
    }

    window.scrollTo(0, 0);
    setActiveId(toc[0]?.id || "");
    root.style.scrollBehavior = previousBehavior;
    return undefined;
  }, [page.id, anchor, toc, offsetFor]);

  useEffect(() => {
    setMenuOpen(false);
  }, [page.id, anchor]);

  // Scroll spy for the "on this page" column.
  useEffect(() => {
    if (!toc.length) return undefined;
    const nodes = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!nodes.length) return undefined;

    let ticking = false;
    const update = () => {
      ticking = false;
      const marker = offsetFor() + 6;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      let current = nodes[0].id;
      if (atBottom) {
        current = nodes[nodes.length - 1].id;
      } else {
        for (const node of nodes) {
          if (node.getBoundingClientRect().top <= marker) current = node.id;
          else break;
        }
      }
      setActiveId((existing) => (existing === current ? existing : current));
    };
    const request = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [toc, offsetFor]);

  // Copy buttons live inside the injected HTML, so labels are synced by hand.
  useEffect(() => {
    const root = articleRef.current;
    if (!root) return;
    root.querySelectorAll("[data-copy-label]").forEach((node) => {
      node.textContent = t("docs.copy");
    });
  }, [html, t]);

  const onArticleClick = useCallback(
    async (event) => {
      const trigger = event.target.closest("[data-copy]");
      if (!trigger) return;
      const pre = trigger.closest(".code-block")?.querySelector("pre");
      if (!pre) return;
      await copyToClipboard(pre.textContent);
      const label = trigger.querySelector("[data-copy-label]");
      if (!label) return;
      label.textContent = t("docs.copied");
      window.setTimeout(() => {
        label.textContent = t("docs.copy");
      }, 1400);
    },
    [t]
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
        return;
      }
      if (event.key === "/" && !searchOpen) {
        const target = event.target;
        const tag = target?.tagName?.toLowerCase() || "";
        if (tag !== "input" && tag !== "textarea" && !target?.isContentEditable) {
          event.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    document.body.classList.toggle("docs-drawer", menuOpen);
    return () => document.body.classList.remove("docs-drawer");
  }, [menuOpen]);

  return (
    <div className={`docs-root${menuOpen ? " sidebar-open" : ""}`}>
      <div className="docs-subbar">
        <div className="docs-subbar-inner">
          <button
            className="docs-icon-btn docs-menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="docs-sidebar"
            aria-label={menuOpen ? t("docs.closeMenu") : t("docs.openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>

          <div className="docs-crumb">
            <a href="#/docs">{t("docs.title")}</a>
            <span className="crumb-sep">/</span>
            <strong>{page.title}</strong>
          </div>

          <span className="docs-badge">{DOCS_VERSION}</span>

          <div className="docs-subbar-actions">
            <button
              className="docs-search-trigger"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" />
              <span>{t("docs.search")}</span>
              <kbd>{/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K"}</kbd>
            </button>
            <a
              className="docs-icon-btn docs-github"
              href={DOCS_GITHUB}
              target="_blank"
              rel="noreferrer"
              aria-label={t("docs.github")}
            >
              <Icon name="github" />
            </a>
          </div>
        </div>
      </div>

      <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />

      <div className="page-shell">
        <aside className="sidebar" id="docs-sidebar" aria-label={t("docs.sidebar")}>
          {DOCS_NAV.map((group) => {
            const groupHashActive = hasAnchorItem(group);
            return (
              <div className="sidebar-group" key={group.title}>
                <div className="sidebar-title">{group.title}</div>
                <nav aria-label={group.title}>
                  {group.items.map((item) => {
                    let active = false;
                    if (item.page === page.id) {
                      active = item.anchor ? item.anchor === anchor : !groupHashActive;
                    }
                    return (
                      <a
                        key={`${item.page}-${item.anchor || "top"}`}
                        className={`sidebar-link${active ? " is-active" : ""}`}
                        href={docsPageHref(item.page, item.anchor)}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.title}
                      </a>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </aside>

        <main className="main" id="main">
          {lang !== "zh" ? <p className="docs-lang-note">{t("docs.langNote")}</p> : null}

          <article
            className="doc"
            lang="zh-Hans"
            ref={articleRef}
            onClick={onArticleClick}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {previous || next ? (
            <nav className="page-nav" aria-label={t("docs.pageNav")}>
              {previous ? (
                <a href={docsHref(previous.page)}>
                  <small>{t("docs.prev")}</small>
                  <strong>{previous.title}</strong>
                </a>
              ) : (
                <span />
              )}
              {next ? (
                <a className="next" href={docsHref(next.page)}>
                  <small>{t("docs.next")}</small>
                  <strong>{next.title}</strong>
                </a>
              ) : (
                <span />
              )}
            </nav>
          ) : null}

          <footer className="doc-footer">
            {t("docs.footerNote")} ·{" "}
            <a href={DOCS_GITHUB} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </footer>
        </main>

        <aside className="toc" aria-label={t("docs.toc")}>
          <div className="toc-title">{t("docs.toc")}</div>
          <nav>
            {toc.length ? (
              toc.map((item) => (
                <a
                  key={item.id}
                  className={`toc-link toc-h${item.level}${activeId === item.id ? " is-active" : ""}`}
                  href={`${docsHref(page.id)}#${item.id}`}
                >
                  {item.text}
                </a>
              ))
            ) : (
              <span className="toc-link">{t("docs.tocEmpty")}</span>
            )}
          </nav>
        </aside>
      </div>

      <DocsSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
