import { c as t } from "./client.gen-vBuWXWwf.js";
const s = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/all-components",
  ...e
}), a = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/crops",
  ...e
}), c = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/imageurl",
  ...e
}), i = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/v2-cropurl",
  ...e
}), l = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/site-background-color",
  ...e
}), g = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/fixupgrade",
  ...e
}), p = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/install",
  ...e
}), y = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/uninstall",
  ...e
}), u = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/variations",
  ...e
}), n = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/updateStatusCode",
  ...e
});
export {
  g as a,
  p as b,
  y as c,
  u as d,
  i as e,
  c as f,
  n as g,
  l as h,
  a as i,
  s as j
};
//# sourceMappingURL=sdk.gen-CjQc6NVt.js.map
