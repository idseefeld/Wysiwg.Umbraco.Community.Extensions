import { html as n, unsafeHTML as u, css as f, property as p, customElement as y } from "@umbraco-cms/backoffice/external/lit";
import { W as w } from "./base-block-editor-custom.view-Dqc2JicF.js";
var b = Object.defineProperty, v = Object.getOwnPropertyDescriptor, d = (e, t, o, a) => {
  for (var i = a > 1 ? void 0 : a ? v(t, o) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (i = (a ? l(t, o, i) : l(i)) || i);
  return a && i && b(t, o, i), i;
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
      const s = n`<wysiwg-cropped-image .mediaItem=${o}></wysiwg-cropped-image>`, l = ((i = e == null ? void 0 : e.captionColor) == null ? void 0 : i.value) ?? this.defaultColor.value, c = e == null ? void 0 : e.figCaption, m = `style="color: ${l};"`, g = c ? u(`<figcaption ${m}>${c}</figcaption>`) : "";
      return n`<figure>${s}${g}</figure>`;
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
const z = r;
export {
  r as CroppedPictureCustomView,
  z as default
};
//# sourceMappingURL=cropped-picture.view-BxR63m1e.js.map
