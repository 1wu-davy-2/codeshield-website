import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { copyToClipboard } from "../lib/hooks.js";
import CHAT_COPY, { CHAT_INTENTS } from "../i18n/chat.js";
import { Icon } from "./ui.jsx";

const EMAIL = "hello@codeshield.dev";

let seq = 0;
const nextId = () => {
  seq += 1;
  return `m${seq}`;
};

function pickIntent(text) {
  const query = String(text).toLowerCase();
  if (!query.trim()) return null;
  for (const intent of CHAT_INTENTS) {
    if (intent.keys.some((key) => query.includes(key))) return intent.id;
  }
  return null;
}

export default function ChatWidget() {
  const { lang } = useI18n();
  const copy = CHAT_COPY[lang] || CHAT_COPY.en;

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(() => [
    { id: nextId(), role: "bot", text: copy.greeting }
  ]);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const timers = useRef([]);
  const greeted = useRef(lang);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Keep the greeting in sync with the active language until the user replies.
  useEffect(() => {
    if (greeted.current === lang) return;
    greeted.current = lang;
    setMessages((current) => {
      const onlyGreeting = current.length === 1 && current[0].role === "bot";
      if (!onlyGreeting) return current;
      return [{ id: current[0].id, role: "bot", text: copy.greeting }];
    });
  }, [lang, copy.greeting]);

  useEffect(() => {
    if (!open) return;
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [open, messages, typing]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const answer = useCallback(
    (text) => {
      const intent = pickIntent(text);
      if (!intent) {
        return {
          text: copy.fallback,
          action: "copyEmail"
        };
      }
      return { text: copy.answers[intent] || copy.fallback, intent };
    },
    [copy]
  );

  const send = useCallback(
    (raw) => {
      const text = String(raw || "").trim();
      if (!text) return;

      setMessages((current) => [...current, { id: nextId(), role: "user", text }]);
      setDraft("");
      setTyping(true);

      const reply = answer(text);
      const delay = 620 + Math.min(text.length * 12, 700);
      const timer = window.setTimeout(() => {
        setTyping(false);
        setMessages((current) => [
          ...current,
          { id: nextId(), role: "bot", text: reply.text, action: reply.action }
        ]);
        if (!open) setUnread(true);
      }, delay);
      timers.current.push(timer);
    },
    [answer, open]
  );

  const onSubmit = (event) => {
    event.preventDefault();
    send(draft);
  };

  const onCopyEmail = async () => {
    await copyToClipboard(EMAIL);
    setMessages((current) => [
      ...current,
      { id: nextId(), role: "bot", text: copy.copied, tone: "muted" }
    ]);
  };

  const quickKeys = useMemo(
    () => ["pricing", "trial", "frameworks", "how", "contact"],
    []
  );

  const toggle = () => {
    setOpen((current) => {
      const next = !current;
      if (next) setUnread(false);
      return next;
    });
  };

  const showQuick = messages.filter((item) => item.role === "user").length < 2;

  return (
    <>
      {open ? (
        <section
          className="chat-panel"
          role="dialog"
          aria-label={copy.title}
          aria-modal="false"
        >
          <header className="chat-head">
            <span className="chat-avatar" aria-hidden="true">
              <Icon name="logo" />
            </span>
            <span className="chat-head-text">
              <strong>{copy.title}</strong>
              <span className="chat-status">
                <i aria-hidden="true" />
                {copy.status}
              </span>
            </span>
            <button
              className="chat-close"
              type="button"
              aria-label={copy.close}
              onClick={toggle}
            >
              <Icon name="minus" className="icon icon-sm" />
            </button>
          </header>

          <div className="chat-body" ref={scrollRef}>
            <ol className="chat-log" aria-live="polite" aria-relevant="additions">
              {messages.map((item) => (
                <li key={item.id} className={`chat-msg chat-msg--${item.role}`}>
                  <div className={`chat-bubble${item.tone ? ` is-${item.tone}` : ""}`}>
                    {item.text}
                  </div>
                  {item.action === "copyEmail" ? (
                    <div className="chat-actions">
                      <button className="chat-action" type="button" onClick={onCopyEmail}>
                        <Icon name="mail" className="icon icon-xs" />
                        {copy.copyEmail}
                      </button>
                      <a className="chat-action" href="#/contact" onClick={() => setOpen(false)}>
                        <Icon name="arrow-up-right" className="icon icon-xs" />
                        {copy.goContact}
                      </a>
                    </div>
                  ) : null}
                </li>
              ))}
              {typing ? (
                <li className="chat-msg chat-msg--bot">
                  <div className="chat-bubble chat-typing" aria-label={copy.typing}>
                    <i />
                    <i />
                    <i />
                  </div>
                </li>
              ) : null}
            </ol>
          </div>

          {showQuick ? (
            <div className="chat-quick">
              <span className="chat-quick-label">{copy.quickTitle}</span>
              <div className="chat-chips">
                {quickKeys.map((key) => (
                  <button
                    key={key}
                    className="chat-chip"
                    type="button"
                    onClick={() => send(copy.quick[key])}
                  >
                    {copy.quick[key]}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <form className="chat-composer" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="chatInput">
              {copy.placeholder}
            </label>
            <input
              id="chatInput"
              ref={inputRef}
              type="text"
              autoComplete="off"
              value={draft}
              placeholder={copy.placeholder}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button
              className="chat-send"
              type="submit"
              aria-label={copy.send}
              disabled={!draft.trim()}
            >
              <Icon name="send" className="icon icon-sm" />
            </button>
          </form>
        </section>
      ) : null}

      <button
        className={`chat-launcher${open ? " is-open" : ""}`}
        type="button"
        ref={launcherRef}
        aria-label={open ? copy.close : copy.open}
        aria-expanded={open}
        onClick={toggle}
      >
        <Icon name={open ? "x" : "chat"} className="icon chat-icon-open" />
        {unread && !open ? <i className="chat-unread" aria-hidden="true" /> : null}
      </button>
    </>
  );
}
