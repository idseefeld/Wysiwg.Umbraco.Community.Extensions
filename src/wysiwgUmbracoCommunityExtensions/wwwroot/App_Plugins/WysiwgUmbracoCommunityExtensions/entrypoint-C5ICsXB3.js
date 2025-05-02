import { UMB_AUTH_CONTEXT as g } from "@umbraco-cms/backoffice/auth";
import { c as s } from "./services.gen-B_ebHh4e.js";
import { c as r } from "./services.gen-CS9qDZj5.js";
const w = (o, i) => {
  console.log("Moin von wysiwg Erweiterungen 🎉"), o.consumeContext(g, async (a) => {
    const e = a.getOpenApiConfiguration();
    s.setConfig({
      baseUrl: e.base,
      credentials: e.credentials
    }), s.interceptors.request.use(async (n, c) => {
      const t = await e.token();
      return n.headers.set("Authorization", `Bearer ${t}`), n;
    }), r.setConfig({
      baseUrl: e.base,
      credentials: e.credentials
    }), r.interceptors.request.use(async (n, c) => {
      const t = await e.token();
      return n.headers.set("Authorization", `Bearer ${t}`), n;
    });
  });
}, d = (o, i) => {
  console.log("Tschuesss von wysiwg Erweiterungen 👋");
};
export {
  w as onInit,
  d as onUnload
};
//# sourceMappingURL=entrypoint-C5ICsXB3.js.map
