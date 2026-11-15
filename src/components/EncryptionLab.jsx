import { useEffect, useRef, useState } from "react";
import { gcm } from "@noble/ciphers/aes.js";
import { chacha20poly1305 } from "@noble/ciphers/chacha.js";
import { bytesToHex, randomBytes } from "@noble/ciphers/utils.js";
import { useI18n } from "../i18n/index.jsx";
import { loadLabSnapshots } from "../lib/labData.js";
import LabFileExplorer from "./LabFileExplorer.jsx";
import { Icon, SectionHead } from "./ui.jsx";

const PRODUCTS = {
  python: {
    project: "erp-portal",
    runtime: "CPython 3.12 · Django 5.2",
    count: "11",
    unit: "modules",
    output: "dist/erp-portal-shielded/",
    license: "pyshield.lic",
    command: "python shield.py build -p ./erp-portal -o ./dist/erp-portal-shielded --cipher chacha-pure",
    source: [
      "from pricing import PLANS",
      "",
      "def calculate_price(customer, plan):",
      "    base = PLANS[plan].monthly_price",
      "    if customer.is_enterprise:",
      "        return round(base * 0.82, 2)",
      "    return base"
    ]
  },
  java: {
    project: "spring-boot-demo",
    runtime: "JDK 17 · Spring Boot 3.2.12",
    count: "4",
    unit: "classes",
    output: "dist/demo-1.0.0.jar",
    license: "jshield.lic",
    command: "java -jar codeshield.jar build -i demo-1.0.0.jar -o dist/demo-1.0.0.jar -e 2028-12-31",
    source: [
      "@Service",
      "public class GreetingService {",
      "    private final DemoProperties properties;",
      "",
      "    public String greet(String name) {",
      "        return \"hello, \" + name + \" from \"",
      "            + properties.getBrand();",
      "    }",
      "}"
    ]
  }
};

const STAGE_ICONS = ["scan", "box", "lock", "file-check", "cpu"];
const PROGRESS = [16, 38, 66, 86, 100];
const encoder = new TextEncoder();

function cipherLabel(cipher) {
  if (cipher === "aes") return "AES-256-GCM";
  if (cipher === "chacha-pure") return "ChaCha20-Poly1305 · pure";
  return "ChaCha20-Poly1305";
}

function createSealedBuild(product, cipher, source, snapshotId) {
  const data = PRODUCTS[product];
  const id = snapshotId || `CS-${bytesToHex(randomBytes(3)).toUpperCase()}-${bytesToHex(randomBytes(2)).toUpperCase()}`;
  const key = randomBytes(32);
  const nonce = randomBytes(12);
  const aad = encoder.encode(`${product}:${data.project}:${id}`);
  const plaintext = encoder.encode(source);
  const algorithm = cipherLabel(cipher);
  const seal = cipher === "aes" ? gcm(key, nonce, aad) : chacha20poly1305(key, nonce, aad);
  const sealed = seal.encrypt(plaintext);
  const open = cipher === "aes" ? gcm(key, nonce, aad) : chacha20poly1305(key, nonce, aad);
  const opened = open.decrypt(sealed);
  const verified = opened.length === plaintext.length && opened.every((byte, index) => byte === plaintext[index]);
  const nonceHex = bytesToHex(nonce);
  const tagHex = bytesToHex(sealed.slice(-16));
  const payloadHex = bytesToHex(sealed.slice(0, -16));
  const words = payloadHex.match(/.{1,4}/g) || [];
  const hexLines = [];
  for (let index = 0; index < Math.min(5, Math.ceil(words.length / 8)); index += 1) {
    hexLines.push(`${(index * 16).toString(16).padStart(8, "0")}  ${words.slice(index * 8, index * 8 + 8).join(" ")}`);
  }
  const hiddenBytes = Math.max(0, sealed.length - 80);
  return {
    id,
    algorithm,
    verified,
    nonceHex,
    tagHex,
    ciphertextHex: bytesToHex(sealed),
    sourceBytes: plaintext.length,
    sealedBytes: sealed.length,
    lines: [
      `CSE/1 · ${algorithm} · BUILD ${id}`,
      `NONCE ${nonceHex} · AAD ${data.project}`,
      ...hexLines,
      `… ${hiddenBytes} bytes sealed · payload preview`,
      `AUTH ${tagHex}`,
      `VERIFY ${verified ? "OK" : "FAILED"} · ${plaintext.length} B → ${sealed.length} B`
    ]
  };
}

