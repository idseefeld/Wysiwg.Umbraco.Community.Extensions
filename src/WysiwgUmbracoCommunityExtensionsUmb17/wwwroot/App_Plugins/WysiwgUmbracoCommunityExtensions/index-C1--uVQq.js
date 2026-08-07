import { html as p, css as C, property as l, state as b, customElement as S } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as x } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as O } from "@umbraco-cms/backoffice/style";
import { UmbChangeEvent as U } from "@umbraco-cms/backoffice/event";
import { e as E } from "./sdk.gen-CjQc6NVt.js";
var k = Object.defineProperty, z = Object.getOwnPropertyDescriptor, y = (e) => {
  throw TypeError(e);
}, s = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? z(t, i) : t, c = e.length - 1, n; c >= 0; c--)
    (n = e[c]) && (a = (o ? n(t, i, a) : n(a)) || a);
  return o && a && k(t, i, a), a;
}, m = (e, t, i) => t.has(e) || y("Cannot " + i), g = (e, t, i) => (m(e, t, "read from private field"), t.get(e)), v = (e, t, i) => t.has(e) ? y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), L = (e, t, i, o) => (m(e, t, "write to private field"), t.set(e, i), i), f = (e, t, i) => (m(e, t, "access private method"), i), d, h, w, _;
const P = "wysiwg-cropped-image";
let r = class extends x {
  constructor() {
    super(...arguments), v(this, h), this.value = "", this.alt = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", v(this, d);
  }
  render() {
    const e = f(this, h, _).call(this), t = f(this, h, w).call(this);
    return p` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), g(this, d)?.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new U()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (L(this, d, new IntersectionObserver((e) => {
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), g(this, d)?.disconnect());
    })), g(this, d).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    if (!this.mediaItem?.mediaKey)
      return;
    const t = this.mediaItem.selectedCropAlias?.toLowerCase() ?? "", i = this.mediaItem.crops?.find((I) => I.alias === t), o = i ? JSON.stringify(i) : "", a = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", c = {
      url: "/api/v1/wysiwg/v2-cropurl",
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: o,
        selectedFocalPoint: a
      }
    }, { data: n, error: u } = await E(c);
    return this._isLoading = !1, u ? (console.error(u), "error") : n !== void 0 ? n : "no data";
  }
  async generateImageUrl(e) {
    await this.requestCropUrl(e).then((t) => {
      if (t === "error") {
        this.value = "";
        return;
      } else if (t === "no data") {
        this.value = "";
        return;
      }
      this.value = t ?? "";
    });
  }
};
d = /* @__PURE__ */ new WeakMap();
h = /* @__PURE__ */ new WeakSet();
w = function() {
  if (this._isLoading)
    return p`<div id="loader"><uui-loader></uui-loader></div>`;
};
_ = function() {
  try {
    return this.value ? p`<img
          id="figure-image"
          src="${this.value ?? ""}"
          alt="${this.alt ?? this.mediaItem?.mediaKey ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : p`<div id="icon" part="img"></div>`;
  } catch (e) {
    console.error("wysiwg-image-crop.renderImageCrop error", e);
  }
};
r.styles = [
  O,
  C`
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        justify-content: center;
        align-items: center;
      }

      #loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }

      img {
        display: flex;
        height: auto;
        width: var(--wysiwg-cropped-image-width, 100%);
        margin: var(--wysiwg-image-border-radius, 0);
        border-radius: var(--wysiwg-image-border-radius, 0);

        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
        background-size: 10px 10px;
        background-repeat: repeat;
      }

      #icon {
        width: 100%;
        height: 100%;
        font-size: var(--uui-size-8);
      }
    `
];
s([
  l({ type: String })
], r.prototype, "value", 2);
s([
  l({ type: String })
], r.prototype, "alt", 2);
s([
  l({ type: Object })
], r.prototype, "mediaItem", 2);
s([
  l({ type: Number })
], r.prototype, "width", 2);
s([
  l()
], r.prototype, "icon", 2);
s([
  l()
], r.prototype, "loading", 2);
s([
  b()
], r.prototype, "_isLoading", 2);
r = s([
  S(P)
], r);
export {
  r as WysiwgCroppedImageElement
};
//# sourceMappingURL=index-C1--uVQq.js.map
