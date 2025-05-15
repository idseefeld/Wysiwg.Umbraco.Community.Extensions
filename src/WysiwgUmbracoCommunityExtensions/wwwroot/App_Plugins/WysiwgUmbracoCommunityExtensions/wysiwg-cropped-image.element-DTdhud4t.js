import { html as s, styleMap as T, nothing as A, css as B, property as l, state as f, customElement as W, ifDefined as z } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as Q } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as D } from "@umbraco-cms/backoffice/style";
import "./headline.view-Bs57Ozuv.js";
import "./paragraph.view-bEw0hP76.js";
import "./picture-with-crop.view-_QUOV5FD.js";
import "./cropped-picture.view-DUCKyoaH.js";
import "./wysiwg-datatype-picker.element-BKj-4eik.js";
import "./wysiwg-image-crops.element-CAGvkQix.js";
import "./wysiwg-image-and-crop-picker.element-BjfauK8v.js";
import { UUICardElement as V, demandCustomElement as j } from "@umbraco-cms/backoffice/external/uui";
import { W as M } from "./services.gen-ya8kz8Ij.js";
import { U as ue } from "./dashboard.element-S6yezZM9.js";
import { W as pe } from "./wysiwg-base-block-editor-custom.view-DVhqiDDI.js";
import { UmbPropertyValueChangeEvent as ge } from "@umbraco-cms/backoffice/property-editor";
var he = Object.defineProperty, me = Object.getOwnPropertyDescriptor, X = (e) => {
  throw TypeError(e);
}, b = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? me(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (o ? a(t, i, r) : a(r)) || r);
  return o && r && he(t, i, r), r;
}, ve = (e, t, i) => t.has(e) || X("Cannot " + i), ye = (e, t, i) => t.has(e) ? X("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), R = (e, t, i) => (ve(e, t, "access private method"), i), E, Z, ee;
const h = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "",
  padding: void 0,
  minHeight: "0"
}, fe = "wysiwg-block-layout-view";
let u = class extends pe {
  constructor() {
    super(...arguments), ye(this, E), this.pageBackroundColor = h.backgroundColor, this.backgroundStyleMap = h, this.isfirstElement = !1, this.pageBackgroundColor = void 0;
  }
  get backgroundStyles() {
    return {
      backgroundImage: this.backgroundStyleMap.backgroundImage,
      backgroundRepeat: this.backgroundStyleMap.backgroundRepeat,
      backgroundPosition: this.backgroundStyleMap.backgroundPosition,
      backgroundColor: this.backgroundStyleMap.backgroundColor,
      padding: this.backgroundStyleMap.padding,
      minHeight: this.backgroundStyleMap.minHeight
    };
  }
  get backgroundStyleDefaults() {
    return {
      backgroundImage: h.backgroundImage,
      backgroundRepeat: h.backgroundRepeat,
      backgroundPosition: h.backgroundPosition,
      backgroundColor: h.backgroundColor,
      padding: h.padding,
      minHeight: h.minHeight
    };
  }
  async prozessSettings(e) {
    var i, o, r;
    const t = "";
    if ((i = e.settingsData) != null && i.length) {
      const n = this, a = e.layout["Umbraco.BlockGrid"];
      if (!a) {
        console.error("No layout found");
        return;
      }
      const _ = a[0].contentKey;
      this.isfirstElement = _ === n.contentKey;
      const y = a == null ? void 0 : a.find(
        (c) => c.contentKey === n.contentKey
      ), p = (o = e == null ? void 0 : e.settingsData) == null ? void 0 : o.find(
        (c) => c.key === (y == null ? void 0 : y.settingsKey)
      ), d = (p == null ? void 0 : p.values) ?? [];
      this.setBackgroudStyle(d);
      const C = (r = d == null ? void 0 : d.find((c) => c.alias === "backgroundImage")) == null ? void 0 : r.value, ce = C != null && C.length ? C[0].mediaKey : "";
      await R(this, E, Z).call(this, ce).then((c) => {
        c !== void 0 && c !== "error" && this.setBackgroudImageStyle(c);
      }), await R(this, E, ee).call(this, t.toString()).then((c) => {
        c !== void 0 && c !== "error" && (this.pageBackgroundColor = c);
      });
    }
  }
  async lastStepObservingProperties(e) {
    var i;
    if (!e) return;
    let t = (i = e.find((o) => o.alias === "pageBackgroundColor")) == null ? void 0 : i.value;
    t != null && t.value && (this.pageBackroundColor = t.value);
  }
  setBackgroudStyle(e) {
    var i, o, r;
    const t = this.backgroundStyleDefaults;
    if (e != null && e.length) {
      const n = (((i = e == null ? void 0 : e.find((d) => d.alias === "backgroundColor")) == null ? void 0 : i.value) ?? {}).value, a = n || (this.pageBackgroundColor ? this.pageBackgroundColor : ""), _ = this.isTransparentColor(a);
      a && (t.backgroundColor = _ ? "" : a);
      const y = (((o = e == null ? void 0 : e.find((d) => d.alias === "minHeight")) == null ? void 0 : o.value) ?? "0").toString();
      t.minHeight = y;
      let p = (r = e == null ? void 0 : e.find((d) => d.alias === "padding")) == null ? void 0 : r.value.toString();
      p || (p = a && !_ ? "10px" : "", console.debug("padding: ", p)), t.padding = p;
    }
    this.backgroundStyleMap = t;
  }
  setBackgroudImageStyle(e) {
    const t = this.backgroundStyles, i = t.padding ?? h.padding;
    e ? (t.backgroundImage = `url('${e}')`, t.backgroundPosition = "inherit", t.padding = !i || i === h.padding ? "10px" : i) : (t.backgroundImage = "none", t.backgroundPosition = "-10000px"), this.backgroundStyleMap = t;
  }
  renderUpdateHint() {
    const e = s`<umb-ufm-render inline .markdown=${this.label} .value=${this.content}></umb-ufm-render>`;
    return !this.isfirstElement || (this.setUpdateStatus(), this.updateStatus !== ue.Update) ? e : s`
        <uui-button id="tooltip-toggle" popovertarget="tooltip-popover" look="primary" type="button" color="danger" compact style="margin-right: 0.5rem;">
          <uui-icon name="alert"></uui-icon>
        </uui-button>${e}

        <uui-popover-container id="tooltip-popover">

          <div class="popover-container" style="display: flex;flex-direction: column;padding: 1rem;border-radius: 3px;width: 200px;background: var(--uui-color-danger);box-shadow: var(--uui-shadow-depth-3);color: white;line-height: 1.4em;">
            <h3>
              <umb-localize key="wysiwg_updateAvailableTitle" .debug=${this._debug}>
                Update Available
              </umb-localize>
            </h3>
            <p>
              <umb-localize key="wysiwg_updateAvailable" .debug=${this._debug}>
                An update is available for the WYSIWYG extensions.
              </umb-localize>
            </p>
          </div>

        </uui-popover-container>
      `;
  }
  render() {
    var i, o;
    const e = { backgroundColor: this.pageBackroundColor }, t = this.backgroundStyleMap;
    return s`
    <umb-ref-grid-block class="wysiwg"
      style=${T(e)}
      standalone
      href=${((i = this.config) != null && i.showContentEdit ? (o = this.config) == null ? void 0 : o.editContentPath : void 0) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <div slot="name">${this.renderUpdateHint()}</div>
      ${this.unpublished ? s`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : A}

      <umb-block-grid-areas-container
        slot="areas"
        style="${T(t)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
E = /* @__PURE__ */ new WeakSet();
Z = async function(e) {
  if (!e)
    return;
  const t = {
    query: {
      mediaItemId: e
    }
  }, { data: i, error: o } = await M.imageUrl(t);
  if (o)
    return console.error(o), "error";
  if (i !== void 0)
    return i;
};
ee = async function(e) {
  if (!e)
    return;
  const t = {
    query: {
      mediaItemId: e
    }
  }, { data: i, error: o } = await M.siteBackgroundColor(t);
  if (o)
    return console.error(o), "error";
  if (i !== void 0)
    return i;
};
u.styles = [
  D,
  B`
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
b([
  l({ attribute: !1 })
], u.prototype, "label", 2);
b([
  l({ type: String, reflect: !1 })
], u.prototype, "icon", 2);
b([
  l({ type: Boolean, reflect: !0 })
], u.prototype, "unpublished", 2);
b([
  f()
], u.prototype, "pageBackroundColor", 2);
b([
  f()
], u.prototype, "backgroundStyleMap", 2);
b([
  f()
], u.prototype, "isfirstElement", 2);
b([
  f()
], u.prototype, "pageBackgroundColor", 2);
u = b([
  W(fe)
], u);
const be = u, Ye = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgBlockLayoutView() {
    return u;
  },
  default: be
}, Symbol.toStringTag, { value: "Module" }));
var we = Object.defineProperty, _e = Object.getOwnPropertyDescriptor, te = (e) => {
  throw TypeError(e);
}, I = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? _e(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (o ? a(t, i, r) : a(r)) || r);
  return o && r && we(t, i, r), r;
}, ke = (e, t, i) => t.has(e) || te("Cannot " + i), Ce = (e, t, i) => t.has(e) ? te("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), O = (e, t, i) => (ke(e, t, "access private method"), i), S, ie, oe, H;
const $e = "wysiwg-card-image";
let k = class extends V {
  constructor() {
    super(...arguments), Ce(this, S), this.name = "", this.fileExt = "", this.hasPreview = !1;
  }
  connectedCallback() {
    super.connectedCallback(), j(this, "uui-symbol-folder"), j(this, "uui-symbol-file");
  }
  queryPreviews(e) {
    this.hasPreview = e.composedPath()[0].assignedElements({
      flatten: !0
    }).length > 0;
  }
  renderMedia() {
    return this.hasPreview === !0 ? "" : this.fileExt === "" ? s`<uui-symbol-folder id="entity-symbol"></uui-symbol-folder>` : s`<uui-symbol-file
      id="entity-symbol"
      type="${this.fileExt}"></uui-symbol-file>`;
  }
  render() {
    return s` ${this.renderMedia()}
      <slot @slotchange=${this.queryPreviews}></slot>
      ${this.href ? O(this, S, oe).call(this) : O(this, S, ie).call(this)}
      <!-- Select border must be right after .open-part -->
      <div id="select-border"></div>

      <slot name="tag"></slot>
      <slot name="actions"></slot>`;
  }
};
S = /* @__PURE__ */ new WeakSet();
ie = function() {
  return s`
      <button
        id="open-part"
        tabindex=${this.disabled ? A : "0"}
        @click=${this.handleOpenClick}
        @keydown=${this.handleOpenKeydown}>
        ${O(this, S, H).call(this)}
      </button>
    `;
};
oe = function() {
  return s`
      <a
        id="open-part"
        tabindex=${this.disabled ? A : "0"}
        href=${z(this.disabled ? void 0 : this.href)}
        target=${z(this.target || void 0)}
        rel=${z(
    this.rel || z(
      this.target === "_blank" ? "noopener noreferrer" : void 0
    )
  )}>
        ${O(this, S, H).call(this)}
      </a>
    `;
};
H = function() {
  return s`
      <div id="content" class="uui-text ellipsis">
        <span id="name" title="${this.name}">${this.name}</span>
        <small id="detail">${this.detail}<slot name="detail"></slot></small>
      </div>
    `;
};
k.styles = [
  ...V.styles,
  B`
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
I([
  l({ type: String })
], k.prototype, "name", 2);
I([
  l({ type: String })
], k.prototype, "detail", 2);
I([
  l({ type: String, attribute: "file-ext" })
], k.prototype, "fileExt", 2);
I([
  f()
], k.prototype, "hasPreview", 2);
k = I([
  W($e)
], k);
var xe = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, re = (e) => {
  throw TypeError(e);
}, v = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Se(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (o ? a(t, i, r) : a(r)) || r);
  return o && r && xe(t, i, r), r;
}, q = (e, t, i) => t.has(e) || re("Cannot " + i), L = (e, t, i) => (q(e, t, "read from private field"), t.get(e)), G = (e, t, i) => t.has(e) ? re("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ie = (e, t, i, o) => (q(e, t, "write to private field"), t.set(e, i), i), J = (e, t, i) => (q(e, t, "access private method"), i), $, U, ae, ne;
const ze = "wysiwg-image-crop";
let g = class extends Q {
  constructor() {
    super(...arguments), G(this, U), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", G(this, $);
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = L(this, $)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaKey") || e.has("cropAlias") ? this.loadImage() : e.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (Ie(this, $, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = L(this, $)) == null || t.disconnect());
    })), L(this, $).observe(this)) : this.generateImageUrl(this.width);
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
    }, { data: i, error: o } = await M.cropUrl(t);
    return this._isLoading = !1, o ? (console.error(o), "error") : i !== void 0 ? i : "no data";
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
    const e = J(this, U, ne).call(this), t = J(this, U, ae).call(this);
    return s` ${e} ${t} `;
  }
};
$ = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakSet();
ae = function() {
  if (this._isLoading)
    return s`<div id="loader"><uui-loader></uui-loader></div>`;
};
ne = function() {
  try {
    return this._imageUrl ? s`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : s`<div id="icon" part="img"></div>`;
  } catch (e) {
    console.error("wysiwg-image-crop.renderImageCrop error", e);
  }
};
g.styles = [
  D,
  B`
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
v([
  l({ type: String })
], g.prototype, "mediaKey", 2);
v([
  l({ type: String })
], g.prototype, "alt", 2);
v([
  l({ type: String })
], g.prototype, "cropAlias", 2);
v([
  l({ type: Number })
], g.prototype, "width", 2);
v([
  l()
], g.prototype, "icon", 2);
v([
  l()
], g.prototype, "loading", 2);
v([
  f()
], g.prototype, "_isLoading", 2);
v([
  f()
], g.prototype, "_imageUrl", 2);
g = v([
  W(ze)
], g);
var Ee = Object.defineProperty, Ue = Object.getOwnPropertyDescriptor, se = (e) => {
  throw TypeError(e);
}, w = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? Ue(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (o ? a(t, i, r) : a(r)) || r);
  return o && r && Ee(t, i, r), r;
}, N = (e, t, i) => t.has(e) || se("Cannot " + i), K = (e, t, i) => (N(e, t, "read from private field"), t.get(e)), Y = (e, t, i) => t.has(e) ? se("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Pe = (e, t, i, o) => (N(e, t, "write to private field"), t.set(e, i), i), F = (e, t, i) => (N(e, t, "access private method"), i), x, P, le, de;
const Oe = "wysiwg-cropped-image";
let m = class extends Q {
  constructor() {
    super(...arguments), Y(this, P), this.value = "", this.alt = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", Y(this, x);
  }
  render() {
    const e = F(this, P, de).call(this), t = F(this, P, le).call(this);
    return s` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = K(this, x)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new ge()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (Pe(this, x, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = K(this, x)) == null || t.disconnect());
    })), K(this, x).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var y, p, d;
    if (!((y = this.mediaItem) != null && y.mediaKey))
      return;
    const t = ((p = this.mediaItem.selectedCropAlias) == null ? void 0 : p.toLowerCase()) ?? "", i = (d = this.mediaItem.crops) == null ? void 0 : d.find((C) => C.alias === t), o = i ? JSON.stringify(i) : "", r = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", n = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: o,
        selectedFocalPoint: r
      }
    }, { data: a, error: _ } = await M.v2CropUrl(n);
    return this._isLoading = !1, _ ? (console.error(_), "error") : a !== void 0 ? a : "no data";
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
x = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakSet();
le = function() {
  if (this._isLoading)
    return s`<div id="loader"><uui-loader></uui-loader></div>`;
};
de = function() {
  var e;
  try {
    return this.value ? s`<img
          id="figure-image"
          src="${this.value ?? ""}"
          alt="${this.alt ?? ((e = this.mediaItem) == null ? void 0 : e.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : s`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
m.styles = [
  D,
  B`
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
w([
  l({ type: String })
], m.prototype, "value", 2);
w([
  l({ type: String })
], m.prototype, "alt", 2);
w([
  l({ type: Object })
], m.prototype, "mediaItem", 2);
w([
  l({ type: Number })
], m.prototype, "width", 2);
w([
  l()
], m.prototype, "icon", 2);
w([
  l()
], m.prototype, "loading", 2);
w([
  f()
], m.prototype, "_isLoading", 2);
m = w([
  W(Oe)
], m);
export {
  g as W,
  m as a,
  Ye as b
};
//# sourceMappingURL=wysiwg-cropped-image.element-DTdhud4t.js.map
