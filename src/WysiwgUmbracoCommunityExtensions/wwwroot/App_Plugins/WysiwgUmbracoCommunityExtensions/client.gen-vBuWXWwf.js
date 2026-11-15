const G = {
  bodySerializer: (e) => JSON.stringify(e, (t, r) => typeof r == "bigint" ? r.toString() : r)
};
function M({
  onRequest: e,
  onSseError: t,
  onSseEvent: r,
  responseTransformer: a,
  responseValidator: i,
  sseDefaultRetryDelay: c,
  sseMaxRetryAttempts: n,
  sseMaxRetryDelay: s,
  sseSleepFn: o,
  url: m,
  ...f
}) {
  let l;
  const g = o ?? ((d) => new Promise((h) => setTimeout(h, d)));
  return { stream: async function* () {
    let d = c ?? 3e3, h = 0;
    const w = f.signal ?? new AbortController().signal;
    for (; !w.aborted; ) {
      h++;
      const O = f.headers instanceof Headers ? f.headers : new Headers(f.headers);
      l !== void 0 && O.set("Last-Event-ID", l);
      try {
        const E = {
          redirect: "follow",
          ...f,
          body: f.serializedBody,
          headers: O,
          signal: w
        };
        let x = new Request(m, E);
        e && (x = await e(m, E));
        const y = await (f.fetch ?? globalThis.fetch)(x);
        if (!y.ok) throw new Error(`SSE failed: ${y.status} ${y.statusText}`);
        if (!y.body) throw new Error("No body in SSE response");
        const S = y.body.pipeThrough(new TextDecoderStream()).getReader();
        let b = "";
        const T = () => {
          try {
            S.cancel();
          } catch {
          }
        };
        w.addEventListener("abort", T);
        try {
          for (; ; ) {
            const { done: L, value: J } = await S.read();
            if (L) break;
            b += J, b = b.replace(/\r\n?/g, `
`);
            const $ = b.split(`

`);
            b = $.pop() ?? "";
            for (const _ of $) {
              const F = _.split(`
`), q = [];
              let v;
              for (const j of F)
                if (j.startsWith("data:"))
                  q.push(j.replace(/^data:\s*/, ""));
                else if (j.startsWith("event:"))
                  v = j.replace(/^event:\s*/, "");
                else if (j.startsWith("id:"))
                  l = j.replace(/^id:\s*/, "");
                else if (j.startsWith("retry:")) {
                  const B = Number.parseInt(j.replace(/^retry:\s*/, ""), 10);
                  Number.isNaN(B) || (d = B);
                }
              let z, I = !1;
              if (q.length) {
                const j = q.join(`
`);
                try {
                  z = JSON.parse(j), I = !0;
                } catch {
                  z = j;
                }
              }
              I && (i && await i(z), a && (z = await a(z))), r?.({
                data: z,
                event: v,
                id: l,
                retry: d
              }), q.length && (yield z);
            }
          }
        } finally {
          w.removeEventListener("abort", T), S.releaseLock();
        }
        break;
      } catch (E) {
        if (t?.(E), n !== void 0 && h >= n)
          break;
        const x = Math.min(d * 2 ** (h - 1), s ?? 3e4);
        await g(x);
      }
    }
  }() };
}
const Q = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, K = (e) => {
  switch (e) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, X = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, D = ({
  allowReserved: e,
  explode: t,
  name: r,
  style: a,
  value: i
}) => {
  if (!t) {
    const s = (e ? i : i.map((o) => encodeURIComponent(o))).join(K(a));
    switch (a) {
      case "label":
        return `.${s}`;
      case "matrix":
        return `;${r}=${s}`;
      case "simple":
        return s;
      default:
        return `${r}=${s}`;
    }
  }
  const c = Q(a), n = i.map((s) => a === "label" || a === "simple" ? e ? s : encodeURIComponent(s) : k({
    allowReserved: e,
    name: r,
    value: s
  })).join(c);
  return a === "label" || a === "matrix" ? c + n : n;
}, k = ({
  allowReserved: e,
  name: t,
  value: r
}) => {
  if (r == null)
    return "";
  if (typeof r == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${t}=${e ? r : encodeURIComponent(r)}`;
}, P = ({
  allowReserved: e,
  explode: t,
  name: r,
  style: a,
  value: i,
  valueOnly: c
}) => {
  if (i instanceof Date)
    return c ? i.toISOString() : `${r}=${i.toISOString()}`;
  if (a !== "deepObject" && !t) {
    let o = [];
    Object.entries(i).forEach(([f, l]) => {
      o = [...o, f, e ? l : encodeURIComponent(l)];
    });
    const m = o.join(",");
    switch (a) {
      case "form":
        return `${r}=${m}`;
      case "label":
        return `.${m}`;
      case "matrix":
        return `;${r}=${m}`;
      default:
        return m;
    }
  }
  const n = X(a), s = Object.entries(i).map(
    ([o, m]) => k({
      allowReserved: e,
      name: a === "deepObject" ? `${r}[${o}]` : o,
      value: m
    })
  ).join(n);
  return a === "label" || a === "matrix" ? n + s : s;
}, Y = /\{[^{}]+\}/g, Z = ({ path: e, url: t }) => {
  let r = t;
  const a = t.match(Y);
  if (a)
    for (const i of a) {
      let c = !1, n = i.substring(1, i.length - 1), s = "simple";
      n.endsWith("*") && (c = !0, n = n.substring(0, n.length - 1)), n.startsWith(".") ? (n = n.substring(1), s = "label") : n.startsWith(";") && (n = n.substring(1), s = "matrix");
      const o = e[n];
      if (o == null)
        continue;
      if (Array.isArray(o)) {
        r = r.replace(i, D({ explode: c, name: n, style: s, value: o }));
        continue;
      }
      if (typeof o == "object") {
        r = r.replace(
          i,
          P({
            explode: c,
            name: n,
            style: s,
            value: o,
            valueOnly: !0
          })
        );
        continue;
      }
      if (s === "matrix") {
        r = r.replace(
          i,
          `;${k({
            name: n,
            value: o
          })}`
        );
        continue;
      }
      const m = encodeURIComponent(
        s === "label" ? `.${o}` : o
      );
      r = r.replace(i, m);
    }
  return r;
}, ee = ({
  baseUrl: e,
  path: t,
  query: r,
  querySerializer: a,
  url: i
}) => {
  const c = i.startsWith("/") ? i : `/${i}`;
  let n = (e ?? "") + c;
  t && (n = Z({ path: t, url: n }));
  let s = r ? a(r) : "";
  return s.startsWith("?") && (s = s.substring(1)), s && (n += `?${s}`), n;
};
function U(e) {
  const t = e.body !== void 0;
  if (t && e.bodySerializer)
    return "serializedBody" in e ? e.serializedBody !== void 0 && e.serializedBody !== "" ? e.serializedBody : null : e.body !== "" ? e.body : null;
  if (t)
    return e.body;
}
const te = async (e, t) => {
  const r = typeof t == "function" ? await t(e) : t;
  if (r)
    return e.scheme === "bearer" ? `Bearer ${r}` : e.scheme === "basic" ? `Basic ${btoa(r)}` : r;
}, W = ({
  parameters: e = {},
  ...t
} = {}) => (a) => {
  const i = [];
  if (a && typeof a == "object")
    for (const c in a) {
      const n = a[c];
      if (n == null)
        continue;
      const s = e[c] || t;
      if (Array.isArray(n)) {
        const o = D({
          allowReserved: s.allowReserved,
          explode: !0,
          name: c,
          style: "form",
          value: n,
          ...s.array
        });
        o && i.push(o);
      } else if (typeof n == "object") {
        const o = P({
          allowReserved: s.allowReserved,
          explode: !0,
          name: c,
          style: "deepObject",
          value: n,
          ...s.object
        });
        o && i.push(o);
      } else {
        const o = k({
          allowReserved: s.allowReserved,
          name: c,
          value: n
        });
        o && i.push(o);
      }
    }
  return i.join("&");
}, re = (e) => {
  if (!e)
    return "stream";
  const t = e.split(";")[0]?.trim();
  if (t) {
    if (t.startsWith("application/json") || t.endsWith("+json"))
      return "json";
    if (t === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some((r) => t.startsWith(r)))
      return "blob";
    if (t.startsWith("text/"))
      return "text";
  }
}, se = (e, t) => t ? !!(e.headers.has(t) || e.query?.[t] || e.headers.get("Cookie")?.includes(`${t}=`)) : !1;
async function ae(e) {
  for (const t of e.security ?? []) {
    if (se(e, t.name))
      continue;
    const r = await te(t, e.auth);
    if (!r)
      continue;
    const a = t.name ?? "Authorization";
    switch (t.in) {
      case "query":
        e.query || (e.query = {}), e.query[a] = r;
        break;
      case "cookie":
        e.headers.append("Cookie", `${a}=${r}`);
        break;
      default:
        e.headers.set(a, r);
        break;
    }
  }
}
const N = (e) => ee({
  baseUrl: e.baseUrl,
  path: e.path,
  query: e.query,
  querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : W(e.querySerializer),
  url: e.url
}), R = (e, t) => {
  const r = { ...e, ...t };
  return r.baseUrl?.endsWith("/") && (r.baseUrl = r.baseUrl.substring(0, r.baseUrl.length - 1)), r.headers = H(e.headers, t.headers), r;
}, ne = (e) => {
  const t = [];
  return e.forEach((r, a) => {
    t.push([a, r]);
  }), t;
}, H = (...e) => {
  const t = new Headers();
  for (const r of e) {
    if (!r)
      continue;
    const a = r instanceof Headers ? ne(r) : Object.entries(r);
    for (const [i, c] of a)
      if (c === null)
        t.delete(i);
      else if (Array.isArray(c))
        for (const n of c)
          t.append(i, n);
      else c !== void 0 && t.set(
        i,
        typeof c == "object" ? JSON.stringify(c) : c
      );
  }
  return t;
};
class C {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(t) {
    const r = this.getInterceptorIndex(t);
    this.fns[r] && (this.fns[r] = null);
  }
  exists(t) {
    const r = this.getInterceptorIndex(t);
    return !!this.fns[r];
  }
  getInterceptorIndex(t) {
    return typeof t == "number" ? this.fns[t] ? t : -1 : this.fns.indexOf(t);
  }
  update(t, r) {
    const a = this.getInterceptorIndex(t);
    return this.fns[a] ? (this.fns[a] = r, t) : !1;
  }
  use(t) {
    return this.fns.push(t), this.fns.length - 1;
  }
}
const oe = () => ({
  error: new C(),
  request: new C(),
  response: new C()
}), ie = W({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), ce = {
  "Content-Type": "application/json"
}, V = (e = {}) => ({
  ...G,
  headers: ce,
  parseAs: "auto",
  querySerializer: ie,
  ...e
}), le = (e = {}) => {
  let t = R(V(), e);
  const r = () => ({ ...t }), a = (f) => (t = R(t, f), r()), i = oe(), c = async (f) => {
    const l = {
      ...t,
      ...f,
      fetch: f.fetch ?? t.fetch ?? globalThis.fetch,
      headers: H(t.headers, f.headers),
      serializedBody: void 0
    };
    l.security && await ae(l), l.requestValidator && await l.requestValidator(l), l.body !== void 0 && l.bodySerializer && (l.serializedBody = l.bodySerializer(l.body)), (l.body === void 0 || l.serializedBody === "") && l.headers.delete("Content-Type");
    const g = l, p = N(g);
    return { opts: g, url: p };
  }, n = async (f) => {
    const l = f.throwOnError ?? t.throwOnError, g = f.responseStyle ?? t.responseStyle;
    let p, u;
    try {
      const { opts: d, url: h } = await c(f), w = {
        redirect: "follow",
        ...d,
        body: U(d)
      };
      p = new Request(h, w);
      for (const y of i.request.fns)
        y && (p = await y(p, d));
      const O = d.fetch;
      u = await O(p);
      for (const y of i.response.fns)
        y && (u = await y(u, p, d));
      const E = {
        request: p,
        response: u
      };
      if (u.ok) {
        const y = (d.parseAs === "auto" ? re(u.headers.get("Content-Type")) : d.parseAs) ?? "json";
        if (u.status === 204 || u.headers.get("Content-Length") === "0") {
          let b;
          switch (y) {
            case "arrayBuffer":
            case "blob":
            case "text":
              b = await u[y]();
              break;
            case "formData":
              b = new FormData();
              break;
            case "stream":
              b = u.body;
              break;
            default:
              b = {};
              break;
          }
          return d.responseStyle === "data" ? b : {
            data: b,
            ...E
          };
        }
        let S;
        switch (y) {
          case "arrayBuffer":
          case "blob":
          case "formData":
          case "text":
            S = await u[y]();
            break;
          case "json": {
            const b = await u.text();
            S = b ? JSON.parse(b) : {};
            break;
          }
          case "stream":
            return d.responseStyle === "data" ? u.body : {
              data: u.body,
              ...E
            };
        }
        return y === "json" && (d.responseValidator && await d.responseValidator(S), d.responseTransformer && (S = await d.responseTransformer(S))), d.responseStyle === "data" ? S : {
          data: S,
          ...E
        };
      }
      const x = await u.text();
      let A;
      try {
        A = JSON.parse(x);
      } catch {
      }
      throw A ?? x;
    } catch (d) {
      let h = d;
      for (const w of i.error.fns)
        w && (h = await w(h, u, p, f));
      if (h = h || {}, l)
        throw h;
      return g === "data" ? void 0 : {
        error: h,
        request: p,
        response: u
      };
    }
  }, s = (f) => (l) => n({ ...l, method: f }), o = (f) => async (l) => {
    const { opts: g, url: p } = await c(l);
    return M({
      ...g,
      body: g.body,
      method: f,
      onRequest: async (u, d) => {
        let h = new Request(u, d);
        for (const w of i.request.fns)
          w && (h = await w(h, g));
        return h;
      },
      serializedBody: U(g),
      url: p
    });
  };
  return {
    buildUrl: (f) => N({ ...t, ...f }),
    connect: s("CONNECT"),
    delete: s("DELETE"),
    get: s("GET"),
    getConfig: r,
    head: s("HEAD"),
    interceptors: i,
    options: s("OPTIONS"),
    patch: s("PATCH"),
    post: s("POST"),
    put: s("PUT"),
    request: n,
    setConfig: a,
    sse: {
      connect: o("CONNECT"),
      delete: o("DELETE"),
      get: o("GET"),
      head: o("HEAD"),
      options: o("OPTIONS"),
      patch: o("PATCH"),
      post: o("POST"),
      put: o("PUT"),
      trace: o("TRACE")
    },
    trace: s("TRACE")
  };
}, fe = le(V({ baseUrl: "https://localhost:44313/" }));
export {
  fe as c
};
//# sourceMappingURL=client.gen-vBuWXWwf.js.map
