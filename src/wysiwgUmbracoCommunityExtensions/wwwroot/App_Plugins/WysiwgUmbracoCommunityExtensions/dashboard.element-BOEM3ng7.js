import { LitElement as k, html as o, css as z, state as g, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as $ } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as C } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as U } from "@umbraco-cms/backoffice/current-user";
import { W as c } from "./services.gen-B_ebHh4e.js";
import { S as B } from "./services.gen-CS9qDZj5.js";
import { umbConfirmModal as E } from "@umbraco-cms/backoffice/modal";
var u = /* @__PURE__ */ ((t) => (t[t.Unknown = 0] = "Unknown", t[t.UpToDate = 1] = "UpToDate", t[t.Update = 2] = "Update", t[t.Install = 3] = "Install", t))(u || {}), I = Object.defineProperty, D = Object.getOwnPropertyDescriptor, v = (t) => {
  throw TypeError(t);
}, d = (t, e, r, s) => {
  for (var n = s > 1 ? void 0 : s ? D(e, r) : e, _ = t.length - 1, p; _ >= 0; _--)
    (p = t[_]) && (n = (s ? p(e, r, n) : p(n)) || n);
  return s && n && I(e, r, n), n;
}, S = (t, e, r) => e.has(t) || v("Cannot " + r), i = (t, e, r) => (S(t, e, "read from private field"), e.get(t)), h = (t, e, r) => e.has(t) ? v("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), T = (t, e, r, s) => (S(t, e, "write to private field"), e.set(t, r), r), a, m, y, w, b, f;
let l = class extends $(k) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._variations = void 0, this._serverInfo = void 0, this._varyByCulture = !1, this._varyBySegment = !1, this._majorVersion = 0, this._minorVersion = 0, this._patchVersion = 0, this._debug = !0, h(this, a), h(this, m, (t) => {
      const e = t.target;
      this._varyByCulture = e.checked;
    }), h(this, y, (t) => {
      const e = t.target;
      this._varyBySegment = e.checked;
    }), h(this, w, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting", this._majorVersion >= 15 && this._minorVersion >= 4 && this._patchVersion >= 0 && (this._varyBySegment = !1);
      const r = {
        query: {
          culture: this._varyByCulture,
          segment: this._varyBySegment
        }
      }, { data: s, error: n } = await c.fixUpgrade(r);
      if (n)
        return i(this, a) && i(this, a).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_updateSettingsError"),
            message: `${this.localize.term("wysiwg_updateSettingsErrorDescription")} ${n}`
          }
        }), e.state = "failed", console.error(n), "error";
      s !== void 0 && (i(this, a) && i(this, a).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_updateSettingsSuccess"),
          message: `${this.localize.term("wysiwg_updateSettingsSuccessDescription")}`
        }
      }), this.setVariations(s), e.state = "success");
    }), h(this, b, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting";
      const { data: r, error: s } = await c.install();
      if (s)
        return i(this, a) && i(this, a).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${s}`
          }
        }), e.state = "failed", console.error(s), "error";
      r !== void 0 && (r === "Installed" ? (i(this, a) && i(this, a).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_installSuccess"),
          message: this.localize.term("wysiwg_installSuccessDescription")
        }
      }), this._updateStatus = u.UpToDate, e.state = "success") : e.state = "failed");
    }), h(this, f, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      const r = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: o`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await E(this, r), console.log("confirmed uninstall"), e.state = "waiting", this._updateStatus = u.Install;
      const { data: s, error: n } = await c.unInstall();
      if (n)
        return i(this, a) && (i(this, a).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${n}`
          }
        }), e.state = "failed"), console.error(n), "error";
      s !== void 0 && (s === "Uninstalled" ? (i(this, a) && i(this, a).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
          message: this.localize.term("wysiwg_uninstallSuccessDescription")
        }
      }), e.state = "success") : e.state = "failed", this._updateStatus = void 0);
    }), this.consumeContext(C, (t) => {
      T(this, a, t);
    }), this.consumeContext(U, (t) => {
      this.observe(t.currentUser, (e) => {
        this._contextCurrentUser = e;
      });
    });
  }
  async getUpdateStatus() {
    if (this._updateStatus) return;
    const { data: t, error: e } = await c.getUpdateStatusCode();
    e && (console.error(e), i(this, a) && i(this, a).stay("danger", {
      data: {
        headline: this.localize.term("wysiwg_versionError"),
        message: `${this.localize.term("wysiwg_versionErrorDescription")} ${e}`
      }
    })), t !== void 0 && (this._updateStatus = t);
  }
  async getServerInfo() {
    var r;
    if (this._updateStatus) return;
    const { data: t, error: e } = await B.getServerInformation();
    if (e && (console.error(e), i(this, a) && i(this, a).stay("danger", {
      data: {
        headline: this.localize.term("wysiwg_serverInfoError"),
        message: `${this.localize.term("wysiwg_serverInfoErrorDescription")} ${e}`
      }
    })), t !== void 0) {
      this._serverInfo = t;
      const s = (r = this._serverInfo) == null ? void 0 : r.assemblyVersion.split(".");
      this._majorVersion = s.length > 0 ? parseInt(s[0]) : 0, this._minorVersion = s.length > 1 ? parseInt(s[1]) : 0, this._patchVersion = s.length > 2 ? parseInt(s[2]) : 0;
    }
  }
  async getVariations() {
    const { data: t, error: e } = await c.getVariations();
    if (e)
      return i(this, a) && i(this, a).stay("danger", {
        data: {
          headline: this.localize.term("wysiwg_variationsError"),
          message: `${this.localize.term("wysiwg_variationsErrorDescription")} ${e}`
        }
      }), "error";
    t !== void 0 && this.setVariations(t);
  }
  setVariations(t) {
    this._variations = t, this._varyByCulture = this._variations.indexOf("culture") !== -1, this._varyBySegment = this._variations.indexOf("segment") !== -1;
  }
  render() {
    var t;
    return (t = this._contextCurrentUser) != null && t.isAdmin ? (this.getUpdateStatus(), this.getServerInfo(), this.getVariations(), o`${this.renderSetupBox()} ${this.renderUpdateBox()}`) : o`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
  }
  renderSetupBox() {
    if (this._updateStatus === void 0)
      return this.renderUninstallBox();
    if (this._updateStatus === u.UpToDate)
      return this.renderUninstallBox();
    const t = this._updateStatus === u.Install ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug }) : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug });
    return o`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
      debug: this._debug
    })}>
        <uui-button
          color="positive"
          look="primary"
          @click="${i(this, b)}"
        >
        ${t}
        </uui-button>
        <div slot="header"></div>
        <umb-localize key="wysiwg_setupButtonDescription" .debug=${this._debug}>
          <p>
            This will create the document and data types needed for WYSIWG block
            editor views.
          </p>
        </umb-localize>
      </uui-box>
    `;
  }
  renderUpdateBox() {
    if (this._updateStatus === void 0 || this._updateStatus !== u.UpToDate)
      return;
    const t = this.localize.term("wysiwg_cultureSegmentButtonLabel", { debug: this._debug });
    return o`
      <uui-box headline=${this.localize.term("wysiwg_cultureSegmentTitle", {
      debug: this._debug
    })}>
        <div slot="header"></div>
        <umb-localize key="wysiwg_cultureSegmentDescription" .debug=${this._debug}>
          <p>
            This will update the culture and segment settings for the WYSIWG BlockGrid element types.
          </p>
        </umb-localize>
        <p>
          <uui-checkbox
            @change="${i(this, m)}"
            ?checked=${this._varyByCulture}>Vary by culture</uui-checkbox><br />
          ${this.renderSegmentCheckbox()}
        </p>
        <uui-button
          color="positive"
          look="primary"
          @click="${i(this, w)}"
        >
        ${t}
        </uui-button>
      </uui-box>
    `;
  }
  renderSegmentCheckbox() {
    return this._majorVersion > 15 || this._majorVersion === 15 && this._minorVersion >= 4 && this._patchVersion >= 0 ? o`
      <uui-checkbox
        disabled
        ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
      ` : o`
    <uui-checkbox
      @change="${i(this, y)}"
      ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
    `;
  }
  renderUninstallBox() {
    if (this._updateStatus === void 0 || this._updateStatus === u.Install)
      return;
    const t = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug });
    return o`
      <uui-box headline=${this.localize.term("wysiwg_uninstallTitle", {
      debug: this._debug
    })}>
        <div slot="header"></div>
        <umb-localize key="wysiwg_uninstallButtonDescription" .debug=${this._debug}>
          <p>
            This will remove the document and data types needed for WYSIWG block
            editor views.
          </p>
        </umb-localize>
        <uui-button
          color="danger"
          look="primary"
          @click="${i(this, f)}"
        >
        ${t}
        </uui-button>
      </uui-box>
    `;
  }
};
a = /* @__PURE__ */ new WeakMap();
m = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakMap();
b = /* @__PURE__ */ new WeakMap();
f = /* @__PURE__ */ new WeakMap();
l.styles = [
  z`
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
    `
];
d([
  g()
], l.prototype, "_contextCurrentUser", 2);
d([
  g()
], l.prototype, "_updateStatus", 2);
d([
  g()
], l.prototype, "_variations", 2);
d([
  g()
], l.prototype, "_serverInfo", 2);
l = d([
  x("wysiwg-dashboard")
], l);
const P = l;
export {
  l as WysiwgDashboardElement,
  P as default
};
//# sourceMappingURL=dashboard.element-BOEM3ng7.js.map
