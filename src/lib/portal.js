/* Browser client for the PyShield license portal.
   All calls go to /api/* on the current origin — vite (dev) or nginx (prod)
   proxies them to the portal, which itself sends no CORS headers. */

const BASE = (import.meta.env.VITE_PORTAL_BASE || "").replace(/\/$/, "");

async function request(path, { method = "GET", body, query } = {}) {
  let url = `${BASE}${path}`;
  if (query) {
    const search = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (cause) {
    throw { code: "network_error", error: String(cause?.message || cause), status: 0 };
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw {
      code: data?.code || `http_${response.status}`,
      error: data?.error || `HTTP ${response.status}`,
      errors: data?.errors || null,
      status: response.status
    };
  }
  return data || {};
}

export const portal = {
  health: () => request("/health"),
  config: () => request("/api/public/config"),
  trialApplication: (id) => request("/api/public/trial/application", { query: { id } }),
  applyTrial: (payload) => request("/api/public/trial/apply", { method: "POST", body: payload }),
  verifyTrial: ({ applicationId, code }) =>
    request("/api/public/trial/verify", { method: "POST", body: { application_id: applicationId, code } }),
  resendTrial: (applicationId) =>
    request("/api/public/trial/resend", { method: "POST", body: { application_id: applicationId } }),
  license: (serial, machine) => request("/api/public/license", { query: { serial, machine } }),
  redeem: ({ key, serial, machine }) =>
    request("/api/public/redeem", { method: "POST", body: { key, serial, machine } }),
  upgrade: (payload) => request("/api/public/upgrade", { method: "POST", body: payload })
};

export const SERIAL_RE = /^PS-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$/i;
export const MACHINE_RE = /^[0-9a-fA-F]{32}$/;

export function normalizeSerial(value) {
  return String(value || "").trim().toUpperCase();
}

export function validateIdentity({ serial, machine }) {
  return {
    serial: SERIAL_RE.test(normalizeSerial(serial)) ? "" : "serial",
    machine: MACHINE_RE.test(String(machine || "").trim()) ? "" : "machine"
  };
}
