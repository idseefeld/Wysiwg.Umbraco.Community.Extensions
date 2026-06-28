const m = {
  bodySerializer: (t) => JSON.stringify(t, (r, e) => typeof e == "bigint" ? e.toString() : e)
}, g = (t) => {
  switch (t) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, j = (t) => {
  switch (t) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, x = (t) => {
  switch (t) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, h = ({
  allowReserved: t,
  explode: r,
  name: e,
  style: s,
  value: i
}) => {
  if (!r) {
    const a = (t ? i : i.map((o) => encodeURIComponent(o))).join(j(s));
    switch (s) {
      case "label":
        return `.${a}`;
      case "matrix":
        return `;${e}=${a}`;
      case "simple":
        return a;
      default:
        return `${e}=${a}`;
    }
  }
  const c = g(s), n = i.map((a) => s === "label" || s === "simple" ? t ? a : encodeURIComponent(a) : u({
    allowReserved: t,
    name: e,
    value: a
  })).join(c);
  return s === "label" || s === "matrix" ? c + n : n;
}, u = ({
  allowReserved: t,
  name: r,
  value: e
}) => {
  if (e == null)
    return "";
  if (typeof e == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${r}=${t ? e : encodeURIComponent(e)}`;
}, p = ({
  allowReserved: t,
  explode: r,
  name: e,
  style: s,
  value: i,
  valueOnly: c
}) => {
  if (i instanceof Date)
    return c ? i.toISOString() : `${e}=${i.toISOString()}`;
  if (s !== "deepObject" && !r) {
    let o = [];
    Object.entries(i).forEach(([y, d]) => {
      o = [...o, y, t ? d : encodeURIComponent(d)];
    });
    const l = o.join(",");
    switch (s) {
      case "form":
        return `${e}=${l}`;
      case "label":
        return `.${l}`;
      case "matrix":
        return `;${e}=${l}`;
      default:
        return l;
    }
  }
  const n = x(s), a = Object.entries(i).map(
    ([o, l]) => u({
      allowReserved: t,
      name: s === "deepObject" ? `${e}[${o}]` : o,
      value: l
    })
  ).join(n);
  return s === "label" || s === "matrix" ? n + a : a;
}, z = /\{[^{}]+\}/g, S = ({ path: t, url: r }) => {
  let e = r;
  const s = r.match(z);
  if (s)
    for (const i of s) {
      let c = !1, n = i.substring(1, i.length - 1), a = "simple";
      n.endsWith("*") && (c = !0, n = n.substring(0, n.length - 1)), n.startsWith(".") ? (n = n.substring(1), a = "label") : n.startsWith(";") && (n = n.substring(1), a = "matrix");
      const o = t[n];
      if (o == null)
        continue;
      if (Array.isArray(o)) {
        e = e.replace(i, h({ explode: c, name: n, style: a, value: o }));
        continue;
      }
      if (typeof o == "object") {
        e = e.replace(
          i,
          p({
            explode: c,
            name: n,
            style: a,
            value: o,
            valueOnly: !0
          })
        );
        continue;
      }
      if (a === "matrix") {
        e = e.replace(
          i,
          `;${u({
            name: n,
            value: o
          })}`
        );
        continue;
      }
      const l = encodeURIComponent(
        a === "label" ? `.${o}` : o
      );
      e = e.replace(i, l);
    }
  return e;
}, $ = ({
  baseUrl: t,
  path: r,
  query: e,
  querySerializer: s,
  url: i
}) => {
  const c = i.startsWith("/") ? i : `/${i}`;
  let n = (t ?? "") + c;
  r && (n = S({ path: r, url: n }));
  let a = e ? s(e) : "";
  return a.startsWith("?") && (a = a.substring(1)), a && (n += `?${a}`), n;
};
function q(t) {
  const r = t.body !== void 0;
  if (r && t.bodySerializer)
    return "serializedBody" in t ? t.serializedBody !== void 0 && t.serializedBody !== "" ? t.serializedBody : null : t.body !== "" ? t.body : null;
  if (r)
    return t.body;
}
const w = async (t, r) => {
  const e = typeof r == "function" ? await r(t) : r;
  if (e)
    return t.scheme === "bearer" ? `Bearer ${e}` : t.scheme === "basic" ? `Basic ${btoa(e)}` : e;
}, b = ({
  parameters: t = {},
  ...r
} = {}) => (s) => {
  const i = [];
  if (s && typeof s == "object")
    for (const c in s) {
      const n = s[c];
      if (n == null)
        continue;
      const a = t[c] || r;
      if (Array.isArray(n)) {
        const o = h({
          allowReserved: a.allowReserved,
          explode: !0,
          name: c,
          style: "form",
          value: n,
          ...a.array
        });
        o && i.push(o);
      } else if (typeof n == "object") {
        const o = p({
          allowReserved: a.allowReserved,
          explode: !0,
          name: c,
          style: "deepObject",
          value: n,
          ...a.object
        });
        o && i.push(o);
      } else {
        const o = u({
          allowReserved: a.allowReserved,
          name: c,
          value: n
        });
        o && i.push(o);
      }
    }
  return i.join("&");
}, R = (t) => {
  var e;
  if (!t)
    return "stream";
  const r = (e = t.split(";")[0]) == null ? void 0 : e.trim();
  if (r) {
    if (r.startsWith("application/json") || r.endsWith("+json"))
      return "json";
    if (r === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some((s) => r.startsWith(s)))
      return "blob";
    if (r.startsWith("text/"))
      return "text";
  }
}, A = (t, r) => {
  var e, s;
  return r ? !!(t.headers.has(r) || (e = t.query) != null && e[r] || (s = t.headers.get("Cookie")) != null && s.includes(`${r}=`)) : !1;
}, C = async ({
  security: t,
  ...r
}) => {
  for (const e of t) {
    if (A(r, e.name))
      continue;
    const s = await w(e, r.auth);
    if (!s)
      continue;
    const i = e.name ?? "Authorization";
    switch (e.in) {
      case "query":
        r.query || (r.query = {}), r.query[i] = s;
        break;
      case "cookie":
        r.headers.append("Cookie", `${i}=${s}`);
        break;
      case "header":
      default:
        r.headers.set(i, s);
        break;
    }
  }
}, W = (t) => $({
  baseUrl: t.baseUrl,
  path: t.path,
  query: t.query,
  querySerializer: typeof t.querySerializer == "function" ? t.querySerializer : b(t.querySerializer),
  url: t.url
}), k = (t, r) => {
  var s;
  const e = { ...t, ...r };
  return (s = e.baseUrl) != null && s.endsWith("/") && (e.baseUrl = e.baseUrl.substring(0, e.baseUrl.length - 1)), e.headers = O(t.headers, r.headers), e;
}, I = (t) => {
  const r = [];
  return t.forEach((e, s) => {
    r.push([s, e]);
  }), r;
}, O = (...t) => {
  const r = new Headers();
  for (const e of t) {
    if (!e)
      continue;
    const s = e instanceof Headers ? I(e) : Object.entries(e);
    for (const [i, c] of s)
      if (c === null)
        r.delete(i);
      else if (Array.isArray(c))
        for (const n of c)
          r.append(i, n);
      else c !== void 0 && r.set(
        i,
        typeof c == "object" ? JSON.stringify(c) : c
      );
  }
  return r;
};
class f {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(r) {
    const e = this.getInterceptorIndex(r);
    this.fns[e] && (this.fns[e] = null);
  }
  exists(r) {
    const e = this.getInterceptorIndex(r);
    return !!this.fns[e];
  }
  getInterceptorIndex(r) {
    return typeof r == "number" ? this.fns[r] ? r : -1 : this.fns.indexOf(r);
  }
  update(r, e) {
    const s = this.getInterceptorIndex(r);
    return this.fns[s] ? (this.fns[s] = e, r) : !1;
  }
  use(r) {
    return this.fns.push(r), this.fns.length - 1;
  }
}
const E = () => ({
  error: new f(),
  request: new f(),
  response: new f()
}), B = b({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), U = {
  "Content-Type": "application/json"
}, v = (t = {}) => ({
  ...m,
  headers: U,
  parseAs: "auto",
  querySerializer: B,
  ...t
});
export {
  R as a,
  E as b,
  v as c,
  W as d,
  O as e,
  q as g,
  k as m,
  C as s
};
//# sourceMappingURL=utils.gen-BTePmXYR.js.map
