var R = Object.defineProperty;
var T = (l, e, a) => e in l ? R(l, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : l[e] = a;
var v = (l, e, a) => T(l, typeof e != "symbol" ? e + "" : e, a);
var q = /\{[^{}]+\}/g, p = ({ allowReserved: l, name: e, value: a }) => {
  if (a == null) return "";
  if (typeof a == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${e}=${l ? a : encodeURIComponent(a)}`;
}, A = (l) => {
  switch (l) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, _ = (l) => {
  switch (l) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, W = (l) => {
  switch (l) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, j = ({ allowReserved: l, explode: e, name: a, style: i, value: s }) => {
  if (!e) {
    let t = (l ? s : s.map((u) => encodeURIComponent(u))).join(_(i));
    switch (i) {
      case "label":
        return `.${t}`;
      case "matrix":
        return `;${a}=${t}`;
      case "simple":
        return t;
      default:
        return `${a}=${t}`;
    }
  }
  let n = A(i), r = s.map((t) => i === "label" || i === "simple" ? l ? t : encodeURIComponent(t) : p({ allowReserved: l, name: a, value: t })).join(n);
  return i === "label" || i === "matrix" ? n + r : r;
}, S = ({ allowReserved: l, explode: e, name: a, style: i, value: s }) => {
  if (s instanceof Date) return `${a}=${s.toISOString()}`;
  if (i !== "deepObject" && !e) {
    let t = [];
    Object.entries(s).forEach(([d, o]) => {
      t = [...t, d, l ? o : encodeURIComponent(o)];
    });
    let u = t.join(",");
    switch (i) {
      case "form":
        return `${a}=${u}`;
      case "label":
        return `.${u}`;
      case "matrix":
        return `;${a}=${u}`;
      default:
        return u;
    }
  }
  let n = W(i), r = Object.entries(s).map(([t, u]) => p({ allowReserved: l, name: i === "deepObject" ? `${a}[${t}]` : t, value: u })).join(n);
  return i === "label" || i === "matrix" ? n + r : r;
}, E = ({ path: l, url: e }) => {
  let a = e, i = e.match(q);
  if (i) for (let s of i) {
    let n = !1, r = s.substring(1, s.length - 1), t = "simple";
    r.endsWith("*") && (n = !0, r = r.substring(0, r.length - 1)), r.startsWith(".") ? (r = r.substring(1), t = "label") : r.startsWith(";") && (r = r.substring(1), t = "matrix");
    let u = l[r];
    if (u == null) continue;
    if (Array.isArray(u)) {
      a = a.replace(s, j({ explode: n, name: r, style: t, value: u }));
      continue;
    }
    if (typeof u == "object") {
      a = a.replace(s, S({ explode: n, name: r, style: t, value: u }));
      continue;
    }
    if (t === "matrix") {
      a = a.replace(s, `;${p({ name: r, value: u })}`);
      continue;
    }
    let d = encodeURIComponent(t === "label" ? `.${u}` : u);
    a = a.replace(s, d);
  }
  return a;
}, $ = ({ allowReserved: l, array: e, object: a } = {}) => (i) => {
  let s = [];
  if (i && typeof i == "object") for (let n in i) {
    let r = i[n];
    if (r != null) {
      if (Array.isArray(r)) {
        s = [...s, j({ allowReserved: l, explode: !0, name: n, style: "form", value: r, ...e })];
        continue;
      }
      if (typeof r == "object") {
        s = [...s, S({ allowReserved: l, explode: !0, name: n, style: "deepObject", value: r, ...a })];
        continue;
      }
      s = [...s, p({ allowReserved: l, name: n, value: r })];
    }
  }
  return s.join("&");
}, z = (l) => {
  if (!l) return;
  let e = l.split(";")[0].trim();
  if (e.startsWith("application/json") || e.endsWith("+json")) return "json";
  if (e === "multipart/form-data") return "formData";
  if (["application/", "audio/", "image/", "video/"].some((a) => e.startsWith(a))) return "blob";
  if (e.startsWith("text/")) return "text";
}, I = ({ baseUrl: l, path: e, query: a, querySerializer: i, url: s }) => {
  let n = s.startsWith("/") ? s : `/${s}`, r = l + n;
  e && (r = E({ path: e, url: r }));
  let t = a ? i(a) : "";
  return t.startsWith("?") && (t = t.substring(1)), t && (r += `?${t}`), r;
}, x = (l, e) => {
  var i;
  let a = { ...l, ...e };
  return (i = a.baseUrl) != null && i.endsWith("/") && (a.baseUrl = a.baseUrl.substring(0, a.baseUrl.length - 1)), a.headers = C(l.headers, e.headers), a;
}, C = (...l) => {
  let e = new Headers();
  for (let a of l) {
    if (!a || typeof a != "object") continue;
    let i = a instanceof Headers ? a.entries() : Object.entries(a);
    for (let [s, n] of i) if (n === null) e.delete(s);
    else if (Array.isArray(n)) for (let r of n) e.append(s, r);
    else n !== void 0 && e.set(s, typeof n == "object" ? JSON.stringify(n) : n);
  }
  return e;
}, g = class {
  constructor() {
    v(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  exists(l) {
    return this._fns.indexOf(l) !== -1;
  }
  eject(l) {
    let e = this._fns.indexOf(l);
    e !== -1 && (this._fns = [...this._fns.slice(0, e), ...this._fns.slice(e + 1)]);
  }
  use(l) {
    this._fns = [...this._fns, l];
  }
}, D = () => ({ error: new g(), request: new g(), response: new g() }), N = { bodySerializer: (l) => JSON.stringify(l) }, P = $({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), H = { "Content-Type": "application/json" }, U = (l = {}) => ({ ...N, baseUrl: "", fetch: globalThis.fetch, headers: H, parseAs: "auto", querySerializer: P, ...l }), J = (l = {}) => {
  let e = x(U(), l), a = () => ({ ...e }), i = (r) => (e = x(e, r), a()), s = D(), n = async (r) => {
    let t = { ...e, ...r, headers: C(e.headers, r.headers) };
    t.body && t.bodySerializer && (t.body = t.bodySerializer(t.body)), t.body || t.headers.delete("Content-Type");
    let u = I({ baseUrl: t.baseUrl ?? "", path: t.path, query: t.query, querySerializer: typeof t.querySerializer == "function" ? t.querySerializer : $(t.querySerializer), url: t.url }), d = { redirect: "follow", ...t }, o = new Request(u, d);
    for (let m of s.request._fns) o = await m(o, t);
    let O = t.fetch, c = await O(o);
    for (let m of s.response._fns) c = await m(c, o, t);
    let b = { request: o, response: c };
    if (c.ok) {
      if (c.status === 204 || c.headers.get("Content-Length") === "0") return { data: {}, ...b };
      if (t.parseAs === "stream") return { data: c.body, ...b };
      let m = (t.parseAs === "auto" ? z(c.headers.get("Content-Type")) : t.parseAs) ?? "json", w = await c[m]();
      return m === "json" && t.responseTransformer && (w = await t.responseTransformer(w)), { data: w, ...b };
    }
    let h = await c.text();
    try {
      h = JSON.parse(h);
    } catch {
    }
    let y = h;
    for (let m of s.error._fns) y = await m(h, c, o, t);
    if (y = y || {}, t.throwOnError) throw y;
    return { error: y, ...b };
  };
  return { connect: (r) => n({ ...r, method: "CONNECT" }), delete: (r) => n({ ...r, method: "DELETE" }), get: (r) => n({ ...r, method: "GET" }), getConfig: a, head: (r) => n({ ...r, method: "HEAD" }), interceptors: s, options: (r) => n({ ...r, method: "OPTIONS" }), patch: (r) => n({ ...r, method: "PATCH" }), post: (r) => n({ ...r, method: "POST" }), put: (r) => n({ ...r, method: "PUT" }), request: n, setConfig: i, trace: (r) => n({ ...r, method: "TRACE" }) };
};
const f = J(U());
class k {
  static crops(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/crops"
    });
  }
  static cropUrl(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/cropurl"
    });
  }
  static imageUrl(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/imageurl"
    });
  }
  static install(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/install"
    });
  }
  static mediaTypes(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/mediatypes"
    });
  }
  static unInstall(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/uninstall"
    });
  }
  static getUpdateStatusCode(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/updateStatusCode"
    });
  }
  static v2CropUrl(e) {
    return ((e == null ? void 0 : e.client) ?? f).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/v2-cropurl"
    });
  }
}
export {
  k as W,
  f as c
};
//# sourceMappingURL=services.gen-mcYb1gDV.js.map
