import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import zh from "./zh.js";
import en from "./en.js";
import ja from "./ja.js";
import ko from "./ko.js";
import additions from "./additions.js";

const DICTS = {
  zh: { ...zh, ...additions.zh },
  en: { ...en, ...additions.en },
  ja: { ...ja, ...additions.ja },
  ko: { ...ko, ...additions.ko }
};
const SUPPORTED = ["zh", "en", "ja", "ko"];
const HTML_LANG = { zh: "zh-Hans", en: "en", ja: "ja", ko: "ko" };
const LANG_STORAGE = "cs-lang";

export const LANGUAGES = [
  { code: "zh", label: "简体中文", short: "中文" },
  { code: "en", label: "English", short: "EN" },
  { code: "ja", label: "日本語", short: "日本語" },
  { code: "ko", label: "한국어", short: "한국어" }
];

const MAILTO = {
  trial: { address: "hello@codeshield.dev", subject: "trialSubject" },
  pro: { address: "sales@codeshield.dev", subject: "proSubject" },
  enterprise: { address: "sales@codeshield.dev", subject: "enterpriseSubject" },
  demo: { address: "sales@codeshield.dev", subject: "demoSubject" }
};

const I18nContext = createContext(null);

function get(obj, path) {
  return path.split(".").reduce((acc, key) => {
    return acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined;
  }, obj);
}

export function normalizeLang(value) {
  if (!value) return null;
  const tag = String(value).toLowerCase();
  if (tag.startsWith("zh")) return "zh";
  if (tag.startsWith("ja")) return "ja";
  if (tag.startsWith("ko")) return "ko";
  if (tag.startsWith("en")) return "en";
  return null;
}

function detectLang() {
  try {
    const query = new URLSearchParams(window.location.search).get("lang");
    const fromQuery = normalizeLang(query);
    if (fromQuery) return fromQuery;
  } catch (error) {
    /* ignore */
  }

  try {
    const stored = normalizeLang(localStorage.getItem(LANG_STORAGE));
    if (stored) return stored;
  } catch (error) {
    /* ignore */
  }

  const candidates =
    navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
  for (const candidate of candidates) {
    const match = normalizeLang(candidate);
    if (match) return match;
  }
  return "en";
}

function setMeta(selector, content) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute("content", content);
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLang);

  const dict = DICTS[lang] || DICTS.en;

  const setLang = useCallback((nextLang) => {
    const normalized = normalizeLang(nextLang);
    if (!normalized || !SUPPORTED.includes(normalized)) return;
    setLangState(normalized);
    try {
      localStorage.setItem(LANG_STORAGE, normalized);
    } catch (error) {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key, fallback) => {
      let value = get(dict, key);
      if (value === undefined) value = get(DICTS.en, key);
      if (value === undefined) value = get(DICTS.zh, key);
      if (value === undefined) value = fallback;
      return value === undefined ? key : value;
    },
    [dict]
  );

  const mailto = useCallback(
    (kind) => {
      const plan = MAILTO[kind];
      if (!plan) return "mailto:hello@codeshield.dev";
      const subject = get(dict, `mailto.${plan.subject}`) || "";
      return `mailto:${plan.address}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
    },
    [dict]
  );

  useEffect(() => {
    document.documentElement.setAttribute("lang", HTML_LANG[lang] || lang);
    const meta = dict.meta || {};
    // The docs view sets a page-level title; keep it while it is mounted.
    const docsMounted = Boolean(document.querySelector(".docs-root"));
    if (meta.title) {
      if (!docsMounted) document.title = meta.title;
      setMeta('meta[property="og:title"]', meta.title);
      setMeta('meta[name="twitter:title"]', meta.title);
    }
    if (meta.description) {
      if (!docsMounted) setMeta('meta[name="description"]', meta.description);
      setMeta('meta[property="og:description"]', meta.description);
      setMeta('meta[name="twitter:description"]', meta.description);
    }
    try {
      localStorage.setItem(LANG_STORAGE, lang);
    } catch (error) {
      /* ignore */
    }
  }, [lang, dict]);

  const value = useMemo(
    () => ({ lang, setLang, t, dict, mailto, languages: LANGUAGES }),
    [lang, setLang, t, dict, mailto]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
