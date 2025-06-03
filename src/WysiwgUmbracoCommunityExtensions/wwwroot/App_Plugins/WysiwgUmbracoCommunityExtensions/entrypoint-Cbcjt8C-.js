import { UMB_AUTH_CONTEXT as c } from "@umbraco-cms/backoffice/auth";
import { c as o } from "./services.gen-ya8kz8Ij.js";
import { c as a } from "./services.gen-DXgDAJ2g.js";
const u = (n, i) => {
  console.log("Moin von WYSIWYG Erweiterungen 🎉"), n.consumeContext(c, async (t) => {
    const e = t == null ? void 0 : t.getOpenApiConfiguration();
    o.setConfig({
      baseUrl: e == null ? void 0 : e.base,
      credentials: e == null ? void 0 : e.credentials
    }), o.interceptors.request.use(async (s, l) => {
      const r = await (e == null ? void 0 : e.token());
      return s.headers.set("Authorization", `Bearer ${r}`), s;
    }), a.setConfig({
      baseUrl: e == null ? void 0 : e.base,
      credentials: e == null ? void 0 : e.credentials
    }), a.interceptors.request.use(async (s, l) => {
      const r = await (e == null ? void 0 : e.token());
      return s.headers.set("Authorization", `Bearer ${r}`), s;
    });
  });
}, _ = (n, i) => {
  console.log("Tschuesss von WYSIWYG Erweiterungen 👋");
};
export {
  u as onInit,
  _ as onUnload
};
//# sourceMappingURL=entrypoint-Cbcjt8C-.js.map
