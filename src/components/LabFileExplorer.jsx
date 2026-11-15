import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../i18n/index.jsx";
import { Icon } from "./ui.jsx";

const MAX_LINES = 260;

const KIND_ICONS = {
  source: "doc",
  config: "box",
  test: "check-circle",
  stub: "file-check",
  sidecar: "lock",
  manifest: "file-check",
  license: "key",
  metadata: "layers",
  binary: "box",
  data: "doc",
  other: "doc"
};

const KINDS = new Set(Object.keys(KIND_ICONS));
const PRIMARY_KINDS = ["stub", "sidecar", "binary", "metadata"];

function baseName(path) {
  return path.slice(path.lastIndexOf("/") + 1);
}

function formatBytes(value) {
  if (!Number.isFinite(value)) return "";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(2)} MB`;
}

function fileKind(file) {
  return KINDS.has(file.kind) ? file.kind : "other";
}

function sortFiles(files) {
  return files.slice().sort((a, b) => a.path.localeCompare(b.path, "en"));
}

function buildTree(files) {
  const root = { dirs: new Map(), files: [] };
  files.forEach((file) => {
    const parts = file.path.split("/").filter(Boolean);
    let node = root;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const dir = parts[index];
      if (!node.dirs.has(dir)) node.dirs.set(dir, { dirs: new Map(), files: [] });
      node = node.dirs.get(dir);
    }
    node.files.push(file);
  });
  return root;
}

function pickPrimary(files) {
  if (!files || files.length === 0) return null;
  return (
    files.find((file) => file.primary) ||
    PRIMARY_KINDS.map((kind) => files.find((file) => file.kind === kind)).find(Boolean) ||
    files[0]
  );
}

function FileTree({ node, depth, selectedId, relatedIds, onSelect }) {
  const dirs = Array.from(node.dirs.entries()).sort(([a], [b]) => a.localeCompare(b, "en"));
  const files = sortFiles(node.files);

  return (
    <>
      {dirs.map(([name, child]) => (
        <div className="lab-tree-dir" key={`dir:${name}`}>
          <div className="lab-dir-row" style={{ "--depth": depth }}>
            <span className="dir-caret" aria-hidden="true">▾</span>
            <span className="dir-name">{name}</span>
          </div>
          <FileTree
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            relatedIds={relatedIds}
            onSelect={onSelect}
          />
        </div>
      ))}
      {files.map((file) => {
        const kind = fileKind(file);
        const selected = file.id === selectedId;
        const related = !selected && relatedIds.has(file.id);
        return (
          <button
            type="button"
            className={`lab-file-row${selected ? " is-selected" : ""}${related ? " is-related" : ""}`}
            style={{ "--depth": depth }}
            key={file.id}
            onClick={() => onSelect(file)}
            aria-pressed={selected}
            title={file.path}
          >
            <Icon name={KIND_ICONS[kind]} className={`icon icon-xs file-icon ${kind}`} />
            <span className="file-name">{baseName(file.path)}</span>
            <span className={`file-kind ${kind}`}>{file.kindLabel}</span>
            {related ? <span className="file-link" aria-hidden="true" /> : null}
          </button>
        );
      })}
    </>
  );
}

function FileViewer({ file, side, emptyTitle, emptyBody, onCopy, t }) {
  const { lang } = useI18n();
  const view = useMemo(() => {
    if (!file) return null;
    const allLines = String(file.content).replace(/\r\n?/g, "\n").split("\n");
    const clipped = allLines.slice(0, MAX_LINES);
    return {
      lines: clipped,
      truncated: Boolean(file.truncated) || allLines.length > MAX_LINES
    };
  }, [file]);

  if (!file) {
    return (
      <div className="lab-viewer is-empty">
        <span className="viewer-empty-icon"><Icon name={side === "before" ? "doc" : "lock"} /></span>
        <strong>{emptyTitle}</strong>
        <p>{emptyBody}</p>
      </div>
    );
  }

  const kind = fileKind(file);
  const kindLabel = t(`lab.files.kind.${kind}`);
  const lineSuffix = lang === "en" ? "lines" : t("lab.files.linesSuffix");

  return (
    <div className="lab-viewer">
      <div className="lab-viewer-head">
        <span className="viewer-path" title={file.path}>
          <Icon name={KIND_ICONS[kind]} className="icon icon-xs" />
          <code>{file.path}</code>
        </span>
        <span className="viewer-meta">
          <span className={`file-kind ${kind}`}>{kindLabel}</span>
          {file.encoding === "hexdump" ? <span className="hex-tag">{t("lab.files.hex")}</span> : null}
          {file.encoding === "javap" ? <span className="hex-tag">{t("lab.files.javap")}</span> : null}
          {file.redacted ? <span className="redacted-tag">{t("lab.files.redacted")}</span> : null}
          {Number.isFinite(file.bytes) ? <span>{formatBytes(file.bytes)}</span> : null}
          <span>{view.lines.length} {lineSuffix}</span>
          <button
            type="button"
            className="viewer-copy"
            onClick={() => onCopy(file.content, false)}
            title={t("lab.files.copy")}
            aria-label={t("lab.files.copy")}
          >
            <Icon name="copy" className="icon icon-xs" />
          </button>
        </span>
      </div>
      <div className="lab-viewer-code" tabIndex={0} aria-label={`${kindLabel} ${file.path}`}>
        {view.lines.map((line, index) => (
          <div className="viewer-line" key={index}>
            <span className="viewer-line-no">{String(index + 1).padStart(2, "0")}</span>
            <code>{line || " "}</code>
          </div>
        ))}
      </div>
      {view.truncated ? <div className="lab-viewer-truncated">{t("lab.files.truncated")}</div> : null}
      <div className="lab-viewer-foot">
        <span className="viewer-note">{file.note || ""}</span>
        {file.sha256 ? (
          <span className="viewer-hash" title={`${t("lab.files.sha")} ${file.sha256}`}>
            {t("lab.files.sha")} {file.sha256.slice(0, 12)}…
          </span>
        ) : null}
      </div>
    </div>
  );
}

function FilePane({
  side,
  title,
  hint,
  root,
  files,
  countSuffix,
  selectedId,
  relatedIds,
  onSelect,
  viewerFile,
  emptyTitle,
  emptyBody,
  onCopy,
  tabs,
  notes,
  t
}) {
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <section className={`lab-file-pane ${side}`}>
      <header className="lab-file-pane-head">
        <div>
          <strong>{title}</strong>
          <small title={root}>{root}</small>
          {notes?.length ? (
            <span className="file-pane-notes">
              {notes.map((note) => <em key={note}>{note}</em>)}
            </span>
          ) : null}
        </div>
        <span className="file-pane-count"><b>{files.length}</b> {countSuffix}</span>
      </header>
      <div className="lab-file-list" role="group" aria-label={title}>
        <div className="lab-file-hint">{hint}</div>
        <FileTree
          node={tree}
          depth={0}
          selectedId={selectedId}
          relatedIds={relatedIds}
          onSelect={onSelect}
        />
      </div>
      <div className={`lab-artifact-tabs${side === "before" ? " is-passive" : ""}`}>{tabs}</div>
      <FileViewer
        file={viewerFile}
        side={side}
        emptyTitle={emptyTitle}
        emptyBody={emptyBody}
        onCopy={onCopy}
        t={t}
      />
    </section>
  );
}

export default function LabFileExplorer({ before, after, onCopy }) {
  const { t } = useI18n();

  const normalizedBefore = useMemo(
    () =>
      sortFiles(before.files).map((file) => ({
        ...file,
        kind: fileKind(file),
        kindLabel: t(`lab.files.kind.${fileKind(file)}`)
      })),
    [before, t]
  );

  const normalizedAfter = useMemo(
    () =>
      sortFiles(after.files).map((file) => ({
        ...file,
        kind: fileKind(file),
        kindLabel: t(`lab.files.kind.${fileKind(file)}`)
      })),
    [after, t]
  );

  const afterById = useMemo(
    () => new Map(normalizedAfter.map((file) => [file.id, file])),
    [normalizedAfter]
  );

  const beforeById = useMemo(
    () => new Map(normalizedBefore.map((file) => [file.id, file])),
    [normalizedBefore]
  );

  const artifactsBySource = useMemo(() => {
    const map = new Map();
    normalizedAfter.forEach((file) => {
      if (!file.sourceId) return;
      if (!map.has(file.sourceId)) map.set(file.sourceId, []);
      map.get(file.sourceId).push(file);
    });
    map.forEach((files) => {
      files.sort((a, b) => {
        const aPrimary = a.primary || PRIMARY_KINDS.includes(a.kind) ? 0 : 1;
        const bPrimary = b.primary || PRIMARY_KINDS.includes(b.kind) ? 0 : 1;
        return aPrimary - bPrimary || a.path.localeCompare(b.path, "en");
      });
    });
    return map;
  }, [normalizedAfter]);

  const initial = useMemo(() => {
    const firstPrimary =
      normalizedBefore.find((file) =>
        (artifactsBySource.get(file.id) || []).some((artifact) => artifact.primary)
      ) ||
      normalizedBefore.find((file) => (artifactsBySource.get(file.id) || []).length > 0) ||
      normalizedBefore[0];
    const artifacts = firstPrimary ? artifactsBySource.get(firstPrimary.id) || [] : [];
    return {
      sourceId: firstPrimary ? firstPrimary.id : "",
      afterId: pickPrimary(artifacts)?.id || normalizedAfter[0]?.id || ""
    };
  }, [normalizedBefore, normalizedAfter, artifactsBySource]);

  const [selectedSourceId, setSelectedSourceId] = useState(initial.sourceId);
  const [selectedAfterId, setSelectedAfterId] = useState(initial.afterId);

  const selectedBefore = beforeById.get(selectedSourceId) || null;
  const selectedAfter = afterById.get(selectedAfterId) || null;
  const relatedArtifacts = (selectedSourceId && artifactsBySource.get(selectedSourceId)) || [];
  const primaryArtifact = pickPrimary(relatedArtifacts);

  useEffect(() => {
    const rows = document.querySelectorAll(".lab-file-pane .lab-file-row.is-selected");
    rows.forEach((row) => {
      const list = row.closest(".lab-file-list");
      if (!list) return;
      const listRect = list.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      if (rowRect.top < listRect.top || rowRect.bottom > listRect.bottom) {
        list.scrollTop += rowRect.top - listRect.top - 18;
      }
    });
  }, [selectedSourceId, selectedAfterId]);

  const onSelectBefore = (file) => {
    setSelectedSourceId(file.id);
    const artifacts = artifactsBySource.get(file.id) || [];
    if (!artifacts.some((artifact) => artifact.id === selectedAfterId)) {
      setSelectedAfterId(pickPrimary(artifacts)?.id || "");
    }
  };

  const onSelectAfter = (file) => {
    setSelectedAfterId(file.id);
    setSelectedSourceId(file.sourceId || "");
  };

  const sourceLabel = String(before.project?.name || before.project?.id || "");
  const outputLabel = String(
    after.project?.root || after.build?.output || after.project?.name || after.project?.id || ""
  );
  const demo = Boolean(before.demo || after.demo);

  const beforeCountSuffix = t("lab.files.countSuffix");
  const afterCountSuffix = t("lab.files.countSuffix");
  const afterNotes = useMemo(() => {
    const notes = [];
    if (after.project?.container === "jar") notes.push(t("lab.files.jarNote"));
    if (after.project?.secretOmitted || before.project?.secretOmitted) {
      notes.push(t("lab.files.secretOmitted"));
    }
    return notes;
  }, [after.project, before.project, t]);

  return (
    <div className="lab-files">
      <div className="lab-files-head">
        <div>
          <span className="lab-files-kicker">03 / FILE COMPARISON</span>
          <h3>{t("lab.files.title")}</h3>
          <p>{t("lab.files.lead")}</p>
        </div>
        <div className={`snapshot-state${demo ? " is-demo" : ""}`}>
          <span><i aria-hidden="true" />{demo ? t("lab.files.demo") : t("lab.files.real")}</span>
          <small>{demo ? t("lab.files.demoNote") : t("lab.files.realNote")}</small>
        </div>
      </div>

      <div className="lab-file-grid">
        <FilePane
          side="before"
          title={t("lab.files.beforeTitle")}
          hint={t("lab.files.beforeHint")}
          root={sourceLabel}
          files={normalizedBefore}
          countSuffix={beforeCountSuffix}
          selectedId={selectedSourceId}
          relatedIds={new Set()}
          onSelect={onSelectBefore}
          viewerFile={selectedBefore}
          emptyTitle={t("lab.files.noSourceTitle")}
          emptyBody={t("lab.files.noSourceBody")}
          onCopy={onCopy}
          t={t}
          tabs={
            relatedArtifacts.length > 0 ? (
              <span className="tabs-passive-label">
                <Icon name="arrow-right" className="icon icon-xs" />
                {relatedArtifacts.length} {t("lab.files.artifactsSuffix")}
              </span>
            ) : null
          }
        />

        <FilePane
          side="after"
          title={t("lab.files.afterTitle")}
          hint={t("lab.files.afterHint")}
          root={outputLabel}
          files={normalizedAfter}
          countSuffix={afterCountSuffix}
          selectedId={selectedAfterId}
          relatedIds={new Set(relatedArtifacts.map((file) => file.id))}
          onSelect={onSelectAfter}
          viewerFile={selectedAfter}
          emptyTitle={t("lab.files.noArtifactTitle")}
          emptyBody={t("lab.files.noArtifactBody")}
          onCopy={onCopy}
          notes={afterNotes}
          t={t}
          tabs={
            relatedArtifacts.length > 1 ? (
              <>
                <span className="tabs-label">{t("lab.files.artifacts")}</span>
                {relatedArtifacts.map((file) => (
                  <button
                    type="button"
                    className={file.id === selectedAfterId ? "is-active" : ""}
                    key={file.id}
                    onClick={() => onSelectAfter(file)}
                    title={file.path}
                  >
                    {baseName(file.path)}
                    <em>{file.kindLabel}</em>
                  </button>
                ))}
              </>
            ) : primaryArtifact ? (
              <span className="tabs-passive-label">
                <Icon name="check" className="icon icon-xs" />
                {t("lab.files.matched")}
              </span>
            ) : null
          }
        />
      </div>

      <div className="lab-files-foot">
        <span><Icon name="shield" className="icon icon-xs" />{t("lab.files.note")}</span>
        <span>{t("lab.files.pairHint")}</span>
      </div>
    </div>
  );
}
