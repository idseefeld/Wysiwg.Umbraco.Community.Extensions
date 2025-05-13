import { LitElement as k, html as l, css as z, state as g, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as C } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as U } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as $ } from "@umbraco-cms/backoffice/current-user";
import { W as d } from "./services.gen-ya8kz8Ij.js";
import { umbConfirmModal as B } from "@umbraco-cms/backoffice/modal";
import { D as E, C as D } from "./constants-C13VoIZD.js";
var h = /* @__PURE__ */ ((t) => (t[t.Unknown = 0] = "Unknown", t[t.UpToDate = 1] = "UpToDate", t[t.Update = 2] = "Update", t[t.Install = 3] = "Install", t))(h || {}), T = Object.defineProperty, W = Object.getOwnPropertyDescriptor, f = (t) => {
  throw TypeError(t);
}, c = (t, e, a, r) => {
  for (var n = r > 1 ? void 0 : r ? W(e, a) : e, m = t.length - 1, _; m >= 0; m--)
    (_ = t[m]) && (n = (r ? _(e, a, n) : _(n)) || n);
  return r && n && T(e, a, n), n;
}, S = (t, e, a) => e.has(t) || f("Cannot " + a), i = (t, e, a) => (S(t, e, "read from private field"), e.get(t)), u = (t, e, a) => e.has(t) ? f("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, a), I = (t, e, a, r) => (S(t, e, "write to private field"), e.set(t, a), a), s, p, y, b, w, v;
let o = class extends C(k) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._variations = void 0, this._uninstalling = !1, this._varyByCulture = !1, this._varyBySegment = !1, this._version = { major: 1, minor: 0, patch: 0 }, this._debug = E, this._commonUtilities = void 0, u(this, s), u(this, p, (t) => {
      const e = t.target;
      this._varyByCulture = e.checked;
    }), u(this, y, (t) => {
      const e = t.target;
      this._varyBySegment = e.checked;
    }), u(this, b, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting", (this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0) && (this._varyBySegment = !1);
      const a = {
        query: {
          culture: this._varyByCulture,
          segment: this._varyBySegment
        }
      }, { data: r, error: n } = await d.fixUpgrade(a);
      if (n)
        return i(this, s) && i(this, s).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_updateSettingsError"),
            message: `${this.localize.term("wysiwg_updateSettingsErrorDescription")} ${n}`
          }
        }), e.state = "failed", console.error(n), "error";
      r !== void 0 && (i(this, s) && i(this, s).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_updateSettingsSuccess"),
          message: `${this.localize.term("wysiwg_updateSettingsSuccessDescription")}`
        }
      }), this.setVariations(r), e.state = "success");
    }), u(this, w, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting";
      const { data: a, error: r } = await d.install();
      if (r)
        return i(this, s) && i(this, s).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${r}`
          }
        }), e.state = "failed", console.error(r), "error";
      a !== void 0 && (a === "Installed" ? (i(this, s) && i(this, s).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_installSuccess"),
          message: this.localize.term("wysiwg_installSuccessDescription")
        }
      }), this._updateStatus = h.UpToDate, e.state = "success") : e.state = "failed");
    }), u(this, v, async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      const a = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: l`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await B(this, a), console.log("confirmed uninstall"), e.state = "waiting", this._uninstalling = !0;
      const { data: r, error: n } = await d.unInstall();
      if (this._uninstalling = !1, n)
        return i(this, s) && (i(this, s).stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${n}`
          }
        }), e.state = "failed"), console.error(n), "error";
      r !== void 0 && (r === "Uninstalled" ? (i(this, s) && i(this, s).peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
          message: this.localize.term("wysiwg_uninstallSuccessDescription")
        }
      }), e.state = "success") : e.state = "failed", this._updateStatus = void 0);
    }), this.consumeContext(U, (t) => {
      I(this, s, t), this._commonUtilities = new D(this.localize, t);
    }), this.consumeContext($, (t) => {
      if (!t) {
        this._contextCurrentUser = void 0;
        return;
      }
      this.observe(t.currentUser, (e) => {
        this._contextCurrentUser = e;
      });
    });
  }
  async getVariations() {
    const { data: t, error: e } = await d.getVariations();
    if (e)
      return i(this, s) && i(this, s).stay("danger", {
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
    return (t = this._contextCurrentUser) != null && t.isAdmin ? (this.setUpdateStatus(), this.setSemVersion(), this.getVariations(), l`${this.renderSetupBox()} ${this.renderUpdateBox()}`) : l`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
  }
  async setUpdateStatus() {
    var t;
    this._updateStatus || await ((t = this._commonUtilities) == null ? void 0 : t.getUpdateStatus(i(this, s)).then((e) => {
      e && (this._updateStatus = e);
    }));
  }
  async setSemVersion() {
    var t;
    await ((t = this._commonUtilities) == null ? void 0 : t.getUmbracoVersion(i(this, s)).then((e) => {
      e && (this._version = e);
    }));
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
          @click="${i(this, w)}"
        >
        ${t}
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
            This will update the culture and segment settings for the WYSIWYG BlockGrid element types.
          </p>
        </umb-localize>
        <p>
          <uui-checkbox
            @change="${i(this, p)}"
            ?checked=${this._varyByCulture}>Vary by culture</uui-checkbox><br />
          ${this.renderSegmentCheckbox()}
        </p>
        <uui-button
          color="positive"
          look="primary"
          @click="${i(this, b)}"
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
      @change="${i(this, y)}"
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
            This will remove the document and data types needed for WYSIWYG block
            editor views.
          </p>
        </umb-localize>
        <uui-button
          color="danger"
          look="primary"
          @click="${i(this, v)}"
        >
        ${t}
        </uui-button>
      </uui-box>
    `;
  }
};
s = /* @__PURE__ */ new WeakMap();
p = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakMap();
b = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakMap();
v = /* @__PURE__ */ new WeakMap();
o.styles = [
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
c([
  g()
], o.prototype, "_contextCurrentUser", 2);
c([
  g()
], o.prototype, "_updateStatus", 2);
c([
  g()
], o.prototype, "_variations", 2);
c([
  g()
], o.prototype, "_uninstalling", 2);
o = c([
  x("wysiwg-dashboard")
], o);
const O = o, P = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgDashboardElement() {
    return o;
  },
  default: O
}, Symbol.toStringTag, { value: "Module" }));
export {
  h as U,
  P as d
};
//# sourceMappingURL=dashboard.element-S6yezZM9.js.map
