var h = (e) => {
  throw TypeError(e);
};
var d = (e, s, t) => s.has(e) || h("Cannot " + t);
var o = (e, s, t) => (d(e, s, "read from private field"), t ? t.call(e) : s.get(e)), p = (e, s, t) => s.has(e) ? h("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(e) : s.set(e, t), a = (e, s, t, i) => (d(e, s, "write to private field"), i ? i.call(e, t) : s.set(e, t), t);
import { UmbContextBase as C } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as b } from "@umbraco-cms/backoffice/context-api";
import { UMB_NOTIFICATION_CONTEXT as l } from "@umbraco-cms/backoffice/notification";
import { UmbNumberState as f, UmbStringState as w } from "@umbraco-cms/backoffice/observable-api";
import { UmbLocalizationController as g } from "@umbraco-cms/backoffice/localization-api";
import { g as U } from "./sdk.gen-DoNa0lH6.js";
var n, m, c, r;
class x extends C {
  constructor(t) {
    super(t, S);
    p(this, n);
    p(this, m);
    p(this, c);
    p(this, r);
    a(this, n, new g(this)), a(this, m, new f(0)), this.updateStatusCode = o(this, m).asObservable(), a(this, c, new w("")), this.umbracoVersion = o(this, c).asObservable(), a(this, r, void 0), this.consumeContext(l, (i) => {
      a(this, r, i);
    }), this.setUpdateStatus();
  }
  /**
   * Sets the update status code for the WYSIWYG block grid.
   * This method retrieves the current update status from the service and updates the observable.
   * If an error occurs during retrieval, it will notify the user through the notification context.
   */
  async setUpdateStatus() {
    const { data: t, error: i } = await U();
    if (i && o(this, r) && o(this, r).stay("danger", {
      data: {
        headline: o(this, n).term("wysiwg_versionError"),
        message: `${o(this, n).term("wysiwg_versionErrorDescription")} ${i}`
      }
    }), t !== void 0) {
      const u = typeof t == "string" ? parseInt(t, 10) : t;
      o(this, m).setValue(u);
    }
  }
}
n = new WeakMap(), m = new WeakMap(), c = new WeakMap(), r = new WeakMap();
const k = x, S = new b(
  "UmbWorkspaceContext",
  "Wysiwg.WorkspaceContext.BlockGrid"
);
export {
  S as WYSIWG_BLOCKGRID_CONTEXT,
  x as WysiwgBlockGridContextApi,
  k as api
};
//# sourceMappingURL=wysiwg.workspace.context-BPJKpgtt.js.map
