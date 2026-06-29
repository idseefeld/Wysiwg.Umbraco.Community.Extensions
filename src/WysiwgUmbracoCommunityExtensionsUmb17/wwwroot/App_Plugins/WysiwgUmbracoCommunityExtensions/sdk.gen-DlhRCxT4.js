import { c as t } from "./client.gen-vBuWXWwf.js";
const s = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/crops",
  ...e
}), a = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/imageurl",
  ...e
}), c = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/v2-cropurl",
  ...e
}), i = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/mediatypes",
  ...e
}), g = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/site-background-color",
  ...e
}), l = (e) => (e?.client ?? t).get({
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
}), h = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/updateStatusCode",
  ...e
});
export {
  l as a,
  p as b,
  y as c,
  u as d,
  c as e,
  a as f,
  h as g,
  g as h,
  i,
  s as j
};
//# sourceMappingURL=sdk.gen-DlhRCxT4.js.map
