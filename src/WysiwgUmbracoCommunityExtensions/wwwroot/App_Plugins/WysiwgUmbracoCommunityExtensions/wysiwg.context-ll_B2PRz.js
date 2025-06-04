var u = (e) => {
  throw TypeError(e);
};
var p = (e, s, t) => s.has(e) || u("Cannot " + t);
var i = (e, s, t) => (p(e, s, "read from private field"), t ? t.call(e) : s.get(e)), m = (e, s, t) => s.has(e) ? u("Cannot add the same private member more than once") : s instanceof WeakSet ? s.add(e) : s.set(e, t), n = (e, s, t, o) => (p(e, s, "write to private field"), o ? o.call(e, t) : s.set(e, t), t);
import { UmbContextBase as c } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as C } from "@umbraco-cms/backoffice/context-api";
import { W as g } from "./services.gen-ya8kz8Ij.js";
import { UMB_NOTIFICATION_CONTEXT as h } from "@umbraco-cms/backoffice/notification";
import { UmbNumberState as x } from "@umbraco-cms/backoffice/observable-api";
var a, r;
class U extends c {
  // #localize: UmbLocalizationController;
  constructor(t) {
    super(t, f);
    m(this, a);
    m(this, r);
    n(this, a, new x(0)), this.updateStatusCode = i(this, a).asObservable(), n(this, r, void 0), this.consumeContext(h, (o) => {
      n(this, r, o);
    }), this.setUpdateStatus();
  }
  // Define your context methods here
  getContextData() {
    return "Hello from Wysiwg Context!";
  }
  async setUpdateStatus() {
    await this.getUpdateStatus(i(this, r)).then((t) => {
      t && i(this, a).setValue(t);
    });
  }
  async getUpdateStatus(t) {
    const { data: o, error: d } = await g.getUpdateStatusCode();
    if (d && (console.error(d), t && t.stay("danger", {
      data: {
        headline: "Error getting status",
        // this._localize.term("wysiwg_versionError"),
        message: "Could not get the current wysiwyg status."
        //`${this._localize.term("wysiwg_versionErrorDescription")} ${error}`,
      }
    })), o !== void 0)
      return o;
  }
}
a = new WeakMap(), r = new WeakMap();
const T = U, f = new C(
  "UmbWorkspaceContext",
  "Wysiwg.WorkspaceContext.BlockGrid"
);
export {
  f as WYSIWG_BLOCKGRID_CONTEXT,
  U as WysiwgBlockGridContextApi,
  T as api
};
//# sourceMappingURL=wysiwg.context-ll_B2PRz.js.map
