import { styleMap as j, nothing as L, html as l, css as O, property as s, state as C, customElement as U, ifDefined as S } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as D } from "@umbraco-cms/backoffice/style";
import "./headline.view-BrAsvpqV.js";
import "./paragraph.view-BuXeltMt.js";
import "./picture-with-crop.view-uKUklPHt.js";
import "./cropped-picture.view-BHnWNjdv.js";
import "./wysiwg-datatype-picker.element-BKj-4eik.js";
import "./wysiwg-image-crops.element-CAGvkQix.js";
import "./wysiwg-image-and-crop-picker.element-Dheh-YuP.js";
import { UUICardElement as Q, demandCustomElement as R } from "@umbraco-cms/backoffice/external/uui";
import { W as K } from "./services.gen-B_ebHh4e.js";
import "./dashboard.element-UFlTKH0G.js";
import { W as se } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
import { UmbPropertyValueChangeEvent as le } from "@umbraco-cms/backoffice/property-editor";
var de = Object.defineProperty, ce = Object.getOwnPropertyDescriptor, V = (e) => {
  throw TypeError(e);
}, $ = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? ce(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (a = (r ? o(t, i, a) : o(a)) || a);
  return r && a && de(t, i, a), a;
}, ue = (e, t, i) => t.has(e) || V("Cannot " + i), pe = (e, t, i) => t.has(e) ? V("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ge = (e, t, i) => (ue(e, t, "access private method"), i), B, X;
const h = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  padding: "0"
}, he = "wysiwg-block-layout-view";
let p = class extends se {
  constructor() {
    super(...arguments), pe(this, B), this.pageBackroundColor = h.backgroundColor, this.backgroundStyleMap = h;
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
    var t, i, r, a;
    if ((t = e.settingsData) != null && t.length) {
      const n = this, o = (i = e.layout["Umbraco.BlockGrid"]) == null ? void 0 : i.find(
        (d) => d.contentKey === n.contentKey
      ), u = (r = e == null ? void 0 : e.settingsData) == null ? void 0 : r.find(
        (d) => d.key === (o == null ? void 0 : o.settingsKey)
      ), v = (u == null ? void 0 : u.values) ?? [];
      this.getBackgroudStyle(v);
      const f = (a = v == null ? void 0 : v.find((d) => d.alias === "backgroundImage")) == null ? void 0 : a.value, I = f != null && f.length ? f[0].mediaKey : "";
      await ge(this, B, X).call(this, I).then((d) => {
        d !== void 0 && d !== "error" && this.getBackgroudImageStyle(d);
      });
    }
  }
  async lastStepObservingProperties(e) {
    var i;
    if (!e) return;
    let t = (i = e.find((r) => r.alias === "pageBackgroundColor")) == null ? void 0 : i.value;
    t != null && t.value && (this.pageBackroundColor = t.value);
  }
  getBackgroudStyle(e) {
    var i, r;
    const t = this.backgroundStyleDefaults;
    if (e != null && e.length) {
      const a = (((i = e == null ? void 0 : e.find((u) => u.alias === "backgroundColor")) == null ? void 0 : i.value) ?? {}).value, n = this.isTransparentColor(a);
      a && (t.backgroundColor = n ? "transparent" : a);
      let o = (r = e == null ? void 0 : e.find((u) => u.alias === "padding")) == null ? void 0 : r.value;
      o || (o = a && !n ? "10px" : "0", console.debug("padding: ", o)), t.padding = `${o}`;
    }
    this.backgroundStyleMap = t;
  }
  getBackgroudImageStyle(e) {
    const t = this.backgroundStyles, i = t.padding ?? h.padding;
    e ? (t.backgroundImage = `url('${e}')`, t.backgroundPosition = "inherit", t.padding = i === h.padding ? "10px" : i) : (t.backgroundImage = "none", t.backgroundPosition = "-10000px"), this.backgroundStyleMap = t;
  }
  render() {
    var i, r;
    const e = { backgroundColor: this.pageBackroundColor }, t = this.backgroundStyleMap;
    return l`<umb-ref-grid-block class="wysiwg"
      style=${j(e)}
      standalone
      href=${((i = this.config) != null && i.showContentEdit ? (r = this.config) == null ? void 0 : r.editContentPath : void 0) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <umb-ufm-render
        slot="name"
        inline
        .markdown=${this.label}
        .value=${this.content}
      ></umb-ufm-render>
      ${this.unpublished ? l`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : L}
      <umb-block-grid-areas-container
        slot="areas"
        style="${j(t)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
B = /* @__PURE__ */ new WeakSet();
X = async function(e) {
  if (!e)
    return;
  const t = {
    query: {
      mediaItemId: e
    }
  }, { data: i, error: r } = await K.imageUrl(t);
  if (r)
    return console.error(r), "error";
  if (i !== void 0)
    return i;
};
p.styles = [
  D,
  O`
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
$([
  s({ attribute: !1 })
], p.prototype, "label", 2);
$([
  s({ type: String, reflect: !1 })
], p.prototype, "icon", 2);
$([
  s({ type: Boolean, reflect: !0 })
], p.prototype, "unpublished", 2);
$([
  C()
], p.prototype, "pageBackroundColor", 2);
$([
  C()
], p.prototype, "backgroundStyleMap", 2);
p = $([
  U(he)
], p);
const me = p, Te = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgBlockLayoutView() {
    return p;
  },
  default: me
}, Symbol.toStringTag, { value: "Module" }));
var ye = Object.defineProperty, ve = Object.getOwnPropertyDescriptor, Y = (e) => {
  throw TypeError(e);
}, x = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? ve(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (a = (r ? o(t, i, a) : o(a)) || a);
  return r && a && ye(t, i, a), a;
}, fe = (e, t, i) => t.has(e) || Y("Cannot " + i), be = (e, t, i) => t.has(e) ? Y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), P = (e, t, i) => (fe(e, t, "access private method"), i), k, Z, ee, A;
const we = "wysiwg-card-image";
let b = class extends Q {
  constructor() {
    super(...arguments), be(this, k), this.name = "", this.fileExt = "", this.hasPreview = !1;
  }
  connectedCallback() {
    super.connectedCallback(), R(this, "uui-symbol-folder"), R(this, "uui-symbol-file");
  }
  queryPreviews(e) {
    this.hasPreview = e.composedPath()[0].assignedElements({
      flatten: !0
    }).length > 0;
  }
  renderMedia() {
    return this.hasPreview === !0 ? "" : this.fileExt === "" ? l`<uui-symbol-folder id="entity-symbol"></uui-symbol-folder>` : l`<uui-symbol-file
      id="entity-symbol"
      type="${this.fileExt}"></uui-symbol-file>`;
  }
  render() {
    return l` ${this.renderMedia()}
      <slot @slotchange=${this.queryPreviews}></slot>
      ${this.href ? P(this, k, ee).call(this) : P(this, k, Z).call(this)}
      <!-- Select border must be right after .open-part -->
      <div id="select-border"></div>

      <slot name="tag"></slot>
      <slot name="actions"></slot>`;
  }
};
k = /* @__PURE__ */ new WeakSet();
Z = function() {
  return l`
      <button
        id="open-part"
        tabindex=${this.disabled ? L : "0"}
        @click=${this.handleOpenClick}
        @keydown=${this.handleOpenKeydown}>
        ${P(this, k, A).call(this)}
      </button>
    `;
};
ee = function() {
  return l`
      <a
        id="open-part"
        tabindex=${this.disabled ? L : "0"}
        href=${S(this.disabled ? void 0 : this.href)}
        target=${S(this.target || void 0)}
        rel=${S(
    this.rel || S(
      this.target === "_blank" ? "noopener noreferrer" : void 0
    )
  )}>
        ${P(this, k, A).call(this)}
      </a>
    `;
};
A = function() {
  return l`
      <div id="content" class="uui-text ellipsis">
        <span id="name" title="${this.name}">${this.name}</span>
        <small id="detail">${this.detail}<slot name="detail"></slot></small>
      </div>
    `;
};
b.styles = [
  ...Q.styles,
  O`
      #entity-symbol {
        align-self: center;
        width: 60%;
        margin-bottom: var(--uui-size-layout-1);
        padding: var(--uui-size-space-6);
      }

      slot[name='tag'] {
        position: absolute;
        top: var(--uui-size-4);
        right: var(--uui-size-4);
        display: flex;
        justify-content: right;
        z-index: 2;
      }

      slot[name='actions'] {
        position: absolute;
        top: var(--uui-size-4);
        right: var(--uui-size-4);
        display: flex;
        justify-content: right;
        z-index: 2;
        opacity: 0;
        transition: opacity 120ms;
      }
      :host(:focus) slot[name='actions'],
      :host(:focus-within) slot[name='actions'],
      :host(:hover) slot[name='actions'] {
        opacity: 1;
      }

      slot:not([name])::slotted(*) {
        align-self: center;
        border-radius: var(--uui-border-radius);
        object-fit: cover;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      #open-part {
        position: absolute;
        z-index: 1;
        inset: 0;
        color: var(--uui-color-interactive);
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      :host([disabled]) #open-part {
        pointer-events: none;
        color: var(--uui-color-contrast-disabled);
      }

      #open-part:hover {
        color: var(--uui-color-interactive-emphasis);
      }
      #open-part:hover #name {
        text-decoration: underline;
      }

      #open-part #name {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        overflow-wrap: anywhere;
      }

      :host([image]:not([image=''])) #open-part {
        transition: opacity 0.5s 0.5s;
        opacity: 0;
      }

      #content {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        font-family: inherit;
        box-sizing: border-box;
        text-align: left;
        word-break: break-word;
        padding-top: var(--uui-size-space-3);
        opacity: 0.5;
      }
      #content:hover {
        opacity: 1;
      }
      #content::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        border-top: 1px solid var(--uui-color-divider);
        border-radius: 0 0 var(--uui-border-radius) var(--uui-border-radius);
        background-color: var(--uui-color-surface);
        pointer-events: none;
        opacity: 0.96;
      }

      #detail {
        opacity: 0.6;
      }

      .ellipse{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      :host(
          [image]:not([image='']):hover,
          [image]:not([image='']):focus,
          [image]:not([image='']):focus-within,
          [selected][image]:not([image='']),
          [error][image]:not([image=''])
        )
        #open-part {
        opacity: 1;
        transition-duration: 120ms;
        transition-delay: 0s;
      }

      :host([selectable]) #open-part {
        inset: var(--uui-size-space-3) var(--uui-size-space-4);
      }
      :host(:not([selectable])) #content {
        padding: var(--uui-size-space-3) var(--uui-size-space-4);
      }
      :host([selectable]) #content::before {
        inset: calc(var(--uui-size-space-3) * -1)
          calc(var(--uui-size-space-4) * -1);
        top: 0;
      }
    `
];
x([
  s({ type: String })
], b.prototype, "name", 2);
x([
  s({ type: String })
], b.prototype, "detail", 2);
x([
  s({ type: String, attribute: "file-ext" })
], b.prototype, "fileExt", 2);
x([
  C()
], b.prototype, "hasPreview", 2);
b = x([
  U(we)
], b);
var _e = Object.defineProperty, ke = Object.getOwnPropertyDescriptor, te = (e) => {
  throw TypeError(e);
}, m = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? ke(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (a = (r ? o(t, i, a) : o(a)) || a);
  return r && a && _e(t, i, a), a;
}, q = (e, t, i) => t.has(e) || te("Cannot " + i), W = (e, t, i) => (q(e, t, "read from private field"), t.get(e)), T = (e, t, i) => t.has(e) ? te("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ce = (e, t, i, r) => (q(e, t, "write to private field"), t.set(e, i), i), H = (e, t, i) => (q(e, t, "access private method"), i), w, z, ie, ae;
const $e = "wysiwg-image-crop";
let c = class extends F {
  constructor() {
    super(...arguments), T(this, z), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", T(this, w);
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = W(this, w)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaKey") || e.has("cropAlias") ? this.loadImage() : e.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (Ce(this, w, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = W(this, w)) == null || t.disconnect());
    })), W(this, w).observe(this)) : this.generateImageUrl(this.width);
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
    }, { data: i, error: r } = await K.cropUrl(t);
    return this._isLoading = !1, r ? (console.error(r), "error") : i !== void 0 ? i : "no data";
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
    const e = H(this, z, ae).call(this), t = H(this, z, ie).call(this);
    return l` ${e} ${t} `;
  }
};
w = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
ie = function() {
  if (this._isLoading)
    return l`<div id="loader"><uui-loader></uui-loader></div>`;
};
ae = function() {
  try {
    return this._imageUrl ? l`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : l`<div id="icon" part="img"></div>`;
  } catch (e) {
    console.error("wysiwg-image-crop.renderImageCrop error", e);
  }
};
c.styles = [
  D,
  O`
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
  C()
], c.prototype, "_isLoading", 2);
m([
  C()
], c.prototype, "_imageUrl", 2);
c = m([
  U($e)
], c);
var xe = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, re = (e) => {
  throw TypeError(e);
}, y = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? Ie(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (a = (r ? o(t, i, a) : o(a)) || a);
  return r && a && xe(t, i, a), a;
}, N = (e, t, i) => t.has(e) || re("Cannot " + i), M = (e, t, i) => (N(e, t, "read from private field"), t.get(e)), G = (e, t, i) => t.has(e) ? re("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Se = (e, t, i, r) => (N(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (N(e, t, "access private method"), i), _, E, oe, ne;
const ze = "wysiwg-cropped-image";
let g = class extends F {
  constructor() {
    super(...arguments), G(this, E), this.value = "", this.alt = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", G(this, _);
  }
  render() {
    const e = J(this, E, ne).call(this), t = J(this, E, oe).call(this);
    return l` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = M(this, _)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new le()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (Se(this, _, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = M(this, _)) == null || t.disconnect());
    })), M(this, _).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var v, f, I;
    if (!((v = this.mediaItem) != null && v.mediaKey))
      return;
    const t = ((f = this.mediaItem.selectedCropAlias) == null ? void 0 : f.toLowerCase()) ?? "", i = (I = this.mediaItem.crops) == null ? void 0 : I.find((d) => d.alias === t), r = i ? JSON.stringify(i) : "", a = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", n = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: r,
        selectedFocalPoint: a
      }
    }, { data: o, error: u } = await K.v2CropUrl(n);
    return this._isLoading = !1, u ? (console.error(u), "error") : o !== void 0 ? o : "no data";
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
_ = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
oe = function() {
  if (this._isLoading)
    return l`<div id="loader"><uui-loader></uui-loader></div>`;
};
ne = function() {
  var e;
  try {
    return this.value ? l`<img
          id="figure-image"
          src="${this.value ?? ""}"
          alt="${this.alt ?? ((e = this.mediaItem) == null ? void 0 : e.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : l`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
g.styles = [
  D,
  O`
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
y([
  s({ type: String })
], g.prototype, "value", 2);
y([
  s({ type: String })
], g.prototype, "alt", 2);
y([
  s({ type: Object })
], g.prototype, "mediaItem", 2);
y([
  s({ type: Number })
], g.prototype, "width", 2);
y([
  s()
], g.prototype, "icon", 2);
y([
  s()
], g.prototype, "loading", 2);
y([
  C()
], g.prototype, "_isLoading", 2);
g = y([
  U(ze)
], g);
export {
  c as W,
  g as a,
  Te as b
};
//# sourceMappingURL=wysiwg-cropped-image.element-CntTXJEb.js.map
