import { html as l, unsafeHTML as y, css as v, property as u, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { W as h } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
var x = Object.defineProperty, z = Object.getOwnPropertyDescriptor, w = (e, t, i, r) => {
  for (var o = r > 1 ? void 0 : r ? z(t, i) : t, a = e.length - 1, n; a >= 0; a--)
    (n = e[a]) && (o = (r ? n(t, i, o) : n(o)) || o);
  return r && o && x(t, i, o), o;
};
let s = class extends h {
  constructor() {
    super(...arguments), this.debugLocalize = !1, this.defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var o, a;
    const e = this.content;
    if (!e)
      return l`<div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this.debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const i = ((e == null ? void 0 : e.mediaItem) ?? [])[0] ?? null;
    if (i ? i.mediaKey : "") {
      const n = (e == null ? void 0 : e.alternativeText) ?? (i == null ? void 0 : i.selectedCropAlias) ?? "", d = l`<wysiwg-cropped-image class="wysiwg-cropped-image" .mediaItem=${i} .alt=${n}></wysiwg-cropped-image>`, g = e == null ? void 0 : e.figCaption, c = ((o = e == null ? void 0 : e.captionColor) == null ? void 0 : o.value) ?? this.defaultColor.value, f = (a = e == null ? void 0 : e.rotation) != null && a.from ? `transform: rotate(${e.rotation.from}deg);` : "", p = this.isTransparentColor(c) ? "" : `style="color: var(--wysiwg-figcaption-color,${c});"`, m = g ? y(`<figcaption ${p}>${g}</figcaption>`) : "";
      return l`<figure style=${f}>${d}${m}</figure>`;
    } else
      return l`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this.debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
s.styles = [
  v`
      :host {
        display: block;
        height: auto;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      .error {
        color: var(--wysiwg-error-color, #cc0000);
        font-weight: bold;
        text-align: center;
      }
      figure {
        margin: 0;
        padding: 0;
        display: block;

        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
      }
      figcaption {
        display: inline-block;
        margin: var(--wysiwg-figcaption-margin, 0);
        padding: var(--wysiwg-figcaption-padding, 0);
        color: var(--wysiwg-figcaption-color, inherit);
        font-style: var(--wysiwg-figcaption-font-style, italic);
        font-variant: var(--wysiwg-figcaption-font-variant, normal);
        font-weight: var(--wysiwg-figcaption-font-weight, normal);
        font-size: var(--wysiwg-figcaption-font-size, 90%);
        font-family: var(--wysiwg-figcaption-font-family, inherit);
        line-height: var(--wysiwg-figcaption-line-height, 1.2em);
        text-shadow: var(--wysiwg-figcaption-text-shadow, none);
      }
      .wysiwg-cropped-image {
        border-radius: var(--wysiwg-cropped-image-border-radius, 0);
        border-style: var(--wysiwg-cropped-image-border-style, none);
        border-width: var(--wysiwg-cropped-image-border-width, 0);
        border-color: var(--wysiwg-cropped-image-border-color, transparent);
        box-shadow: var(--wysiwg-cropped-image-box-shadow, none);
        background-color: var(--wysiwg-cropped-image-background-color, transparent);
      }
    `
];
w([
  u({ attribute: !1 })
], s.prototype, "content", 2);
s = w([
  b("wysiwg-croppedicture-view")
], s);
const C = s;
export {
  s as CroppedPictureCustomView,
  C as default
};
//# sourceMappingURL=cropped-picture.view-BKYcNyBc.js.map
