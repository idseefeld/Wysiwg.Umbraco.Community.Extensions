import { c as t } from "./client.gen-vBuWXWwf.js";
const s = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/all-components",
  ...e
}), a = (e) => (e.client ?? t).post({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/preview-markup",
  ...e,
  headers: {
    "Content-Type": "application/json",
    ...e.headers
  }
}), c = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/crops",
  ...e
}), i = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/imageurl",
  ...e
}), l = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/v2-cropurl",
  ...e
}), p = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/site-background-color",
  ...e
}), g = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/fixupgrade",
  ...e
}), y = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/install",
  ...e
}), u = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/uninstall",
  ...e
}), n = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/variations",
  ...e
}), h = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/updateStatusCode",
  ...e
});
export {
  g as a,
  y as b,
  u as c,
  n as d,
  l as e,
  i as f,
  h as g,
  p as h,
  c as i,
  s as j,
  a as p
};
//# sourceMappingURL=sdk.gen-CBXr3l_Z.js.map