function getStageLogs(product, cipher, integrity, runtimeMode, license, bindingMode, buildId) {
  const data = PRODUCTS[product];
  const algorithm = cipherLabel(cipher);
  return [
    [
      `[00:00.084] SCAN  ${data.project} · ${data.runtime}`,
      `[00:00.216] OK    discovered ${data.count} ${data.unit}; dependencies excluded`
    ],
    [
      "[00:00.742] PACK  deflate streams · normalize metadata",
      `[00:01.128] OK    ${integrity === "off" ? "manifest disabled" : `${integrity} manifest`} · ${runtimeMode} runtime`
    ],
    [
      `[00:01.604] SEAL  ${algorithm} · per-${product === "python" ? "module" : "class"} keys`,
      "[00:02.284] OK    AEAD tags verified · plaintext removed from output"
    ],
    [
      `[00:02.716] SIGN  Ed25519 manifest · build ${buildId}`,
      `[00:03.146] OK    ${license ? `${data.license} issued${bindingMode !== "none" ? ` · ${bindingMode} binding` : ""}` : "unsigned trial package · no license file"}`
    ],
    [
      `[00:03.482] EMIT  ${data.output}`,
      `[00:04.208] READY  protected build verified · runtime ${product === "python" ? "import hook" : "agent"} embedded`
    ]
  ];
}

