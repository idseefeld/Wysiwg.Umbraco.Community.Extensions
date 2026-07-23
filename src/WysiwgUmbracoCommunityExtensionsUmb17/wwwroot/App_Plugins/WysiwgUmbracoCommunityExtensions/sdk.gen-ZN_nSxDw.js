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
  url: "/api/v1/wysiwg/mediatypes",
  ...e
}), g = (e) => (e?.client ?? t).get({
  security: [{ scheme: "bearer", type: "http" }],
  url: "/api/v1/wysiwg/site-background-color",
  ...e
}), p = (e) => (e?.client ?? t).get({
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
  p as a,
  y as b,
  u as c,
  n as d,
  i as e,
  c as f,
  h as g,
  g as h,
  l as i,
  a as j,
  s as k
};
//# sourceMappingURL=sdk.gen-ZN_nSxDw.js.map
