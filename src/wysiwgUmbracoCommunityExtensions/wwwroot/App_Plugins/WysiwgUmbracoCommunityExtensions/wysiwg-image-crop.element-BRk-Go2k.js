import { styleMap as P, nothing as Q, html as g, css as E, property as s, state as k, customElement as O } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as q } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as M } from "@umbraco-cms/backoffice/style";
import "./headline.view-9ZEXfVDK.js";
import "./paragraph.view-AYtIWzwd.js";
import "./picture-with-crop.view-Cs4EPyBy.js";
import "./cropped-picture.view-BxR63m1e.js";
import "./wysiwg-datatype-picker.element-BKj-4eik.js";
import "./wysiwg-image-crops.element-CAGvkQix.js";
import "./wysiwg-image-and-crop-picker.element-CpRW4K2D.js";
import { W } from "./services.gen-B_ebHh4e.js";
import "./dashboard.element-B_ANfST9.js";
import { UmbPropertyValueChangeEvent as V } from "@umbraco-cms/backoffice/property-editor";
import { W as X, t as Y } from "./base-block-editor-custom.view-Dqc2JicF.js";
var Z = Object.defineProperty, ee = Object.getOwnPropertyDescriptor, N = (e) => {
  throw TypeError(e);
}, _ = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ee(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && Z(t, i, r), r;
}, te = (e, t, i) => t.has(e) || N("Cannot " + i), ie = (e, t, i) => t.has(e) ? N("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ae = (e, t, i) => (te(e, t, "access private method"), i), U, R;
const h = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  padding: "0"
}, re = "wysiwg-block-layout-view";
let u = class extends X {
  constructor() {
    super(...arguments), ie(this, U), this.pageBackroundColor = h.backgroundColor, this.backgroundStyleMap = h;
  }
  get backgroundStyles() {
    return {
      backgroundImage: this.backgroundStyleMap.backgroundImage,
      backgroundRepeat: this.backgroundStyleMap.backgroundRepeat,
      backgroundPosition: this.backgroundStyleMap.backgroundPosition,
      backgroundColor: this.backgroundStyleMap.backgroundColor,
      padding: this.backgroundStyleMap.padding
    };
  }
  get backgroundStyleDefaults() {
    return {
      backgroundImage: h.backgroundImage,
      backgroundRepeat: h.backgroundRepeat,
      backgroundPosition: h.backgroundPosition,
      backgroundColor: h.backgroundColor,
      padding: h.padding
    };
  }
  async prozessSettings(e) {
    var t, i, a, r;
    if ((t = e.settingsData) != null && t.length) {
      const n = this, o = (i = e.layout["Umbraco.BlockGrid"]) == null ? void 0 : i.find(
        (l) => l.contentKey === n.contentKey
      ), d = (a = e == null ? void 0 : e.settingsData) == null ? void 0 : a.find(
        (l) => l.key === (o == null ? void 0 : o.settingsKey)
      ), y = (d == null ? void 0 : d.values) ?? [];
      this.getBackgroudStyle(y);
      const v = (r = y == null ? void 0 : y.find((l) => l.alias === "backgroundImage")) == null ? void 0 : r.value, C = v != null && v.length ? v[0].mediaKey : "";
      await ae(this, U, R).call(this, C).then((l) => {
        l !== void 0 && l !== "error" && this.getBackgroudImageStyle(l);
      });
    }
  }
  async lastStepObservingProperties(e) {
    var i;
    if (!e) return;
    let t = (i = e.find((a) => a.alias === "pageBackgroundColor")) == null ? void 0 : i.value;
    t != null && t.value && (this.pageBackroundColor = t.value);
  }
  getBackgroudStyle(e) {
    var i, a;
    const t = this.backgroundStyleDefaults;
    if (e != null && e.length) {
      const r = (((i = e == null ? void 0 : e.find((d) => d.alias === "backgroundColor")) == null ? void 0 : i.value) ?? {}).value, n = r === Y;
      r && (t.backgroundColor = n ? "transparent" : r);
      let o = (a = e == null ? void 0 : e.find((d) => d.alias === "padding")) == null ? void 0 : a.value;
      o || (o = r && !n ? "10px" : "0", console.debug("padding: ", o)), t.padding = `${o}`;
    }
    this.backgroundStyleMap = t;
  }
  getBackgroudImageStyle(e) {
    const t = this.backgroundStyles, i = t.padding ?? h.padding;
    e ? (t.backgroundImage = `url('${e}')`, t.backgroundPosition = "inherit", t.padding = i === h.padding ? "10px" : i) : (t.backgroundImage = "none", t.backgroundPosition = "-10000px"), this.backgroundStyleMap = t;
  }
  render() {
    var i, a;
    const e = { backgroundColor: this.pageBackroundColor }, t = this.backgroundStyleMap;
    return g`<umb-ref-grid-block class="wysiwg"
      style=${P(e)}
      standalone
      href=${((i = this.config) != null && i.showContentEdit ? (a = this.config) == null ? void 0 : a.editContentPath : void 0) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <umb-ufm-render
        slot="name"
        inline
        .markdown=${this.label}
        .value=${this.content}
      ></umb-ufm-render>
      ${this.unpublished ? g`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : Q}
      <umb-block-grid-areas-container
        slot="areas"
        style="${P(t)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
U = /* @__PURE__ */ new WeakSet();
R = async function(e) {
  if (!e)
    return;
  const t = {
    query: {
      mediaItemId: e
    }
  }, { data: i, error: a } = await W.imageUrl(t);
  if (a)
    return console.error(a), "error";
  if (i !== void 0)
    return i;
};
u.styles = [
  M,
  E`
      :host {
        display: flex;
        height: 100%;
        box-sizing: border-box;
      }
      .left,
      .right {
        display: flexbox;
      }
    `
];
_([
  s({ attribute: !1 })
], u.prototype, "label", 2);
_([
  s({ type: String, reflect: !1 })
], u.prototype, "icon", 2);
_([
  s({ type: Boolean, reflect: !0 })
], u.prototype, "unpublished", 2);
_([
  k()
], u.prototype, "pageBackroundColor", 2);
_([
  k()
], u.prototype, "backgroundStyleMap", 2);
u = _([
  O(re)
], u);
const oe = u, Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgBlockLayoutView() {
    return u;
  },
  default: oe
}, Symbol.toStringTag, { value: "Module" }));
var ne = Object.defineProperty, se = Object.getOwnPropertyDescriptor, T = (e) => {
  throw TypeError(e);
}, f = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? se(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && ne(t, i, r), r;
}, z = (e, t, i) => t.has(e) || T("Cannot " + i), $ = (e, t, i) => (z(e, t, "read from private field"), t.get(e)), L = (e, t, i) => t.has(e) ? T("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), le = (e, t, i, a) => (z(e, t, "write to private field"), t.set(e, i), i), D = (e, t, i) => (z(e, t, "access private method"), i), b, I, H, j;
const ce = "wysiwg-cropped-image";
let p = class extends q {
  constructor() {
    super(...arguments), L(this, I), this.value = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", L(this, b);
  }
  render() {
    const e = D(this, I, j).call(this), t = D(this, I, H).call(this);
    return g` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = $(this, b)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new V()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (le(this, b, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = $(this, b)) == null || t.disconnect());
    })), $(this, b).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var y, v, C;
    if (!((y = this.mediaItem) != null && y.mediaKey))
      return;
    const t = ((v = this.mediaItem.selectedCropAlias) == null ? void 0 : v.toLowerCase()) ?? "", i = (C = this.mediaItem.crops) == null ? void 0 : C.find((l) => l.alias === t), a = i ? JSON.stringify(i) : "", r = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", n = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: a,
        selectedFocalPoint: r
      }
    }, { data: o, error: d } = await W.v2CropUrl(n);
    return this._isLoading = !1, d ? (console.error(d), "error") : o !== void 0 ? o : "no data";
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
b = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakSet();
H = function() {
  if (this._isLoading)
    return g`<div id="loader"><uui-loader></uui-loader></div>`;
};
j = function() {
  var e;
  try {
    return this.value ? g`<img
          id="figure-image"
          part="img"
          src="${this.value ?? ""}"
          alt="${((e = this.mediaItem) == null ? void 0 : e.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : g`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
p.styles = [
  M,
  E`
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

      /* ::part(img) {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;

        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
        background-size: 10px 10px;
        background-repeat: repeat;
      } */
      img {
        display: flex;
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
f([
  s({ type: String })
], p.prototype, "value", 2);
f([
  s({ type: Object })
], p.prototype, "mediaItem", 2);
f([
  s({ type: Number })
], p.prototype, "width", 2);
f([
  s()
], p.prototype, "icon", 2);
f([
  s()
], p.prototype, "loading", 2);
f([
  k()
], p.prototype, "_isLoading", 2);
p = f([
  O(ce)
], p);
var de = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, G = (e) => {
  throw TypeError(e);
}, m = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ge(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && de(t, i, r), r;
}, B = (e, t, i) => t.has(e) || G("Cannot " + i), x = (e, t, i) => (B(e, t, "read from private field"), t.get(e)), K = (e, t, i) => t.has(e) ? G("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ue = (e, t, i, a) => (B(e, t, "write to private field"), t.set(e, i), i), A = (e, t, i) => (B(e, t, "access private method"), i), w, S, J, F;
const he = "wysiwg-image-crop";
let c = class extends q {
  constructor() {
    super(...arguments), K(this, S), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", K(this, w);
  }
  render() {
    const e = A(this, S, F).call(this), t = A(this, S, J).call(this);
    return g` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = x(this, w)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaKey") || e.has("cropAlias") ? this.loadImage() : e.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (ue(this, w, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = x(this, w)) == null || t.disconnect());
    })), x(this, w).observe(this)) : this.generateImageUrl(this.width);
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
    }, { data: i, error: a } = await W.cropUrl(t);
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
};
w = /* @__PURE__ */ new WeakMap();
S = /* @__PURE__ */ new WeakSet();
J = function() {
  if (this._isLoading)
    return g`<div id="loader"><uui-loader></uui-loader></div>`;
};
F = function() {
  try {
    return this._imageUrl ? g`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : g`<div id="icon" part="img"></div>`;
  } catch (e) {
    console.error("wysiwg-image-crop.renderImageCrop error", e);
  }
};
c.styles = [
  M,
  E`
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
m([
  s({ type: String })
], c.prototype, "mediaKey", 2);
m([
  s({ type: String })
], c.prototype, "alt", 2);
m([
  s({ type: String })
], c.prototype, "cropAlias", 2);
m([
  s({ type: Number })
], c.prototype, "width", 2);
m([
  s()
], c.prototype, "icon", 2);
m([
  s()
], c.prototype, "loading", 2);
m([
  k()
], c.prototype, "_isLoading", 2);
m([
  k()
], c.prototype, "_imageUrl", 2);
c = m([
  O(he)
], c);
export {
  c as W,
  Ue as b
};
//# sourceMappingURL=wysiwg-image-crop.element-BRk-Go2k.js.map
