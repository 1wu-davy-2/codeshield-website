import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import PORTAL_COPY, { portalError } from "../i18n/portal.js";
import { copyToClipboard } from "../lib/hooks.js";
import { normalizeSerial, portal, validateIdentity } from "../lib/portal.js";
import { Icon } from "./ui.jsx";

const TABS = ["trial", "redeem", "status"];

function identityFromLocation() {
  const pick = (params) => ({
    serial: params.get("serial") || "",
    machine: params.get("machine") || ""
  });
  try {
    const search = new URLSearchParams(window.location.search);
    const found = pick(search);
    if (found.serial || found.machine) return found;
    const hashQuery = window.location.hash.split("?")[1];
    if (hashQuery) return pick(new URLSearchParams(hashQuery));
  } catch (error) {
    /* ignore */
  }
  return { serial: "", machine: "" };
}

function ErrorLine({ failure, copy }) {
  const message = portalError(copy, failure);
  if (!message) return null;
  return (
    <p className="portal-error" role="alert">
      <Icon name="warning" className="icon icon-xs" />
      <span>{message}</span>
    </p>
  );
}

function ResultCard({ copy, data, title, onAgain }) {
  const [copied, setCopied] = useState(false);
  const code = data.trial_code || "";

  const copyCode = async () => {
    await copyToClipboard(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="portal-success">
      <div className="portal-success-head">
        <Icon name="check-circle" className="icon" />
        <div>
          <strong>{title}</strong>
          <span className={`portal-status is-${data.status || data.edition || "granted"}`}>
            {copy.statusText[data.status] || copy.statusText.granted}
          </span>
        </div>
      </div>
      <dl className="portal-kv">
        {data.edition ? (
          <div><dt>{copy.edition}</dt><dd>{data.edition}</dd></div>
        ) : null}
        {data.expires ? (
          <div><dt>{copy.expires}</dt><dd>{data.expires}</dd></div>
        ) : null}
        {Number.isFinite(data.max_builds) ? (
          <div><dt>{copy.maxBuilds}</dt><dd>{data.max_builds}</dd></div>
        ) : null}
        {data.license_id ? (
          <div><dt>{copy.licenseId}</dt><dd><code>{data.license_id}</code></dd></div>
        ) : null}
        {code ? (
          <div>
            <dt>{copy.trialCode}</dt>
            <dd>
              <code>{code}</code>
              <button className="portal-copy" type="button" onClick={copyCode}>
                <Icon name="copy" className="icon icon-xs" />
                {copied ? copy.copied : copy.copyCode}
              </button>
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="portal-actions">
        {data.deep_link ? (
          <a className="portal-primary" href={data.deep_link}>
            <Icon name="play" className="icon icon-xs" />
            {copy.openClient}
          </a>
        ) : null}
        <button className="portal-ghost" type="button" onClick={onAgain}>
          {copy.again}
        </button>
      </div>
    </div>
  );
}

export default function PortalPanel() {
  const { lang } = useI18n();
  const copy = PORTAL_COPY[lang] || PORTAL_COPY.en;

  const initial = useMemo(identityFromLocation, []);
  const [serial, setSerial] = useState(normalizeSerial(initial.serial));
  const [machine, setMachine] = useState(initial.machine.trim());
  const [tab, setTab] = useState("trial");

  const [config, setConfig] = useState(null);
  const [online, setOnline] = useState(null);

  // trial state
  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    orgType: "individual",
    company: "",
    consent: false
  });
  const [phase, setPhase] = useState("form"); // form | code | done
  const [applicationId, setApplicationId] = useState(null);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [resendIn, setResendIn] = useState(0);

  // redeem / status state
  const [key, setKey] = useState("");
  const [statusResult, setStatusResult] = useState(null);

  const countdown = useRef(null);
  useEffect(() => () => window.clearInterval(countdown.current), []);

  useEffect(() => {
    let alive = true;
    Promise.allSettled([portal.config(), portal.health()]).then(([configResult, healthResult]) => {
      if (!alive) return;
      if (configResult.status === "fulfilled") setConfig(configResult.value);
      setOnline(healthResult.status === "fulfilled" && healthResult.value?.ok === true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const startResendCountdown = useCallback(() => {
    setResendIn(60);
    window.clearInterval(countdown.current);
    countdown.current = window.setInterval(() => {
      setResendIn((current) => {
        if (current <= 1) {
          window.clearInterval(countdown.current);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
  }, []);

  const identityCheck = validateIdentity({ serial, machine });
  const identityReady = !identityCheck.serial && !identityCheck.machine;

  const applyTrial = async (event) => {
    event.preventDefault();
    setFailure(null);
    if (!identityReady) {
      setFieldErrors(identityCheck);
      return;
    }
    if (!form.consent) return;
    setBusy(true);
    try {
      const data = await portal.applyTrial({
        serial: normalizeSerial(serial),
        machine: machine.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        name: form.name.trim(),
        org_type: form.orgType,
        company_name: form.orgType === "company" ? form.company.trim() : "",
        consent: true,
        captcha_token: "",
        website: ""
      });
      setFieldErrors({});
      if (data.verification_required) {
        setApplicationId(data.application_id);
        setMaskedEmail(data.email || "");
        setPhase("code");
        startResendCountdown();
      } else {
        setResult(data);
        setPhase("done");
      }
    } catch (caught) {
      if (caught.code === "validation_failed" && caught.errors) setFieldErrors(caught.errors);
      setFailure(caught);
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setFailure(null);
    setBusy(true);
    try {
      const data = await portal.verifyTrial({ applicationId, code: code.trim() });
      setResult(data);
      setPhase("done");
    } catch (caught) {
      setFailure(caught);
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    if (resendIn > 0 || !applicationId) return;
    setFailure(null);
    setBusy(true);
    try {
      const data = await portal.resendTrial(applicationId);
      if (data.expires_in) startResendCountdown();
    } catch (caught) {
      setFailure(caught);
    } finally {
      setBusy(false);
    }
  };

  const redeem = async (event) => {
    event.preventDefault();
    setFailure(null);
    if (!identityReady) {
      setFieldErrors(identityCheck);
      return;
    }
    setBusy(true);
    try {
      const data = await portal.redeem({
        key: key.trim().toUpperCase(),
        serial: normalizeSerial(serial),
        machine: machine.trim()
      });
      setFieldErrors({});
      setResult(data);
      setPhase("done");
    } catch (caught) {
      if (caught.code === "validation_failed" && caught.errors) setFieldErrors(caught.errors);
      setFailure(caught);
    } finally {
      setBusy(false);
    }
  };

  const checkStatus = async (event) => {
    event.preventDefault();
    setFailure(null);
    if (!identityReady) {
      setFieldErrors(identityCheck);
      return;
    }
    setBusy(true);
    try {
      const data = await portal.license(normalizeSerial(serial), machine.trim());
      setFieldErrors({});
      setStatusResult(data);
    } catch (caught) {
      setFailure(caught);
    } finally {
      setBusy(false);
    }
  };

  const resetTab = (next) => {
    setTab(next);
    setFailure(null);
    setFieldErrors({});
    setPhase("form");
    setResult(null);
    setStatusResult(null);
    setCode("");
  };

  const showCompany = form.orgType === "company";
  const trialDays = config?.trial_days;
  const trialBuilds = config?.trial_builds;

  return (
    <section className="portal-panel" id="portal">
      <header className="portal-head">
        <div>
          <span className="portal-kicker">04 / LICENSE PORTAL</span>
          <h3>{copy.panelTitle}</h3>
          <p>{copy.panelLead}</p>
        </div>
        <span className={`portal-badge${online ? " is-online" : ""}`}>
          <i aria-hidden="true" />
          {online ? `${copy.online}${config?.version ? ` · v${config.version}` : ""}` : copy.offline}
        </span>
      </header>

      <div className="portal-identity">
        <label className="portal-field">
          <span>{copy.serial}</span>
          <input
            type="text"
            value={serial}
            placeholder={copy.serialPlaceholder}
            autoComplete="off"
            spellCheck="false"
            onChange={(event) => setSerial(event.target.value.toUpperCase())}
          />
          {fieldErrors.serial || identityCheck.serial ? <em>{copy.invalidSerial}</em> : null}
        </label>
        <label className="portal-field">
          <span>{copy.machine}</span>
          <input
            type="text"
            value={machine}
            placeholder={copy.machinePlaceholder}
            autoComplete="off"
            spellCheck="false"
            onChange={(event) => setMachine(event.target.value.trim())}
          />
          {fieldErrors.machine || identityCheck.machine ? <em>{copy.invalidMachine}</em> : null}
        </label>
        <p className="portal-hint"><Icon name="fingerprint" className="icon icon-xs" />{copy.fromClient}</p>
      </div>

      <div className="portal-tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "is-active" : ""}
            onClick={() => resetTab(item)}
          >
            {item === "trial" ? copy.tabTrial : item === "redeem" ? copy.tabRedeem : copy.tabStatus}
          </button>
        ))}
      </div>

      <ErrorLine failure={failure} copy={copy} />

      {tab === "trial" ? (
        phase === "done" && result ? (
          <ResultCard copy={copy} data={result} title={copy.successTitle} onAgain={() => resetTab("trial")} />
        ) : phase === "code" ? (
          <form className="portal-form" onSubmit={verifyCode}>
            <div className="portal-code-head">
              <strong>{copy.codeTitle}</strong>
              <span>{maskedEmail ? `${copy.email}: ${maskedEmail}` : copy.codeHint}</span>
              <small>{copy.codeHint}</small>
            </div>
            <div className="portal-code-row">
              <input
                className="portal-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                placeholder={copy.codePlaceholder}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <button className="portal-primary" type="submit" disabled={busy || code.length !== 6}>
                {busy ? copy.submitting : copy.verify}
              </button>
              <button
                className="portal-ghost"
                type="button"
                onClick={resendCode}
                disabled={busy || resendIn > 0}
              >
                {resendIn > 0 ? copy.resendIn(resendIn) : copy.resend}
              </button>
            </div>
          </form>
        ) : (
          <form className="portal-form" onSubmit={applyTrial}>
            <div className="portal-grid">
              <label className="portal-field">
                <span>{copy.email}</span>
                <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </label>
              <label className="portal-field">
                <span>{copy.phone}</span>
                <input type="tel" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              </label>
              <label className="portal-field">
                <span>{copy.name}</span>
                <input type="text" required minLength={2} maxLength={40} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </label>
              <label className="portal-field">
                <span>{copy.orgType}</span>
                <select value={form.orgType} onChange={(event) => setForm({ ...form, orgType: event.target.value })}>
                  <option value="individual">{copy.orgIndividual}</option>
                  <option value="company">{copy.orgCompany}</option>
                </select>
              </label>
              {showCompany ? (
                <label className="portal-field is-wide">
                  <span>{copy.companyName}</span>
                  <input type="text" required minLength={2} maxLength={100} value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
                </label>
              ) : null}
            </div>
            <label className="portal-consent">
              <input type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} />
              <span>{copy.consent}</span>
            </label>
            {trialDays || trialBuilds ? (
              <p className="portal-meta">
                {trialDays ? `${trialDays}d` : ""}{trialDays && trialBuilds ? " · " : ""}{trialBuilds ? `${trialBuilds}/mo` : ""}
              </p>
            ) : null}
            <button className="portal-primary" type="submit" disabled={busy || !form.consent || !identityReady}>
              {busy ? copy.submitting : copy.submit}
            </button>
          </form>
        )
      ) : null}

      {tab === "redeem" ? (
        phase === "done" && result ? (
          <ResultCard copy={copy} data={result} title={copy.paidTitle} onAgain={() => resetTab("redeem")} />
        ) : (
          <form className="portal-form" onSubmit={redeem}>
            <label className="portal-field">
              <span>{copy.keyLabel}</span>
              <input
                type="text"
                required
                value={key}
                placeholder={copy.keyPlaceholder}
                spellCheck="false"
                onChange={(event) => setKey(event.target.value.toUpperCase())}
              />
            </label>
            <button className="portal-primary" type="submit" disabled={busy || !identityReady || !key.trim()}>
              {busy ? copy.submitting : copy.redeem}
            </button>
          </form>
        )
      ) : null}

      {tab === "status" ? (
        statusResult ? (
          <ResultCard
            copy={copy}
            data={{ ...statusResult, deep_link: statusResult.deep_link || "" }}
            title={copy.statusText[statusResult.status] || copy.statusText.unknown}
            onAgain={() => resetTab("status")}
          />
        ) : (
          <form className="portal-form" onSubmit={checkStatus}>
            <button className="portal-primary" type="submit" disabled={busy || !identityReady}>
              {busy ? copy.submitting : copy.statusSubmit}
            </button>
          </form>
        )
      ) : null}
    </section>
  );
}