export default function EncryptionLab({ activeProduct, setActiveProduct, onCopy, standalone = false }) {
  const { t } = useI18n();
  const [product, setProduct] = useState(activeProduct || "python");
  const [cipher, setCipher] = useState("aes");
  const [mode, setMode] = useState("balanced");
  const [license, setLicense] = useState(true);
  const [bindingMode, setBindingMode] = useState("first-run");
  const [runtimeMode, setRuntimeMode] = useState("pyc");
  const [integrity, setIntegrity] = useState("protected");
  const [licenseValidity, setLicenseValidity] = useState("date");
  const [graceDays, setGraceDays] = useState("0");
  const [customer, setCustomer] = useState("");
  const [encryptMigrations, setEncryptMigrations] = useState(false);
  const [encryptTests, setEncryptTests] = useState(false);
  const [excludeDeps, setExcludeDeps] = useState(true);
  const [panel, setPanel] = useState("config");
  const [status, setStatus] = useState("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [sealedBuild, setSealedBuild] = useState(null);
  const [snapshots, setSnapshots] = useState({});
  const timers = useRef([]);
  const terminalRef = useRef(null);
  const shellRef = useRef(null);
  const previousPanel = useRef(panel);
  const running = status === "running";
  const done = status === "done";
  const binding = bindingMode !== "none";
  const snapshot = snapshots[product] || { status: "loading", data: null, error: "" };
  const snapshotData = snapshot.status === "ready" ? snapshot.data : null;
  const snapshotBuild = snapshotData?.after?.build || null;
  const docProject = snapshotData?.before?.project;
  const data = {
    ...PRODUCTS[product],
    ...(docProject
      ? {
          project: docProject.id || PRODUCTS[product].project,
          runtime: docProject.runtime || PRODUCTS[product].runtime,
          command: docProject.command || PRODUCTS[product].command
        }
      : null),
    ...(snapshotBuild
      ? {
          count: snapshotBuild.count != null ? String(snapshotBuild.count) : PRODUCTS[product].count,
          unit: snapshotBuild.unit || PRODUCTS[product].unit,
          output: snapshotBuild.output || PRODUCTS[product].output,
          license: snapshotBuild.license || PRODUCTS[product].license
        }
      : null)
  };
  const activeBuildId = snapshotBuild?.id || sealedBuild?.id;
  const activeAlgorithm = snapshotBuild?.algorithm || sealedBuild?.algorithm;
  const unitLabel =
    snapshotBuild?.unit === "classes"
      ? t("lab.unitClasses")
      : snapshotBuild?.unit === "modules"
        ? t("lab.unitModules")
        : snapshotBuild?.unit || data.unit;
  const fallbackUnit =
    data.unit === "classes"
      ? t("lab.unitClasses")
      : data.unit === "modules"
        ? t("lab.unitModules")
        : data.unit;
  const protectedCount =
    snapshotBuild?.count != null
      ? `${snapshotBuild.count} ${unitLabel}`
      : `${data.count} ${fallbackUnit}`;
  const activeOutput = snapshotBuild?.output || data.output;
  const projectCards = ["python", "java"].map((id) => {
    const meta = snapshots[id]?.data?.before?.project;
    return {
      id,
      name: meta?.id || PRODUCTS[id].project,
      runtime: meta?.runtime || PRODUCTS[id].runtime
    };
  });
  const cipherOptions = [
    { value: "aes", label: t("lab.form.cipherAes"), desc: t("lab.form.cipherAesDesc") },
    { value: "chacha", label: t("lab.form.cipherChaCha"), desc: t("lab.form.cipherChaChaDesc") },
    { value: "chacha-pure", label: t("lab.form.cipherPure"), desc: t("lab.form.cipherPureDesc") }
  ];
  const runtimeOptions = product === "python"
    ? [
        { value: "pyc", label: t("lab.form.runtimePyc"), desc: t("lab.form.runtimePycDesc") },
        { value: "source", label: t("lab.form.runtimeSource"), desc: t("lab.form.runtimeSourceDesc") },
        { value: "native", label: t("lab.form.runtimeNative"), desc: t("lab.form.runtimeNativeDesc"), pro: true }
      ]
    : [
        { value: "stub", label: t("lab.form.runtimeStub"), desc: t("lab.form.runtimeStubDesc") },
        { value: "inplace", label: t("lab.form.runtimeInplace"), desc: t("lab.form.runtimeInplaceDesc") }
      ];
  const integrityOptions = [
    { value: "protected", label: t("lab.form.integrityProtected"), desc: t("lab.form.integrityProtectedDesc") },
    { value: "full", label: t("lab.form.integrityFull"), desc: t("lab.form.integrityFullDesc") },
    { value: "off", label: t("lab.form.integrityOff"), desc: t("lab.form.integrityOffDesc") }
  ];
  const validityOptions = [
    { value: "perpetual", label: t("lab.form.validityPermanent"), desc: t("lab.form.validityPermanentDesc") },
    { value: "days", label: t("lab.form.validityDays"), desc: t("lab.form.validityDaysDesc") },
    { value: "date", label: t("lab.form.validityDate"), desc: t("lab.form.validityDateDesc") }
  ];
  const bindingOptions = [
    { value: "none", label: t("lab.form.bindingNone"), desc: t("lab.form.bindingNoneDesc") },
    { value: "first-run", label: t("lab.form.bindingFirst"), desc: t("lab.form.bindingFirstDesc") },
    { value: "fixed", label: t("lab.form.bindingFixed"), desc: t("lab.form.bindingFixedDesc") }
  ];

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const resetRun = () => {
    clearTimers();
    setStatus("idle");
    setActiveStep(-1);
    setProgress(0);
    setLogs([]);
    setSealedBuild(null);
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (activeProduct && activeProduct !== product && !running) {
      setProduct(activeProduct);
      resetRun();
    }
  }, [activeProduct]);

  useEffect(() => {
    let cancelled = false;
    ["python", "java"].forEach((id) => {
      loadLabSnapshots(id)
        .then((data) => {
          if (!cancelled) {
            setSnapshots((current) => ({ ...current, [id]: { status: "ready", data, error: "" } }));
          }
        })
        .catch((error) => {
          if (!cancelled) {
            setSnapshots((current) => ({
              ...current,
              [id]: { status: "error", data: null, error: error.message || "load failed" }
            }));
          }
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!snapshotData?.after?.build) return;
    const build = snapshotData.after.build;
    const algorithm = String(build.algorithm || build.cipher || "").toLowerCase();
    setCipher(algorithm.includes("pure") ? "chacha-pure" : algorithm.includes("chacha") ? "chacha" : "aes");
    setMode(build.mode === "strict" ? "strict" : "balanced");
    setLicense(Boolean(build.license));
    setIntegrity(["full", "off"].includes(build.integrity) ? build.integrity : "protected");
    setBindingMode(build.machineBinding ? "first-run" : "none");
    setLicenseValidity(build.expires ? "date" : "perpetual");
    setRuntimeMode(product === "python" ? "pyc" : "stub");
  }, [snapshotData, product]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (previousPanel.current === panel) return;
    previousPanel.current = panel;
    const shell = shellRef.current;
    if (!shell) return;
    const header = document.querySelector(".site-header");
    const top = shell.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 18;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
  }, [panel]);

  const chooseProduct = (id) => {
    if (running) return;
    setProduct(id);
    setActiveProduct(id);
    setRuntimeMode(id === "python" ? "pyc" : "stub");
    setPanel("config");
    resetRun();
  };

  const changeOption = (setter, value) => {
    if (running) return;
    setter(value);
    resetRun();
  };

  const startBuild = () => {
    clearTimers();
    setPanel("run");
    const build = createSealedBuild(product, cipher, data.source.join("\n"), snapshotBuild?.id);
    setSealedBuild(build);
    setStatus("running");
    setActiveStep(0);
    setProgress(4);
    setLogs([
      "[00:00.000] INIT  CodeShield local protection engine",
      `[00:00.012] SAFE  browser-local ${build.algorithm} · no files uploaded`
    ]);
    const stageLogs = getStageLogs(product, cipher, integrity, runtimeMode, license, bindingMode, build.id);
    const starts = [120, 850, 1650, 2550, 3450];
    stageLogs.forEach((entries, index) => {
      timers.current.push(window.setTimeout(() => {
        setActiveStep(index);
        setProgress(PROGRESS[index]);
        setLogs((current) => [...current, ...entries]);
      }, starts[index]));
    });
    timers.current.push(window.setTimeout(() => {
      setActiveStep(5);
      setProgress(100);
      setStatus("done");
      setLogs((current) => [...current, "[00:04.860] DONE  5 / 5 stages passed · package is ready to ship"]);
    }, 4450));
  };

  const downloadReport = () => {
    const snapshotLabel = snapshotData
      ? `${snapshotData.after.demo ? "demo" : "real build snapshot"} · ${snapshotData.before.files.length} before / ${snapshotData.after.files.length} after entries`
      : "not loaded";
    const report = [
      "CodeShield · INTERACTIVE BUILD REPORT (NON-PRODUCTION)",
      "======================================================",
      `Project: ${snapshotData?.before?.project?.id || data.project}`,
      `Runtime: ${snapshotData?.before?.project?.runtime || data.runtime}`,
      `Algorithm: ${activeAlgorithm || sealedBuild.algorithm}`,
      `Protection mode: ${mode}`,
      `Runtime mode: ${runtimeMode}`,
      `Integrity manifest: ${integrity}`,
      `Protected entries: ${protectedCount}`,
      `Output: ${activeOutput}`,
      `License: ${license ? snapshotBuild?.license || data.license : "disabled"}`,
      `License validity: ${licenseValidity}${customer ? ` · customer=${customer}` : ""}${graceDays ? ` · grace=${graceDays}d` : ""}`,
      `Machine binding: ${bindingMode}`,
      `Build ID: ${activeBuildId || sealedBuild.id}`,
      `Snapshot: ${snapshotLabel}`,
      "",
      `Local AEAD self-check: ${sealedBuild.sourceBytes} B plaintext -> ${sealedBuild.sealedBytes} B sealed`,
      `Nonce: ${sealedBuild.nonceHex}`,
      `Auth tag: ${sealedBuild.tagHex}`,
      `AEAD verify: ${sealedBuild.verified ? "OK" : "FAILED"}`,
      "Self-check encryption: performed locally in this browser; it is not the build artifact shown above.",
      "",
      ...logs,
      "",
      "Local AEAD self-check ciphertext (hex):",
      sealedBuild.ciphertextHex
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `codeshield-${product}-demo-report.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const tabStatus = running
    ? t("lab.statusRunning")
    : done
      ? t("lab.statusDone")
      : t("lab.statusIdle");
  const demoFingerprint = "DEMO-7F3A-2C91-8B04";

  return (
    <section className={`lab-section${standalone ? " is-standalone" : " section"}`} id={standalone ? undefined : "flow"}>
      <div className="container">
        {!standalone ? <SectionHead eyebrow={t("lab.eyebrow")} title={t("lab.title")} lead={t("lab.lead")} center /> : null}
        <div className="lab-shell reveal" ref={shellRef}>
          <div className="lab-topbar">
            <div className="lab-brand"><span className="lab-brand-icon"><Icon name="terminal" className="icon icon-sm" /></span><span>PROTECTION LAB</span><span className="lab-version">v0.6</span></div>
            <span className="lab-demo-badge"><i /> {t("lab.badge")}</span>
          </div>

          <div className="lab-tabbar" role="tablist" aria-label={t("lab.form.configTab")}>
            <button
              type="button"
              role="tab"
              aria-selected={panel === "config"}
              className={`lab-tab${panel === "config" ? " is-active" : ""}`}
              onClick={() => setPanel("config")}
            >
              <span className="lab-tab-number">01</span>
              <span className="lab-tab-copy">
                <strong>{t("lab.form.configTab")}</strong>
                <small>{data.project} · {data.runtime}</small>
              </span>
              {running ? <span className="lab-tab-live"><i />{t("lab.statusRunning")}</span> : null}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={panel === "run"}
              className={`lab-tab${panel === "run" ? " is-active" : ""}`}
              onClick={() => setPanel("run")}
            >
              <span className="lab-tab-number">02</span>
              <span className="lab-tab-copy">
                <strong>{t("lab.form.runTab")}</strong>
                <small>{tabStatus}</small>
              </span>
              {done ? <span className="lab-tab-badge"><Icon name="check" className="icon icon-xs" />{t("lab.complete")}</span> : null}
            </button>
          </div>

          {panel === "config" ? (
            <div className="lab-form-page">
              <div className="lab-form-intro">
                <div>
                  <span className="execution-kicker">01 / BUILD CONFIGURATION</span>
                  <h3>{t("lab.form.configTab")}</h3>
                  <p>{t("lab.form.configLead")}</p>
                </div>
                <span className={`run-state ${status}`}><i />{tabStatus}</span>
              </div>

              <section className="lab-form-card lab-project-card">
                <div className="lab-form-card-head">
                  <div><span>01</span><h4>{t("lab.form.projectSection")}</h4><p>{t("lab.form.projectLead")}</p></div>
                  <span className="lab-form-flag">{t("lab.form.valuesNote")}</span>
                </div>
                <div className="lab-project-grid">
                  <fieldset className="lab-project-choice-group" disabled={running}>
                    <legend>{t("lab.project")}</legend>
                    <div className="project-options">
                      {projectCards.map((card) => (
                        <button className={`project-option${product === card.id ? " is-active" : ""}`} type="button" key={card.id} onClick={() => chooseProduct(card.id)} aria-pressed={product === card.id}>
                          <span className={`project-logo ${card.id}`}>{card.id === "python" ? "Py" : "Jv"}</span>
                          <span><strong>{card.name}</strong><small>{card.runtime}</small></span>
                          <span className="radio-dot" />
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="lab-path-grid">
                    <div className="lab-field">
                      <span>{t("lab.form.projectDir")}</span>
                      <div className="lab-readonly"><Icon name="box" className="icon icon-sm" /><code>{data.project}</code></div>
                    </div>
                    <div className="lab-field">
                      <span>{t("lab.form.outputDir")}</span>
                      <div className="lab-readonly"><Icon name="layers" className="icon icon-sm" /><code>{activeOutput}</code></div>
                    </div>
                    <div className="lab-field">
                      <span>{t("lab.form.runtimeEnv")}</span>
                      <div className="lab-readonly"><Icon name="cpu" className="icon icon-sm" /><code>{data.runtime}</code></div>
                    </div>
                    <div className="lab-field">
                      <span>{t("lab.form.fingerprint")}</span>
                      <div className="lab-readonly"><Icon name="fingerprint" className="icon icon-sm" /><code>{demoFingerprint}</code><em>{t("lab.form.fingerprintDemo")}</em></div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="lab-form-columns">
                <section className="lab-form-card">
                  <div className="lab-form-card-head">
                    <div><span>02</span><h4>{t("lab.form.encryption")}</h4><p>{t("lab.form.encryptionLead")}</p></div>
                  </div>

                  <fieldset className="lab-field-group" disabled={running}>
                    <legend>{t("lab.form.algorithm")}</legend>
                    <div className="lab-choice-grid is-three">
                      {cipherOptions.map((option) => (
                        <button
                          type="button"
                          className={`lab-choice${cipher === option.value ? " is-active" : ""}`}
                          key={option.value}
                          onClick={() => changeOption(setCipher, option.value)}
                          aria-pressed={cipher === option.value}
                        >
                          <strong>{option.label}</strong>
                          <small>{option.desc}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="lab-field-group" disabled={running}>
                    <legend>{t("lab.form.runtime")}</legend>
                    <div className={`lab-choice-grid${runtimeOptions.length === 3 ? " is-three" : " is-two"}`}>
                      {runtimeOptions.map((option) => (
                        <button
                          type="button"
                          className={`lab-choice${runtimeMode === option.value ? " is-active" : ""}`}
                          key={option.value}
                          onClick={() => changeOption(setRuntimeMode, option.value)}
                          aria-pressed={runtimeMode === option.value}
                        >
                          <strong>{option.label}{option.pro ? <em className="lab-pro">PRO</em> : null}</strong>
                          <small>{option.desc}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="lab-field-group" disabled={running}>
                    <legend>{t("lab.form.integrity")}</legend>
                    <div className="lab-choice-grid is-three">
                      {integrityOptions.map((option) => (
                        <button
                          type="button"
                          className={`lab-choice${integrity === option.value ? " is-active" : ""}`}
                          key={option.value}
                          onClick={() => changeOption(setIntegrity, option.value)}
                          aria-pressed={integrity === option.value}
                        >
                          <strong>{option.label}</strong>
                          <small>{option.desc}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </section>

                <section className="lab-form-card">
                  <div className="lab-form-card-head">
                    <div><span>03</span><h4>{t("lab.form.licenseSection")}</h4><p>{t("lab.form.licenseLead")}</p></div>
                  </div>

                  <div className="toggle-list">
                    <label className="toggle-row">
                      <span><strong>{t("lab.license")}</strong><small>{t("lab.licenseDesc")}</small></span>
                      <input type="checkbox" checked={license} disabled={running} onChange={(event) => changeOption(setLicense, event.target.checked)} />
                      <span className="switch" aria-hidden="true" />
                    </label>
                  </div>

                  <fieldset className="lab-field-group" disabled={running || !license}>
                    <legend>{t("lab.form.validity")}</legend>
                    <div className="lab-choice-grid is-three compact">
                      {validityOptions.map((option) => (
                        <button
                          type="button"
                          className={`lab-choice${licenseValidity === option.value ? " is-active" : ""}`}
                          key={option.value}
                          onClick={() => changeOption(setLicenseValidity, option.value)}
                          aria-pressed={licenseValidity === option.value}
                        >
                          <strong>{option.label}</strong>
                          <small>{option.desc}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="lab-inline-fields">
                    <label className="lab-field">
                      <span>{t("lab.form.grace")}</span>
                      <input type="number" min="0" value={graceDays} disabled={running || !license} onChange={(event) => changeOption(setGraceDays, event.target.value)} />
                      <small>{t("lab.form.graceDesc")}</small>
                    </label>
                    <label className="lab-field">
                      <span>{t("lab.form.customer")}</span>
                      <input type="text" value={customer} placeholder={t("lab.form.customerPlaceholder")} disabled={running || !license} onChange={(event) => changeOption(setCustomer, event.target.value)} />
                    </label>
                  </div>

                  <fieldset className="lab-field-group" disabled={running || !license}>
                    <legend>{t("lab.form.binding")}</legend>
                    <div className="lab-choice-grid is-three compact">
                      {bindingOptions.map((option) => (
                        <button
                          type="button"
                          className={`lab-choice${bindingMode === option.value ? " is-active" : ""}`}
                          key={option.value}
                          onClick={() => changeOption(setBindingMode, option.value)}
                          aria-pressed={bindingMode === option.value}
                        >
                          <strong>{option.label}</strong>
                          <small>{option.desc}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </section>
              </div>

              <details className="lab-advanced">
                <summary>
                  <span><strong>{t("lab.form.advanced")}</strong><small>{t("lab.form.advancedDesc")}</small></span>
                  <Icon name="chevron-down" className="icon icon-sm" />
                </summary>
                <div className="lab-advanced-body">
                  <label className="lab-check"><input type="checkbox" checked={encryptMigrations} disabled={running} onChange={(event) => changeOption(setEncryptMigrations, event.target.checked)} /><span>{t("lab.form.migrations")}</span></label>
                  <label className="lab-check"><input type="checkbox" checked={encryptTests} disabled={running} onChange={(event) => changeOption(setEncryptTests, event.target.checked)} /><span>{t("lab.form.tests")}</span></label>
                  <label className="lab-check"><input type="checkbox" checked={excludeDeps} disabled={running} onChange={(event) => changeOption(setExcludeDeps, event.target.checked)} /><span>{t("lab.form.excludeDeps")}</span></label>
                </div>
              </details>

              <div className="lab-form-actions">
                <p><Icon name="cloud-off" className="icon icon-xs" />{t("lab.form.startNote")}</p>
                <button className={`lab-start${running ? " is-running" : ""}${done ? " is-done" : ""}`} type="button" onClick={startBuild} disabled={running}>
                  <span className="start-icon"><Icon name={done ? "arrow-right" : running ? "terminal" : "play"} className="icon icon-sm" /></span>
                  <span>{running ? t("lab.running") : done ? t("lab.rerun") : t("lab.start")}</span>
                  {!running ? <Icon name="arrow-right" className="icon icon-sm start-arrow" /> : null}
                </button>
              </div>
            </div>
          ) : (
            <div className="lab-run-page">
              <div className="execution-head">
                <div><span className="execution-kicker">02 / {t("lab.pipeline")}</span><h3>{data.project}<span> / protected build</span></h3></div>
                <div className="lab-run-actions">
                  <span className={`run-state ${status}`}><i />{tabStatus}</span>
                  {done ? <button className="lab-ghost-btn" type="button" onClick={startBuild}><Icon name="play" className="icon icon-xs" />{t("lab.rerun")}</button> : null}
                  <button className="lab-ghost-btn" type="button" onClick={() => setPanel("config")}><Icon name="arrow-right" className="icon icon-xs" />{t("lab.form.backToConfig")}</button>
                </div>
              </div>

              {status === "idle" ? (
                <div className="lab-run-empty">
                  <span className="lab-run-empty-icon"><Icon name="play" /></span>
                  <strong>{t("lab.form.notStarted")}</strong>
                  <p>{t("lab.form.notStartedDesc")}</p>
                  <button className="lab-start lab-start-inline" type="button" onClick={() => setPanel("config")}>{t("lab.form.goConfig")}<Icon name="arrow-right" className="icon icon-sm" /></button>
                </div>
              ) : (
                <>
                  <div className="progress-meta"><span>{done ? t("lab.complete") : `${t("lab.executing")} ${String(Math.min(activeStep + 1, 5)).padStart(2, "0")} / 05`}</span><strong>{progress}%</strong></div>
                  <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>

                  <ol className="lab-stages">
                    {[1, 2, 3, 4, 5].map((number, index) => {
                      const stageStatus = done || activeStep > index ? "is-done" : activeStep === index && running ? "is-active" : "";
                      return <li className={stageStatus} key={number}><span className="stage-node">{stageStatus === "is-done" ? <Icon name="check" className="icon icon-xs" /> : <Icon name={STAGE_ICONS[index]} className="icon icon-sm" />}</span><span className="stage-copy"><strong>{t(`lab.step${number}`)}</strong><small>{["SCAN", "DEFLATE", "AEAD", "ED25519", "PACKAGE"][index]}</small></span></li>;
                    })}
                  </ol>

                  <div className="lab-terminal">
                    <div className="terminal-head"><span><i /><i /><i /></span><strong>codeshield · local-build</strong><button type="button" onClick={() => onCopy(data.command, false)} aria-label={t("common.copyCommand")}><Icon name="copy" className="icon icon-xs" /></button></div>
                    <div className="terminal-log" ref={terminalRef} aria-live="polite">
                      {logs.length === 0 ? <div className="terminal-empty"><Icon name="terminal" /><span>{t("lab.terminalWaiting")}</span><small>$ {data.command}</small></div> : logs.map((log, index) => <div className={`log-line ${log.includes("DONE") ? "is-success" : ""}`} key={`${index}-${log}`}><span>{log.slice(0, 12)}</span><code>{log.slice(12)}</code></div>)}
                      {running && <span className="terminal-cursor" aria-hidden="true">▋</span>}
                    </div>
                  </div>

                  {done ? <div className="lab-result">
                    <div className="result-banner" aria-live="polite"><div className="result-check"><Icon name="check" /></div><div><span>BUILD {activeBuildId}</span><h3>{t("lab.complete")}</h3></div><div className="result-summary"><span><small>{t("lab.protected")}</small><strong>{protectedCount}</strong></span><span><small>{t("lab.output")}</small><strong>{activeOutput}</strong></span><span><small>{t("lab.cipherLabel")}</small><strong>{activeAlgorithm}</strong></span><span><small>{t("lab.signature")}</small><strong className="verified">Ed25519 · VERIFIED</strong></span></div><button className="report-button" type="button" onClick={downloadReport}><Icon name="doc" className="icon icon-sm" />{t("lab.report")}</button></div>
                    {snapshotData ? (
                      <LabFileExplorer
                        key={`${product}-${snapshotBuild?.id || "snapshot"}`}
                        before={snapshotData.before}
                        after={snapshotData.after}
                        onCopy={onCopy}
                      />
                    ) : (
                      <>
                        <div className="compare-heading"><div><span>03 / BEFORE & AFTER</span><h3>{t("lab.compare")}</h3></div><p>{t("lab.compareDesc")}</p></div>
                        {snapshot.status === "error" ? <p className="lab-snapshot-note"><Icon name="warning" className="icon icon-xs" />{t("lab.files.fallback")}</p> : null}
                        <div className="code-compare">
                          <article className="code-card before"><div className="code-card-head"><span><i className="plain-dot" />{t("lab.before")}</span><span className="readable-tag">{t("lab.readable")}</span></div><div className="code-content">{data.source.map((line, index) => <div className="compare-line" key={index}><span>{String(index + 1).padStart(2, "0")}</span><code>{line || " "}</code></div>)}</div><div className="code-card-foot"><Icon name="warning" className="icon icon-xs" />{t("lab.beforeNote")}</div></article>
                          <div className="compare-transform" aria-hidden="true"><span><Icon name="arrow-right" /></span><small>CODESHIELD</small></div>
                          <article className="code-card after"><div className="code-card-head"><span><Icon name="lock" className="icon icon-xs" />{t("lab.after")}</span><span className="sealed-tag"><i />{activeAlgorithm}</span></div><div className="code-content">{sealedBuild?.lines.map((line, index) => <div className="compare-line" key={index}><span>{String(index + 1).padStart(2, "0")}</span><code>{line}</code></div>)}</div><div className="code-card-foot"><Icon name="shield" className="icon icon-xs" />{sealedBuild?.verified ? t("lab.realCrypto") : t("lab.afterNote")}</div></article>
                        </div>
                      </>
                    )}
                  </div> : null}
                </>
              )}
            </div>
          )}
        </div>
        <p className="lab-footnote"><Icon name="shield" className="icon icon-sm" />{t("lab.footnote")}</p>
      </div>
    </section>
  );
}
