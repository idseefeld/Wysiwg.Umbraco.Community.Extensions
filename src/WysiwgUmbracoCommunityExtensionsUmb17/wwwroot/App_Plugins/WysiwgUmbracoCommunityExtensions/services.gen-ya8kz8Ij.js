var R = Object.defineProperty;
var T = (l, e, a) => e in l ? R(l, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : l[e] = a;
var v = (l, e, a) => T(l, typeof e != "symbol" ? e + "" : e, a);
var q = /\{[^{}]+\}/g, w = ({ allowReserved: l, name: e, value: a }) => {
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
}, j = ({ allowReserved: l, explode: e, name: a, style: u, value: s }) => {
  if (!e) {
    let t = (l ? s : s.map((i) => encodeURIComponent(i))).join(_(u));
    switch (u) {
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
  let n = A(u), r = s.map((t) => u === "label" || u === "simple" ? l ? t : encodeURIComponent(t) : w({ allowReserved: l, name: a, value: t })).join(n);
  return u === "label" || u === "matrix" ? n + r : r;
}, C = ({ allowReserved: l, explode: e, name: a, style: u, value: s }) => {
  if (s instanceof Date) return `${a}=${s.toISOString()}`;
  if (u !== "deepObject" && !e) {
    let t = [];
    Object.entries(s).forEach(([f, o]) => {
      t = [...t, f, l ? o : encodeURIComponent(o)];
    });
    let i = t.join(",");
    switch (u) {
      case "form":
        return `${a}=${i}`;
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${a}=${i}`;
      default:
        return i;
    }
  }
  let n = W(u), r = Object.entries(s).map(([t, i]) => w({ allowReserved: l, name: u === "deepObject" ? `${a}[${t}]` : t, value: i })).join(n);
  return u === "label" || u === "matrix" ? n + r : r;
}, E = ({ path: l, url: e }) => {
  let a = e, u = e.match(q);
  if (u) for (let s of u) {
    let n = !1, r = s.substring(1, s.length - 1), t = "simple";
    r.endsWith("*") && (n = !0, r = r.substring(0, r.length - 1)), r.startsWith(".") ? (r = r.substring(1), t = "label") : r.startsWith(";") && (r = r.substring(1), t = "matrix");
    let i = l[r];
    if (i == null) continue;
    if (Array.isArray(i)) {
      a = a.replace(s, j({ explode: n, name: r, style: t, value: i }));
      continue;
    }
    if (typeof i == "object") {
      a = a.replace(s, C({ explode: n, name: r, style: t, value: i }));
      continue;
    }
    if (t === "matrix") {
      a = a.replace(s, `;${w({ name: r, value: i })}`);
      continue;
    }
    let f = encodeURIComponent(t === "label" ? `.${i}` : i);
    a = a.replace(s, f);
  }
  return a;
}, S = ({ allowReserved: l, array: e, object: a } = {}) => (u) => {
  let s = [];
  if (u && typeof u == "object") for (let n in u) {
    let r = u[n];
    if (r != null) {
      if (Array.isArray(r)) {
        s = [...s, j({ allowReserved: l, explode: !0, name: n, style: "form", value: r, ...e })];
        continue;
      }
      if (typeof r == "object") {
        s = [...s, C({ allowReserved: l, explode: !0, name: n, style: "deepObject", value: r, ...a })];
        continue;
      }
      s = [...s, w({ allowReserved: l, name: n, value: r })];
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
}, I = ({ baseUrl: l, path: e, query: a, querySerializer: u, url: s }) => {
  let n = s.startsWith("/") ? s : `/${s}`, r = l + n;
  e && (r = E({ path: e, url: r }));
  let t = a ? u(a) : "";
  return t.startsWith("?") && (t = t.substring(1)), t && (r += `?${t}`), r;
}, x = (l, e) => {
  var u;
  let a = { ...l, ...e };
  return (u = a.baseUrl) != null && u.endsWith("/") && (a.baseUrl = a.baseUrl.substring(0, a.baseUrl.length - 1)), a.headers = U(l.headers, e.headers), a;
}, U = (...l) => {
  let e = new Headers();
  for (let a of l) {
    if (!a || typeof a != "object") continue;
    let u = a instanceof Headers ? a.entries() : Object.entries(a);
    for (let [s, n] of u) if (n === null) e.delete(s);
    else if (Array.isArray(n)) for (let r of n) e.append(s, r);
    else n !== void 0 && e.set(s, typeof n == "object" ? JSON.stringify(n) : n);
  }
  return e;
}, p = class {
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
}, D = () => ({ error: new p(), request: new p(), response: new p() }), N = { bodySerializer: (l) => JSON.stringify(l) }, P = S({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), H = { "Content-Type": "application/json" }, $ = (l = {}) => ({ ...N, baseUrl: "", fetch: globalThis.fetch, headers: H, parseAs: "auto", querySerializer: P, ...l }), J = (l = {}) => {
  let e = x($(), l), a = () => ({ ...e }), u = (r) => (e = x(e, r), a()), s = D(), n = async (r) => {
    let t = { ...e, ...r, headers: U(e.headers, r.headers) };
    t.body && t.bodySerializer && (t.body = t.bodySerializer(t.body)), t.body || t.headers.delete("Content-Type");
    let i = I({ baseUrl: t.baseUrl ?? "", path: t.path, query: t.query, querySerializer: typeof t.querySerializer == "function" ? t.querySerializer : S(t.querySerializer), url: t.url }), f = { redirect: "follow", ...t }, o = new Request(i, f);
    for (let d of s.request._fns) o = await d(o, t);
    let O = t.fetch, c = await O(o);
    for (let d of s.response._fns) c = await d(c, o, t);
    let b = { request: o, response: c };
    if (c.ok) {
      if (c.status === 204 || c.headers.get("Content-Length") === "0") return { data: {}, ...b };
      if (t.parseAs === "stream") return { data: c.body, ...b };
      let d = (t.parseAs === "auto" ? z(c.headers.get("Content-Type")) : t.parseAs) ?? "json", g = await c[d]();
      return d === "json" && t.responseTransformer && (g = await t.responseTransformer(g)), { data: g, ...b };
    }
    let h = await c.text();
    try {
      h = JSON.parse(h);
    } catch {
    }
    let y = h;
    for (let d of s.error._fns) y = await d(h, c, o, t);
    if (y = y || {}, t.throwOnError) throw y;
    return { error: y, ...b };
  };
  return { connect: (r) => n({ ...r, method: "CONNECT" }), delete: (r) => n({ ...r, method: "DELETE" }), get: (r) => n({ ...r, method: "GET" }), getConfig: a, head: (r) => n({ ...r, method: "HEAD" }), interceptors: s, options: (r) => n({ ...r, method: "OPTIONS" }), patch: (r) => n({ ...r, method: "PATCH" }), post: (r) => n({ ...r, method: "POST" }), put: (r) => n({ ...r, method: "PUT" }), request: n, setConfig: u, trace: (r) => n({ ...r, method: "TRACE" }) };
};
const m = J($());
class B {
  static crops(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/crops"
    });
  }
  static cropUrl(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/cropurl"
    });
  }
  static fixUpgrade(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/fixupgrade"
    });
  }
  static imageUrl(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/imageurl"
    });
  }
  static install(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/install"
    });
  }
  static mediaTypes(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/mediatypes"
    });
  }
  static siteBackgroundColor(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/site-background-color"
    });
  }
  static unInstall(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/uninstall"
    });
  }
  static getUpdateStatusCode(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/updateStatusCode"
    });
  }
  static v2CropUrl(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/v2-cropurl"
    });
  }
  static getVariations(e) {
    return ((e == null ? void 0 : e.client) ?? m).get({
      ...e,
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/variations"
    });
  }
}
export {
  J,
  B as W,
  m as c,
  $ as x
};
//# sourceMappingURL=services.gen-ya8kz8Ij.js.map
