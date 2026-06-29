const G = {
  bodySerializer: (r) => JSON.stringify(r, (e, t) => typeof t == "bigint" ? t.toString() : t)
};
function M({
  onRequest: r,
  onSseError: e,
  onSseEvent: t,
  responseTransformer: s,
  responseValidator: a,
  sseDefaultRetryDelay: c,
  sseMaxRetryAttempts: o,
  sseMaxRetryDelay: n,
  sseSleepFn: i,
  url: m,
  ...f
}) {
  let l;
  const g = i ?? ((d) => new Promise((h) => setTimeout(h, d)));
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
        r && (x = await r(m, E));
        const y = await (f.fetch ?? globalThis.fetch)(x);
        if (!y.ok) throw new Error(`SSE failed: ${y.status} ${y.statusText}`);
        if (!y.body) throw new Error("No body in SSE response");
        const S = y.body.pipeThrough(new TextDecoderStream()).getReader();
        let p = "";
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
            p += J, p = p.replace(/\r\n?/g, `
`);
            const $ = p.split(`

`);
            p = $.pop() ?? "";
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
              I && (a && await a(z), s && (z = await s(z))), t?.({
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
        if (e?.(E), o !== void 0 && h >= o)
          break;
        const x = Math.min(d * 2 ** (h - 1), n ?? 3e4);
        await g(x);
      }
    }
  }() };
}
const Q = (r) => {
  switch (r) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, K = (r) => {
  switch (r) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, X = (r) => {
  switch (r) {
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
  allowReserved: r,
  explode: e,
  name: t,
  style: s,
  value: a
}) => {
  if (!e) {
    const n = (r ? a : a.map((i) => encodeURIComponent(i))).join(K(s));
    switch (s) {
      case "label":
        return `.${n}`;
      case "matrix":
        return `;${t}=${n}`;
      case "simple":
        return n;
      default:
        return `${t}=${n}`;
    }
  }
  const c = Q(s), o = a.map((n) => s === "label" || s === "simple" ? r ? n : encodeURIComponent(n) : k({
    allowReserved: r,
    name: t,
    value: n
  })).join(c);
  return s === "label" || s === "matrix" ? c + o : o;
}, k = ({
  allowReserved: r,
  name: e,
  value: t
}) => {
  if (t == null)
    return "";
  if (typeof t == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${e}=${r ? t : encodeURIComponent(t)}`;
}, P = ({
  allowReserved: r,
  explode: e,
  name: t,
  style: s,
  value: a,
  valueOnly: c
}) => {
  if (a instanceof Date)
    return c ? a.toISOString() : `${t}=${a.toISOString()}`;
  if (s !== "deepObject" && !e) {
    let i = [];
    Object.entries(a).forEach(([f, l]) => {
      i = [...i, f, r ? l : encodeURIComponent(l)];
    });
    const m = i.join(",");
    switch (s) {
      case "form":
        return `${t}=${m}`;
      case "label":
        return `.${m}`;
      case "matrix":
        return `;${t}=${m}`;
      default:
        return m;
    }
  }
  const o = X(s), n = Object.entries(a).map(
    ([i, m]) => k({
      allowReserved: r,
      name: s === "deepObject" ? `${t}[${i}]` : i,
      value: m
    })
  ).join(o);
  return s === "label" || s === "matrix" ? o + n : n;
}, Y = /\{[^{}]+\}/g, Z = ({ path: r, url: e }) => {
  let t = e;
  const s = e.match(Y);
  if (s)
    for (const a of s) {
      let c = !1, o = a.substring(1, a.length - 1), n = "simple";
      o.endsWith("*") && (c = !0, o = o.substring(0, o.length - 1)), o.startsWith(".") ? (o = o.substring(1), n = "label") : o.startsWith(";") && (o = o.substring(1), n = "matrix");
      const i = r[o];
      if (i == null)
        continue;
      if (Array.isArray(i)) {
        t = t.replace(a, D({ explode: c, name: o, style: n, value: i }));
        continue;
      }
      if (typeof i == "object") {
        t = t.replace(
          a,
          P({
            explode: c,
            name: o,
            style: n,
            value: i,
            valueOnly: !0
          })
        );
        continue;
      }
      if (n === "matrix") {
        t = t.replace(
          a,
          `;${k({
            name: o,
            value: i
          })}`
        );
        continue;
      }
      const m = encodeURIComponent(
        n === "label" ? `.${i}` : i
      );
      t = t.replace(a, m);
    }
  return t;
}, ee = ({
  baseUrl: r,
  path: e,
  query: t,
  querySerializer: s,
  url: a
}) => {
  const c = a.startsWith("/") ? a : `/${a}`;
  let o = (r ?? "") + c;
  e && (o = Z({ path: e, url: o }));
  let n = t ? s(t) : "";
  return n.startsWith("?") && (n = n.substring(1)), n && (o += `?${n}`), o;
};
function U(r) {
  const e = r.body !== void 0;
  if (e && r.bodySerializer)
    return "serializedBody" in r ? r.serializedBody !== void 0 && r.serializedBody !== "" ? r.serializedBody : null : r.body !== "" ? r.body : null;
  if (e)
    return r.body;
}
const te = async (r, e) => {
  const t = typeof e == "function" ? await e(r) : e;
  if (t)
    return r.scheme === "bearer" ? `Bearer ${t}` : r.scheme === "basic" ? `Basic ${btoa(t)}` : t;
}, W = ({
  parameters: r = {},
  ...e
} = {}) => (s) => {
  const a = [];
  if (s && typeof s == "object")
    for (const c in s) {
      const o = s[c];
      if (o == null)
        continue;
      const n = r[c] || e;
      if (Array.isArray(o)) {
        const i = D({
          allowReserved: n.allowReserved,
          explode: !0,
          name: c,
          style: "form",
          value: o,
          ...n.array
        });
        i && a.push(i);
      } else if (typeof o == "object") {
        const i = P({
          allowReserved: n.allowReserved,
          explode: !0,
          name: c,
          style: "deepObject",
          value: o,
          ...n.object
        });
        i && a.push(i);
      } else {
        const i = k({
          allowReserved: n.allowReserved,
          name: c,
          value: o
        });
        i && a.push(i);
      }
    }
  return a.join("&");
}, re = (r) => {
  if (!r)
    return "stream";
  const e = r.split(";")[0]?.trim();
  if (e) {
    if (e.startsWith("application/json") || e.endsWith("+json"))
      return "json";
    if (e === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some((t) => e.startsWith(t)))
      return "blob";
    if (e.startsWith("text/"))
      return "text";
  }
}, se = (r, e) => e ? !!(r.headers.has(e) || r.query?.[e] || r.headers.get("Cookie")?.includes(`${e}=`)) : !1, ae = async ({
  security: r,
  ...e
}) => {
  for (const t of r) {
    if (se(e, t.name))
      continue;
    const s = await te(t, e.auth);
    if (!s)
      continue;
    const a = t.name ?? "Authorization";
    switch (t.in) {
      case "query":
        e.query || (e.query = {}), e.query[a] = s;
        break;
      case "cookie":
        e.headers.append("Cookie", `${a}=${s}`);
        break;
      default:
        e.headers.set(a, s);
        break;
    }
  }
}, N = (r) => ee({
  baseUrl: r.baseUrl,
  path: r.path,
  query: r.query,
  querySerializer: typeof r.querySerializer == "function" ? r.querySerializer : W(r.querySerializer),
  url: r.url
}), R = (r, e) => {
  const t = { ...r, ...e };
  return t.baseUrl?.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = H(r.headers, e.headers), t;
}, ne = (r) => {
  const e = [];
  return r.forEach((t, s) => {
    e.push([s, t]);
  }), e;
}, H = (...r) => {
  const e = new Headers();
  for (const t of r) {
    if (!t)
      continue;
    const s = t instanceof Headers ? ne(t) : Object.entries(t);
    for (const [a, c] of s)
      if (c === null)
        e.delete(a);
      else if (Array.isArray(c))
        for (const o of c)
          e.append(a, o);
      else c !== void 0 && e.set(
        a,
        typeof c == "object" ? JSON.stringify(c) : c
      );
  }
  return e;
};
class C {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(e) {
    const t = this.getInterceptorIndex(e);
    this.fns[t] && (this.fns[t] = null);
  }
  exists(e) {
    const t = this.getInterceptorIndex(e);
    return !!this.fns[t];
  }
  getInterceptorIndex(e) {
    return typeof e == "number" ? this.fns[e] ? e : -1 : this.fns.indexOf(e);
  }
  update(e, t) {
    const s = this.getInterceptorIndex(e);
    return this.fns[s] ? (this.fns[s] = t, e) : !1;
  }
  use(e) {
    return this.fns.push(e), this.fns.length - 1;
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
}, V = (r = {}) => ({
  ...G,
  headers: ce,
  parseAs: "auto",
  querySerializer: ie,
  ...r
}), le = (r = {}) => {
  let e = R(V(), r);
  const t = () => ({ ...e }), s = (f) => (e = R(e, f), t()), a = oe(), c = async (f) => {
    const l = {
      ...e,
      ...f,
      fetch: f.fetch ?? e.fetch ?? globalThis.fetch,
      headers: H(e.headers, f.headers),
      serializedBody: void 0
    };
    l.security && await ae({
      ...l,
      security: l.security
    }), l.requestValidator && await l.requestValidator(l), l.body !== void 0 && l.bodySerializer && (l.serializedBody = l.bodySerializer(l.body)), (l.body === void 0 || l.serializedBody === "") && l.headers.delete("Content-Type");
    const g = l, b = N(g);
    return { opts: g, url: b };
  }, o = async (f) => {
    const l = f.throwOnError ?? e.throwOnError, g = f.responseStyle ?? e.responseStyle;
    let b, u;
    try {
      const { opts: d, url: h } = await c(f), w = {
        redirect: "follow",
        ...d,
        body: U(d)
      };
      b = new Request(h, w);
      for (const y of a.request.fns)
        y && (b = await y(b, d));
      const O = d.fetch;
      u = await O(b);
      for (const y of a.response.fns)
        y && (u = await y(u, b, d));
      const E = {
        request: b,
        response: u
      };
      if (u.ok) {
        const y = (d.parseAs === "auto" ? re(u.headers.get("Content-Type")) : d.parseAs) ?? "json";
        if (u.status === 204 || u.headers.get("Content-Length") === "0") {
          let p;
          switch (y) {
            case "arrayBuffer":
            case "blob":
            case "text":
              p = await u[y]();
              break;
            case "formData":
              p = new FormData();
              break;
            case "stream":
              p = u.body;
              break;
            default:
              p = {};
              break;
          }
          return d.responseStyle === "data" ? p : {
            data: p,
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
            const p = await u.text();
            S = p ? JSON.parse(p) : {};
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
      for (const w of a.error.fns)
        w && (h = await w(h, u, b, f));
      if (h = h || {}, l)
        throw h;
      return g === "data" ? void 0 : {
        error: h,
        request: b,
        response: u
      };
    }
  }, n = (f) => (l) => o({ ...l, method: f }), i = (f) => async (l) => {
    const { opts: g, url: b } = await c(l);
    return M({
      ...g,
      body: g.body,
      method: f,
      onRequest: async (u, d) => {
        let h = new Request(u, d);
        for (const w of a.request.fns)
          w && (h = await w(h, g));
        return h;
      },
      serializedBody: U(g),
      url: b
    });
  };
  return {
    buildUrl: (f) => N({ ...e, ...f }),
    connect: n("CONNECT"),
    delete: n("DELETE"),
    get: n("GET"),
    getConfig: t,
    head: n("HEAD"),
    interceptors: a,
    options: n("OPTIONS"),
    patch: n("PATCH"),
    post: n("POST"),
    put: n("PUT"),
    request: o,
    setConfig: s,
    sse: {
      connect: i("CONNECT"),
      delete: i("DELETE"),
      get: i("GET"),
      head: i("HEAD"),
      options: i("OPTIONS"),
      patch: i("PATCH"),
      post: i("POST"),
      put: i("PUT"),
      trace: i("TRACE")
    },
    trace: n("TRACE")
  };
}, fe = le(V());
export {
  fe as c
};
//# sourceMappingURL=client.gen-v1-aVGe2.js.map
