import { UMB_AUTH_CONTEXT as l } from "@umbraco-cms/backoffice/auth";
import { c as s } from "./services.gen-ya8kz8Ij.js";
import { c as r } from "./services.gen-DXgDAJ2g.js";
const d = (o, i) => {
  console.log("Moin von WYSIWYG Erweiterungen 🎉"), o.consumeContext(l, async (a) => {
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
}, f = (o, i) => {
  console.log("Tschuesss von WYSIWYG Erweiterungen 👋");
};
export {
  d as onInit,
  f as onUnload
};
//# sourceMappingURL=entrypoint-rJ-MZUmf.js.map
