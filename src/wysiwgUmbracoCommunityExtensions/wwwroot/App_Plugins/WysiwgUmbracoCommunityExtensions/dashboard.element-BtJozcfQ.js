import { LitElement as z, html as l, css as k, state as _, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as C } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as U } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as $ } from "@umbraco-cms/backoffice/current-user";
import { W as d } from "./services.gen-B_ebHh4e.js";
import { umbConfirmModal as B } from "@umbraco-cms/backoffice/modal";
import { S as E } from "./services.gen-CS9qDZj5.js";
var h = /* @__PURE__ */ ((t) => (t[t.Unknown = 0] = "Unknown", t[t.UpToDate = 1] = "UpToDate", t[t.Update = 2] = "Update", t[t.Install = 3] = "Install", t))(h || {});
class D {
  constructor(e, i) {
    this._localize = e, this._notificationContext = i;
  }
  async getUmbracoVersion(e) {
    if (!e)
      return;
    const { data: i, error: n } = await E.getServerInformation();
    if (n) {
      console.error(n), this._notificationContext && this._notificationContext.stay("danger", {
        data: {
          headline: this._localize.term("wysiwg_serverInfoError"),
          message: `${this._localize.term("wysiwg_serverInfoErrorDescription")}`
        }
      });
      return;
    }
    if (i !== void 0) {
      const r = i, o = r == null ? void 0 : r.assemblyVersion.split(".");
      return {
        major: o.length > 0 ? parseInt(o[0]) : 1,
        minor: o.length > 1 ? parseInt(o[1]) : 0,
        patch: o.length > 2 ? parseInt(o[2]) : 0
      };
    }
  }
}
var T = Object.defineProperty, I = Object.getOwnPropertyDescriptor, f = (t) => {
  throw TypeError(t);
}, g = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? I(e, i) : e, o = t.length - 1, m; o >= 0; o--)
    (m = t[o]) && (r = (n ? m(e, i, r) : m(r)) || r);
  return n && r && T(e, i, r), r;
}, S = (t, e, i) => e.has(t) || f("Cannot " + i), s = (t, e, i) => (S(t, e, "read from private field"), i ? i.call(t) : e.get(t)), c = (t, e, i) => e.has(t) ? f("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), W = (t, e, i, n) => (S(t, e, "write to private field"), e.set(t, i), i), a, p, y, w, b, v;
let u = class extends C(z) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._variations = void 0, this._uninstalling = !1, this._varyByCulture = !1, this._varyBySegment = !1, this._version = { major: 1, minor: 0, patch: 0 }, this._debug = !0, c(this, a), this._commonUtilities = void 0, c(this, p, (t) => {
      const e = t.target;
      this._varyByCulture = e.checked;
    }), c(this, y, (t) => {
      const e = t.target;
      this._varyBySegment = e.checked;
    }), c(this, w, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting", (this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0) && (this._varyBySegment = !1);
      const i = {
        query: {
          culture: this._varyByCulture,
          segment: this._varyBySegment
        }
      }, { data: n, error: r } = await d.fixUpgrade(i);
      if (r)
        return s(this, a) && s(this, a).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_updateSettingsError"),
            message: `${this.localize.term("wysiwg_updateSettingsErrorDescription")} ${r}`
          }
        }), e.state = "failed", console.error(r), "error";
      n !== void 0 && (s(this, a) && s(this, a).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_updateSettingsSuccess"),
          message: `${this.localize.term("wysiwg_updateSettingsSuccessDescription")}`
        }
      }), this.setVariations(n), e.state = "success");
    }), c(this, b, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting";
      const { data: i, error: n } = await d.install();
      if (n)
        return s(this, a) && s(this, a).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${n}`
          }
        }), e.state = "failed", console.error(n), "error";
      i !== void 0 && (i === "Installed" ? (s(this, a) && s(this, a).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_installSuccess"),
          message: this.localize.term("wysiwg_installSuccessDescription")
        }
      }), this._updateStatus = h.UpToDate, e.state = "success") : e.state = "failed");
    }), c(this, v, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      const i = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: l`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await B(this, i), console.log("confirmed uninstall"), e.state = "waiting", this._uninstalling = !0;
      const { data: n, error: r } = await d.unInstall();
      if (this._uninstalling = !1, r)
        return s(this, a) && (s(this, a).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${r}`
          }
        }), e.state = "failed"), console.error(r), "error";
      n !== void 0 && (n === "Uninstalled" ? (s(this, a) && s(this, a).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
          message: this.localize.term("wysiwg_uninstallSuccessDescription")
        }
      }), e.state = "success") : e.state = "failed", this._updateStatus = void 0);
    }), this.consumeContext(U, (t) => {
      W(this, a, t), this._commonUtilities = new D(this.localize, t);
    }), this.consumeContext($, (t) => {
      this.observe(t.currentUser, (e) => {
        this._contextCurrentUser = e;
      });
    });
  }
  async setSemVersion() {
    var t;
    await ((t = this._commonUtilities) == null ? void 0 : t.getUmbracoVersion(s(this, a)).then((e) => {
      e && (this._version = e);
    }));
  }
  async getUpdateStatus() {
    if (this._updateStatus) return;
    const { data: t, error: e } = await d.getUpdateStatusCode();
    e && (console.error(e), s(this, a) && s(this, a).stay("danger", {
      data: {
        headline: this.localize.term("wysiwg_versionError"),
        message: `${this.localize.term("wysiwg_versionErrorDescription")} ${e}`
      }
    })), t !== void 0 && (this._updateStatus = t);
  }
  // private async getServerInfo() {
  //   if (this._updateStatus) return;
  //   const { data, error } =
  //     await ServerService.getServerInformation();
  //   if (error) {
  //     console.error(error);
  //     if (this.#notificationContext) {
  //       this.#notificationContext.stay("danger", {
  //         data: {
  //           headline: this.localize.term("wysiwg_serverInfoError"),
  //           message: `${this.localize.term("wysiwg_serverInfoErrorDescription")} ${error}`,
  //         },
  //       });
  //     }
  //   }
  //   if (data !== undefined) {
  //     this._serverInfo = data;
  //     const assemblyVersion = this._serverInfo?.assemblyVersion.split(".");
  //     this._version.major = assemblyVersion.length > 0 ? parseInt(assemblyVersion[0]) : 0;
  //     this._version.minor = assemblyVersion.length > 1 ? parseInt(assemblyVersion[1]) : 0;
  //     this._version.patch = assemblyVersion.length > 2 ? parseInt(assemblyVersion[2]) : 0;
  //   }
  // }
  async getVariations() {
    const { data: t, error: e } = await d.getVariations();
    if (e)
      return s(this, a) && s(this, a).stay("danger", {
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
    return (t = this._contextCurrentUser) != null && t.isAdmin ? (this.getUpdateStatus(), this.setSemVersion(), this.getVariations(), l`${this.renderSetupBox()} ${this.renderUpdateBox()}`) : l`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
  }
  renderSetupBox() {
    if (this._updateStatus === void 0)
      return this.renderUninstallBox();
    if (this._updateStatus === h.UpToDate)
      return this.renderUninstallBox();
    const t = this._updateStatus === h.Install ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug }) : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug });
    return l`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
      debug: this._debug
    })}>
        <uui-button
          color="positive"
          look="primary"
          @click="${s(this, b)}"
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
    if (this._uninstalling || this._updateStatus === void 0 || this._updateStatus !== h.UpToDate)
      return;
    const t = this.localize.term("wysiwg_cultureSegmentButtonLabel", { debug: this._debug });
    return l`
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
            @change="${s(this, p)}"
            ?checked=${this._varyByCulture}>Vary by culture</uui-checkbox><br />
          ${this.renderSegmentCheckbox()}
        </p>
        <uui-button
          color="positive"
          look="primary"
          @click="${s(this, w)}"
        >
        ${t}
        </uui-button>
      </uui-box>
    `;
  }
  renderSegmentCheckbox() {
    return this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0 ? l`
      <uui-checkbox
        disabled
        ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
      ` : l`
    <uui-checkbox
      @change="${s(this, y)}"
      ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
    `;
  }
  renderUninstallBox() {
    if (this._updateStatus === void 0 || this._updateStatus === h.Install)
      return;
    const t = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug });
    return l`
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
          @click="${s(this, v)}"
        >
        ${t}
        </uui-button>
      </uui-box>
    `;
  }
};
a = /* @__PURE__ */ new WeakMap();
p = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakMap();
b = /* @__PURE__ */ new WeakMap();
v = /* @__PURE__ */ new WeakMap();
u.styles = [
  k`
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
g([
  _()
], u.prototype, "_contextCurrentUser", 2);
g([
  _()
], u.prototype, "_updateStatus", 2);
g([
  _()
], u.prototype, "_variations", 2);
g([
  _()
], u.prototype, "_uninstalling", 2);
u = g([
  x("wysiwg-dashboard")
], u);
const j = u;
export {
  u as WysiwgDashboardElement,
  j as default
};
//# sourceMappingURL=dashboard.element-BtJozcfQ.js.map
