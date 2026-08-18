import { html as n, unsafeHTML as h, css as b, property as C, customElement as $ } from "@umbraco-cms/backoffice/external/lit";
import { W as w } from "./wysiwg-base-block-editor-custom.view-Cn6p_o0v.js";
var _ = Object.defineProperty, x = Object.getOwnPropertyDescriptor, f = (e, r, g, i) => {
  for (var o = i > 1 ? void 0 : i ? x(r, g) : r, t = e.length - 1, a; t >= 0; t--)
    (a = e[t]) && (o = (i ? a(r, g, o) : a(o)) || o);
  return i && o && _(r, g, o), o;
};
let s = class extends w {
  constructor() {
    super(...arguments), this._debugLocalize = !1, this._defaultColor = { label: "Black", value: "#000" };
  }
  render() {
    const e = this.content, r = this.config?.editContentPath ?? "";
    if (!e)
      return n`
      <div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this._debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    const i = (e?.mediaItem ?? [])[0] ?? null;
    if (i ? i.mediaKey : "") {
      const t = e?.captionColor?.value, a = this.isTransparentColor(t) || !t, c = e?.alternativeText ?? i?.selectedCropAlias ?? "", m = a ? n`<wysiwg-cropped-image .mediaItem=${i} .alt=${c}></wysiwg-cropped-image>` : n`<wysiwg-cropped-image .mediaItem=${i} .alt=${c} class="wysiwg-cropped-image" style="border-color: ${t};"></wysiwg-cropped-image>`, p = e?.figCaption, l = e?.rotation?.from ?? 0, y = l ? `margin: var(--wysiwg-figure-margin, 0);transform: var(--wysiwg-figure-transform, rotate(${l ?? 0}deg));` : "", d = l ? 'class="rotate" ' : "", u = a ? `${d}style="padding-top: 0;"` : `${d}style="color: var(--wysiwg-figcaption-color,${t ?? this._defaultColor.value});"`, v = p ? h(`<figcaption ${u}>${p}</figcaption>`) : "";
      return n`<a id="editor-link" href="${r}"><figure style=${y}>${m}${v}</figure></a>`;
    } else
      return n`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this._debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
  }
};
s.styles = [
  w.baseStyles,
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
f([
  C({ attribute: !1 })
], s.prototype, "content", 2);
s = f([
  $("wysiwg-cropped-picture-view")
], s);
const P = s;
export {
  s as CroppedPictureCustomView,
  P as default
};
//# sourceMappingURL=cropped-picture.view-CBuSYFPw.js.map
