import { html as g, unsafeHTML as y, css as u, property as v, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { W as h } from "./wysiwg-base-block-editor-custom.view-BoT8cJ6_.js";
var C = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, p = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? _(t, o) : t, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (i = (r ? s(t, o, i) : s(i)) || i);
  return r && i && C(t, o, i), i;
};
let n = class extends h {
  constructor() {
    super(...arguments), this._debugLocalize = !1, this._defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    const e = this.content;
    if (!e)
      return g`
      <div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this._debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const o = (e?.mediaItem ?? [])[0] ?? null;
    if (o ? o.mediaKey : "") {
      const i = e?.captionColor?.value ?? this._defaultColor.value, a = e?.alternativeText ?? o?.selectedCropAlias ?? "", s = g`<wysiwg-cropped-image class="wysiwg-cropped-image" .mediaItem=${o} .alt=${a} style="border-color: ${i};"></wysiwg-cropped-image>`, c = e?.figCaption, l = e?.rotation?.from ?? 0, w = l ? `margin: var(--wysiwg-figure-margin, 0);transform: var(--wysiwg-figure-transform, rotate(${l ?? 0}deg));` : "", d = l ? 'class="rotate" ' : "", f = this.isTransparentColor(i) ? "" : `${d}style="color: var(--wysiwg-figcaption-color,${i});"`, m = c ? y(`<figcaption ${f}>${c}</figcaption>`) : "";
      return g`<figure style=${w}>${s}${m}</figure>`;
    } else
      return g`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this._debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
n.styles = [
  u`
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
        font-style: var(--wysiwg-figcaption-font-style, italic);
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
p([
  v({ attribute: !1 })
], n.prototype, "content", 2);
n = p([
  b("wysiwg-cropped-picture-view")
], n);
const z = n;
export {
  n as CroppedPictureCustomView,
  z as default
};
//# sourceMappingURL=cropped-picture.view-BUAqLphC.js.map
