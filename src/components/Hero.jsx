import { useRef } from "react";
import { useI18n } from "../i18n/index.jsx";
import { Counter, CopyButton, Icon } from "./ui.jsx";

const HERO_COMMAND = "java -jar codeshield.jar build -i app.jar -o dist/app.jar -e 2027-12-31";

export default function Hero({ onCopy }) {
  const { t, mailto } = useI18n();
  const visualRef = useRef(null);
  const consoleRef = useRef(null);
  const canParallax = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const onVisualMove = (event) => {
    if (!canParallax.current || !visualRef.current || !consoleRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    consoleRef.current.style.setProperty("--ry", `${(x * 3.2).toFixed(2)}deg`);
    consoleRef.current.style.setProperty("--rx", `${(-y * 2.6).toFixed(2)}deg`);
  };

  const resetTilt = () => {
    if (!consoleRef.current) return;
    consoleRef.current.style.setProperty("--ry", "0deg");
    consoleRef.current.style.setProperty("--rx", "0deg");
  };

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <div className="grid-overlay" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="badge reveal">
            <span className="pulse-dot" />
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="reveal" style={{ "--d": ".06s" }}>
            <span>{t("hero.title1")}</span>
            <br />
            <span className="gradient-text">{t("hero.title2")}</span>
          </h1>
          <p className="hero-lead reveal" style={{ "--d": ".12s" }}>
            {t("hero.lead")}
          </p>
          <div className="hero-actions reveal" style={{ "--d": ".18s" }}>
            <a className="btn btn-primary btn-lg" href={mailto("trial")}>
              <span>{t("hero.ctaPrimary")}</span>
              <Icon name="arrow-right" className="icon icon-sm" />
            </a>
            <a className="btn btn-ghost btn-lg" href="#flow">
              <Icon name="play" className="icon icon-sm" />
              <span>{t("hero.ctaSecondary")}</span>
            </a>
          </div>
          <ul className="hero-trust reveal" style={{ "--d": ".24s" }}>
            {["hero.trust1", "hero.trust2", "hero.trust3"].map((key) => (
              <li key={key}>
                <Icon name="check" className="icon icon-xs" />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="hero-visual reveal"
          style={{ "--d": ".18s" }}
          id="heroVisual"
          ref={visualRef}
          onPointerMove={onVisualMove}
          onPointerLeave={resetTilt}
        >
          <div className="console-glow" aria-hidden="true" />
          <div className="console" ref={consoleRef}>
            <div className="console-bar">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="console-title">{t("hero.terminalTitle")}</span>
              <span className="status-chip">
                <Icon name="shield" className="icon icon-xs" />
                PROTECTED
              </span>
            </div>
            <div className="console-body">
              <pre className="code" aria-label="Build output">
                <span className="ln">
                  <span className="prompt">$</span>{" "}
                  <span className="cmd">java -jar codeshield.jar build</span>{" "}
                  <span className="arg">-i app.jar</span>
                </span>
                <span className="ln dim">{"  -o dist/app.jar -e 2027-12-31"}</span>
                <span className="ln dim">{"→ scanning 1,284 classes …"}</span>
                <span className="ln ok">
                  <span className="tick">✓</span> sealed 1,284 classes <span className="sep">·</span> AES-256-GCM
                </span>
                <span className="ln ok">
                  <span className="tick">✓</span> metadata stubs written <span className="sep">·</span> Spring-safe
                </span>
                <span className="ln ok">
                  <span className="tick">✓</span> manifest signed <span className="sep">·</span> Ed25519
                </span>
                <span className="ln ok">
                  <span className="tick">✓</span> jshield.lic issued <span className="sep">·</span> expires 2027-12-31
                </span>
                <span className="ln result">
                  <span className="badge-mini">PROTECTED</span> build ready in <span className="hl">8.4s</span>
                </span>
              </pre>
              <div className="scan-line" aria-hidden="true" />
            </div>
            <div className="console-foot">
              <span className="signal">
                <i aria-hidden="true" />
                <span>{t("hero.fact3")}</span>
              </span>
              <CopyButton text={HERO_COMMAND} onCopy={onCopy} label={t("common.copyCommand")} />
            </div>
          </div>

          <div className="float-card fc-a" aria-hidden="true">
            <span className="fc-icon">
              <Icon name="shield" className="icon icon-sm" />
            </span>
            <div>
              <strong>Ed25519</strong>
              <span>signature verified</span>
            </div>
            <Icon name="check-circle" className="icon icon-xs fc-check" />
          </div>
          <div className="float-card fc-b" aria-hidden="true">
            <span className="fc-icon alt">
              <Icon name="key" className="icon icon-sm" />
            </span>
            <div>
              <strong>1,284</strong>
              <span>{t("hero.fact2")}</span>
            </div>
          </div>
          <div className="float-card fc-c" aria-hidden="true">
            <span className="fc-icon warn">
              <Icon name="terminal" className="icon icon-sm" />
            </span>
            <div>
              <strong>Fail-closed</strong>
              <span>{t("hero.fact1")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container stats-bar">
        <div className="stat reveal">
          <div className="stat-num">
            <Counter value={3} />
          </div>
          <div className="stat-label">{t("stats.s1.label")}</div>
          <div className="stat-note">{t("stats.s1.note")}</div>
        </div>
        <div className="stat reveal" style={{ "--d": ".06s" }}>
          <div className="stat-num">
            <Counter value={5.6} decimals={1} suffix="%" />
          </div>
          <div className="stat-label">{t("stats.s2.label")}</div>
          <div className="stat-note">{t("stats.s2.note")}</div>
        </div>
        <div className="stat reveal" style={{ "--d": ".12s" }}>
          <div className="stat-num">
            <Counter value={200} suffix="+" />
          </div>
          <div className="stat-label">{t("stats.s3.label")}</div>
          <div className="stat-note">{t("stats.s3.note")}</div>
        </div>
        <div className="stat reveal" style={{ "--d": ".18s" }}>
          <div className="stat-num">
            <Counter value={100} suffix="%" />
          </div>
          <div className="stat-label">{t("stats.s4.label")}</div>
          <div className="stat-note">{t("stats.s4.note")}</div>
        </div>
      </div>
    </section>
  );
}
