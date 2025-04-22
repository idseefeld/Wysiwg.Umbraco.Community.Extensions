import { LitElement as y, html as l, css as v, state as w, customElement as z } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as U } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as C } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as x } from "@umbraco-cms/backoffice/current-user";
import { W as h } from "./services.gen-mcYb1gDV.js";
import { umbConfirmModal as E } from "@umbraco-cms/backoffice/modal";
var u = /* @__PURE__ */ ((t) => (t[t.Unknown = 0] = "Unknown", t[t.UpToDate = 1] = "UpToDate", t[t.Update = 2] = "Update", t[t.Install = 3] = "Install", t))(u || {}), S = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, b = (t) => {
  throw TypeError(t);
}, _ = (t, e, i, a) => {
  for (var o = a > 1 ? void 0 : a ? $(e, i) : e, d = t.length - 1, c; d >= 0; d--)
    (c = t[d]) && (o = (a ? c(e, i, o) : c(o)) || o);
  return a && o && S(e, i, o), o;
}, f = (t, e, i) => e.has(t) || b("Cannot " + i), r = (t, e, i) => (f(t, e, "read from private field"), e.get(t)), p = (t, e, i) => e.has(t) ? b("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), D = (t, e, i, a) => (f(t, e, "write to private field"), e.set(t, i), i), s, g, m;
let n = class extends U(y) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._debug = !0, p(this, s), p(this, g, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting";
      const { data: i, error: a } = await h.install();
      if (a)
        return r(this, s) && r(this, s).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${a}`
          }
        }), e.state = "failed", console.error(a), "error";
      i !== void 0 && (i === "Installed" ? (r(this, s) && r(this, s).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_installSuccess"),
          message: this.localize.term("wysiwg_installSuccessDescription")
        }
      }), this._updateStatus = u.UpToDate, e.state = "success") : e.state = "failed");
    }), this.confirmUninstall = async () => {
    }, p(this, m, async (t) => {
      const e = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: l`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await E(this, e);
      const i = t.target;
      if (!i || i.state === "waiting") return;
      i.state = "waiting";
      const { data: a, error: o } = await h.unInstall();
      if (o)
        return r(this, s) && (r(this, s).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${o}`
          }
        }), i.state = "failed"), console.error(o), "error";
      a !== void 0 && (a === "Uninstalled" ? (r(this, s) && r(this, s).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
          message: this.localize.term("wysiwg_uninstallSuccessDescription")
        }
      }), i.state = "success") : i.state = "failed", this._updateStatus = void 0);
    }), this.consumeContext(C, (t) => {
      D(this, s, t);
    }), this.consumeContext(x, (t) => {
      this.observe(t.currentUser, (e) => {
        this._contextCurrentUser = e;
      });
    });
  }
  async getUpdateStatus() {
    if (this._updateStatus) return;
    const { data: t, error: e } = await h.getUpdateStatusCode();
    e && (console.error(e), r(this, s) && r(this, s).stay("danger", {
      data: {
        headline: this.localize.term("wysiwg_versionError"),
        message: `${this.localize.term("wysiwg_versionErrorDescription")} ${e}`
      }
    })), t !== void 0 && (this._updateStatus = t);
  }
  render() {
    var t;
    return (t = this._contextCurrentUser) != null && t.isAdmin ? (this.getUpdateStatus(), l`${this.renderSetupBox()} ${this.renderUninstallBox()}`) : l`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
  }
  renderSetupBox() {
    if (this._updateStatus === void 0 || this._updateStatus === u.UpToDate)
      return;
    const t = this._updateStatus === u.Install ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug }) : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug });
    return l`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
      debug: this._debug
    })}>
        <uui-button
          color="positive"
          look="primary"
          @click="${r(this, g)}"
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
  renderUninstallBox() {
    if (this._updateStatus === void 0 || this._updateStatus === u.Install)
      return;
    const t = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug });
    return l`
      <uui-box headline=${this.localize.term("wysiwg_uninstallTitle", {
      debug: this._debug
    })}>
        <uui-button
          color="danger"
          look="primary"
          @click="${r(this, m)}"
        >
        ${t}
        </uui-button>
        <div slot="header"></div>
        <umb-localize key="wysiwg_uninstallButtonDescription" .debug=${this._debug}>
          <p>
            This will remove the document and data types needed for WYSIWG block
            editor views.
          </p>
        </umb-localize>
      </uui-box>
    `;
  }
};
s = /* @__PURE__ */ new WeakMap();
g = /* @__PURE__ */ new WeakMap();
m = /* @__PURE__ */ new WeakMap();
n.styles = [
  v`
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
_([
  w()
], n.prototype, "_contextCurrentUser", 2);
_([
  w()
], n.prototype, "_updateStatus", 2);
n = _([
  z("wysiwg-dashboard")
], n);
const O = n;
export {
  n as WysiwgDashboardElement,
  O as default
};
//# sourceMappingURL=dashboard.element-k3NXgfvx.js.map
