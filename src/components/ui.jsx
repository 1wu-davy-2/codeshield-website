import { useEffect, useRef, useState } from "react";

export function Icon({ name, className = "icon", hidden = true }) {
  return (
    <svg className={className} aria-hidden={hidden ? "true" : undefined} focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function CopyButton({ text, onCopy, label, className = "copy-btn" }) {
  return (
    <button className={className} type="button" aria-label={label} onClick={() => onCopy(text, false)}>
      <Icon name="copy" className="icon icon-sm" />
    </button>
  );
}

function formatCount(value, decimals) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

export function Counter({ value, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => formatCount(value, decimals));

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finalValue = formatCount(value, decimals);

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      setDisplay(finalValue);
      return undefined;
    }

    let frame = null;
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || started) return;
        started = true;
        observer.disconnect();
        const duration = 1500;
        let startTime = null;
        const tick = (now) => {
          if (startTime === null) startTime = now;
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(formatCount(value * eased, decimals));
          if (progress < 1) frame = window.requestAnimationFrame(tick);
          else setDisplay(finalValue);
        };
        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [value, decimals]);

  return (
    <>
      <span ref={ref}>{display}</span>
      {suffix ? <span className="stat-suffix">{suffix}</span> : null}
    </>
  );
}

export function handleSpotlight(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function SectionHead({ eyebrow, title, lead, center = false }) {
  return (
    <div className={`section-head${center ? " center" : ""} reveal`}>
      <span className="eyebrow">
        <i aria-hidden="true" />
        <span>{eyebrow}</span>
      </span>
      <h2>{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}
