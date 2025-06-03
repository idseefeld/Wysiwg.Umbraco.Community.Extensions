import { UmbContextBase as o } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken as e } from "@umbraco-cms/backoffice/context-api";
class x extends o {
  constructor(t) {
    super(t, n);
  }
  // Define your context methods here
  getContextData() {
    return "Hello from Wysiwg Context!";
  }
}
const n = new e(
  "globalContext",
  "Wysiwg.GlobalContext.BlockGrid"
);
export {
  n as WYSIWG_BLOCKGRID_CONTEXT,
  x as WysiwgBlockGridContextApi,
  x as default
};
//# sourceMappingURL=wysiwg.context-DFPEezZn.js.map
