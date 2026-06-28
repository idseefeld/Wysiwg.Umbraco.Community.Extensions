import { LitElement as Y, html as v, css as F, state as U, customElement as J } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as M } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as X } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as K } from "@umbraco-cms/backoffice/current-user";
import { g as Q, a as Z, b as tt, c as et, d as it } from "./sdk.gen-DoNa0lH6.js";
import { U as E } from "./types-eEpi63XY.js";
import { umbConfirmModal as st } from "@umbraco-cms/backoffice/modal";
import { m as q, c as A, g as P, a as at, b as rt, d as j, e as nt, s as ot } from "./utils.gen-BTePmXYR.js";
import { D as lt } from "./constants-C2L7NEyy.js";
function ct({
  onRequest: e,
  onSseError: t,
  onSseEvent: s,
  responseTransformer: o,
  responseValidator: i,
  sseDefaultRetryDelay: _,
  sseMaxRetryAttempts: w,
  sseMaxRetryDelay: g,
  sseSleepFn: m,
  url: B,
  ...r
}) {
  let a;
  const y = m ?? ((n) => new Promise((c) => setTimeout(c, n)));
  return { stream: async function* () {
    let n = _ ?? 3e3, c = 0;
    const f = r.signal ?? new AbortController().signal;
    for (; !f.aborted; ) {
      c++;
      const T = r.headers instanceof Headers ? r.headers : new Headers(r.headers);
      a !== void 0 && T.set("Last-Event-ID", a);
      try {
        const S = {
          redirect: "follow",
          ...r,
          body: r.serializedBody,
          headers: T,
          signal: f
        };
        let x = new Request(B, S);
        e && (x = await e(B, S));
        const u = await (r.fetch ?? globalThis.fetch)(x);
        if (!u.ok) throw new Error(`SSE failed: ${u.status} ${u.statusText}`);
        if (!u.body) throw new Error("No body in SSE response");
        const p = u.body.pipeThrough(new TextDecoderStream()).getReader();
        let d = "";
        const I = () => {
          try {
            p.cancel();
          } catch {
          }
        };
        f.addEventListener("abort", I);
        try {
          for (; ; ) {
            const { done: W, value: R } = await p.read();
            if (W) break;
            d += R, d = d.replace(/\r\n?/g, `
`);
            const O = d.split(`

`);
            d = O.pop() ?? "";
            for (const H of O) {
              const G = H.split(`
`), $ = [];
              let V;
              for (const b of G)
                if (b.startsWith("data:"))
                  $.push(b.replace(/^data:\s*/, ""));
                else if (b.startsWith("event:"))
                  V = b.replace(/^event:\s*/, "");
                else if (b.startsWith("id:"))
                  a = b.replace(/^id:\s*/, "");
                else if (b.startsWith("retry:")) {
                  const N = Number.parseInt(b.replace(/^retry:\s*/, ""), 10);
                  Number.isNaN(N) || (n = N);
                }
              let k, L = !1;
              if ($.length) {
                const b = $.join(`
`);
                try {
                  k = JSON.parse(b), L = !0;
                } catch {
                  k = b;
                }
              }
              L && (i && await i(k), o && (k = await o(k))), s == null || s({
                data: k,
                event: V,
                id: a,
                retry: n
              }), $.length && (yield k);
            }
          }
        } finally {
          f.removeEventListener("abort", I), p.releaseLock();
        }
        break;
      } catch (S) {
        if (t == null || t(S), w !== void 0 && c >= w)
          break;
        const x = Math.min(n * 2 ** (c - 1), g ?? 3e4);
        await y(x);
      }
    }
  }() };
}
const ut = (e = {}) => {
  let t = q(A(), e);
  const s = () => ({ ...t }), o = (r) => (t = q(t, r), s()), i = rt(), _ = async (r) => {
    const a = {
      ...t,
      ...r,
      fetch: r.fetch ?? t.fetch ?? globalThis.fetch,
      headers: nt(t.headers, r.headers),
      serializedBody: void 0
    };
    a.security && await ot({
      ...a,
      security: a.security
    }), a.requestValidator && await a.requestValidator(a), a.body !== void 0 && a.bodySerializer && (a.serializedBody = a.bodySerializer(a.body)), (a.body === void 0 || a.serializedBody === "") && a.headers.delete("Content-Type");
    const y = a, h = j(y);
    return { opts: y, url: h };
  }, w = async (r) => {
    const a = r.throwOnError ?? t.throwOnError, y = r.responseStyle ?? t.responseStyle;
    let h, l;
    try {
      const { opts: n, url: c } = await _(r), f = {
        redirect: "follow",
        ...n,
        body: P(n)
      };
      h = new Request(c, f);
      for (const u of i.request.fns)
        u && (h = await u(h, n));
      const T = n.fetch;
      l = await T(h);
      for (const u of i.response.fns)
        u && (l = await u(l, h, n));
      const S = {
        request: h,
        response: l
      };
      if (l.ok) {
        const u = (n.parseAs === "auto" ? at(l.headers.get("Content-Type")) : n.parseAs) ?? "json";
        if (l.status === 204 || l.headers.get("Content-Length") === "0") {
          let d;
          switch (u) {
            case "arrayBuffer":
            case "blob":
            case "text":
              d = await l[u]();
              break;
            case "formData":
              d = new FormData();
              break;
            case "stream":
              d = l.body;
              break;
            case "json":
            default:
              d = {};
              break;
          }
          return n.responseStyle === "data" ? d : {
            data: d,
            ...S
          };
        }
        let p;
        switch (u) {
          case "arrayBuffer":
          case "blob":
          case "formData":
          case "text":
            p = await l[u]();
            break;
          case "json": {
            const d = await l.text();
            p = d ? JSON.parse(d) : {};
            break;
          }
          case "stream":
            return n.responseStyle === "data" ? l.body : {
              data: l.body,
              ...S
            };
        }
        return u === "json" && (n.responseValidator && await n.responseValidator(p), n.responseTransformer && (p = await n.responseTransformer(p))), n.responseStyle === "data" ? p : {
          data: p,
          ...S
        };
      }
      const x = await l.text();
      let D;
      try {
        D = JSON.parse(x);
      } catch {
      }
      throw D ?? x;
    } catch (n) {
      let c = n;
      for (const f of i.error.fns)
        f && (c = await f(c, l, h, r));
      if (c = c || {}, a)
        throw c;
      return y === "data" ? void 0 : {
        error: c,
        request: h,
        response: l
      };
    }
  }, g = (r) => (a) => w({ ...a, method: r }), m = (r) => async (a) => {
    const { opts: y, url: h } = await _(a);
    return ct({
      ...y,
      body: y.body,
      method: r,
      onRequest: async (l, n) => {
        let c = new Request(l, n);
        for (const f of i.request.fns)
          f && (c = await f(c, y));
        return c;
      },
      serializedBody: P(y),
      url: h
    });
  };
  return {
    buildUrl: (r) => j({ ...t, ...r }),
    connect: g("CONNECT"),
    delete: g("DELETE"),
    get: g("GET"),
    getConfig: s,
    head: g("HEAD"),
    interceptors: i,
    options: g("OPTIONS"),
    patch: g("PATCH"),
    post: g("POST"),
    put: g("PUT"),
    request: w,
    setConfig: o,
    sse: {
      connect: m("CONNECT"),
      delete: m("DELETE"),
      get: m("GET"),
      head: m("HEAD"),
      options: m("OPTIONS"),
      patch: m("PATCH"),
      post: m("POST"),
      put: m("PUT"),
      trace: m("TRACE")
    },
    trace: g("TRACE")
  };
}, dt = ut(A()), ht = (e) => ((e == null ? void 0 : e.client) ?? dt).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/management/api/v1/server/information",
  ...e
});
class ft {
  constructor(t, s) {
    this._localize = t, this._notificationContext = s;
  }
  destroy() {
  }
  async getUmbracoVersion() {
    if (!this._notificationContext)
      return;
    const { data: t, error: s } = await ht();
    if (s) {
      console.error(s), this._notificationContext && this._notificationContext.stay("danger", {
        data: {
          headline: this._localize.term("wysiwg_serverInfoError"),
          message: `${this._localize.term("wysiwg_serverInfoErrorDescription")}`
        }
      });
      return;
    }
    if (t !== void 0) {
      const o = t, i = o == null ? void 0 : o.assemblyVersion.split(".");
      return {
        major: i.length > 0 ? parseInt(i[0]) : 1,
        minor: i.length > 1 ? parseInt(i[1]) : 0,
        patch: i.length > 2 ? parseInt(i[2]) : 0
      };
    }
  }
  async getUpdateStatus() {
    const { data: t, error: s } = await Q();
    if (s && (console.error(s), this._notificationContext && this._notificationContext.stay("danger", {
      data: {
        headline: this._localize.term("wysiwg_versionError"),
        message: `${this._localize.term("wysiwg_versionErrorDescription")} ${s}`
      }
    })), t !== void 0)
      return t;
  }
}
const gt = "18.0.0", mt = {
  version: gt
};
var yt = Object.defineProperty, pt = Object.getOwnPropertyDescriptor, z = (e, t, s, o) => {
  for (var i = o > 1 ? void 0 : o ? pt(t, s) : t, _ = e.length - 1, w; _ >= 0; _--)
    (w = e[_]) && (i = (o ? w(t, s, i) : w(i)) || i);
  return o && i && yt(t, s, i), i;
};
let C = class extends M(Y) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._variations = void 0, this._version = { major: 1, minor: 0, patch: 0 }, this._uninstalling = !1, this._varyByCulture = !1, this._varyBySegment = !1, this._debug = lt, this._commonUtilities = void 0, this._notificationContext = void 0, this._onChangeCulture = (e) => {
      const t = e.target;
      this._varyByCulture = t.checked;
    }, this._onChangeSegment = (e) => {
      const t = e.target;
      this._varyBySegment = t.checked;
    }, this._onClickUpdateSettings = async (e) => {
      const t = e.target;
      if (!t || t.state === "waiting") return;
      t.state = "waiting", (this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0) && (this._varyBySegment = !1);
      const s = {
        url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/fixupgrade",
        query: {
          culture: this._varyByCulture,
          segment: this._varyBySegment
        }
      }, { data: o, error: i } = await Z(s);
      if (i)
        return this._notificationContext && this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_updateSettingsError"),
            message: `${this.localize.term("wysiwg_updateSettingsErrorDescription")} ${i}`
          }
        }), t.state = "failed", console.error(i), "error";
      o !== void 0 && (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_updateSettingsSuccess"),
          message: `${this.localize.term("wysiwg_updateSettingsSuccessDescription")}`
        }
      }), this.setVariations(o), t.state = "success");
    }, this._onClickInstall = async (e) => {
      const t = e.target;
      if (!t || t.state === "waiting") return;
      t.state = "waiting";
      const { data: s, error: o } = await tt();
      if (o)
        return this._notificationContext && this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${o}`
          }
        }), t.state = "failed", console.error(o), "error";
      s !== void 0 && (s === "Installed" ? (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_installSuccess"),
          message: this.localize.term("wysiwg_installSuccessDescription")
        }
      }), this._updateStatus = E.UpToDate, t.state = "success") : t.state = "failed");
    }, this._onClickUninstall = async (e) => {
      const t = e.target;
      if (!t || t.state === "waiting") return;
      const s = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: v`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await st(this, s), console.log("confirmed uninstall"), t.state = "waiting", this._uninstalling = !0;
      const { data: o, error: i } = await et();
      if (this._uninstalling = !1, i)
        return this._notificationContext && (this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${i}`
          }
        }), t.state = "failed"), console.error(i), "error";
      o !== void 0 && (o === "Uninstalled" ? (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
          message: this.localize.term("wysiwg_uninstallSuccessDescription")
        }
      }), t.state = "success") : t.state = "failed", this._updateStatus = void 0);
    }, this.consumeContext(X, (e) => {
      this._notificationContext = e, this._commonUtilities = new ft(this.localize, e);
    }), this.consumeContext(K, (e) => {
      if (!e) {
        this._contextCurrentUser = void 0;
        return;
      }
      this.observe(e.currentUser, (t) => {
        this._contextCurrentUser = t;
      });
    });
  }
  async getVariations() {
    if (this._variations !== void 0) return;
    const { data: e, error: t } = await it();
    if (t)
      return this._notificationContext && this._notificationContext.stay("danger", {
        data: {
          headline: this.localize.term("wysiwg_variationsError"),
          message: `${this.localize.term("wysiwg_variationsErrorDescription")} ${t}`
        }
      }), "error";
    e !== void 0 && this.setVariations(e);
  }
  setVariations(e) {
    this._variations = e, this._varyByCulture = this._variations.indexOf("culture") !== -1, this._varyBySegment = this._variations.indexOf("segment") !== -1;
  }
  render() {
    var e;
    return (e = this._contextCurrentUser) != null && e.isAdmin ? (this.setUpdateStatus(), this.setSemVersion(), this.getVariations(), v`${this.renderSetupBox()} ${this.renderUpdateBox()} ${this.renderVersionInfo()}`) : v`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
  }
  async setUpdateStatus() {
    var e;
    this._updateStatus === void 0 && await ((e = this._commonUtilities) == null ? void 0 : e.getUpdateStatus().then((t) => {
      t && (this._updateStatus = t);
    }));
  }
  async setSemVersion() {
    var e;
    this._version.major > 1 || await ((e = this._commonUtilities) == null ? void 0 : e.getUmbracoVersion().then((t) => {
      t && (this._version = t);
    }));
  }
  renderVersionInfo() {
    const e = mt.version;
    return v`
      <div class="full-width footer-line">
        <p>Package version: ${e}</p>
      </div>
    `;
  }
  renderSetupBox() {
    if (this._updateStatus === void 0)
      return this.renderUninstallBox();
    if (this._updateStatus === E.UpToDate)
      return this.renderUninstallBox();
    const e = this._updateStatus === E.Install ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug }) : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug });
    return v`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
      debug: this._debug
    })}>
        <uui-button
          label=${e}
          color="positive"
          look="primary"
          @click="${this._onClickInstall}"
        >
        ${e}
        </uui-button>
        <div slot="header"></div>
        <umb-localize key="wysiwg_setupButtonDescription" .debug=${this._debug}>
          <p>
            This will create the document and data types needed for WYSIWYG block
            editor views.
          </p>
        </umb-localize>
      </uui-box>
    `;
  }
  renderUpdateBox() {
    if (this._uninstalling || this._updateStatus === void 0 || this._updateStatus !== E.UpToDate)
      return;
    const e = this.localize.term("wysiwg_cultureSegmentButtonLabel", { debug: this._debug });
    return v`
      <uui-box headline=${this.localize.term("wysiwg_cultureSegmentTitle", {
      debug: this._debug
    })}>
        <div slot="header"></div>
        <umb-localize key="wysiwg_cultureSegmentDescription" .debug=${this._debug}>
          <p>
            This will update the culture and segment settings for the WYSIWYG BlockGrid element types.
          </p>
        </umb-localize>
        <p>
          <uui-checkbox
            label="Vary by culture"
            @change="${this._onChangeCulture}"
            ?checked=${this._varyByCulture}>Vary by culture</uui-checkbox><br />
          ${this.renderSegmentCheckbox()}
        </p>
        <uui-button
          label=${e}
          color="positive"
          look="primary"
          @click="${this._onClickUpdateSettings}"
        >
        ${e}
        </uui-button>
      </uui-box>
    `;
  }
  renderSegmentCheckbox() {
    return this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0 ? v`
      <uui-checkbox
        disabled
        label="Vary by segment is not supported in Umbraco versions above 15.4"
        ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
      ` : v`
    <uui-checkbox
      label="Vary by segment"
      @change="${this._onChangeSegment}"
      ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
    `;
  }
  renderUninstallBox() {
    if (this._updateStatus === void 0 || this._updateStatus === E.Install)
      return;
    const e = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug });
    return v`
      <uui-box headline=${this.localize.term("wysiwg_uninstallTitle", {
      debug: this._debug
    })}>
        <div slot="header"></div>
        <umb-localize key="wysiwg_uninstallButtonDescription" .debug=${this._debug}>
          <p>
            This will remove the document and data types needed for WYSIWYG block
            editor views.
          </p>
        </umb-localize>
        <uui-button
          label=${e}
          color="danger"
          look="primary"
          @click="${this._onClickUninstall}"
        >
        ${e}
        </uui-button>
      </uui-box>
    `;
  }
};
C.styles = [
  F`
      :host {
        display: grid;
        gap: var(--uui-size-layout-1);
        padding: var(--uui-size-layout-1);
        grid-template-columns: 1fr 1fr 1fr;
      }

      uui-box {
        margin-bottom: var(--uui-size-layout-1);
      }

      h2 {
        margin-top: 0;
      }

      .wide {
        grid-column: span 3;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      .footer-line p{
        opacity: 0.6;
        margin: 0;
        padding: 0;
      }
    `
];
z([
  U()
], C.prototype, "_contextCurrentUser", 2);
z([
  U()
], C.prototype, "_updateStatus", 2);
z([
  U()
], C.prototype, "_variations", 2);
z([
  U()
], C.prototype, "_version", 2);
z([
  U()
], C.prototype, "_uninstalling", 2);
C = z([
  J("wysiwg-dashboard")
], C);
const Et = C;
export {
  C as WysiwgDashboardElement,
  Et as default
};
//# sourceMappingURL=dashboard.element-BVvL33-m.js.map
