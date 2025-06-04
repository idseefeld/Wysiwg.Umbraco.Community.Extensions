import { css as I, property as s, state as C, customElement as z, html as n, nothing as D, ifDefined as y } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as j } from "@umbraco-cms/backoffice/style";
import "./wysiwg-image-crops.element-WzjeAO76.js";
import "./wysiwg-image-and-crop-picker.element-pFNAOPFJ.js";
import { UUICardElement as H, demandCustomElement as L } from "@umbraco-cms/backoffice/external/uui";
import { W as T } from "./services.gen-ya8kz8Ij.js";
import "./dashboard.element-KXYT37Cl.js";
import { UmbChangeEvent as ee } from "@umbraco-cms/backoffice/event";
var te = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, B = (e) => {
  throw TypeError(e);
}, f = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ie(t, i) : t, l = e.length - 1, o; l >= 0; l--)
    (o = e[l]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && te(t, i, r), r;
}, re = (e, t, i) => t.has(e) || B("Cannot " + i), ae = (e, t, i) => t.has(e) ? B("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), b = (e, t, i) => (re(e, t, "access private method"), i), v, G, J, k;
const se = "wysiwg-card-image";
let u = class extends H {
  constructor() {
    super(...arguments), ae(this, v), this.name = "", this.fileExt = "", this.hasPreview = !1;
  }
  connectedCallback() {
    super.connectedCallback(), L(this, "uui-symbol-folder"), L(this, "uui-symbol-file");
  }
  queryPreviews(e) {
    this.hasPreview = e.composedPath()[0].assignedElements({
      flatten: !0
    }).length > 0;
  }
  renderMedia() {
    return this.hasPreview === !0 ? "" : this.fileExt === "" ? n`<uui-symbol-folder id="entity-symbol"></uui-symbol-folder>` : n`<uui-symbol-file
      id="entity-symbol"
      type="${this.fileExt}"></uui-symbol-file>`;
  }
  render() {
    return n` ${this.renderMedia()}
      <slot @slotchange=${this.queryPreviews}></slot>
      ${this.href ? b(this, v, J).call(this) : b(this, v, G).call(this)}
      <!-- Select border must be right after .open-part -->
      <div id="select-border"></div>

      <slot name="tag"></slot>
      <slot name="actions"></slot>`;
  }
};
v = /* @__PURE__ */ new WeakSet();
G = function() {
  return n`
      <button
        id="open-part"
        tabindex=${this.disabled ? D : "0"}
        @click=${this.handleOpenClick}
        @keydown=${this.handleOpenKeydown}>
        ${b(this, v, k).call(this)}
      </button>
    `;
};
J = function() {
  return n`
      <a
        id="open-part"
        tabindex=${this.disabled ? D : "0"}
        href=${y(this.disabled ? void 0 : this.href)}
        target=${y(this.target || void 0)}
        rel=${y(
    this.rel || y(
      this.target === "_blank" ? "noopener noreferrer" : void 0
    )
  )}>
        ${b(this, v, k).call(this)}
      </a>
    `;
};
k = function() {
  return n`
      <div id="content" class="uui-text ellipsis">
        <span id="name" title="${this.name}">${this.name}</span>
        <small id="detail">${this.detail}<slot name="detail"></slot></small>
      </div>
    `;
};
u.styles = [
  ...H.styles,
  I`
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
f([
  s({ type: String })
], u.prototype, "name", 2);
f([
  s({ type: String })
], u.prototype, "detail", 2);
f([
  s({ type: String, attribute: "file-ext" })
], u.prototype, "fileExt", 2);
f([
  C()
], u.prototype, "hasPreview", 2);
u = f([
  z(se)
], u);
var oe = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, R = (e) => {
  throw TypeError(e);
}, p = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? ne(t, i) : t, l = e.length - 1, o; l >= 0; l--)
    (o = e[l]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && oe(t, i, r), r;
}, U = (e, t, i) => t.has(e) || R("Cannot " + i), $ = (e, t, i) => (U(e, t, "read from private field"), t.get(e)), M = (e, t, i) => t.has(e) ? R("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), le = (e, t, i, a) => (U(e, t, "write to private field"), t.set(e, i), i), A = (e, t, i) => (U(e, t, "access private method"), i), g, w, F, Q;
const de = "wysiwg-image-crop";
let d = class extends N {
  constructor() {
    super(...arguments), M(this, w), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", M(this, g);
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = $(this, g)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaKey") || e.has("cropAlias") ? this.loadImage() : e.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (le(this, g, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = $(this, g)) == null || t.disconnect());
    })), $(this, g).observe(this)) : this.generateImageUrl(this.width);
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
    }, { data: i, error: a } = await T.cropUrl(t);
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
    const e = A(this, w, Q).call(this), t = A(this, w, F).call(this);
    return n` ${e} ${t} `;
  }
};
g = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakSet();
F = function() {
  if (this._isLoading)
    return n`<div id="loader"><uui-loader></uui-loader></div>`;
};
Q = function() {
  try {
    return this._imageUrl ? n`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : n`<div id="icon" part="img"></div>`;
  } catch (e) {
    console.error("wysiwg-image-crop.renderImageCrop error", e);
  }
};
d.styles = [
  j,
  I`
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
p([
  s({ type: String })
], d.prototype, "mediaKey", 2);
p([
  s({ type: String })
], d.prototype, "alt", 2);
p([
  s({ type: String })
], d.prototype, "cropAlias", 2);
p([
  s({ type: Number })
], d.prototype, "width", 2);
p([
  s()
], d.prototype, "icon", 2);
p([
  s()
], d.prototype, "loading", 2);
p([
  C()
], d.prototype, "_isLoading", 2);
p([
  C()
], d.prototype, "_imageUrl", 2);
d = p([
  z(de)
], d);
var ce = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, V = (e) => {
  throw TypeError(e);
}, h = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? pe(t, i) : t, l = e.length - 1, o; l >= 0; l--)
    (o = e[l]) && (r = (a ? o(t, i, r) : o(r)) || r);
  return a && r && ce(t, i, r), r;
}, E = (e, t, i) => t.has(e) || V("Cannot " + i), x = (e, t, i) => (E(e, t, "read from private field"), t.get(e)), q = (e, t, i) => t.has(e) ? V("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), he = (e, t, i, a) => (E(e, t, "write to private field"), t.set(e, i), i), K = (e, t, i) => (E(e, t, "access private method"), i), m, _, X, Y;
const ue = "wysiwg-cropped-image";
let c = class extends N {
  constructor() {
    super(...arguments), q(this, _), this.value = "", this.alt = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", q(this, m);
  }
  render() {
    const e = K(this, _, Y).call(this), t = K(this, _, X).call(this);
    return n` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = x(this, m)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new ee()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (he(this, m, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = x(this, m)) == null || t.disconnect());
    })), x(this, m).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var O, P, W;
    if (!((O = this.mediaItem) != null && O.mediaKey))
      return;
    const t = ((P = this.mediaItem.selectedCropAlias) == null ? void 0 : P.toLowerCase()) ?? "", i = (W = this.mediaItem.crops) == null ? void 0 : W.find((Z) => Z.alias === t), a = i ? JSON.stringify(i) : "", r = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", l = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: a,
        selectedFocalPoint: r
      }
    }, { data: o, error: S } = await T.v2CropUrl(l);
    return this._isLoading = !1, S ? (console.error(S), "error") : o !== void 0 ? o : "no data";
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
_ = /* @__PURE__ */ new WeakSet();
X = function() {
  if (this._isLoading)
    return n`<div id="loader"><uui-loader></uui-loader></div>`;
};
Y = function() {
  var e;
  try {
    return this.value ? n`<img
          id="figure-image"
          src="${this.value ?? ""}"
          alt="${this.alt ?? ((e = this.mediaItem) == null ? void 0 : e.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : n`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
c.styles = [
  j,
  I`
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
h([
  s({ type: String })
], c.prototype, "value", 2);
h([
  s({ type: String })
], c.prototype, "alt", 2);
h([
  s({ type: Object })
], c.prototype, "mediaItem", 2);
h([
  s({ type: Number })
], c.prototype, "width", 2);
h([
  s()
], c.prototype, "icon", 2);
h([
  s()
], c.prototype, "loading", 2);
h([
  C()
], c.prototype, "_isLoading", 2);
c = h([
  z(ue)
], c);
export {
  d as W,
  c as a
};
//# sourceMappingURL=wysiwg-cropped-image.element-C2bjUm-K.js.map
