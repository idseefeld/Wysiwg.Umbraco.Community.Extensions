import { LitElement as u, html as l, unsafeHTML as p, css as v, property as b, customElement as w } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as y } from "@umbraco-cms/backoffice/element-api";
var $ = Object.defineProperty, x = Object.getOwnPropertyDescriptor, d = (e, o, r, i) => {
  for (var t = i > 1 ? void 0 : i ? x(o, r) : o, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (t = (i ? n(o, r, t) : n(t)) || t);
  return i && t && $(o, r, t), t;
};
let a = class extends y(u) {
  constructor() {
    super(...arguments), this.defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var n, c;
    const e = this.content;
    if (!e)
      return l`<div class="error">Invalid data</div>`;
    const o = (e == null ? void 0 : e.mediaItem) ?? [], r = o.length ? o[0].mediaKey : "", i = (e == null ? void 0 : e.cropAlias[0]) ?? "", t = ((n = e == null ? void 0 : e.captionColor) == null ? void 0 : n.value) ?? this.defaultColor.value, s = e == null ? void 0 : e.figCaption;
    if (r) {
      const m = l`<wysiwg-image-crop
        mediaKey="${r}"
        alt="${((c = this.content) == null ? void 0 : c.alternativeText) ?? ""}"
        cropAlias="${i}"
      ></wysiwg-image-crop>`, g = `style="color: ${t};"`, f = s ? p(`<figcaption ${g}>${s}</figcaption>`) : "";
      return l`<figure>${m}${f}</figure>`;
    } else
      return l`<div class="error">No Image selected or found</div>`;
  }
};
a.styles = [
  v`
      :host {
        display: block;
        height: auto;
        box-sizing: border-box;
        background-color: transparent;
        /* border-radius: 9px; */
        padding: 0;
      }
      .error {
        color: red;
        font-weight: bold;
        text-align: center;
      }
      figure {
        margin: 0;
        padding: 0;
        display: block;
      }
    `
];
d([
  b({ attribute: !1 })
], a.prototype, "content", 2);
a = d([
  w("wysiwg-picturewithcrop-view")
], a);
const _ = a;
export {
  a as PictureWithCropCustomView,
  _ as default
};
//# sourceMappingURL=picture-with-crop.view-BzdjLqbe.js.map
