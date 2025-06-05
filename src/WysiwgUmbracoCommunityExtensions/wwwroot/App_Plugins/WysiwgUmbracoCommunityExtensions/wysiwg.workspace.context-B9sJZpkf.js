var p = (t) => {
  throw TypeError(t);
};
var d = (t, s, e) => s.has(t) || p("Cannot " + e);
var o = (t, s, e) => (d(t, s, "read from private field"), e ? e.call(t) : s.get(t)), c = (t, s, e) => s.has(t) ? p("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(t) : s.set(t, e), a = (t, s, e, i) => (d(t, s, "write to private field"), i ? i.call(t, e) : s.set(t, e), e);
import { UmbContextBase as C } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as u } from "@umbraco-cms/backoffice/context-api";
import { W as b } from "./services.gen-ya8kz8Ij.js";
import { UMB_NOTIFICATION_CONTEXT as l } from "@umbraco-cms/backoffice/notification";
import { UmbNumberState as w, UmbStringState as U } from "@umbraco-cms/backoffice/observable-api";
import { UmbLocalizationController as f } from "@umbraco-cms/backoffice/localization-api";
var n, m, h, r;
class x extends C {
  constructor(e) {
    super(e, S);
    c(this, n);
    c(this, m);
    c(this, h);
    c(this, r);
    a(this, n, new f(this)), a(this, m, new w(0)), this.updateStatusCode = o(this, m).asObservable(), a(this, h, new U("")), this.umbracoVersion = o(this, h).asObservable(), a(this, r, void 0), this.consumeContext(l, (i) => {
      a(this, r, i);
    }), this.setUpdateStatus();
  }
  /**
   * Sets the update status code for the WYSIWYG block grid.
   * This method retrieves the current update status from the service and updates the observable.
   * If an error occurs during retrieval, it will notify the user through the notification context.
   */
  async setUpdateStatus() {
    const { data: e, error: i } = await b.getUpdateStatusCode();
    i && o(this, r) && o(this, r).stay("danger", {
      data: {
        headline: o(this, n).term("wysiwg_versionError"),
        message: `${o(this, n).term("wysiwg_versionErrorDescription")} ${i}`
      }
    }), e !== void 0 && o(this, m).setValue(e);
  }
}
n = new WeakMap(), m = new WeakMap(), h = new WeakMap(), r = new WeakMap();
const k = x, S = new u(
  "UmbWorkspaceContext",
  "Wysiwg.WorkspaceContext.BlockGrid"
);
export {
  S as WYSIWG_BLOCKGRID_CONTEXT,
  x as WysiwgBlockGridContextApi,
  k as api
};
//# sourceMappingURL=wysiwg.workspace.context-B9sJZpkf.js.map
