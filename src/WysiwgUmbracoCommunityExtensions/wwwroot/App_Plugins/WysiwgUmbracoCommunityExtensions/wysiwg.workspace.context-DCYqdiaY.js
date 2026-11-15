import { UmbContextBase as o } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as i } from "@umbraco-cms/backoffice/context-api";
import { UMB_NOTIFICATION_CONTEXT as r } from "@umbraco-cms/backoffice/notification";
import { UmbNumberState as a, UmbStringState as n } from "@umbraco-cms/backoffice/observable-api";
import { UmbLocalizationController as m } from "@umbraco-cms/backoffice/localization-api";
import { g as p } from "./sdk.gen-CBXr3l_Z.js";
class c extends o {
  constructor(t) {
    super(t, h), this.#e = new m(this), this.#s = new a(0), this.updateStatusCode = this.#s.asObservable(), this.#o = new n(""), this.umbracoVersion = this.#o.asObservable(), this.#t = void 0, this.consumeContext(r, (e) => {
      this.#t = e;
    }), this.setUpdateStatus();
  }
  #e;
  #s;
  #o;
  #t;
  /**
   * Sets the update status code for the WYSIWYG block grid.
   * This method retrieves the current update status from the service and updates the observable.
   * If an error occurs during retrieval, it will notify the user through the notification context.
   */
  async setUpdateStatus() {
    const { data: t, error: e } = await p();
    if (e && this.#t && this.#t.stay("danger", {
      data: {
        headline: this.#e.term("wysiwg_versionError"),
        message: `${this.#e.term("wysiwg_versionErrorDescription")} ${e}`
      }
    }), t !== void 0) {
      const s = typeof t == "string" ? parseInt(t, 10) : t;
      this.#s.setValue(s);
    }
  }
}
const g = c, h = new i(
  "UmbWorkspaceContext",
  "Wysiwg.WorkspaceContext.BlockGrid"
);
export {
  h as WYSIWG_BLOCKGRID_CONTEXT,
  c as WysiwgBlockGridContextApi,
  g as api
};
//# sourceMappingURL=wysiwg.workspace.context-DCYqdiaY.js.map
