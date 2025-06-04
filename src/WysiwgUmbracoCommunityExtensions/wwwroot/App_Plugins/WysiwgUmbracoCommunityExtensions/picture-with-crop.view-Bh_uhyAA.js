import { html as l, unsafeHTML as u, css as p, property as v, customElement as w } from "@umbraco-cms/backoffice/external/lit";
import { W as y } from "./wysiwg-base-block-editor-custom.view--GL6EEZz.js";
var b = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, d = (e, o, r, s) => {
  for (var t = s > 1 ? void 0 : s ? $(o, r) : o, a = e.length - 1, i; a >= 0; a--)
    (i = e[a]) && (t = (s ? i(o, r, t) : i(t)) || t);
  return s && t && b(o, r, t), t;
};
let n = class extends y {
  constructor() {
    super(...arguments), this._defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var i, c;
    const e = this.content;
    if (!e)
      return l`<div class="error">Invalid data</div>`;
    const o = (e == null ? void 0 : e.mediaItem) ?? [], r = o.length ? o[0].mediaKey : "", s = (e == null ? void 0 : e.cropAlias[0]) ?? "", t = ((i = e == null ? void 0 : e.captionColor) == null ? void 0 : i.value) ?? this._defaultColor.value, a = e == null ? void 0 : e.figCaption;
    if (r) {
      const g = l`<wysiwg-image-crop
        mediaKey="${r}"
        alt="${((c = this.content) == null ? void 0 : c.alternativeText) ?? ""}"
        cropAlias="${s}"
      ></wysiwg-image-crop>`, m = `style="color: ${t};"`, f = a ? u(`<figcaption ${m}>${a}</figcaption>`) : "";
      return l`<figure>${g}${f}</figure>`;
    } else
      return l`<div class="error">No Image selected or found</div>`;
  }
};
n.styles = [
  p`
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
  v({ attribute: !1 })
], n.prototype, "content", 2);
n = d([
  w("wysiwg-picturewithcrop-view")
], n);
const x = n;
export {
  n as PictureWithCropCustomView,
  x as default
};
//# sourceMappingURL=picture-with-crop.view-Bh_uhyAA.js.map
