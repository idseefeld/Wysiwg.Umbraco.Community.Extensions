import { html as l, unsafeHTML as u, css as b, property as h, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { W as x } from "./wysiwg-base-block-editor-custom.view-NTK5T3_I.js";
var z = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, d = (i, t, o, r) => {
  for (var e = r > 1 ? void 0 : r ? _(t, o) : t, a = i.length - 1, s; a >= 0; a--)
    (s = i[a]) && (e = (r ? s(t, o, e) : s(e)) || e);
  return r && e && z(t, o, e), e;
};
let n = class extends x {
  constructor() {
    super(...arguments), this.debugLocalize = !1, this.defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var e, a;
    const i = this.content;
    if (!i)
      return l`
      <div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this.debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const o = ((i == null ? void 0 : i.mediaItem) ?? [])[0] ?? null;
    if (o ? o.mediaKey : "") {
      const s = (i == null ? void 0 : i.alternativeText) ?? (o == null ? void 0 : o.selectedCropAlias) ?? "", f = l`<wysiwg-cropped-image class="wysiwg-cropped-image" .mediaItem=${o} .alt=${s}></wysiwg-cropped-image>`, c = i == null ? void 0 : i.figCaption, w = ((e = i == null ? void 0 : i.captionColor) == null ? void 0 : e.value) ?? this.defaultColor.value, g = ((a = i == null ? void 0 : i.rotation) == null ? void 0 : a.from) ?? 0, p = g ? `transform: rotate(${g}deg);` : "", y = g ? 'class="rotate" ' : "", m = this.isTransparentColor(w) ? "" : `${y}style="color: var(--wysiwg-figcaption-color,${w});"`, v = c ? u(`<figcaption ${m}>${c}</figcaption>`) : "";
      return l`<figure style=${p}>${f}${v}</figure>`;
    } else
      return l`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this.debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
n.styles = [
  b`
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
d([
  h({ attribute: !1 })
], n.prototype, "content", 2);
n = d([
  $("wysiwg-croppedicture-view")
], n);
const k = n;
export {
  n as CroppedPictureCustomView,
  k as default
};
//# sourceMappingURL=cropped-picture.view-B5GVEUBU.js.map
