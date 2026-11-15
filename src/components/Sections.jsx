import { Fragment, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { useDocumentTheme } from "../lib/hooks.js";
import { CopyButton, Icon, SectionHead, handleSpotlight } from "./ui.jsx";

export function Proof() {
  const { t } = useI18n();
  return (
    <section className="proof" aria-label={t("proof.label")}>
      <div className="container proof-inner reveal">
        <span className="proof-label">{t("proof.label")}</span>
        <div className="proof-chips">
          {["CPython 3.12", "Django", "JDK 8–21", "Spring Boot 3.2", "Maven", "CLI / CI"].map((chip) => (
            <span className="chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>
        <p className="proof-note">{t("proof.note")}</p>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: "lock", key: "why.c1" },
  { icon: "key", key: "why.c2" },
  { icon: "cloud-off", key: "why.c3" },
  { icon: "plug", key: "why.c4" },
  { icon: "layers", key: "why.c5" },
  { icon: "globe", key: "why.c6" }
];

export function Capabilities() {
  const { t } = useI18n();
  return (
    <section className="section" id="capabilities">
      <div className="container">
        <SectionHead eyebrow={t("why.eyebrow")} title={t("why.title")} lead={t("why.lead")} />
        <div className="feature-grid">
          {FEATURES.map((feature, index) => (
            <article
              className="card spot reveal"
              key={feature.key}
              style={{ "--d": `${index * 0.05}s` }}
              onPointerMove={handleSpotlight}
            >
              <span className="card-icon">
                <Icon name={feature.icon} />
              </span>
              <h3>{t(`${feature.key}.title`)}</h3>
              <p>{t(`${feature.key}.desc`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PythonPanel({ onCopy }) {
  const { t } = useI18n();
  return (
    <div className="product-panel is-active" id="panel-python" role="tabpanel" aria-labelledby="tab-python">
      <div className="product-copy">
        <div className="product-kicker">
          <span className="dot" aria-hidden="true" />
          Python runtime
        </div>
        <h3>
          CodeShield <span className="for">for</span> Python
        </h3>
        <p>{t("product.pythonDesc")}</p>
        <ul className="check-list">
          {["product.pythonB1", "product.pythonB2", "product.pythonB3", "product.pythonB4"].map((key) => (
            <li key={key}>
              <Icon name="check" className="icon icon-sm" />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <div className="product-note">
          <Icon name="sparkle" className="icon icon-sm" />
          <span>{t("product.pythonNote")}</span>
        </div>
      </div>
      <div className="product-visual">
        <div className="console console-tall">
          <div className="console-bar">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="console-title">python · shield.py build</span>
            <CopyButton
              text="python shield.py build -p ./erp-portal -o ./dist"
              onCopy={onCopy}
              label={t("common.copyCommand")}
            />
          </div>
          <div className="console-body">
            <pre className="code">
              <span className="ln">
                <span className="prompt">$</span> <span className="cmd">python shield.py build</span>
              </span>
              <span className="ln dim">{"  -p ./erp-portal -o ./dist"}</span>
              <span className="ln dim">pyshield 0.6.0 on CPython 3.12</span>
              <span className="ln dim">{"→ compiling & protecting 48 modules …"}</span>
              <span className="ln ok">
                <span className="tick">✓</span> sealed 48 modules <span className="sep">·</span> 2.0 MB{" "}
                <span className="sep">·</span> 12.6s
              </span>
              <span className="ln ok">
                <span className="tick">✓</span> license written <span className="sep">·</span> pyshield.lic
              </span>
              <span className="ln ok">
                <span className="tick">✓</span> runtime installed <span className="sep">·</span> native (Pro)
              </span>
              <span className="ln result">
                <span className="badge-mini">READY</span> deploy the output folder
              </span>
            </pre>
          </div>
        </div>
        <div className="lic-float">
          <div className="lic-head">
            <span>
              <Icon name="file-check" className="icon icon-xs" />
              pyshield.lic
            </span>
            <span className="lic-state">VALID</span>
          </div>
          <div className="lic-row">
            <span>expires</span>
            <strong>2027-12-31</strong>
          </div>
          <div className="lic-row">
            <span>binding</span>
            <strong>machine · first run</strong>
          </div>
          <div className="lic-row">
            <span>signature</span>
            <strong className="ok-text">Ed25519 ✓</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function JavaPanel({ onCopy }) {
  const { t } = useI18n();
  return (
    <div className="product-panel is-active" id="panel-java" role="tabpanel" aria-labelledby="tab-java">
      <div className="product-copy">
        <div className="product-kicker">
          <span className="dot" aria-hidden="true" />
          Java runtime
        </div>
        <h3>
          CodeShield <span className="for">for</span> Java
        </h3>
        <p>{t("product.javaDesc")}</p>
        <ul className="check-list">
          {["product.javaB1", "product.javaB2", "product.javaB3", "product.javaB4"].map((key) => (
            <li key={key}>
              <Icon name="check" className="icon icon-sm" />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
        <div className="product-note">
          <Icon name="sparkle" className="icon icon-sm" />
          <span>{t("product.javaNote")}</span>
        </div>
      </div>
      <div className="product-visual">
        <div className="console console-tall">
          <div className="console-bar">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="console-title">java · build &amp; run</span>
            <CopyButton
              text="java -jar codeshield.jar build -i app.jar -o dist/app.jar -e 2027-12-31 && java -jar dist/app.jar"
              onCopy={onCopy}
              label={t("common.copyCommand")}
            />
          </div>
          <div className="console-body">
            <pre className="code">
              <span className="ln">
                <span className="prompt">$</span>{" "}
                <span className="cmd">java -jar codeshield.jar build</span>{" "}
                <span className="arg">-i app.jar</span>
              </span>
              <span className="ln dim">{"  -o dist/app.jar -e 2027-12-31"}</span>
              <span className="ln ok">
                <span className="tick">✓</span> 1,284 classes protected <span className="sep">·</span> stub mode
              </span>
              <span className="ln ok">
                <span className="tick">✓</span> agent embedded <span className="sep">·</span> Launcher-Agent-Class
              </span>
              <span className="ln ok">
                <span className="tick">✓</span> manifest + license generated
              </span>
              <span className="ln">
                <span className="prompt">$</span> <span className="cmd">java -jar dist/app.jar</span>
              </span>
              <span className="ln ok">
                <span className="tick">✓</span> Spring Boot 3.2 started <span className="sep">·</span> 255 beans
              </span>
              <span className="ln ok">
                <span className="tick">✓</span> Actuator healthy <span className="sep">·</span> decrypt in 42 ms
              </span>
              <span className="ln result">
                <span className="badge-mini">READY</span> license gate passed
              </span>
            </pre>
          </div>
        </div>
        <div className="lic-float">
          <div className="lic-head">
            <span>
              <Icon name="file-check" className="icon icon-xs" />
              jshield.lic
            </span>
            <span className="lic-state">VALID</span>
          </div>
          <div className="lic-row">
            <span>expires</span>
            <strong>2027-12-31</strong>
          </div>
          <div className="lic-row">
            <span>binding</span>
            <strong>machine · first run</strong>
          </div>
          <div className="lic-row">
            <span>renewal</span>
            <strong>replace file · no rebuild</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCTS = {
  python: {
    label: "Python",
    dot: "py",
    icon: "cpu",
    title: "CodeShield for Python",
    tag: "productHub.pythonTag",
    forKey: "productHub.pythonFor",
    desc: "product.pythonDesc",
    bullets: ["product.pythonB1", "product.pythonB2", "product.pythonB3", "product.pythonB4"],
    note: "product.pythonNote",
    meta: ["CPython 3.12", "Django / Flask", "Import hook"]
  },
  java: {
    label: "Java",
    dot: "jv",
    icon: "layers",
    title: "CodeShield for Java",
    tag: "productHub.javaTag",
    forKey: "productHub.javaFor",
    desc: "product.javaDesc",
    bullets: ["product.javaB1", "product.javaB2", "product.javaB3", "product.javaB4"],
    note: "product.javaNote",
    meta: ["JDK 8–21", "Spring Boot 3.2", "Launcher-Agent-Class"]
  }
};

function ProductHubCard({ id, data, activeProduct, setActiveProduct }) {
  const { t } = useI18n();
  const isPython = id === "python";
  return (
    <article className={`product-hub-card ${id} reveal${activeProduct === id ? " is-selected" : ""}`}>
      <div className="phc-top">
        <span className="phc-product">
          <span className={`seg-dot ${isPython ? "py" : "jv"}`} aria-hidden="true" />
          {data.label}
        </span>
        <span className="phc-index">{isPython ? "01" : "02"}</span>
      </div>
      <h3>{data.title}</h3>
      <p className="phc-tag">{t(data.tag)}</p>
      <p className="phc-for">{t(data.forKey)}</p>
      <p className="phc-desc">{t(data.desc)}</p>
      <ul className="phc-list">
        {data.bullets.map((key) => (
          <li key={key}>
            <Icon name="check" className="icon icon-sm" />
            <span>{t(key)}</span>
          </li>
        ))}
      </ul>
      <div className="phc-meta">
        {data.meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="phc-actions">
        <a href="#flow" className="phc-link primary" onClick={() => setActiveProduct(id)}>
          <Icon name="arrow-right" className="icon icon-xs" />
          {t("productHub.flowCta")}
        </a>
        <a href="#workspace" className="phc-link" onClick={() => setActiveProduct(id)}>
          <Icon name="scan" className="icon icon-xs" />
          {t("productHub.uiCta")}
        </a>
      </div>
      <span className="phc-detail" aria-hidden="true">
        {isPython ? "module → stub" : "class → sidecar"}
      </span>
    </article>
  );
}

export function Product({ onCopy, activeProduct, setActiveProduct }) {
  const { t } = useI18n();
  const tabRefs = useRef([]);
  const tabs = [
    { id: "python", label: "Python", dot: "py" },
    { id: "java", label: "Java", dot: "jv" }
  ];

  const activate = (nextId, focus) => {
    setActiveProduct(nextId);
    if (focus) {
      const index = tabs.findIndex((item) => item.id === nextId);
      window.requestAnimationFrame(() => tabRefs.current[index]?.focus());
    }
  };

  const onTabKeyDown = (event, index) => {
    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    activate(tabs[nextIndex].id, true);
  };

  return (
    <section className="section product-section" id="product">
      <div className="container">
        <SectionHead
          eyebrow={t("product.eyebrow")}
          title={t("productHub.title")}
          lead={t("productHub.lead")}
          center
        />

        <div className="product-hub reveal">
          <ProductHubCard
            id="python"
            data={PRODUCTS.python}
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
          />
          <ProductHubCard
            id="java"
            data={PRODUCTS.java}
            activeProduct={activeProduct}
            setActiveProduct={setActiveProduct}
          />
        </div>

        <div className="product-shared reveal">
          <span className="product-shared-icon">
            <Icon name="shield" className="icon icon-sm" />
          </span>
          <span>{t("productHub.shared")}</span>
          <span className="product-shared-sep" aria-hidden="true" />
          <span className="product-shared-flow">
            <b>build</b> <Icon name="arrow-right" className="icon icon-xs" /> <b>sign</b>{" "}
            <Icon name="arrow-right" className="icon icon-xs" /> <b>run</b>
          </span>
        </div>

        <div className="product-demo-head">
          <span className="product-demo-kicker">BUILD &amp; RUN · {activeProduct.toUpperCase()}</span>
          <span className="product-demo-note">
            {(activeProduct === "python" ? t("product.pythonNote") : t("product.javaNote")).split("·")[0].trim()}
          </span>
        </div>

        <div className="product-shell reveal">
          <div className="segmented" role="tablist" aria-label={t("product.tabsAria")}>
            {tabs.map((item, index) => (
              <button
                className={`seg-btn${activeProduct === item.id ? " is-active" : ""}`}
                id={`tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={activeProduct === item.id}
                aria-controls={`panel-${item.id}`}
                tabIndex={activeProduct === item.id ? 0 : -1}
                data-tab={item.id}
                key={item.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                onClick={() => activate(item.id, false)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span className={`seg-dot ${item.dot}`} aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </div>

          {activeProduct === "python" ? <PythonPanel onCopy={onCopy} /> : <JavaPanel onCopy={onCopy} />}
        </div>
      </div>
    </section>
  );
}

const FLOW_TITLES = ["how.s1.title", "how.s2.title", "how.s3.title", "how.s4.title"];
const FLOW_ICONS = ["scan", "lock", "file-check", "cpu"];

const FLOW_DATA = {
  python: {
    code: ["scan 48 modules", "deflate → AES-256-GCM", "manifest + pyshield.lic", "import hook → memory"],
    keys: ["flow.python0", "flow.python1", "flow.python2", "flow.python3"],
    event: ["→ 48 modules found", "✓ AEAD sealed", "✓ Ed25519 manifest signed", "⚡ module loaded in memory"]
  },
  java: {
    code: ["scan 1,284 classes", "stub + sidecar", "manifest + jshield.lic", "Launcher-Agent-Class → defineClass"],
    keys: ["flow.java0", "flow.java1", "flow.java2", "flow.java3"],
    event: ["→ 1,284 classes found", "✓ stub + sidecar written", "✓ manifest + license signed", "⚡ class decrypted before defineClass"]
  }
};

export function ExecutionFlow({ activeProduct, setActiveProduct }) {
  const { t } = useI18n();
  const [activeStep, setActiveStep] = useState(0);
  const data = FLOW_DATA[activeProduct] || FLOW_DATA.python;

  useEffect(() => {
    setActiveStep(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((step) => (step + 1) % 4);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [activeProduct]);

  return (
    <section className="section flow-section" id="flow">
      <div className="container">
        <SectionHead
          eyebrow={t("flow.eyebrow")}
          title={t("flow.title")}
          lead={t("flow.lead")}
          center
        />

        <div className="flow-shell reveal">
          <div className="flow-toolbar">
            <div className="segmented flow-tabs" role="tablist" aria-label={t("product.tabsAria")}>
              {["python", "java"].map((id) => (
                <button
                  className={`seg-btn${activeProduct === id ? " is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={activeProduct === id}
                  key={id}
                  onClick={() => setActiveProduct(id)}
                >
                  <span className={`seg-dot ${id === "python" ? "py" : "jv"}`} aria-hidden="true" />
                  {id === "python" ? "Python" : "Java"}
                </button>
              ))}
            </div>
            <span className="flow-auto">
              <i aria-hidden="true" />
              {t("flow.auto")}
            </span>
          </div>

          <div className={`flow-board ${activeProduct}`}>
            <div className="flow-line" aria-hidden="true" />
            <div className="flow-runner" aria-hidden="true" />
            <div className="flow-track">
              {FLOW_TITLES.map((key, index) => {
                const isRuntime = index === 3;
                return (
                  <button
                    className={`flow-stage${activeStep === index ? " is-active" : ""}${isRuntime ? " is-runtime" : ""}`}
                    type="button"
                    key={key}
                    onClick={() => setActiveStep(index)}
                    aria-label={`${String(index + 1).padStart(2, "0")} ${t(key)}`}
                  >
                    <div className="flow-stage-top">
                      <span className="flow-num">{String(index + 1).padStart(2, "0")}</span>
                      <span className={`flow-tag ${isRuntime ? "runtime" : "build"}`}>
                        {isRuntime ? t("flow.runtime") : t("flow.build")}
                      </span>
                    </div>
                    <span className="flow-icon">
                      <Icon name={FLOW_ICONS[index]} />
                    </span>
                    <h3>{t(key)}</h3>
                    <p>{t(data.keys[index])}</p>
                    <code>{data.code[index]}</code>
                  </button>
                );
              })}
            </div>

            <div className="flow-live" aria-live="polite">
              <span className="flow-live-label">
                <i aria-hidden="true" />
                {t("flow.live")}
              </span>
              <code>{data.event[activeStep]}</code>
              <span className="flow-counter">
                {String(activeStep + 1).padStart(2, "0")} / 04
              </span>
            </div>
          </div>

          <p className="flow-note">
            <Icon name="shield" className="icon icon-sm" />
            <span>{t("flow.note")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function MockWorkspace({ product }) {
  const isPython = product === "python";
  const logs = isPython
    ? [
        ["$", "python shield.py build"],
        ["→", "scanning modules …"],
        ["✓", "sealed 48 modules · AES-256-GCM"],
        ["✓", "manifest signed · Ed25519"],
        ["✓", "pyshield.lic written · VALID"],
        ["✓", "protected output ready · ./dist"],
        ["→", "runtime: import hook · memory only"]
      ]
    : [
        ["$", "java -jar codeshield.jar build -i app.jar"],
        ["→", "scanning 1,284 classes …"],
        ["✓", "stub + sidecar · AES-256-GCM"],
        ["✓", "agent embedded · Launcher-Agent-Class"],
        ["✓", "jshield.lic written · VALID"],
        ["✓", "Spring Boot 3.2 started · 255 beans"],
        ["✓", "Actuator healthy · decrypt in 42 ms"]
      ];

  return (
    <div className={`mock-workspace ${product}`} aria-hidden="true">
      <div className="mock-bar">
        <span className="mock-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>codeshield · workspace</span>
        <span className="mock-env">LOCAL</span>
      </div>
      <div className="mock-body">
        <aside className="mock-side">
          <span className="mock-logo">CS</span>
          <span className="mock-nav is-active">Builds</span>
          <span className="mock-nav">Licenses</span>
          <span className="mock-nav">Releases</span>
          <span className="mock-nav">Audit</span>
        </aside>
        <div className="mock-main">
          <div className="mock-title">
            <div>
              <strong>{isPython ? "erp-portal" : "order-service"}</strong>
              <span>{isPython ? "CPython 3.12 · Django" : "JDK 17 · Spring Boot 3.2"}</span>
            </div>
            <span className="mock-badge">VALID</span>
          </div>
          <div className="mock-stats">
            <span>
              <b>{isPython ? "48" : "1,284"}</b>
              <em>{isPython ? "modules" : "classes"}</em>
            </span>
            <span>
              <b>{isPython ? "2.0 MB" : "5.6%"}</b>
              <em>{isPython ? "sealed" : "overhead"}</em>
            </span>
            <span>
              <b>{isPython ? "12.6s" : "42ms"}</b>
              <em>{isPython ? "build" : "decrypt"}</em>
            </span>
          </div>
          <div className="mock-pipe">
            {["Scan", "Seal", "Sign", "Run"].map((label, index) => (
              <span className="mock-pipe-step" key={label}>
                <i className={index < 3 ? "done" : ""} />
                <em>{label}</em>
              </span>
            ))}
          </div>
          <div className="mock-log">
            {logs.map(([mark, text]) => (
              <div key={text}>
                <span>{mark}</span> {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspacePreview({ product }) {
  const { t } = useI18n();
  const theme = useDocumentTheme();
  const base = `${import.meta.env.BASE_URL}assets/img/product/${product}-workbench`;
  const preferredSrc = `${base}-${theme}.png`;
  const fallbackSrc = `${base}.png`;
  const [src, setSrc] = useState(preferredSrc);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const alt = t(product === "python" ? "ui.pythonAlt" : "ui.javaAlt");

  useEffect(() => {
    ["dark", "light", ""].forEach((variant) => {
      const preload = new Image();
      preload.src = `${base}${variant ? `-${variant}` : ""}.png`;
    });
  }, [base]);

  useEffect(() => {
    setSrc(preferredSrc);
    setFailed(false);
  }, [preferredSrc]);

  const handleError = () => {
    if (src !== fallbackSrc) {
      setSrc(fallbackSrc);
      setLoaded(false);
      return;
    }
    setFailed(true);
  };

  return (
    <div className={`shot-frame ${product}`} data-theme={theme}>
      <MockWorkspace product={product} />
      {failed ? null : (
        <img
          key={src}
          src={src}
          alt={alt}
          className={loaded ? "is-loaded" : undefined}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      )}
    </div>
  );
}

export function OperationUI({ setActiveProduct }) {
  const { t } = useI18n();
  return (
    <section className="section ui-section" id="workspace">
      <div className="container">
        <SectionHead eyebrow={t("ui.eyebrow")} title={t("ui.title")} lead={t("ui.lead")} center />
        <div className="ui-grid">
          {["python", "java"].map((product) => (
            <article className={`shot-card ${product} reveal`} key={product}>
              <div className="shot-card-top">
                <span className="shot-card-label">
                  <span className={`seg-dot ${product === "python" ? "py" : "jv"}`} aria-hidden="true" />
                  {product === "python" ? "Python" : "Java"}
                </span>
                <span className="shot-card-route">BUILD → LICENSE → SHIP</span>
              </div>
              <WorkspacePreview product={product} />
              <div className="shot-meta">
                <h3>{t(product === "python" ? "ui.pythonCaption" : "ui.javaCaption")}</h3>
                <a
                  href="#flow"
                  className="phc-link"
                  onClick={() => setActiveProduct(product)}
                >
                  {t("productHub.flowCta")}
                  <Icon name="arrow-right" className="icon icon-xs" />
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="shot-note reveal">{t("ui.previewNote")}</p>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: "scan", key: "how.s1" },
  { icon: "lock", key: "how.s2" },
  { icon: "file-check", key: "how.s3" },
  { icon: "cpu", key: "how.s4" }
];

export function How() {
  const { t } = useI18n();
  const pipes = ["how.pipe1", "how.pipe2", "how.pipe3", "how.pipe4", "how.pipe5", "how.pipe6"];
  return (
    <section className="section" id="how">
      <div className="container">
        <SectionHead eyebrow={t("how.eyebrow")} title={t("how.title")} lead={t("how.lead")} />
        <div className="steps">
          {STEPS.map((step, index) => (
            <article className="step reveal" key={step.key} style={{ "--d": `${index * 0.06}s` }}>
              <div className="step-top">
                <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="step-icon">
                  <Icon name={step.icon} />
                </span>
              </div>
              <h3>{t(`${step.key}.title`)}</h3>
              <p>{t(`${step.key}.desc`)}</p>
            </article>
          ))}
        </div>
        <div className="pipeline reveal">
          {pipes.map((key, index) => (
            <Fragment key={key}>
              {index > 0 ? <Icon name="arrow-right" className="icon icon-xs" /> : null}
              <span className={index === pipes.length - 1 ? "hl" : undefined}>{t(key)}</span>
            </Fragment>
          ))}
        </div>
        <p className="section-note reveal">
          <Icon name="shield" className="icon icon-sm" />
          <span>{t("how.note")}</span>
        </p>
      </div>
    </section>
  );
}

const KEY_NODES = [
  { index: "01", icon: "cpu", key: "arch.node1" },
  { index: "02", icon: "key", key: "arch.node2" },
  { index: "03", icon: "file-check", key: "arch.node3" },
  { index: "04", icon: "layers", key: "arch.node4" }
];

const ARCH_BADGES = [
  { icon: "shield", key: "arch.badge1" },
  { icon: "layers", key: "arch.badge2" },
  { icon: "key", key: "arch.badge3" }
];

export function Architecture() {
  const { t } = useI18n();
  return (
    <section className="section arch-section" id="architecture">
      <div className="container">
        <SectionHead eyebrow={t("arch.eyebrow")} title={t("arch.title")} lead={t("arch.lead")} center />
        <div className="arch-panel reveal">
          <div className="arch-glow" aria-hidden="true" />
          <div className="keychain">
            {KEY_NODES.map((node, index) => (
              <Fragment key={node.index}>
                {index > 0 ? (
                  <span className="key-arrow" aria-hidden="true">
                    <Icon name="arrow-right" />
                  </span>
                ) : null}
                <div className="key-node">
                  <span className="kn-index">{node.index}</span>
                  <span className="kn-icon">
                    <Icon name={node.icon} />
                  </span>
                  <h3>{t(`${node.key}.title`)}</h3>
                  <p>{t(`${node.key}.desc`)}</p>
                </div>
              </Fragment>
            ))}
          </div>
          <div className="arch-badges">
            {ARCH_BADGES.map((badge) => (
              <span className="arch-badge" key={badge.key}>
                <Icon name={badge.icon} className="icon icon-xs" />
                <span>{t(badge.key)}</span>
              </span>
            ))}
          </div>
          <p className="arch-note">{t("arch.note")}</p>
        </div>
      </div>
    </section>
  );
}

const SECURITY_CARDS = [
  {
    type: "ok",
    icon: "shield",
    title: "security.c1.title",
    items: [
      { icon: "check", key: "security.c1.i1" },
      { icon: "check", key: "security.c1.i2" },
      { icon: "check", key: "security.c1.i3" },
      { icon: "check", key: "security.c1.i4" },
      { icon: "check", key: "security.c1.i5" }
    ]
  },
  {
    type: "warn",
    icon: "warning",
    title: "security.c2.title",
    items: [
      { icon: "minus", key: "security.c2.i1" },
      { icon: "minus", key: "security.c2.i2" },
      { icon: "minus", key: "security.c2.i3" },
      { icon: "minus", key: "security.c2.i4" }
    ]
  },
  {
    type: "advise",
    icon: "compass",
    title: "security.c3.title",
    items: [
      { icon: "arrow-right", key: "security.c3.i1" },
      { icon: "arrow-right", key: "security.c3.i2" },
      { icon: "arrow-right", key: "security.c3.i3" },
      { icon: "arrow-right", key: "security.c3.i4" }
    ]
  }
];

export function Security() {
  const { t } = useI18n();
  return (
    <section className="section" id="security">
      <div className="container">
        <SectionHead eyebrow={t("security.eyebrow")} title={t("security.title")} lead={t("security.lead")} />
        <div className="security-grid">
          {SECURITY_CARDS.map((card, index) => (
            <article className={`sec-card ${card.type} reveal`} key={card.type} style={{ "--d": `${index * 0.06}s` }}>
              <div className="sec-head">
                <span className="sec-icon">
                  <Icon name={card.icon} />
                </span>
                <h3>{t(card.title)}</h3>
              </div>
              <ul>
                {card.items.map((item) => (
                  <li key={item.key}>
                    <Icon name={item.icon} className="icon icon-sm" />
                    <span>{t(item.key)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="section-note reveal">
          <Icon name="doc" className="icon icon-sm" />
          <span>{t("security.footnote")}</span>
        </p>
      </div>
    </section>
  );
}

const COMPARE_ROWS = [
  { feature: "compare.r1", cells: [["partial", "compare.r1c1"], ["partial", "compare.r1c2"], ["yes", "compare.r1c3"]] },
  { feature: "compare.r2", cells: [["yes", "compare.r2c1"], ["partial", "compare.r2c2"], ["yes", "compare.r2c3"]] },
  { feature: "compare.r3", cells: [["no", "compare.r3c1"], ["partial", "compare.r3c2"], ["yes", "compare.r3c3"]] },
  { feature: "compare.r4", cells: [["no", "compare.r4c1"], ["partial", "compare.r4c2"], ["yes", "compare.r4c3"]] },
  { feature: "compare.r5", cells: [["no", "compare.r5c1"], ["partial", "compare.r5c2"], ["yes", "compare.r5c3"]] },
  { feature: "compare.r6", cells: [["no", "compare.r6c1"], ["partial", "compare.r6c2"], ["yes", "compare.r6c3"]] },
  { feature: "compare.r7", cells: [["no", "compare.r7c1"], ["no", "compare.r7c2"], ["yes", null, "Python + Java"]] },
  { feature: "compare.r8", cells: [["no", "compare.r8c1"], ["no", "compare.r8c2"], ["yes", "compare.r8c3"]] }
];

const CELL_ICONS = { yes: "check", partial: "minus", no: "x" };

function CompareCell({ type, textKey, literal }) {
  const { t } = useI18n();
  return (
    <span className={`cell ${type}`}>
      <Icon name={CELL_ICONS[type]} className="icon icon-xs" />
      <span>{textKey ? t(textKey) : literal}</span>
    </span>
  );
}

export function Compare() {
  const { t } = useI18n();
  return (
    <section className="section compare-section" id="compare">
      <div className="container">
        <SectionHead eyebrow={t("compare.eyebrow")} title={t("compare.title")} lead={t("compare.lead")} />
        <div className="table-wrap reveal" tabIndex={0} aria-label={t("compare.tableAria")}>
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">{t("compare.feature")}</span>
                </th>
                <th scope="col">{t("compare.col1")}</th>
                <th scope="col">{t("compare.col2")}</th>
                <th scope="col" className="col-us">
                  <span className="us-pill">CodeShield</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{t(row.feature)}</th>
                  {row.cells.map((cell, index) => (
                    <td className={index === 2 ? "col-us" : undefined} key={`${row.feature}-${index}`}>
                      <CompareCell type={cell[0]} textKey={cell[1]} literal={cell[2]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="table-hint">{t("compare.hint")}</p>
      </div>
    </section>
  );
}
