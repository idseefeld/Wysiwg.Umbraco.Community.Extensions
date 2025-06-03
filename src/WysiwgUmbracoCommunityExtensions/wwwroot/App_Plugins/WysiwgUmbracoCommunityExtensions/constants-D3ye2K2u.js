import { S as i } from "./services.gen-DXgDAJ2g.js";
import { W as a } from "./services.gen-ya8kz8Ij.js";
class g {
  constructor(e, r) {
    this._localize = e, this._notificationContext = r;
  }
  destroy() {
  }
  async getUmbracoVersion(e) {
    if (!e)
      return;
    const { data: r, error: t } = await i.getServerInformation();
    if (t) {
      console.error(t), this._notificationContext && this._notificationContext.stay("danger", {
        data: {
          headline: this._localize.term("wysiwg_serverInfoError"),
          message: `${this._localize.term("wysiwg_serverInfoErrorDescription")}`
        }
      });
      return;
    }
    if (r !== void 0) {
      const s = r, o = s == null ? void 0 : s.assemblyVersion.split(".");
      return {
        major: o.length > 0 ? parseInt(o[0]) : 1,
        minor: o.length > 1 ? parseInt(o[1]) : 0,
        patch: o.length > 2 ? parseInt(o[2]) : 0
      };
    }
  }
  async getUpdateStatus(e) {
    const { data: r, error: t } = await a.getUpdateStatusCode();
    if (t && (console.error(t), e && e.stay("danger", {
      data: {
        headline: this._localize.term("wysiwg_versionError"),
        message: `${this._localize.term("wysiwg_versionErrorDescription")} ${t}`
      }
    })), r !== void 0)
      return r;
  }
}
const f = !1, d = "#fff";
export {
  g as C,
  f as D,
  d as T
};
//# sourceMappingURL=constants-D3ye2K2u.js.map
