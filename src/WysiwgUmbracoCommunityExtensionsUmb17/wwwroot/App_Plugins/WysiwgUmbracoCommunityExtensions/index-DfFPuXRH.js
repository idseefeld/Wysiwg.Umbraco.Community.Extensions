import { html as p, css as x, property as l, state as O, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as U } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as k } from "@umbraco-cms/backoffice/style";
import { UmbChangeEvent as z } from "@umbraco-cms/backoffice/event";
import { e as L } from "./sdk.gen-DoNa0lH6.js";
var P = Object.defineProperty, W = Object.getOwnPropertyDescriptor, I = (e) => {
  throw TypeError(e);
}, s = (e, t, i, o) => {
  for (var a = o > 1 ? void 0 : o ? W(t, i) : t, c = e.length - 1, n; c >= 0; c--)
    (n = e[c]) && (a = (o ? n(t, i, a) : n(a)) || a);
  return o && a && P(t, i, a), a;
}, g = (e, t, i) => t.has(e) || I("Cannot " + i), m = (e, t, i) => (g(e, t, "read from private field"), t.get(e)), w = (e, t, i) => t.has(e) ? I("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $ = (e, t, i, o) => (g(e, t, "write to private field"), t.set(e, i), i), _ = (e, t, i) => (g(e, t, "access private method"), i), d, h, C, b;
const M = "wysiwg-cropped-image";
let r = class extends U {
  constructor() {
    super(...arguments), w(this, h), this.value = "", this.alt = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", w(this, d);
  }
  render() {
    const e = _(this, h, b).call(this), t = _(this, h, C).call(this);
    return p` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = m(this, d)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new z()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? ($(this, d, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = m(this, d)) == null || t.disconnect());
    })), m(this, d).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var v, f, y;
    if (!((v = this.mediaItem) != null && v.mediaKey))
      return;
    const t = ((f = this.mediaItem.selectedCropAlias) == null ? void 0 : f.toLowerCase()) ?? "", i = (y = this.mediaItem.crops) == null ? void 0 : y.find((S) => S.alias === t), o = i ? JSON.stringify(i) : "", a = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", c = {
      url: "/umbraco/wysiwgumbracocommunityextensions/api/v1/v2-cropurl",
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: o,
        selectedFocalPoint: a
      }
    }, { data: n, error: u } = await L(c);
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
C = function() {
  if (this._isLoading)
    return p`<div id="loader"><uui-loader></uui-loader></div>`;
};
b = function() {
  var e;
  try {
    return this.value ? p`<img
          id="figure-image"
          src="${this.value ?? ""}"
          alt="${this.alt ?? ((e = this.mediaItem) == null ? void 0 : e.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : p`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
r.styles = [
  k,
  x`
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
  O()
], r.prototype, "_isLoading", 2);
r = s([
  E(M)
], r);
export {
  r as WysiwgCroppedImageElement
};
//# sourceMappingURL=index-DfFPuXRH.js.map
