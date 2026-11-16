import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import PORTAL_COPY, { portalError } from "../i18n/portal.js";
import { portal } from "../lib/portal.js";
import { Icon } from "./ui.jsx";

const EDITION_LABEL = { pro: "Pro", enterprise: "Enterprise" };

export default function UpgradeDialog({ edition, onClose }) {
  const { lang } = useI18n();
  const copyAll = PORTAL_COPY[lang] || PORTAL_COPY.en;
  const copy = copyAll.upgrade;
  const dialogRef = useRef(null);
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState(null);
  const [done, setDone] = useState(null);
  const [wechat, setWechat] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
  }, []);

  useEffect(() => {
    let alive = true;
    portal.config().then((data) => {
      if (alive && data?.contact_wechat) setWechat(data.contact_wechat);
    }).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setFailure(null);
    setBusy(true);
    try {
      const data = await portal.upgrade({ edition, contact: contact.trim(), notes: notes.trim() });
      setDone(data);
      if (data?.contact_wechat) setWechat(data.contact_wechat);
    } catch (caught) {
      setFailure(caught);
    } finally {
      setBusy(false);
    }
  };

  return (
    <dialog
      className="upgrade-dialog"
      aria-labelledby="upgradeTitle"
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <h3 id="upgradeTitle">
          {copy.title}
          <span className="upgrade-edition">{EDITION_LABEL[edition] || edition}</span>
        </h3>
        <button className="icon-btn" type="button" aria-label={copyAll.upgrade.close} onClick={onClose}>
          <Icon name="x" className="icon icon-sm" />
        </button>
      </div>

      {done ? (
        <div className="upgrade-done">
          <span className="upgrade-done-icon"><Icon name="check-circle" /></span>
          <strong>{copy.success}</strong>
          {done.order_id ? <p className="upgrade-order">{copy.order} <code>#{done.order_id}</code></p> : null}
          {wechat ? <p className="upgrade-wechat"><Icon name="qr" className="icon icon-xs" />WeChat: <code>{wechat}</code></p> : null}
          <div className="dialog-foot">
            <button className="btn btn-outline btn-sm" type="button" onClick={onClose}>
              {copy.close}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="upgrade-lead">{copy.lead}</p>
          <label className="portal-field">
            <span>{copy.contact}</span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={120}
              value={contact}
              autoComplete="off"
              onChange={(event) => setContact(event.target.value)}
            />
          </label>
          <label className="portal-field">
            <span>{copy.notes}</span>
            <textarea
              rows={3}
              maxLength={1000}
              value={notes}
              placeholder={copy.notesPlaceholder}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          {failure ? (
            <p className="portal-error" role="alert">
              <Icon name="warning" className="icon icon-xs" />
              <span>{portalError(copyAll, failure) || copy.failed}</span>
            </p>
          ) : null}
          <div className="dialog-foot">
            <button className="btn btn-primary btn-sm" type="submit" disabled={busy || !contact.trim()}>
              {busy ? copy.submitting : copy.submit}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
