import { LitElement as g, html as a, css as _, state as c, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as b } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as p } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as y } from "@umbraco-cms/backoffice/current-user";
import { W as u } from "./services.gen-ya8kz8Ij.js";
import { umbConfirmModal as f } from "@umbraco-cms/backoffice/modal";
import { D as w, C as v } from "./constants-D3ye2K2u.js";
var r = /* @__PURE__ */ ((t) => (t[t.Unknown = 0] = "Unknown", t[t.UpToDate = 1] = "UpToDate", t[t.Update = 2] = "Update", t[t.Install = 3] = "Install", t))(r || {}), C = Object.defineProperty, x = Object.getOwnPropertyDescriptor, l = (t, e, n, s) => {
  for (var i = s > 1 ? void 0 : s ? x(e, n) : e, h = t.length - 1, d; h >= 0; h--)
    (d = t[h]) && (i = (s ? d(e, n, i) : d(i)) || i);
  return s && i && C(e, n, i), i;
};
let o = class extends b(g) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._variations = void 0, this._uninstalling = !1, this._varyByCulture = !1, this._varyBySegment = !1, this._version = { major: 1, minor: 0, patch: 0 }, this._debug = w, this._commonUtilities = void 0, this._notificationContext = void 0, this._onChangeCulture = (t) => {
      const e = t.target;
      this._varyByCulture = e.checked;
    }, this._onChangeSegment = (t) => {
      const e = t.target;
      this._varyBySegment = e.checked;
    }, this._onClickUpdateSettings = async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting", (this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0) && (this._varyBySegment = !1);
      const n = {
        query: {
          culture: this._varyByCulture,
          segment: this._varyBySegment
        }
      }, { data: s, error: i } = await u.fixUpgrade(n);
      if (i)
        return this._notificationContext && this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_updateSettingsError"),
            message: `${this.localize.term("wysiwg_updateSettingsErrorDescription")} ${i}`
          }
        }), e.state = "failed", console.error(i), "error";
      s !== void 0 && (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_updateSettingsSuccess"),
          message: `${this.localize.term("wysiwg_updateSettingsSuccessDescription")}`
        }
      }), this.setVariations(s), e.state = "success");
    }, this._onClickInstall = async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting";
      const { data: n, error: s } = await u.install();
      if (s)
        return this._notificationContext && this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${s}`
          }
        }), e.state = "failed", console.error(s), "error";
      n !== void 0 && (n === "Installed" ? (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_installSuccess"),
          message: this.localize.term("wysiwg_installSuccessDescription")
        }
      }), this._updateStatus = r.UpToDate, e.state = "success") : e.state = "failed");
    }, this._onClickUninstall = async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      const n = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: a`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await f(this, n), console.log("confirmed uninstall"), e.state = "waiting", this._uninstalling = !0;
      const { data: s, error: i } = await u.unInstall();
      if (this._uninstalling = !1, i)
        return this._notificationContext && (this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${i}`
          }
        }), e.state = "failed"), console.error(i), "error";
      s !== void 0 && (s === "Uninstalled" ? (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
          message: this.localize.term("wysiwg_uninstallSuccessDescription")
        }
      }), e.state = "success") : e.state = "failed", this._updateStatus = void 0);
    }, this.consumeContext(p, (t) => {
      this._notificationContext = t, this._commonUtilities = new v(this.localize, this._notificationContext);
    }), this.consumeContext(y, (t) => {
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
    const { data: t, error: e } = await u.getVariations();
    if (e)
      return this._notificationContext && this._notificationContext.stay("danger", {
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
    return (t = this._contextCurrentUser) != null && t.isAdmin ? (this.setUpdateStatus(), this.setSemVersion(), this.getVariations(), a`${this.renderSetupBox()} ${this.renderUpdateBox()}`) : a`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
  }
  async setUpdateStatus() {
    var t;
    this._updateStatus || await ((t = this._commonUtilities) == null ? void 0 : t.getUpdateStatus(this._notificationContext).then((e) => {
      e && (this._updateStatus = e);
    }));
  }
  async setSemVersion() {
    var t;
    await ((t = this._commonUtilities) == null ? void 0 : t.getUmbracoVersion(this._notificationContext).then((e) => {
      e && (this._version = e);
    }));
  }
  renderSetupBox() {
    if (this._updateStatus === void 0)
      return this.renderUninstallBox();
    if (this._updateStatus === r.UpToDate)
      return this.renderUninstallBox();
    const t = this._updateStatus === r.Install ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug }) : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug });
    return a`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
      debug: this._debug
    })}>
        <uui-button
          color="positive"
          look="primary"
          @click="${this._onClickInstall}"
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
    if (this._uninstalling || this._updateStatus === void 0 || this._updateStatus !== r.UpToDate)
      return;
    const t = this.localize.term("wysiwg_cultureSegmentButtonLabel", { debug: this._debug });
    return a`
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
            @change="${this._onChangeCulture}"
            ?checked=${this._varyByCulture}>Vary by culture</uui-checkbox><br />
          ${this.renderSegmentCheckbox()}
        </p>
        <uui-button
          color="positive"
          look="primary"
          @click="${this._onClickUpdateSettings}"
        >
        ${t}
        </uui-button>
      </uui-box>
    `;
  }
  renderSegmentCheckbox() {
    return this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0 ? a`
      <uui-checkbox
        disabled
        ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
      ` : a`
    <uui-checkbox
      @change="${this._onChangeSegment}"
      ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
    `;
  }
  renderUninstallBox() {
    if (this._updateStatus === void 0 || this._updateStatus === r.Install)
      return;
    const t = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug });
    return a`
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
          @click="${this._onClickUninstall}"
        >
        ${t}
        </uui-button>
      </uui-box>
    `;
  }
};
o.styles = [
  _`
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
l([
  c()
], o.prototype, "_contextCurrentUser", 2);
l([
  c()
], o.prototype, "_updateStatus", 2);
l([
  c()
], o.prototype, "_variations", 2);
l([
  c()
], o.prototype, "_uninstalling", 2);
o = l([
  m("wysiwg-dashboard")
], o);
const S = o, T = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgDashboardElement() {
    return o;
  },
  default: S
}, Symbol.toStringTag, { value: "Module" }));
export {
  r as U,
  T as d
};
//# sourceMappingURL=dashboard.element-KXYT37Cl.js.map
