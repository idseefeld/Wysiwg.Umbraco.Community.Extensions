import { html as a, unsafeHTML as v, css as h, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { W as p } from "./wysiwg-base-block-editor-custom.view-Cn6p_o0v.js";
var C = Object.getOwnPropertyDescriptor, $ = (i, n, l, e) => {
  for (var t = e > 1 ? void 0 : e ? C(n, l) : n, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (t = r(t) || t);
  return t;
};
let s = class extends p {
  constructor() {
    super(...arguments), this._debugLocalize = !1, this._defaultColor = { label: "Black", value: "#000" };
  }
  // @property({ attribute: false })
  // content?: UmbBlockDataType;
  render() {
    const i = this.content, n = this.config?.editContentPath ?? "";
    if (!i)
      return a`
      <div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this._debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const e = (i?.mediaItem ?? [])[0] ?? null;
    if (e ? e.mediaKey : "") {
      const o = i?.captionColor?.value, r = this.isTransparentColor(o) || !o, c = i?.alternativeText ?? e?.selectedCropAlias ?? "", m = r ? a`<wysiwg-cropped-image .mediaItem=${e} .alt=${c}></wysiwg-cropped-image>` : a`<wysiwg-cropped-image .mediaItem=${e} .alt=${c} class="wysiwg-cropped-image" style="border-color: ${o};"></wysiwg-cropped-image>`, d = i?.figCaption, g = i?.rotation?.from ?? 0, f = g ? `margin: var(--wysiwg-figure-margin, 0);transform: var(--wysiwg-figure-transform, rotate(${g ?? 0}deg));` : "", w = g ? 'class="rotate" ' : "", y = r ? `${w}style="padding-top: 0;"` : `${w}style="color: var(--wysiwg-figcaption-color,${o ?? this._defaultColor.value});"`, u = d ? v(`<figcaption ${y}>${d}</figcaption>`) : "";
      return a`<a id="editor-link" href="${n}"><figure style=${f}>${m}${u}</figure></a>`;
    } else
      return a`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this._debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
s.styles = [
  p.baseStyles,
  h`
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
s = $([
  b("wysiwg-cropped-picture-view")
], s);
const _ = s;
export {
  s as CroppedPictureCustomView,
  _ as default
};
//# sourceMappingURL=cropped-picture.view-Clxg5W7A.js.map
