import { html as g, unsafeHTML as u, css as b, property as h, customElement as _ } from "@umbraco-cms/backoffice/external/lit";
import { W as x } from "./wysiwg-base-block-editor-custom.view-BXBLmnky.js";
var z = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, d = (i, t, e, r) => {
  for (var o = r > 1 ? void 0 : r ? $(t, e) : t, a = i.length - 1, n; a >= 0; a--)
    (n = i[a]) && (o = (r ? n(t, e, o) : n(o)) || o);
  return r && o && z(t, e, o), o;
};
let s = class extends x {
  constructor() {
    super(...arguments), this._debugLocalize = !1, this._defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    var o, a;
    const i = this.content;
    if (!i)
      return g`
      <div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this._debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const e = ((i == null ? void 0 : i.mediaItem) ?? [])[0] ?? null;
    if (e ? e.mediaKey : "") {
      const n = (i == null ? void 0 : i.alternativeText) ?? (e == null ? void 0 : e.selectedCropAlias) ?? "", f = g`<wysiwg-cropped-image class="wysiwg-cropped-image" .mediaItem=${e} .alt=${n}></wysiwg-cropped-image>`, c = i == null ? void 0 : i.figCaption, w = ((o = i == null ? void 0 : i.captionColor) == null ? void 0 : o.value) ?? this._defaultColor.value, l = ((a = i == null ? void 0 : i.rotation) == null ? void 0 : a.from) ?? 0, p = l ? `margin: var(--wysiwg-figure-margin, 0);transform: var(--wysiwg-figure-transform, rotate(${l ?? 0}deg));` : "", m = l ? 'class="rotate" ' : "", y = this.isTransparentColor(w) ? "" : `${m}style="color: var(--wysiwg-figcaption-color,${w});"`, v = c ? u(`<figcaption ${y}>${c}</figcaption>`) : "";
      return g`<figure style=${p}>${f}${v}</figure>`;
    } else
      return g`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this._debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
s.styles = [
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
d([
  h({ attribute: !1 })
], s.prototype, "content", 2);
s = d([
  _("wysiwg-cropped-picture-view")
], s);
const k = s;
export {
  s as CroppedPictureCustomView,
  k as default
};
//# sourceMappingURL=cropped-picture.view-CVP3hSKM.js.map
