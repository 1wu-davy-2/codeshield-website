#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "assets", "data", "lab");
const DOCS = ["python-before", "python-after", "java-before", "java-after"];
const KINDS = new Set([
  "source", "config", "test", "stub", "sidecar", "manifest", "license",
  "metadata", "binary", "data", "other"
]);
const ENCODINGS = new Set(["text", "hexdump", "javap"]);
const SHA256 = /^[a-f0-9]{64}$/;
const errors = [];
const warnings = [];
const snapshots = {};

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`);
}

function readDoc(name) {
  const filename = `${name}.json`;
  const fullPath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    fail(filename, "file is missing");
    return null;
  }
  const text = fs.readFileSync(fullPath, "utf8");
  if (text.length > 300_000) {
    warn(filename, `file is ${(text.length / 1024).toFixed(1)} KB; keep each document under 300 KB`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(filename, `invalid JSON: ${error.message}`);
    return null;
  }
}

function checkProject(filename, project) {
  if (!project || typeof project !== "object") {
    fail(filename, "project object is required");
    return;
  }
  ["id", "name", "runtime", "root"].forEach((key) => {
    if (typeof project[key] !== "string" || !project[key].trim()) {
      fail(filename, `project.${key} is required`);
    }
  });
  if (project.container != null && !["dir", "jar"].includes(project.container)) {
    fail(filename, "project.container must be dir or jar");
  }
  if (project.secretOmitted != null && typeof project.secretOmitted !== "boolean") {
    fail(filename, "project.secretOmitted must be boolean");
  }
}

function checkFile(filename, file, index, seenIds, stage) {
  const label = `files[${index}]`;
  if (!file || typeof file !== "object") {
    fail(filename, `${label} must be an object`);
    return;
  }
  if (typeof file.id !== "string" || !file.id.trim()) {
    fail(filename, `${label}.id is required`);
  } else if (seenIds.has(file.id)) {
    fail(filename, `${label}.id is duplicated: ${file.id}`);
  } else {
    seenIds.add(file.id);
  }
  if (typeof file.path !== "string" || !file.path.trim()) {
    fail(filename, `${label}.path is required`);
  }
  if (!KINDS.has(file.kind)) {
    fail(filename, `${label}.kind must be one of: ${[...KINDS].join(", ")}`);
  }
  if (typeof file.language !== "string" || !file.language.trim()) {
    fail(filename, `${label}.language is required`);
  }
  if (file.encoding != null && !ENCODINGS.has(file.encoding)) {
    fail(filename, `${label}.encoding must be text, hexdump or javap`);
  }
  if (!Number.isInteger(file.bytes) || file.bytes < 0) {
    fail(filename, `${label}.bytes must be a non-negative integer`);
  }
  if (typeof file.sha256 !== "string" || !SHA256.test(file.sha256)) {
    fail(filename, `${label}.sha256 must be a 64-character lowercase hex digest`);
  }
  if (typeof file.content !== "string") {
    fail(filename, `${label}.content must be a string`);
  } else {
    if (file.content.includes("\u0000")) {
      fail(filename, `${label}.content contains a NUL byte; use a hexdump preview for binary files`);
    }
    if (file.content.length > 200_000) {
      warn(filename, `${label}.content is ${(file.content.length / 1024).toFixed(1)} KB; consider a shorter preview`);
    }
    if (file.content.split("\n").length > 500) {
      warn(filename, `${label}.content has more than 500 lines; consider truncating and setting truncated:true`);
    }
  }
  if (stage === "after") {
    if (file.sourceId != null && typeof file.sourceId !== "string") {
      fail(filename, `${label}.sourceId must be a string or omitted`);
    }
  }
  if (file.redacted != null && typeof file.redacted !== "boolean") {
    fail(filename, `${label}.redacted must be boolean`);
  }
  if (file.truncated != null && typeof file.truncated !== "boolean") {
    fail(filename, `${label}.truncated must be boolean`);
  }
  if (file.primary != null && typeof file.primary !== "boolean") {
    fail(filename, `${label}.primary must be boolean`);
  }
  if (file.note != null && typeof file.note !== "string") {
    fail(filename, `${label}.note must be a string`);
  }
  if (typeof file.path === "string" && /(?:^|\/)[^/]*\.(?:jshield|shield)-secret\.json$/i.test(file.path)) {
    fail(filename, `${label} exposes a build secret file; never publish *.jshield-secret.json or *.shield-secret.json`);
  }
}

function checkSecrets(filename, files) {
  const patterns = [
    [/master_key\s*=\s*(?!\[REDACTED)[^\s]+/i, "agent config contains a non-redacted master_key"],
    [/"build_key"\s*:\s*"[^"]{8,}"/i, "content contains a build_key"],
    [/"signing_(?:key|seed)"\s*:/i, "content contains signing key material"],
    [/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/, "content contains a private key"],
    [/"master_key"\s*:\s*"[^"]{8,}"/i, "content contains a master key"],
    [/<\s*customer\s*>\s*(?!\[REDACTED\])[^<]+/i, "content contains an XML customer identifier"],
    [/"customer"\s*:\s*"(?!\[REDACTED\])[^"]+"/i, "content contains a customer field"],
    [/"tool_license"\s*:\s*\{/i, "content contains tool license metadata"],
    [/"builds_used"\s*:\s*\d+/i, "content contains a tool build quota"],
    [/"license_id"\s*:\s*"[^"]+"/i, "content contains a tool license id"],
    [/"edition"\s*:\s*"trial"/i, "content contains a trial edition marker"],
    [/"trial"\s*:\s*true/i, "content contains a trial flag"]
  ];
  files.forEach((file, index) => {
    if (!file || typeof file.content !== "string") return;
    patterns.forEach(([pattern, message]) => {
      const match = pattern.exec(file.content);
      if (match && !/REDACTED/i.test(match[0])) {
        fail(filename, `files[${index}] ${message}`);
      }
    });
  });
}

function checkBuild(filename, build) {
  if (!build || typeof build !== "object") {
    fail(filename, "build object is required for after snapshots");
    return;
  }
  ["id", "algorithm", "output"].forEach((key) => {
    if (typeof build[key] !== "string" || !build[key].trim()) {
      fail(filename, `build.${key} is required`);
    }
  });
  if (!Number.isInteger(build.count) || build.count < 0) {
    fail(filename, "build.count must be a non-negative integer");
  }
  if (typeof build.unit !== "string" || !build.unit.trim()) {
    fail(filename, "build.unit is required (modules or classes)");
  }
  if (build.machineBinding != null && typeof build.machineBinding !== "boolean") {
    fail(filename, "build.machineBinding must be boolean");
  }
}

for (const name of DOCS) {
  const filename = `${name}.json`;
  const doc = readDoc(name);
  if (!doc) continue;
  snapshots[name] = doc;

  if (doc.schemaVersion !== 1) fail(filename, "schemaVersion must be 1");
  if (!["python", "java"].includes(doc.product)) fail(filename, "product must be python or java");
  if (!["before", "after"].includes(doc.stage)) fail(filename, "stage must be before or after");
  if (!name.startsWith(`${doc.product}-`) || !name.endsWith(`-${doc.stage}`)) {
    fail(filename, "filename does not match product/stage");
  }
  if (typeof doc.demo !== "boolean") fail(filename, "demo must be true or false");
  if (typeof doc.generatedAt !== "string" || Number.isNaN(Date.parse(doc.generatedAt))) {
    fail(filename, "generatedAt must be an ISO-8601 timestamp");
  }
  checkProject(filename, doc.project);
  if (doc.stage === "after") checkBuild(filename, doc.build);
  if (!Array.isArray(doc.files) || doc.files.length === 0) {
    fail(filename, "files must be a non-empty array");
    continue;
  }
  const seenIds = new Set();
  doc.files.forEach((file, index) => checkFile(filename, file, index, seenIds, doc.stage));
  checkSecrets(filename, doc.files);
  if (doc.stage === "after" && !doc.files.some((file) => file?.sourceId)) {
    warn(filename, "no after file has a sourceId; the UI cannot pair files");
  }
  if (doc.stage === "after" && !doc.files.some((file) => file?.primary)) {
    warn(filename, "no after file is marked primary; the first artifact will be selected");
  }
}

for (const product of ["python", "java"]) {
  const before = snapshots[`${product}-before`];
  const after = snapshots[`${product}-after`];
  if (!before || !after) continue;
  const filename = `${product}-after.json`;
  if (before.project?.id !== after.project?.id) {
    fail(filename, "project.id must match the before snapshot");
  }
  const beforeIds = new Set((before.files || []).map((file) => file?.id).filter(Boolean));
  (after.files || []).forEach((file, index) => {
    if (!file?.sourceId) return;
    if (!beforeIds.has(file.sourceId)) {
      fail(filename, `files[${index}].sourceId does not exist in ${product}-before.json: ${file.sourceId}`);
    }
  });
}

const demoFlags = Object.entries(snapshots).map(([name, doc]) => `${name}:${doc.demo ? "demo" : "real"}`);
console.log(`Checked ${Object.keys(snapshots).length}/4 lab documents (${demoFlags.join(", ") || "none"}).`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((message) => console.log(`  ! ${message}`));
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  errors.forEach((message) => console.error(`  x ${message}`));
  process.exit(1);
}
console.log("Lab snapshot data is valid.");
