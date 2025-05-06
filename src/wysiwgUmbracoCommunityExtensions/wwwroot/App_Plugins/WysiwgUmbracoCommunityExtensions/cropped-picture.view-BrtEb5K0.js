import { html as n, unsafeHTML as u, css as f, property as p, customElement as y } from "@umbraco-cms/backoffice/external/lit";
import { W as w } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
var b = Object.defineProperty, v = Object.getOwnPropertyDescriptor, d = (e, a, o, s) => {
  for (var i = s > 1 ? void 0 : s ? v(a, o) : a, l = e.length - 1, t; l >= 0; l--)
    (t = e[l]) && (i = (s ? t(a, o, i) : t(i)) || i);
  return s && i && b(a, o, i), i;
};
let r = class extends w {
  constructor() {
    super(...arguments), this.debugLocalize = !1, this.defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var i;
    const e = this.content;
    if (!e)
      return n`<div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this.debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const o = ((e == null ? void 0 : e.mediaItem) ?? [])[0] ?? null;
    if (o ? o.mediaKey : "") {
      const l = n`<wysiwg-cropped-image .mediaItem=${o}></wysiwg-cropped-image>`, t = ((i = e == null ? void 0 : e.captionColor) == null ? void 0 : i.value) ?? this.defaultColor.value, c = e == null ? void 0 : e.figCaption, m = this.isTransparentColor(t) ? "" : `style="color: ${t};"`, g = c ? u(`<figcaption ${m}>${c}</figcaption>`) : "";
      return n`<figure>${l}${g}</figure>`;
    } else
      return n`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this.debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
r.styles = [
  f`
      :host {
        display: block;
        height: auto;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
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
      figcaption {
        font-style: var(--wysiwg-figcaption-font-style, italic);
      }
    `
];
d([
  p({ attribute: !1 })
], r.prototype, "content", 2);
r = d([
  y("wysiwg-croppedicture-view")
], r);
const h = r;
export {
  r as CroppedPictureCustomView,
  h as default
};
//# sourceMappingURL=cropped-picture.view-BrtEb5K0.js.map
