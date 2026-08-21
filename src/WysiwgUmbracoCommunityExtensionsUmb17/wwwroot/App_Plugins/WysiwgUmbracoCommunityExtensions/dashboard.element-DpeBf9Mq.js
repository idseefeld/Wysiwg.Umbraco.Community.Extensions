import { LitElement as d, html as o, css as g, state as u, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as _ } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as p } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as f } from "@umbraco-cms/backoffice/current-user";
import { g as b, a as y, b as w, c as v, d as x } from "./sdk.gen-CBXr3l_Z.js";
import { U as l } from "./types-eEpi63XY.js";
import { umbConfirmModal as C } from "@umbraco-cms/backoffice/modal";
import { c as S } from "./client.gen-Cmrrvp-8.js";
import { D as z } from "./constants-B4oFBJqb.js";
const U = (t) => (t?.client ?? S).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/umbraco/management/api/v1/server/information",
  ...t
});
class $ {
  constructor(e, s) {
    this._localize = e, this._notificationContext = s;
  }
  destroy() {
  }
  async getUmbracoVersion() {
    if (!this._notificationContext)
      return;
    const { data: e, error: s } = await U();
    if (s) {
      console.error(s), this._notificationContext && this._notificationContext.stay("danger", {
        data: {
          headline: this._localize.term("wysiwg_serverInfoError"),
          message: `${this._localize.term("wysiwg_serverInfoErrorDescription")}`
        }
      });
      return;
    }
    if (e !== void 0) {
      const i = e?.assemblyVersion.split(".");
      return {
        major: i.length > 0 ? parseInt(i[0]) : 1,
        minor: i.length > 1 ? parseInt(i[1]) : 0,
        patch: i.length > 2 ? parseInt(i[2]) : 0
      };
    }
  }
  async getUpdateStatus() {
    const { data: e, error: s } = await b();
    if (s && (console.error(s), this._notificationContext && this._notificationContext.stay("danger", {
      data: {
        headline: this._localize.term("wysiwg_versionError"),
        message: `${this._localize.term("wysiwg_versionErrorDescription")} ${s}`
      }
    })), e !== void 0)
      return e;
  }
}
const k = "18.1.0-rc2", B = {
  version: k
};
var E = Object.defineProperty, D = Object.getOwnPropertyDescriptor, a = (t, e, s, n) => {
  for (var i = n > 1 ? void 0 : n ? D(e, s) : e, c = t.length - 1, h; c >= 0; c--)
    (h = t[c]) && (i = (n ? h(e, s, i) : h(i)) || i);
  return n && i && E(e, s, i), i;
};
let r = class extends _(d) {
  constructor() {
    super(), this._contextCurrentUser = void 0, this._updateStatus = void 0, this._variations = void 0, this._version = { major: 1, minor: 0, patch: 0 }, this._uninstalling = !1, this._varyByCulture = !1, this._varyBySegment = !1, this._debug = z, this._commonUtilities = void 0, this._notificationContext = void 0, this._onChangeCulture = (t) => {
      const e = t.target;
      this._varyByCulture = e.checked;
    }, this._onChangeSegment = (t) => {
      const e = t.target;
      this._varyBySegment = e.checked;
    }, this._onClickUpdateSettings = async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting", (this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0) && (this._varyBySegment = !1);
      const s = {
        url: "/api/v1/wysiwg/fixupgrade",
        query: {
          culture: this._varyByCulture,
          segment: this._varyBySegment
        }
      }, { data: n, error: i } = await y(s);
      if (i)
        return this._notificationContext && this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_updateSettingsError"),
            message: `${this.localize.term("wysiwg_updateSettingsErrorDescription")} ${i}`
          }
        }), e.state = "failed", console.error(i), "error";
      n !== void 0 && (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_updateSettingsSuccess"),
          message: `${this.localize.term("wysiwg_updateSettingsSuccessDescription")}`
        }
      }), this.setVariations(n), e.state = "success");
    }, this._onClickInstall = async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      e.state = "waiting";
      const { data: s, error: n } = await w();
      if (n)
        return this._notificationContext && this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_installError"),
            message: `${this.localize.term("wysiwg_installErrorDescription")} ${n}`
          }
        }), e.state = "failed", console.error(n), "error";
      s !== void 0 && (s === "Installed" ? (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_installSuccess"),
          message: this.localize.term("wysiwg_installSuccessDescription")
        }
      }), this._updateStatus = l.UpToDate, e.state = "success") : e.state = "failed");
    }, this._onClickUninstall = async (t) => {
      const e = t.target;
      if (!e || e.state === "waiting") return;
      const s = {
        color: "danger",
        headline: this.localize.term("wysiwg_unistallConfirmHeadline", { debug: this._debug }),
        content: o`${this.localize.term("wysiwg_uninstallConfirmDescription", { debug: this._debug })}`,
        confirmLabel: this.localize.term("wysiwg_okConfirmButtonLabel", { debug: this._debug }),
        cancelLabel: this.localize.term("wysiwg_cancelConfirmButtonLabel", { debug: this._debug })
      };
      await C(this, s), console.log("confirmed uninstall"), e.state = "waiting", this._uninstalling = !0;
      const { data: n, error: i } = await v();
      if (this._uninstalling = !1, i)
        return this._notificationContext && (this._notificationContext.stay("danger", {
          data: {
            headline: this.localize.term("wysiwg_uninstallError"),
            message: `${this.localize.term("wysiwg_uninstallErrorDescription")} ${i}`
          }
        }), e.state = "failed"), console.error(i), "error";
      n !== void 0 && (n === "Uninstalled" ? (this._notificationContext && this._notificationContext.peek("positive", {
        data: {
          headline: this.localize.term("wysiwg_uninstallSuccessTitle"),
          message: this.localize.term("wysiwg_uninstallSuccessDescription")
        }
      }), e.state = "success") : e.state = "failed", this._updateStatus = void 0);
    }, this.consumeContext(p, (t) => {
      this._notificationContext = t, this._commonUtilities = new $(this.localize, t);
    }), this.consumeContext(f, (t) => {
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
    if (this._variations !== void 0) return;
    const { data: t, error: e } = await x();
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
    return this._contextCurrentUser?.isAdmin ? (this.setUpdateStatus(), this.setSemVersion(), this.getVariations(), o`${this.renderSetupBox()} ${this.renderUpdateBox()} ${this.renderVersionInfo()}`) : o`<umb-localize key="wysiwg_" .debug=${this._debug}>
      <p>Only admins can see this dashboard</p>
      </umb-localize>`;
  }
  async setUpdateStatus() {
    this._updateStatus === void 0 && await this._commonUtilities?.getUpdateStatus().then((t) => {
      t && (this._updateStatus = t);
    });
  }
  async setSemVersion() {
    this._version.major > 1 || await this._commonUtilities?.getUmbracoVersion().then((t) => {
      t && (this._version = t);
    });
  }
  renderVersionInfo() {
    const t = B.version;
    return o`
      <div class="full-width footer-line">
        <p>Package version: ${t}</p>
      </div>
    `;
  }
  renderSetupBox() {
    if (this._updateStatus === void 0)
      return this.renderUninstallBox();
    if (this._updateStatus === l.UpToDate)
      return this.renderUninstallBox();
    const t = this._updateStatus === l.Install ? this.localize.term("wysiwg_setupButtonLabel", { debug: this._debug }) : this.localize.term("wysiwg_updateButtonLabel", { debug: this._debug });
    return o`
      <uui-box headline=${this.localize.term("wysiwg_setupTitle", {
      debug: this._debug
    })}>
        <uui-button
          label=${t}
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
    if (this._uninstalling || this._updateStatus === void 0 || this._updateStatus !== l.UpToDate)
      return;
    const t = this.localize.term("wysiwg_cultureSegmentButtonLabel", { debug: this._debug });
    return o`
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
          label=${t}
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
    return this._version.major > 15 || this._version.major >= 15 && this._version.minor >= 4 && this._version.patch >= 0 ? o`
      <uui-checkbox
        disabled
        label="Vary by segment is not supported in Umbraco versions above 15.4"
        ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
      ` : o`
    <uui-checkbox
      label="Vary by segment"
      @change="${this._onChangeSegment}"
      ?checked=${this._varyBySegment}>Vary by segment</uui-checkbox>
    `;
  }
  renderUninstallBox() {
    if (this._updateStatus === void 0 || this._updateStatus === l.Install)
      return;
    const t = this.localize.term("wysiwg_uninstallButtonLabel", { debug: this._debug });
    return o`
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
          label=${t}
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
r.styles = [
  g`
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
  u()
], r.prototype, "_contextCurrentUser", 2);
a([
  u()
], r.prototype, "_updateStatus", 2);
a([
  u()
], r.prototype, "_variations", 2);
a([
  u()
], r.prototype, "_version", 2);
a([
  u()
], r.prototype, "_uninstalling", 2);
r = a([
  m("wysiwg-dashboard")
], r);
const P = r;
export {
  r as WysiwgDashboardElement,
  P as default
};
//# sourceMappingURL=dashboard.element-DpeBf9Mq.js.map
