import { html as s, styleMap as j, nothing as K, css as P, property as l, state as w, customElement as O, ifDefined as I } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as F } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as A } from "@umbraco-cms/backoffice/style";
import "./headline.view-Bf8XoX5J.js";
import "./paragraph.view-V-mGIrqZ.js";
import "./picture-with-crop.view-CNeKKSaf.js";
import "./cropped-picture.view-BwxvQlwj.js";
import "./wysiwg-datatype-picker.element-BKj-4eik.js";
import "./wysiwg-image-crops.element-CAGvkQix.js";
import "./wysiwg-image-and-crop-picker.element-Dheh-YuP.js";
import { UUICardElement as Q, demandCustomElement as H } from "@umbraco-cms/backoffice/external/uui";
import { W as D } from "./services.gen-B_ebHh4e.js";
import { U as le } from "./dashboard.element-co4pSfph.js";
import { W as de } from "./wysiwg-base-block-editor-custom.view-CYVB1wdx.js";
import { UmbPropertyValueChangeEvent as ce } from "@umbraco-cms/backoffice/property-editor";
var ue = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, V = (e) => {
  throw TypeError(e);
}, _ = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? pe(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (a = (r ? n(t, i, a) : n(a)) || a);
  return r && a && ue(t, i, a), a;
}, he = (e, t, i) => t.has(e) || V("Cannot " + i), ge = (e, t, i) => t.has(e) ? V("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), me = (e, t, i) => (he(e, t, "access private method"), i), B, X;
const g = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  padding: "0"
}, ve = "wysiwg-block-layout-view";
let d = class extends de {
  constructor() {
    super(...arguments), ge(this, B), this.pageBackroundColor = g.backgroundColor, this.backgroundStyleMap = g, this.isfirstElement = !1;
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
      backgroundImage: g.backgroundImage,
      backgroundRepeat: g.backgroundRepeat,
      backgroundPosition: g.backgroundPosition,
      backgroundColor: g.backgroundColor,
      padding: g.padding
    };
  }
  async prozessSettings(e) {
    var t, i, r;
    if ((t = e.settingsData) != null && t.length) {
      const a = this, o = e.layout["Umbraco.BlockGrid"];
      if (!o) {
        console.error("No layout found");
        return;
      }
      const n = o[0].contentKey;
      this.isfirstElement = n === a.contentKey;
      const u = o == null ? void 0 : o.find(
        (h) => h.contentKey === a.contentKey
      ), k = (i = e == null ? void 0 : e.settingsData) == null ? void 0 : i.find(
        (h) => h.key === (u == null ? void 0 : u.settingsKey)
      ), y = (k == null ? void 0 : k.values) ?? [];
      this.getBackgroudStyle(y);
      const f = (r = y == null ? void 0 : y.find((h) => h.alias === "backgroundImage")) == null ? void 0 : r.value, W = f != null && f.length ? f[0].mediaKey : "";
      await me(this, B, X).call(this, W).then((h) => {
        h !== void 0 && h !== "error" && this.getBackgroudImageStyle(h);
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
      const a = (((i = e == null ? void 0 : e.find((u) => u.alias === "backgroundColor")) == null ? void 0 : i.value) ?? {}).value, o = this.isTransparentColor(a);
      a && (t.backgroundColor = o ? "transparent" : a);
      let n = (r = e == null ? void 0 : e.find((u) => u.alias === "padding")) == null ? void 0 : r.value;
      n || (n = a && !o ? "10px" : "0", console.debug("padding: ", n)), t.padding = `${n}`;
    }
    this.backgroundStyleMap = t;
  }
  getBackgroudImageStyle(e) {
    const t = this.backgroundStyles, i = t.padding ?? g.padding;
    e ? (t.backgroundImage = `url('${e}')`, t.backgroundPosition = "inherit", t.padding = i === g.padding ? "10px" : i) : (t.backgroundImage = "none", t.backgroundPosition = "-10000px"), this.backgroundStyleMap = t;
  }
  renderUpdateHint() {
    const e = s`<umb-ufm-render inline .markdown=${this.label} .value=${this.content}></umb-ufm-render>`;
    return !this.isfirstElement || (this.setUpdateStatus(), this.updateStatus !== le.Update) ? e : s`
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
    var i, r;
    const e = { backgroundColor: this.pageBackroundColor }, t = this.backgroundStyleMap;
    return s`
    <umb-ref-grid-block class="wysiwg"
      style=${j(e)}
      standalone
      href=${((i = this.config) != null && i.showContentEdit ? (r = this.config) == null ? void 0 : r.editContentPath : void 0) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <div slot="name">${this.renderUpdateHint()}</div>
      ${this.unpublished ? s`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : K}

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
  }, { data: i, error: r } = await D.imageUrl(t);
  if (r)
    return console.error(r), "error";
  if (i !== void 0)
    return i;
};
d.styles = [
  A,
  P`
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
  l({ attribute: !1 })
], d.prototype, "label", 2);
_([
  l({ type: String, reflect: !1 })
], d.prototype, "icon", 2);
_([
  l({ type: Boolean, reflect: !0 })
], d.prototype, "unpublished", 2);
_([
  w()
], d.prototype, "pageBackroundColor", 2);
_([
  w()
], d.prototype, "backgroundStyleMap", 2);
_([
  w()
], d.prototype, "isfirstElement", 2);
d = _([
  O(ve)
], d);
const ye = d, Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgBlockLayoutView() {
    return d;
  },
  default: ye
}, Symbol.toStringTag, { value: "Module" }));
var fe = Object.defineProperty, be = Object.getOwnPropertyDescriptor, Z = (e) => {
  throw TypeError(e);
}, S = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? be(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (a = (r ? n(t, i, a) : n(a)) || a);
  return r && a && fe(t, i, a), a;
}, we = (e, t, i) => t.has(e) || Z("Cannot " + i), _e = (e, t, i) => t.has(e) ? Z("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), U = (e, t, i) => (we(e, t, "access private method"), i), x, ee, te, q;
const ke = "wysiwg-card-image";
let b = class extends Q {
  constructor() {
    super(...arguments), _e(this, x), this.name = "", this.fileExt = "", this.hasPreview = !1;
  }
  connectedCallback() {
    super.connectedCallback(), H(this, "uui-symbol-folder"), H(this, "uui-symbol-file");
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
      ${this.href ? U(this, x, te).call(this) : U(this, x, ee).call(this)}
      <!-- Select border must be right after .open-part -->
      <div id="select-border"></div>

      <slot name="tag"></slot>
      <slot name="actions"></slot>`;
  }
};
x = /* @__PURE__ */ new WeakSet();
ee = function() {
  return s`
      <button
        id="open-part"
        tabindex=${this.disabled ? K : "0"}
        @click=${this.handleOpenClick}
        @keydown=${this.handleOpenKeydown}>
        ${U(this, x, q).call(this)}
      </button>
    `;
};
te = function() {
  return s`
      <a
        id="open-part"
        tabindex=${this.disabled ? K : "0"}
        href=${I(this.disabled ? void 0 : this.href)}
        target=${I(this.target || void 0)}
        rel=${I(
    this.rel || I(
      this.target === "_blank" ? "noopener noreferrer" : void 0
    )
  )}>
        ${U(this, x, q).call(this)}
      </a>
    `;
};
q = function() {
  return s`
      <div id="content" class="uui-text ellipsis">
        <span id="name" title="${this.name}">${this.name}</span>
        <small id="detail">${this.detail}<slot name="detail"></slot></small>
      </div>
    `;
};
b.styles = [
  ...Q.styles,
  P`
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
S([
  l({ type: String })
], b.prototype, "name", 2);
S([
  l({ type: String })
], b.prototype, "detail", 2);
S([
  l({ type: String, attribute: "file-ext" })
], b.prototype, "fileExt", 2);
S([
  w()
], b.prototype, "hasPreview", 2);
b = S([
  O(ke)
], b);
var Ce = Object.defineProperty, $e = Object.getOwnPropertyDescriptor, ie = (e) => {
  throw TypeError(e);
}, m = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? $e(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (a = (r ? n(t, i, a) : n(a)) || a);
  return r && a && Ce(t, i, a), a;
}, N = (e, t, i) => t.has(e) || ie("Cannot " + i), M = (e, t, i) => (N(e, t, "read from private field"), t.get(e)), R = (e, t, i) => t.has(e) ? ie("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), xe = (e, t, i, r) => (N(e, t, "write to private field"), t.set(e, i), i), G = (e, t, i) => (N(e, t, "access private method"), i), C, z, ae, re;
const Se = "wysiwg-image-crop";
let c = class extends F {
  constructor() {
    super(...arguments), R(this, z), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", R(this, C);
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = M(this, C)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaKey") || e.has("cropAlias") ? this.loadImage() : e.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (xe(this, C, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = M(this, C)) == null || t.disconnect());
    })), M(this, C).observe(this)) : this.generateImageUrl(this.width);
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
    }, { data: i, error: r } = await D.cropUrl(t);
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
    const e = G(this, z, re).call(this), t = G(this, z, ae).call(this);
    return s` ${e} ${t} `;
  }
};
C = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakSet();
ae = function() {
  if (this._isLoading)
    return s`<div id="loader"><uui-loader></uui-loader></div>`;
};
re = function() {
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
c.styles = [
  A,
  P`
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
  l({ type: String })
], c.prototype, "mediaKey", 2);
m([
  l({ type: String })
], c.prototype, "alt", 2);
m([
  l({ type: String })
], c.prototype, "cropAlias", 2);
m([
  l({ type: Number })
], c.prototype, "width", 2);
m([
  l()
], c.prototype, "icon", 2);
m([
  l()
], c.prototype, "loading", 2);
m([
  w()
], c.prototype, "_isLoading", 2);
m([
  w()
], c.prototype, "_imageUrl", 2);
c = m([
  O(Se)
], c);
var Ie = Object.defineProperty, ze = Object.getOwnPropertyDescriptor, oe = (e) => {
  throw TypeError(e);
}, v = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? ze(t, i) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (a = (r ? n(t, i, a) : n(a)) || a);
  return r && a && Ie(t, i, a), a;
}, T = (e, t, i) => t.has(e) || oe("Cannot " + i), L = (e, t, i) => (T(e, t, "read from private field"), t.get(e)), J = (e, t, i) => t.has(e) ? oe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ee = (e, t, i, r) => (T(e, t, "write to private field"), t.set(e, i), i), Y = (e, t, i) => (T(e, t, "access private method"), i), $, E, ne, se;
const Ue = "wysiwg-cropped-image";
let p = class extends F {
  constructor() {
    super(...arguments), J(this, E), this.value = "", this.alt = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", J(this, $);
  }
  render() {
    const e = Y(this, E, se).call(this), t = Y(this, E, ne).call(this);
    return s` ${e} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = L(this, $)) == null || e.disconnect();
  }
  updated(e) {
    super.updated(e), e.has("mediaItem") && this.loadImage(), e.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new ce()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (Ee(this, $, new IntersectionObserver((e) => {
      var t;
      e[0].isIntersecting && (this.generateImageUrl(e[0].boundingClientRect.width), (t = L(this, $)) == null || t.disconnect());
    })), L(this, $).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(e) {
    var k, y, f;
    if (!((k = this.mediaItem) != null && k.mediaKey))
      return;
    const t = ((y = this.mediaItem.selectedCropAlias) == null ? void 0 : y.toLowerCase()) ?? "", i = (f = this.mediaItem.crops) == null ? void 0 : f.find((W) => W.alias === t), r = i ? JSON.stringify(i) : "", a = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", o = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: e,
        selectedCrop: r,
        selectedFocalPoint: a
      }
    }, { data: n, error: u } = await D.v2CropUrl(o);
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
$ = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakSet();
ne = function() {
  if (this._isLoading)
    return s`<div id="loader"><uui-loader></uui-loader></div>`;
};
se = function() {
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
p.styles = [
  A,
  P`
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
v([
  l({ type: String })
], p.prototype, "value", 2);
v([
  l({ type: String })
], p.prototype, "alt", 2);
v([
  l({ type: Object })
], p.prototype, "mediaItem", 2);
v([
  l({ type: Number })
], p.prototype, "width", 2);
v([
  l()
], p.prototype, "icon", 2);
v([
  l()
], p.prototype, "loading", 2);
v([
  w()
], p.prototype, "_isLoading", 2);
p = v([
  O(Ue)
], p);
export {
  c as W,
  p as a,
  Ge as b
};
//# sourceMappingURL=wysiwg-cropped-image.element-jxnxXK1I.js.map
