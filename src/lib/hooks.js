import { useCallback, useEffect, useState } from "react";

const THEME_STORAGE = "cs-theme";

function readInitialTheme() {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    const meta = document.getElementById("metaThemeColor");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#060b16" : "#f7faff");
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      let stored = null;
      try {
        stored = localStorage.getItem(THEME_STORAGE);
      } catch (error) {
        /* ignore */
      }
      if (stored === "light" || stored === "dark") return;
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE, next);
      } catch (error) {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

export function useDocumentTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll(".reveal:not(.is-visible)"));
    if (!items.length) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      /* fall through to the legacy path */
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (error) {
    /* ignore */
  }
  document.body.removeChild(textarea);
  return true;
}
