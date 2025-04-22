import { UMB_AUTH_CONTEXT as c } from "@umbraco-cms/backoffice/auth";
import { c as t } from "./services.gen-mcYb1gDV.js";
const u = (n, s) => {
  console.log("Moin von wysiwg Erweiterungen 🎉"), n.consumeContext(c, async (i) => {
    const e = i.getOpenApiConfiguration();
    t.setConfig({
      baseUrl: e.base,
      credentials: e.credentials
    }), t.interceptors.request.use(async (o, a) => {
      const r = await e.token();
      return o.headers.set("Authorization", `Bearer ${r}`), o;
    });
  });
}, p = (n, s) => {
  console.log("Tschuesss von wysiwg Erweiterungen 👋");
};
export {
  u as onInit,
  p as onUnload
};
//# sourceMappingURL=entrypoint-CkKERto0.js.map
