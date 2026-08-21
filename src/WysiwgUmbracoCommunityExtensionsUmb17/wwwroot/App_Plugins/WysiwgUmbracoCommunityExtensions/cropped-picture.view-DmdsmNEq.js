import { html as s, unsafeHTML as C, css as $, property as _, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { W as f } from "./wysiwg-base-block-editor-custom.view-CCHW93dJ.js";
var z = Object.defineProperty, L = Object.getOwnPropertyDescriptor, y = (e, r, l, i) => {
  for (var o = i > 1 ? void 0 : i ? L(r, l) : r, t = e.length - 1, a; t >= 0; t--)
    (a = e[t]) && (o = (i ? a(r, l, o) : a(o)) || o);
  return i && o && z(r, l, o), o;
};
let n = class extends f {
  constructor() {
    super(...arguments), this._debugLocalize = !1, this._defaultColor = { label: "Black", value: "#000" }, this._layerLevel = 0;
  }
  // TODO: This property is used to set the layer level of the figure element, which determines its z-index and position in the stacking order. But I could not find the necessary css styling to make it work.
  render() {
    const e = this.content, r = this.config?.editContentPath ?? "";
    if (!e)
      return s`
      <div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this._debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const i = (e?.mediaItem ?? [])[0] ?? null;
    if (i ? i.mediaKey : "") {
      const t = e?.captionColor?.value, a = this.isTransparentColor(t) || !t, c = e?.alternativeText ?? i?.selectedCropAlias ?? "", m = a ? s`<wysiwg-cropped-image .mediaItem=${i} .alt=${c}></wysiwg-cropped-image>` : s`<wysiwg-cropped-image .mediaItem=${i} .alt=${c} class="wysiwg-cropped-image" style="border-color: ${t};"></wysiwg-cropped-image>`, p = e?.figCaption, g = e?.rotation?.from ?? 0, d = this._layerLevel ?? e?.layerLevel ?? 0, v = d > 0 ? `z-index: ${d};position:absolute;` : "", u = g ? `margin: var(--wysiwg-figure-margin, 0);transform: var(--wysiwg-figure-transform, rotate(${g ?? 0}deg));${v}` : "", w = g ? 'class="rotate" ' : "", h = a ? `${w}style="padding-top: 0;"` : `${w}style="color: var(--wysiwg-figcaption-color,${t ?? this._defaultColor.value});"`, b = p ? C(`<figcaption ${h}>${p}</figcaption>`) : "";
      return s`<a id="editor-link" href="${r}"><figure style="${u}">${m}${b}</figure></a>`;
    } else
      return s`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this._debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
n.styles = [
  f.baseStyles,
  $`
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
        margin: var(--wysiwg-figure-margin, 0);
      }
      figcaption {
        display: inline-block;
        margin: var(--wysiwg-figcaption-margin, 0);
        padding: var(--wysiwg-figcaption-padding, 0);
        color: var(--wysiwg-figcaption-color, inherit);
        font-style: var(--wysiwg-figcaption-font-style, normal);
        font-variant: var(--wysiwg-figcaption-font-variant, normal);
        font-weight: var(--wysiwg-figcaption-font-weight, normal);
        font-size: var(--wysiwg-figcaption-font-size, 90%);
        font-family: var(--wysiwg-figcaption-font-family, inherit);
        line-height: var(--wysiwg-figcaption-line-height, 1.2em);
        text-shadow: var(--wysiwg-figcaption-text-shadow, none);
      }
      figcaption.rotate{
        font-style: var(--wysiwg-figcaption-rotate-font-style, normal);
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
y([
  _({ attribute: !1 })
], n.prototype, "_layerLevel", 2);
n = y([
  x("wysiwg-cropped-picture-view")
], n);
const k = n;
export {
  n as CroppedPictureCustomView,
  k as default
};
//# sourceMappingURL=cropped-picture.view-DmdsmNEq.js.map
