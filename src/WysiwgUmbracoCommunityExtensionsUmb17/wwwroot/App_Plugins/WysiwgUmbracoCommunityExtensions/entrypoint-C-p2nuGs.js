import { UMB_AUTH_CONTEXT as o } from "@umbraco-cms/backoffice/auth";
import { c as i } from "./utils.gen-D7-SejOI.js";
import { c as t } from "./utils.gen-BTePmXYR.js";
const m = (r, n) => {
  console.log("Moin von WYSIWYG Erweiterungen 🎉"), r.consumeContext(o, async (s) => {
    const e = s == null ? void 0 : s.getOpenApiConfiguration();
    i({
      baseUrl: e == null ? void 0 : e.base,
      credentials: e == null ? void 0 : e.credentials
    }), t({
      baseUrl: e == null ? void 0 : e.base,
      credentials: e == null ? void 0 : e.credentials
    });
  });
}, p = (r, n) => {
  console.log("Tschuesss von WYSIWYG Erweiterungen 👋");
};
export {
  m as onInit,
  p as onUnload
};
//# sourceMappingURL=entrypoint-C-p2nuGs.js.map
