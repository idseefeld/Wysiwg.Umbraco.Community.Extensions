import { UMB_AUTH_CONTEXT as o } from "@umbraco-cms/backoffice/auth";
import { c as i } from "./client.gen-vBuWXWwf.js";
import { c as s } from "./client.gen-v1-aVGe2.js";
const a = async (e, t) => {
  const n = await e.getContext(o);
  if (!n) {
    console.warn("UMB_AUTH_CONTEXT not available — extension API client will not be authenticated");
    return;
  }
  n.configureClient(i), n.configureClient(s), console.debug("Moin von WYSIWYG Erweiterungen 🎉");
}, g = (e, t) => {
  console.log("Tschuesss von WYSIWYG Erweiterungen 👋");
};
export {
  a as onInit,
  g as onUnload
};
//# sourceMappingURL=entrypoint-BpgyRrYo.js.map
