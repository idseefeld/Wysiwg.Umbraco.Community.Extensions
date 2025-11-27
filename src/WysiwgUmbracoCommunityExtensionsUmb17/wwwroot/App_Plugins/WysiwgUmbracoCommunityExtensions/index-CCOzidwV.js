import { html as h, css as z, property as s, state as w, customElement as E } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as L } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as W } from "@umbraco-cms/backoffice/style";
import "./wysiwg-image-and-crop-picker.element-Dj5E3SPd.js";
import "./wysiwg-card-image.element-SMTzqmtn.js";
import { W as A } from "./services.gen-ya8kz8Ij.js";
import { UmbChangeEvent as T } from "@umbraco-cms/backoffice/event";
var B = Object.defineProperty, G = Object.getOwnPropertyDescriptor, M = (e) => {
  throw TypeError(e);
}, c = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? G(t, i) : t, d = e.length - 1, n; d >= 0; d--)
    (n = e[d]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && B(t, i, r), r;
}, _ = (e, t, i) => t.has(e) || M("Cannot " + i), f = (e, t, i) => (_(e, t, "read from private field"), t.get(e)), S = (e, t, i) => t.has(e) ? M("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), J = (e, t, i, a) => (_(e, t, "write to private field"), t.set(e, i), i), k = (e, t, i) => (_(e, t, "access private method"), i), g, u, K, q;
const R = "wysiwg-image-crop";
let o = class extends L {
  constructor() {
    super(...arguments), S(this, u), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", S(this, g);
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = f(this, g)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaKey") || e.has("cropAlias") ? this.loadImage() : e.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (J(this, g, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = f(this, g)) == null || t.disconnect());
    })), f(this, g).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    if (!this.mediaKey)
      return;
    const t = {
      query: {
        mediaItemId: this.mediaKey,
        cropAlias: this.cropAlias,
        width: e
      }
    }, { data: i, error: a } = await A.cropUrl(t);
    return this._isLoading = !1, a ? (console.error(a), "error") : i !== void 0 ? i : "no data";
  }
  async generateImageUrl(e) {
    await this.requestCropUrl(e).then((t) => {
      if (t === "error") {
        this._imageUrl = void 0;
        return;
      } else if (t === "no data") {
        this._imageUrl = void 0;
        return;
      }
      this._imageUrl = t;
    });
  }
  render() {
    const e = k(this, u, q).call(this), t = k(this, u, K).call(this);
    return h` ${e} ${t} `;
  }
};
g = /* @__PURE__ */ new WeakMap();
u = /* @__PURE__ */ new WeakSet();
K = function() {
  if (this._isLoading)
    return h`<div id="loader"><uui-loader></uui-loader></div>`;
};
q = function() {
  try {
    return this._imageUrl ? h`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : h`<div id="icon" part="img"></div>`;
  } catch (e) {
    console.error("wysiwg-image-crop.renderImageCrop error", e);
  }
};
o.styles = [
  W,
  z`
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

      ::part(img) {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;

        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
        background-size: 10px 10px;
        background-repeat: repeat;
      }
      img {
        width: 100%;
        height: auto;
      }

      #icon {
        width: 100%;
        height: 100%;
        font-size: var(--uui-size-8);
      }
    `
];
c([
  s({ type: String })
], o.prototype, "mediaKey", 2);
c([
  s({ type: String })
], o.prototype, "alt", 2);
c([
  s({ type: String })
], o.prototype, "cropAlias", 2);
c([
  s({ type: Number })
], o.prototype, "width", 2);
c([
  s()
], o.prototype, "icon", 2);
c([
  s()
], o.prototype, "loading", 2);
c([
  w()
], o.prototype, "_isLoading", 2);
c([
  w()
], o.prototype, "_imageUrl", 2);
o = c([
  E(R)
], o);
var j = Object.defineProperty, F = Object.getOwnPropertyDescriptor, N = (e) => {
  throw TypeError(e);
}, p = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? F(t, i) : t, d = e.length - 1, n; d >= 0; d--)
    (n = e[d]) && (r = (a ? n(t, i, r) : n(r)) || r);
  return a && r && j(t, i, r), r;
}, I = (e, t, i) => t.has(e) || N("Cannot " + i), y = (e, t, i) => (I(e, t, "read from private field"), t.get(e)), x = (e, t, i) => t.has(e) ? N("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Q = (e, t, i, a) => (I(e, t, "write to private field"), t.set(e, i), i), O = (e, t, i) => (I(e, t, "access private method"), i), m, v, P, D;
const V = "wysiwg-cropped-image";
let l = class extends L {
  constructor() {
    super(...arguments), x(this, v), this.value = "", this.alt = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", x(this, m);
  }
  render() {
    const e = O(this, v, D).call(this), t = O(this, v, P).call(this);
    return h` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = y(this, m)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new T()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (Q(this, m, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = y(this, m)) == null || t.disconnect());
    })), y(this, m).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var b, U, $;
    if (!((b = this.mediaItem) != null && b.mediaKey))
      return;
    const t = ((U = this.mediaItem.selectedCropAlias) == null ? void 0 : U.toLowerCase()) ?? "", i = ($ = this.mediaItem.crops) == null ? void 0 : $.find((H) => H.alias === t), a = i ? JSON.stringify(i) : "", r = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", d = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: a,
        selectedFocalPoint: r
      }
    }, { data: n, error: C } = await A.v2CropUrl(d);
    return this._isLoading = !1, C ? (console.error(C), "error") : n !== void 0 ? n : "no data";
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
m = /* @__PURE__ */ new WeakMap();
v = /* @__PURE__ */ new WeakSet();
P = function() {
  if (this._isLoading)
    return h`<div id="loader"><uui-loader></uui-loader></div>`;
};
D = function() {
  var e;
  try {
    return this.value ? h`<img
          id="figure-image"
          src="${this.value ?? ""}"
          alt="${this.alt ?? ((e = this.mediaItem) == null ? void 0 : e.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : h`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
l.styles = [
  W,
  z`
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
p([
  s({ type: String })
], l.prototype, "value", 2);
p([
  s({ type: String })
], l.prototype, "alt", 2);
p([
  s({ type: Object })
], l.prototype, "mediaItem", 2);
p([
  s({ type: Number })
], l.prototype, "width", 2);
p([
  s()
], l.prototype, "icon", 2);
p([
  s()
], l.prototype, "loading", 2);
p([
  w()
], l.prototype, "_isLoading", 2);
l = p([
  E(V)
], l);
export {
  o as WysiwgBlocksImageCropElement,
  l as WysiwgCroppedImageElement
};
//# sourceMappingURL=index-CCOzidwV.js.map
