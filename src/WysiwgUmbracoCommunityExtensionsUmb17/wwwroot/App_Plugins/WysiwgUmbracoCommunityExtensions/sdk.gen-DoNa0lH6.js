import { m as B, c as L, g as U, a as _, b as F, d as H, e as J, s as W } from "./utils.gen-D7-SejOI.js";
function G({
  onRequest: e,
  onSseError: l,
  onSseEvent: C,
  responseTransformer: x,
  responseValidator: g,
  sseDefaultRetryDelay: E,
  sseMaxRetryAttempts: k,
  sseMaxRetryDelay: d,
  sseSleepFn: f,
  url: N,
  ...a
}) {
  let t;
  const y = f ?? ((r) => new Promise((c) => setTimeout(c, r)));
  return { stream: async function* () {
    let r = E ?? 3e3, c = 0;
    const u = a.signal ?? new AbortController().signal;
    for (; !u.aborted; ) {
      c++;
      const S = a.headers instanceof Headers ? a.headers : new Headers(a.headers);
      t !== void 0 && S.set("Last-Event-ID", t);
      try {
        const h = {
          redirect: "follow",
          ...a,
          body: a.serializedBody,
          headers: S,
          signal: u
        };
        let v = new Request(N, h);
        e && (v = await e(N, h));
        const n = await (a.fetch ?? globalThis.fetch)(v);
        if (!n.ok) throw new Error(`SSE failed: ${n.status} ${n.statusText}`);
        if (!n.body) throw new Error("No body in SSE response");
        const m = n.body.pipeThrough(new TextDecoderStream()).getReader();
        let i = "";
        const p = () => {
          try {
            m.cancel();
          } catch {
          }
        };
        u.addEventListener("abort", p);
        try {
          for (; ; ) {
            const { done: j, value: z } = await m.read();
            if (j) break;
            i += z, i = i.replace(/\r\n?/g, `
`);
            const D = i.split(`

`);
            i = D.pop() ?? "";
            for (const R of D) {
              const V = R.split(`
`), q = [];
              let A;
              for (const b of V)
                if (b.startsWith("data:"))
                  q.push(b.replace(/^data:\s*/, ""));
                else if (b.startsWith("event:"))
                  A = b.replace(/^event:\s*/, "");
                else if (b.startsWith("id:"))
                  t = b.replace(/^id:\s*/, "");
                else if (b.startsWith("retry:")) {
                  const I = Number.parseInt(b.replace(/^retry:\s*/, ""), 10);
                  Number.isNaN(I) || (r = I);
                }
              let T, P = !1;
              if (q.length) {
                const b = q.join(`
`);
                try {
                  T = JSON.parse(b), P = !0;
                } catch {
                  T = b;
                }
              }
              P && (g && await g(T), x && (T = await x(T))), C == null || C({
                data: T,
                event: A,
                id: t,
                retry: r
              }), q.length && (yield T);
            }
          }
        } finally {
          u.removeEventListener("abort", p), m.releaseLock();
        }
        break;
      } catch (h) {
        if (l == null || l(h), k !== void 0 && c >= k)
          break;
        const v = Math.min(r * 2 ** (c - 1), d ?? 3e4);
        await y(v);
      }
    }
  }() };
}
const M = (e = {}) => {
  let l = B(L(), e);
  const C = () => ({ ...l }), x = (a) => (l = B(l, a), C()), g = F(), E = async (a) => {
    const t = {
      ...l,
      ...a,
      fetch: a.fetch ?? l.fetch ?? globalThis.fetch,
      headers: J(l.headers, a.headers),
      serializedBody: void 0
    };
    t.security && await W({
      ...t,
      security: t.security
    }), t.requestValidator && await t.requestValidator(t), t.body !== void 0 && t.bodySerializer && (t.serializedBody = t.bodySerializer(t.body)), (t.body === void 0 || t.serializedBody === "") && t.headers.delete("Content-Type");
    const y = t, o = H(y);
    return { opts: y, url: o };
  }, k = async (a) => {
    const t = a.throwOnError ?? l.throwOnError, y = a.responseStyle ?? l.responseStyle;
    let o, s;
    try {
      const { opts: r, url: c } = await E(a), u = {
        redirect: "follow",
        ...r,
        body: U(r)
      };
      o = new Request(c, u);
      for (const n of g.request.fns)
        n && (o = await n(o, r));
      const S = r.fetch;
      s = await S(o);
      for (const n of g.response.fns)
        n && (s = await n(s, o, r));
      const h = {
        request: o,
        response: s
      };
      if (s.ok) {
        const n = (r.parseAs === "auto" ? _(s.headers.get("Content-Type")) : r.parseAs) ?? "json";
        if (s.status === 204 || s.headers.get("Content-Length") === "0") {
          let i;
          switch (n) {
            case "arrayBuffer":
            case "blob":
            case "text":
              i = await s[n]();
              break;
            case "formData":
              i = new FormData();
              break;
            case "stream":
              i = s.body;
              break;
            case "json":
            default:
              i = {};
              break;
          }
          return r.responseStyle === "data" ? i : {
            data: i,
            ...h
          };
        }
        let m;
        switch (n) {
          case "arrayBuffer":
          case "blob":
          case "formData":
          case "text":
            m = await s[n]();
            break;
          case "json": {
            const i = await s.text();
            m = i ? JSON.parse(i) : {};
            break;
          }
          case "stream":
            return r.responseStyle === "data" ? s.body : {
              data: s.body,
              ...h
            };
        }
        return n === "json" && (r.responseValidator && await r.responseValidator(m), r.responseTransformer && (m = await r.responseTransformer(m))), r.responseStyle === "data" ? m : {
          data: m,
          ...h
        };
      }
      const v = await s.text();
      let O;
      try {
        O = JSON.parse(v);
      } catch {
      }
      throw O ?? v;
    } catch (r) {
      let c = r;
      for (const u of g.error.fns)
        u && (c = await u(c, s, o, a));
      if (c = c || {}, t)
        throw c;
      return y === "data" ? void 0 : {
        error: c,
        request: o,
        response: s
      };
    }
  }, d = (a) => (t) => k({ ...t, method: a }), f = (a) => async (t) => {
    const { opts: y, url: o } = await E(t);
    return G({
      ...y,
      body: y.body,
      method: a,
      onRequest: async (s, r) => {
        let c = new Request(s, r);
        for (const u of g.request.fns)
          u && (c = await u(c, y));
        return c;
      },
      serializedBody: U(y),
      url: o
    });
  };
  return {
    buildUrl: (a) => H({ ...l, ...a }),
    connect: d("CONNECT"),
    delete: d("DELETE"),
    get: d("GET"),
    getConfig: C,
    head: d("HEAD"),
    interceptors: g,
    options: d("OPTIONS"),
    patch: d("PATCH"),
    post: d("POST"),
    put: d("PUT"),
    request: k,
    setConfig: x,
    sse: {
      connect: f("CONNECT"),
      delete: f("DELETE"),
      get: f("GET"),
      head: f("HEAD"),
      options: f("OPTIONS"),
      patch: f("PATCH"),
      post: f("POST"),
      put: f("PUT"),
      trace: f("TRACE")
    },
    trace: d("TRACE")
  };
}, w = M(L({ baseUrl: "https://localhost:44313/" })), K = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/crops", ...e }), Q = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/fixupgrade", ...e }), X = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/imageurl", ...e }), Y = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/install", ...e }), Z = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/mediatypes", ...e }), ee = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/site-background-color", ...e }), te = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/uninstall", ...e }), ae = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/updateStatusCode", ...e }), re = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/v2-cropurl", ...e }), se = (e) => ((e == null ? void 0 : e.client) ?? w).get({ url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/variations", ...e });
export {
  Q as a,
  Y as b,
  te as c,
  se as d,
  re as e,
  X as f,
  ae as g,
  ee as h,
  Z as i,
  K as j
};
//# sourceMappingURL=sdk.gen-DoNa0lH6.js.map
