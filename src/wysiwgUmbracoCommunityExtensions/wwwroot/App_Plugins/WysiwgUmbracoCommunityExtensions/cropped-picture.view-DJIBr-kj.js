import { html as l, unsafeHTML as f, css as y, property as m, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { W as u } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
var b = Object.defineProperty, h = Object.getOwnPropertyDescriptor, w = (i, a, e, r) => {
  for (var o = r > 1 ? void 0 : r ? h(a, e) : a, t = i.length - 1, s; t >= 0; t--)
    (s = i[t]) && (o = (r ? s(a, e, o) : s(o)) || o);
  return r && o && b(a, e, o), o;
};
let n = class extends u {
  constructor() {
    super(...arguments), this.debugLocalize = !1, this.defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var o;
    const i = this.content;
    if (!i)
      return l`<div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this.debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const e = ((i == null ? void 0 : i.mediaItem) ?? [])[0] ?? null;
    if (e ? e.mediaKey : "") {
      const t = (i == null ? void 0 : i.alternativeText) ?? (e == null ? void 0 : e.selectedCropAlias) ?? "", s = l`<wysiwg-cropped-image class="wysiwg-cropped-image" .mediaItem=${e} .alt=${t}></wysiwg-cropped-image>`, g = i == null ? void 0 : i.figCaption, c = ((o = i == null ? void 0 : i.captionColor) == null ? void 0 : o.value) ?? this.defaultColor.value, d = this.isTransparentColor(c) ? "" : `style="color: var(--wysiwg-figcaption-color,${c});"`, p = g ? f(`<figcaption ${d}>${g}</figcaption>`) : "";
      return l`<figure>${s}${p}</figure>`;
    } else
      return l`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this.debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
n.styles = [
  y`
      :host {
        display: block;
        height: auto;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
        rotate: var(--wysiwg-cropped-image-rotate, 0);
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
  m({ attribute: !1 })
], n.prototype, "content", 2);
n = w([
  v("wysiwg-croppedicture-view")
], n);
const $ = n;
export {
  n as CroppedPictureCustomView,
  $ as default
};
//# sourceMappingURL=cropped-picture.view-DJIBr-kj.js.map
