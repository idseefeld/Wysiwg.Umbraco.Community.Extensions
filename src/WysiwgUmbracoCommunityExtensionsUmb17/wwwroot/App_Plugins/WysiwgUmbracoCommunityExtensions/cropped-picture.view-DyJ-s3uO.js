import { html as n, unsafeHTML as u, css as v, property as b, customElement as h } from "@umbraco-cms/backoffice/external/lit";
import { W as C } from "./wysiwg-base-block-editor-custom.view-BSJRTpze.js";
var $ = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, w = (e, a, o, s) => {
  for (var i = s > 1 ? void 0 : s ? _(a, o) : a, t = e.length - 1, r; t >= 0; t--)
    (r = e[t]) && (i = (s ? r(a, o, i) : r(i)) || i);
  return s && i && $(a, o, i), i;
};
let g = class extends C {
  constructor() {
    super(...arguments), this._debugLocalize = !1, this._defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    const e = this.content;
    if (!e)
      return n`
      <div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this._debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const o = (e?.mediaItem ?? [])[0] ?? null;
    if (o ? o.mediaKey : "") {
      const i = e?.captionColor?.value, t = this.isTransparentColor(i) || !i, r = e?.alternativeText ?? o?.selectedCropAlias ?? "", d = t ? n`<wysiwg-cropped-image .mediaItem=${o} .alt=${r}></wysiwg-cropped-image>` : n`<wysiwg-cropped-image .mediaItem=${o} .alt=${r} class="wysiwg-cropped-image" style="border-color: ${i};"></wysiwg-cropped-image>`, c = e?.figCaption, l = e?.rotation?.from ?? 0, f = l ? `margin: var(--wysiwg-figure-margin, 0);transform: var(--wysiwg-figure-transform, rotate(${l ?? 0}deg));` : "", p = l ? 'class="rotate" ' : "", m = t ? `${p}style="padding-top: 0;"` : `${p}style="color: var(--wysiwg-figcaption-color,${i ?? this._defaultColor.value});"`, y = c ? u(`<figcaption ${m}>${c}</figcaption>`) : "";
      return n`<figure style=${f}>${d}${y}</figure>`;
    } else
      return n`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this._debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
g.styles = [
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
w([
  b({ attribute: !1 })
], g.prototype, "content", 2);
g = w([
  h("wysiwg-cropped-picture-view")
], g);
const I = g;
export {
  g as CroppedPictureCustomView,
  I as default
};
//# sourceMappingURL=cropped-picture.view-DyJ-s3uO.js.map
