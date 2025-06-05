var p = (e) => {
  throw TypeError(e);
};
var d = (e, o, t) => o.has(e) || p("Cannot " + t);
var i = (e, o, t) => (d(e, o, "read from private field"), t ? t.call(e) : o.get(e)), c = (e, o, t) => o.has(e) ? p("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(e) : o.set(e, t), m = (e, o, t, s) => (d(e, o, "write to private field"), s ? s.call(e, t) : o.set(e, t), t);
import { UmbContextBase as h } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as C } from "@umbraco-cms/backoffice/context-api";
import { W as u } from "./services.gen-ya8kz8Ij.js";
import { UMB_NOTIFICATION_CONTEXT as l } from "@umbraco-cms/backoffice/notification";
import { UmbNumberState as w } from "@umbraco-cms/backoffice/observable-api";
import { UmbLocalizationController as U } from "@umbraco-cms/backoffice/localization-api";
var a, n, r;
class f extends h {
  constructor(t) {
    super(t, g);
    c(this, a);
    c(this, n);
    c(this, r);
    m(this, a, new U(this)), m(this, n, new w(0)), this.updateStatusCode = i(this, n).asObservable(), m(this, r, void 0), this.consumeContext(l, (s) => {
      m(this, r, s);
    }), this.setUpdateStatus();
  }
  /**
   * Sets the update status code for the WYSIWYG block grid.
   * This method retrieves the current update status from the service and updates the observable.
   * If an error occurs during retrieval, it will notify the user through the notification context.
   */
  async setUpdateStatus() {
    await this.getUpdateStatus().then((t) => {
      t && i(this, n).setValue(t);
    });
  }
  async getUpdateStatus() {
    const { data: t, error: s } = await u.getUpdateStatusCode();
    if (s && (console.error(s), i(this, r) && i(this, r).stay("danger", {
      data: {
        headline: i(this, a).term("wysiwg_versionError"),
        // "Error getting status",//
        message: `${i(this, a).term("wysiwg_versionErrorDescription")} ${s}`
        // "Could not get the current wysiwyg status.",//
      }
    })), t !== void 0)
      return t;
  }
}
a = new WeakMap(), n = new WeakMap(), r = new WeakMap();
const O = f, g = new C(
  "UmbWorkspaceContext",
  "Wysiwg.WorkspaceContext.BlockGrid"
);
export {
  g as WYSIWG_BLOCKGRID_CONTEXT,
  f as WysiwgBlockGridContextApi,
  O as api
};
//# sourceMappingURL=wysiwg.context-BinSMcUU.js.map
