import { LitElement as f, html as n, unsafeHTML as u, css as p, property as y, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as w } from "@umbraco-cms/backoffice/element-api";
var v = Object.defineProperty, C = Object.getOwnPropertyDescriptor, d = (e, o, t, a) => {
  for (var i = a > 1 ? void 0 : a ? C(o, t) : o, l = e.length - 1, s; l >= 0; l--)
    (s = e[l]) && (i = (a ? s(o, t, i) : s(i)) || i);
  return a && i && v(o, t, i), i;
};
let r = class extends w(f) {
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
    const t = ((e == null ? void 0 : e.mediaItem) ?? [])[0] ?? null;
    if (t ? t.mediaKey : "") {
      const l = n`<wysiwg-cropped-image .mediaItem=${t}></wysiwg-cropped-image>`, s = ((i = e == null ? void 0 : e.captionColor) == null ? void 0 : i.value) ?? this.defaultColor.value, c = e == null ? void 0 : e.figCaption, m = `style="color: ${s};"`, g = c ? u(`<figcaption ${m}>${c}</figcaption>`) : "";
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
  p`
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
  y({ attribute: !1 })
], r.prototype, "content", 2);
r = d([
  b("wysiwg-croppedicture-view")
], r);
const _ = r;
export {
  r as CroppedPictureCustomView,
  _ as default
};
//# sourceMappingURL=cropped-picture.view-dQUMznB5.js.map
