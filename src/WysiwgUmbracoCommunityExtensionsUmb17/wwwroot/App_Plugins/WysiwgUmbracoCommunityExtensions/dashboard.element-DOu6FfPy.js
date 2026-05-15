import { LitElement as g, html as n, css as m, state as c, customElement as _ } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as p } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as y } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as b } from "@umbraco-cms/backoffice/current-user";
import { W as u } from "./services.gen-ya8kz8Ij.js";
import { U as l } from "./types-eEpi63XY.js";
import { umbConfirmModal as f } from "@umbraco-cms/backoffice/modal";
import { S as w } from "./services.gen-DXgDAJ2g.js";
import { D as v } from "./constants-C2L7NEyy.js";
class C {
  constructor(t, s) {
    this._localize = t, this._notificationContext = s;
  }
  destroy() {
  }
  async getUmbracoVersion() {
    if (!this._notificationContext)
      return;
    const { data: t, error: s } = await w.getServerInformation();
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
    const { data: t, error: s } = await u.getUpdateStatusCode();
    if (s && (console.error(s), this._notificationContext && this._notificationContext.stay("danger", {
      data: {
        headline: this._localize.term("wysiwg_versionError"),
        message: `${this._localize.term("wysiwg_versionErrorDescription")} ${s}`
      }
    })), t !== void 0)
      return t;
  }
}
const x = "17.0.10", S = {
  version: x
};
var z = Object.defineProperty, U = Object.getOwnPropertyDescriptor, a = (e, t, s, o) => {
  for (var i = o > 1 ? void 0 : o ? U(t, s) : t, h = e.length - 1, d; h >= 0; h--)
    (d = e[h]) && (i = (o ? d(t, s, i) : d(i)) || i);
  return o && i && z(t, s, i), i;
};
let r = class extends p(g) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._variations = void 0, this._version = { major: 1, minor: 0, patch: 0 }, this._uninstalling = !1, this._varyByCulture = !1, this._varyBySegment = !1, this._debug = v, this._commonUtilities = void 0, this._notificationContext = void 0, this._onChangeCulture = (e) => {
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
        query: {
          culture: this._varyByCulture,
          segment: this._varyBySegment
        }
      }, { data: o, error: i } = await u.fixUpgrade(s);
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
      const { data: s, error: o } = await u.install();
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
      }), this._updateStatus = l.UpToDate, t.state = "success") : t.state = "failed");
    }, this._onClickUninstall = async (e) => {
      const t = e.target;
      if (!t || t.state === "waiting") return;
      const s = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: n`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await f(this, s), console.log("confirmed uninstall"), t.state = "waiting", this._uninstalling = !0;
      const { data: o, error: i } = await u.unInstall();
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
    }, this.consumeContext(y, (e) => {
      this._notificationContext = e, this._commonUtilities = new C(this.localize, e);
    }), this.consumeContext(b, (e) => {
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
    const { data: e, error: t } = await u.getVariations();
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
    return (e = this._contextCurrentUser) != null && e.isAdmin ? (this.setUpdateStatus(), this.setSemVersion(), this.getVariations(), n`${this.renderSetupBox()} ${this.renderUpdateBox()} ${this.renderVersionInfo()}`) : n`<umb-localize key="wysiwg_" .debug=${this._debug}>
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
    const e = S.version;
    return n`
      <div class="full-width footer-line">
        <p>Package version: ${e}</p>
      </div>
    `;
  }
  renderSetupBox() {
    if (this._updateStatus === void 0)
      return this.renderUninstallBox();
    if (this._updateStatus === l.UpToDate)
      return this.renderUninstallBox();
    const e = this._updateStatus === l.Install ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug }) : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug });
    return n`
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
    if (this._uninstalling || this._updateStatus === void 0 || this._updateStatus !== l.UpToDate)
      return;
    const e = this.localize.term("wysiwg_cultureSegmentButtonLabel", { debug: this._debug });
    return n`
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
    return this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0 ? n`
      <uui-checkbox
        disabled
        label="Vary by segment is not supported in Umbraco versions above 15.4"
        ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
      ` : n`
    <uui-checkbox
      label="Vary by segment"
      @change="${this._onChangeSegment}"
      ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
    `;
  }
  renderUninstallBox() {
    if (this._updateStatus === void 0 || this._updateStatus === l.Install)
      return;
    const e = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug });
    return n`
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
r.styles = [
  m`
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
a([
  c()
], r.prototype, "_contextCurrentUser", 2);
a([
  c()
], r.prototype, "_updateStatus", 2);
a([
  c()
], r.prototype, "_variations", 2);
a([
  c()
], r.prototype, "_version", 2);
a([
  c()
], r.prototype, "_uninstalling", 2);
r = a([
  _("wysiwg-dashboard")
], r);
const O = r;
export {
  r as WysiwgDashboardElement,
  O as default
};
//# sourceMappingURL=dashboard.element-DOu6FfPy.js.map
