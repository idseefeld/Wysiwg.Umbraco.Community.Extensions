import { html as l, unsafeHTML as d, css as g, property as f, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { W as v } from "./wysiwg-base-block-editor-custom.view-Cn6p_o0v.js";
var h = Object.defineProperty, w = Object.getOwnPropertyDescriptor, c = (t, o, r, i) => {
  for (var e = i > 1 ? void 0 : i ? w(o, r) : o, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (e = (i ? a(o, r, e) : a(e)) || e);
  return i && e && h(o, r, e), e;
};
let n = class extends v {
  constructor() {
    super(...arguments), this._defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    const t = this.content;
    if (!t)
      return l`<div class="error">Invalid data</div>`;
    const o = t?.mediaItem ?? [], r = o.length ? o[0].mediaKey : "", i = t?.cropAlias[0] ?? "", e = t?.captionColor?.value ?? this._defaultColor.value, s = t?.figCaption;
    if (r) {
      const a = l`<wysiwg-image-crop
        mediaKey="${r}"
        alt="${this.content?.alternativeText ?? ""}"
        cropAlias="${i}"
      ></wysiwg-image-crop>`, p = `style="color: ${e};"`, u = s ? d(`<figcaption ${p}>${s}</figcaption>`) : "";
      return l`<figure>${a}${u}</figure>`;
    } else
      return l`<div class="error">No Image selected or found</div>`;
  }
};
n.styles = [
  g`
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
c([
  f({ attribute: !1 })
], n.prototype, "content", 2);
n = c([
  m("wysiwg-picturewithcrop-view")
], n);
const b = n;
export {
  n as PictureWithCropCustomView,
  b as default
};
//# sourceMappingURL=picture-with-crop.view-BaNZpTJc.js.map
