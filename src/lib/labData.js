const SNAPSHOT_CACHE = new Map();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateSnapshot(doc, { product, stage }) {
  assert(doc && typeof doc === "object", `${product}-${stage}: document must be an object`);
  assert(doc.schemaVersion === 1, `${product}-${stage}: unsupported schemaVersion`);
  assert(doc.product === product, `${product}-${stage}: product mismatch`);
  assert(doc.stage === stage, `${product}-${stage}: stage mismatch`);
  assert(doc.project && typeof doc.project.id === "string", `${product}-${stage}: project.id is required`);
  assert(Array.isArray(doc.files) && doc.files.length > 0, `${product}-${stage}: files must not be empty`);

  const ids = new Set();
  doc.files.forEach((file, index) => {
    const label = `${product}-${stage}: files[${index}]`;
    assert(file && typeof file === "object", `${label} must be an object`);
    assert(typeof file.id === "string" && file.id, `${label}.id is required`);
    assert(typeof file.path === "string" && file.path, `${label}.path is required`);
    assert(typeof file.content === "string", `${label}.content is required`);
    assert(!ids.has(file.id), `${label}.id is duplicated: ${file.id}`);
    ids.add(file.id);
  });

  return { doc, ids };
}

export async function loadLabSnapshots(product) {
  if (SNAPSHOT_CACHE.has(product)) return SNAPSHOT_CACHE.get(product);

  const base = `${import.meta.env.BASE_URL}assets/data/lab/${product}`;
  const request = async (stage) => {
    const response = await fetch(`${base}-${stage}.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${product}-${stage}.json: HTTP ${response.status}`);
    return response.json();
  };

  const promise = Promise.all([request("before"), request("after")]).then(([before, after]) => {
    const beforeResult = validateSnapshot(before, { product, stage: "before" });
    const afterResult = validateSnapshot(after, { product, stage: "after" });

    after.files.forEach((file, index) => {
      if (file.sourceId == null) return;
      assert(
        beforeResult.ids.has(file.sourceId),
        `${product}-after: files[${index}].sourceId does not exist in before snapshot: ${file.sourceId}`
      );
    });

    assert(
      before.project.id === after.project.id,
      `${product}: before/after project.id mismatch`
    );

    return { before, after };
  });

  SNAPSHOT_CACHE.set(product, promise);
  try {
    return await promise;
  } catch (error) {
    SNAPSHOT_CACHE.delete(product);
    throw error;
  }
}
