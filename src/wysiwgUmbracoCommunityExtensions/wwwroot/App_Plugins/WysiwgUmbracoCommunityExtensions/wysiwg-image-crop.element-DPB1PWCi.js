import { LitElement as le, styleMap as H, nothing as de, html as c, css as D, property as s, state as O, customElement as K } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as Q } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as T } from "@umbraco-cms/backoffice/style";
import "./headline.view-Bp4C2aJl.js";
import "./paragraph.view-CBgeWAam.js";
import { UmbElementMixin as ce } from "@umbraco-cms/backoffice/element-api";
import { UMB_PROPERTY_DATASET_CONTEXT as ge } from "@umbraco-cms/backoffice/property";
import "./picture-with-crop.view-BzdjLqbe.js";
import "./cropped-picture.view-dQUMznB5.js";
import "./wysiwg-datatype-picker.element-BKj-4eik.js";
import "./wysiwg-image-crops.element-CAGvkQix.js";
import "./wysiwg-image-and-crop-picker.element-BRNk7bK5.js";
import { W as R } from "./services.gen-mcYb1gDV.js";
import "./dashboard.element-k3NXgfvx.js";
import { UmbPropertyValueChangeEvent as he } from "@umbraco-cms/backoffice/property-editor";
var ue = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, Z = (e) => {
  throw TypeError(e);
}, y = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? pe(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && ue(t, i, r), r;
}, q = (e, t, i) => t.has(e) || Z("Cannot " + i), me = (e, t, i) => (q(e, t, "read from private field"), t.get(e)), J = (e, t, i) => t.has(e) ? Z("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), fe = (e, t, i, a) => (q(e, t, "write to private field"), t.set(e, i), i), ye = (e, t, i) => (q(e, t, "access private method"), i), E, A, ee;
const p = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  padding: "0"
}, ve = "#fff", be = "wysiwg-block-layout-view";
let l = class extends ce(le) {
  constructor() {
    super(), J(this, A), this.pageBackroundColor = p.backgroundColor, this.backgroundStyleMap = p, J(this, E), this.consumeContext(
      ge,
      async (e) => this.getSettings(e)
    );
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
      backgroundImage: p.backgroundImage,
      backgroundRepeat: p.backgroundRepeat,
      backgroundPosition: p.backgroundPosition,
      backgroundColor: p.backgroundColor,
      padding: p.padding
    };
  }
  async getSettings(e) {
    var t;
    fe(this, E, e), this.observe(
      (t = me(this, E)) == null ? void 0 : t.properties,
      async (i) => {
        var r, n, o, g, S, I;
        const a = i;
        if (a != null && a.length) {
          let v = (r = a.find((h) => h.alias === "pageBackgroundColor")) == null ? void 0 : r.value;
          v != null && v.value && (this.pageBackroundColor = v.value);
          const w = a.filter((h) => h.editorAlias === "Umbraco.BlockGrid"), V = ((n = this.config) == null ? void 0 : n.editSettingsPath) ?? "";
          console.debug("editSettingsPath: ", V);
          let L = w[0];
          if (w.length > 1)
            for (let h = 0; h < w.length; h++) {
              const b = w[h];
              if (b.alias && V.indexOf(b.alias) >= 0) {
                L = b;
                break;
              }
            }
          const $ = L.value;
          if (console.debug("thisGrid.alias: ", L.alias), (o = $.settingsData) != null && o.length) {
            const h = this, b = (g = $.layout["Umbraco.BlockGrid"]) == null ? void 0 : g.find(
              (u) => u.contentKey === h.contentKey
            ), W = (S = $ == null ? void 0 : $.settingsData) == null ? void 0 : S.find(
              (u) => u.key === (b == null ? void 0 : b.settingsKey)
            ), x = (W == null ? void 0 : W.values) ?? [];
            this.getBackgroudStyle(x);
            const U = (I = x == null ? void 0 : x.find((u) => u.alias === "backgroundImage")) == null ? void 0 : I.value, se = U != null && U.length ? U[0].mediaKey : "";
            await ye(this, A, ee).call(this, se).then((u) => {
              u !== void 0 && u !== "error" && this.getBackgroudImageStyle(u);
            });
          }
        }
      },
      "_observeProperties"
    );
  }
  //#endregion
  getBackgroudStyle(e) {
    var i, a;
    const t = this.backgroundStyleDefaults;
    if (e != null && e.length) {
      const r = (((i = e == null ? void 0 : e.find((g) => g.alias === "backgroundColor")) == null ? void 0 : i.value) ?? {}).value, n = r === ve;
      r && (t.backgroundColor = n ? "transparent" : r);
      let o = (a = e == null ? void 0 : e.find((g) => g.alias === "padding")) == null ? void 0 : a.value;
      o || (o = r && !n ? "10px" : "0", console.debug("padding: ", o)), t.padding = `${o}`;
    }
    this.backgroundStyleMap = t;
  }
  getBackgroudImageStyle(e) {
    const t = this.backgroundStyles, i = t.padding ?? p.padding;
    e ? (t.backgroundImage = `url('${e}')`, t.backgroundPosition = "inherit", t.padding = i === p.padding ? "10px" : i) : (t.backgroundImage = "none", t.backgroundPosition = "-10000px"), this.backgroundStyleMap = t;
  }
  render() {
    var i, a;
    const e = { backgroundColor: this.pageBackroundColor }, t = this.backgroundStyleMap;
    return c`<umb-ref-grid-block class="wysiwg"
      style=${H(e)}
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
      ${this.unpublished ? c`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : de}
      <umb-block-grid-areas-container
        slot="areas"
        style="${H(t)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
E = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakSet();
ee = async function(e) {
  if (!e)
    return;
  const t = {
    query: {
      mediaItemId: e
    }
  }, { data: i, error: a } = await R.imageUrl(t);
  if (a)
    return console.error(a), "error";
  if (i !== void 0)
    return i;
};
l.styles = [
  T,
  D`
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
y([
  s({ attribute: !1 })
], l.prototype, "content", 2);
y([
  s({ attribute: !1 })
], l.prototype, "label", 2);
y([
  s({ type: String, reflect: !1 })
], l.prototype, "icon", 2);
y([
  s({ attribute: !1 })
], l.prototype, "config", 2);
y([
  s({ type: Boolean, reflect: !0 })
], l.prototype, "unpublished", 2);
y([
  s({ attribute: !1 })
], l.prototype, "settings", 2);
y([
  O()
], l.prototype, "backgroundStyleMap", 2);
l = y([
  K(be)
], l);
const _e = l, Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgBlockLayoutView() {
    return l;
  },
  default: _e
}, Symbol.toStringTag, { value: "Module" }));
var we = Object.defineProperty, ke = Object.getOwnPropertyDescriptor, te = (e) => {
  throw TypeError(e);
}, _ = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ke(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && we(t, i, r), r;
}, G = (e, t, i) => t.has(e) || te("Cannot " + i), z = (e, t, i) => (G(e, t, "read from private field"), t.get(e)), j = (e, t, i) => t.has(e) ? te("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ce = (e, t, i, a) => (G(e, t, "write to private field"), t.set(e, i), i), F = (e, t, i) => (G(e, t, "access private method"), i), k, P, ie, ae;
const Se = "wysiwg-cropped-image";
let m = class extends Q {
  constructor() {
    super(...arguments), j(this, P), this.value = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", j(this, k);
  }
  render() {
    const e = F(this, P, ae).call(this), t = F(this, P, ie).call(this);
    return c` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = z(this, k)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new he()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (Ce(this, k, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = z(this, k)) == null || t.disconnect());
    })), z(this, k).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var S, I, v;
    if (!((S = this.mediaItem) != null && S.mediaKey))
      return;
    const t = ((I = this.mediaItem.selectedCropAlias) == null ? void 0 : I.toLowerCase()) ?? "", i = (v = this.mediaItem.crops) == null ? void 0 : v.find((w) => w.alias === t), a = i ? JSON.stringify(i) : "", r = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", n = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: a,
        selectedFocalPoint: r
      }
    }, { data: o, error: g } = await R.v2CropUrl(n);
    return this._isLoading = !1, g ? (console.error(g), "error") : o !== void 0 ? o : "no data";
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
k = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakSet();
ie = function() {
  if (this._isLoading)
    return c`<div id="loader"><uui-loader></uui-loader></div>`;
};
ae = function() {
  var e;
  try {
    return this.value ? c`<img
          id="figure-image"
          part="img"
          src="${this.value ?? ""}"
          alt="${((e = this.mediaItem) == null ? void 0 : e.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : c`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
m.styles = [
  T,
  D`
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
_([
  s({ type: String })
], m.prototype, "value", 2);
_([
  s({ type: Object })
], m.prototype, "mediaItem", 2);
_([
  s({ type: Number })
], m.prototype, "width", 2);
_([
  s()
], m.prototype, "icon", 2);
_([
  s()
], m.prototype, "loading", 2);
_([
  O()
], m.prototype, "_isLoading", 2);
m = _([
  K(Se)
], m);
var Ie = Object.defineProperty, $e = Object.getOwnPropertyDescriptor, re = (e) => {
  throw TypeError(e);
}, f = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? $e(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && Ie(t, i, r), r;
}, N = (e, t, i) => t.has(e) || re("Cannot " + i), B = (e, t, i) => (N(e, t, "read from private field"), t.get(e)), X = (e, t, i) => t.has(e) ? re("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xe = (e, t, i, a) => (N(e, t, "write to private field"), t.set(e, i), i), Y = (e, t, i) => (N(e, t, "access private method"), i), C, M, oe, ne;
const Ue = "wysiwg-image-crop";
let d = class extends Q {
  constructor() {
    super(...arguments), X(this, M), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", X(this, C);
  }
  render() {
    const e = Y(this, M, ne).call(this), t = Y(this, M, oe).call(this);
    return c` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = B(this, C)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaKey") || e.has("cropAlias") ? this.loadImage() : e.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (xe(this, C, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = B(this, C)) == null || t.disconnect());
    })), B(this, C).observe(this)) : this.generateImageUrl(this.width);
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
    }, { data: i, error: a } = await R.cropUrl(t);
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
C = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakSet();
oe = function() {
  if (this._isLoading)
    return c`<div id="loader"><uui-loader></uui-loader></div>`;
};
ne = function() {
  try {
    return this._imageUrl ? c`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : c`<div id="icon" part="img"></div>`;
  } catch (e) {
    console.error("wysiwg-image-crop.renderImageCrop error", e);
  }
};
d.styles = [
  T,
  D`
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
f([
  s({ type: String })
], d.prototype, "mediaKey", 2);
f([
  s({ type: String })
], d.prototype, "alt", 2);
f([
  s({ type: String })
], d.prototype, "cropAlias", 2);
f([
  s({ type: Number })
], d.prototype, "width", 2);
f([
  s()
], d.prototype, "icon", 2);
f([
  s()
], d.prototype, "loading", 2);
f([
  O()
], d.prototype, "_isLoading", 2);
f([
  O()
], d.prototype, "_imageUrl", 2);
d = f([
  K(Ue)
], d);
export {
  d as W,
  Ne as b
};
//# sourceMappingURL=wysiwg-image-crop.element-DPB1PWCi.js.map
