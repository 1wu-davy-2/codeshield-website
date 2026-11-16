/* Line-level diff used by the lab file comparison.
   Small inputs only (snapshots cap at ~260 lines), so a plain LCS table is fine. */

function toLines(value) {
  return String(value == null ? "" : value).replace(/\r\n?/g, "\n").split("\n");
}

function lcsOps(a, b) {
  const n = a.length;
  const m = b.length;
  const w = m + 1;
  const dp = new Uint32Array((n + 1) * w);

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i * w + j] =
        a[i] === b[j]
          ? dp[(i + 1) * w + j + 1] + 1
          : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
    }
  }

  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: "eq", i, j });
      i += 1;
      j += 1;
    } else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) {
      ops.push({ type: "del", i });
      i += 1;
    } else {
      ops.push({ type: "add", j });
      j += 1;
    }
  }
  while (i < n) {
    ops.push({ type: "del", i });
    i += 1;
  }
  while (j < m) {
    ops.push({ type: "add", j });
    j += 1;
  }
  return ops;
}

/** Aligned rows: every row carries a left (before) and/or right (after) cell. */
export function diffRows(beforeText, afterText) {
  const a = toLines(beforeText);
  const b = toLines(afterText);
  const ops = lcsOps(a, b);
  const rows = [];

  let k = 0;
  while (k < ops.length) {
    if (ops[k].type === "eq") {
      const op = ops[k];
      rows.push({
        type: "eq",
        left: { no: op.i + 1, text: a[op.i] },
        right: { no: op.j + 1, text: b[op.j] }
      });
      k += 1;
      continue;
    }

    const dels = [];
    const adds = [];
    while (k < ops.length && ops[k].type !== "eq") {
      if (ops[k].type === "del") dels.push(ops[k]);
      else adds.push(ops[k]);
      k += 1;
    }

    const paired = Math.min(dels.length, adds.length);
    for (let x = 0; x < paired; x += 1) {
      rows.push({
        type: "change",
        left: { no: dels[x].i + 1, text: a[dels[x].i] },
        right: { no: adds[x].j + 1, text: b[adds[x].j] }
      });
    }
    for (let x = paired; x < dels.length; x += 1) {
      rows.push({ type: "del", left: { no: dels[x].i + 1, text: a[dels[x].i] }, right: null });
    }
    for (let x = paired; x < adds.length; x += 1) {
      rows.push({ type: "add", left: null, right: { no: adds[x].j + 1, text: b[adds[x].j] } });
    }
  }

  return rows;
}

export function countStats(rows) {
  const stats = { added: 0, removed: 0 };
  rows.forEach((row) => {
    if (row.type === "change") {
      stats.added += 1;
      stats.removed += 1;
    } else if (row.type === "add") {
      stats.added += 1;
    } else if (row.type === "del") {
      stats.removed += 1;
    }
  });
  return stats;
}

/** Collapse unchanged runs into hunks, git style. `context` = surrounding lines kept. */
export function buildUnified(rows, context = 3) {
  const visible = new Array(rows.length).fill(false);
  rows.forEach((row, index) => {
    if (row.type === "eq") return;
    const from = Math.max(0, index - context);
    const to = Math.min(rows.length - 1, index + context);
    for (let x = from; x <= to; x += 1) visible[x] = true;
  });

  const ranges = [];
  let cursor = 0;
  while (cursor < rows.length) {
    if (!visible[cursor]) {
      cursor += 1;
      continue;
    }
    let end = cursor;
    while (end + 1 < rows.length && visible[end + 1]) end += 1;
    ranges.push([cursor, end]);
    cursor = end + 1;
  }

  const items = [];
  ranges.forEach(([start, end]) => {
    let oldStart = 0;
    let newStart = 0;
    let oldCount = 0;
    let newCount = 0;
    for (let x = start; x <= end; x += 1) {
      const row = rows[x];
      if (row.left) {
        if (!oldCount) oldStart = row.left.no;
        oldCount += 1;
      }
      if (row.right) {
        if (!newCount) newStart = row.right.no;
        newCount += 1;
      }
    }
    items.push({
      kind: "hunk",
      key: `h${start}`,
      text: `@@ -${oldStart || 0},${oldCount} +${newStart || 0},${newCount} @@`
    });
    for (let x = start; x <= end; x += 1) items.push({ kind: "row", key: `r${x}`, row: rows[x] });
  });

  return items;
}

/** Unified patch text (valid @@ hunks), for the "copy diff" button. */
export function toPatch(path, rows, context = 3) {
  const lines = [`--- a/${path}`, `+++ b/${path}`];
  buildUnified(rows, context).forEach((item) => {
    if (item.kind === "hunk") {
      lines.push(item.text);
      return;
    }
    const row = item.row;
    if (row.type === "eq") lines.push(` ${row.left.text}`);
    else if (row.type === "del") lines.push(`-${row.left.text}`);
    else if (row.type === "add") lines.push(`+${row.right.text}`);
    else {
      lines.push(`-${row.left.text}`);
      lines.push(`+${row.right.text}`);
    }
  });
  return `${lines.join("\n")}\n`;
}

export function buildDiff(beforeText, afterText, context = 3) {
  const rows = diffRows(beforeText, afterText);
  return {
    rows,
    stats: countStats(rows),
    unified: buildUnified(rows, context)
  };
}
