import { styleMap as bt, nothing as ie, html as f, css as ht, property as u, state as j, customElement as dt, ifDefined as J } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as Rt } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles as pt } from "@umbraco-cms/backoffice/style";
import "./headline.view-DPLPckUa.js";
import "./paragraph.view-ChR31KwU.js";
import "./picture-with-crop.view-uKUklPHt.js";
import "./cropped-picture.view-BrtEb5K0.js";
import "./wysiwg-datatype-picker.element-BKj-4eik.js";
import "./wysiwg-image-crops.element-CAGvkQix.js";
import "./wysiwg-image-and-crop-picker.element-CBM75-DY.js";
import { UUICardElement as Lt, demandCustomElement as wt } from "@umbraco-cms/backoffice/external/uui";
import { W as ut } from "./services.gen-B_ebHh4e.js";
import "./dashboard.element-B_ANfST9.js";
import { UmbPropertyValueChangeEvent as se } from "@umbraco-cms/backoffice/property-editor";
import { W as re } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
var oe = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, Bt = (i) => {
  throw TypeError(i);
}, H = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? ne(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && oe(t, e, r), r;
}, ae = (i, t, e) => t.has(i) || Bt("Cannot " + e), le = (i, t, e) => t.has(i) ? Bt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(i) : t.set(i, e), ce = (i, t, e) => (ae(i, t, "access private method"), e), ct, Wt;
const v = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  padding: "0"
}, he = "wysiwg-block-layout-view";
let m = class extends re {
  constructor() {
    super(...arguments), le(this, ct), this.pageBackroundColor = v.backgroundColor, this.backgroundStyleMap = v;
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
      backgroundImage: v.backgroundImage,
      backgroundRepeat: v.backgroundRepeat,
      backgroundPosition: v.backgroundPosition,
      backgroundColor: v.backgroundColor,
      padding: v.padding
    };
  }
  async prozessSettings(i) {
    var t, e, s, r;
    if ((t = i.settingsData) != null && t.length) {
      const n = this, o = (e = i.layout["Umbraco.BlockGrid"]) == null ? void 0 : e.find(
        (c) => c.contentKey === n.contentKey
      ), l = (s = i == null ? void 0 : i.settingsData) == null ? void 0 : s.find(
        (c) => c.key === (o == null ? void 0 : o.settingsKey)
      ), a = (l == null ? void 0 : l.values) ?? [];
      this.getBackgroudStyle(a);
      const h = (r = a == null ? void 0 : a.find((c) => c.alias === "backgroundImage")) == null ? void 0 : r.value, d = h != null && h.length ? h[0].mediaKey : "";
      await ce(this, ct, Wt).call(this, d).then((c) => {
        c !== void 0 && c !== "error" && this.getBackgroudImageStyle(c);
      });
    }
  }
  async lastStepObservingProperties(i) {
    var e;
    if (!i) return;
    let t = (e = i.find((s) => s.alias === "pageBackgroundColor")) == null ? void 0 : e.value;
    t != null && t.value && (this.pageBackroundColor = t.value);
  }
  getBackgroudStyle(i) {
    var e, s;
    const t = this.backgroundStyleDefaults;
    if (i != null && i.length) {
      const r = (((e = i == null ? void 0 : i.find((l) => l.alias === "backgroundColor")) == null ? void 0 : e.value) ?? {}).value, n = this.isTransparentColor(r);
      r && (t.backgroundColor = n ? "transparent" : r);
      let o = (s = i == null ? void 0 : i.find((l) => l.alias === "padding")) == null ? void 0 : s.value;
      o || (o = r && !n ? "10px" : "0", console.debug("padding: ", o)), t.padding = `${o}`;
    }
    this.backgroundStyleMap = t;
  }
  getBackgroudImageStyle(i) {
    const t = this.backgroundStyles, e = t.padding ?? v.padding;
    i ? (t.backgroundImage = `url('${i}')`, t.backgroundPosition = "inherit", t.padding = e === v.padding ? "10px" : e) : (t.backgroundImage = "none", t.backgroundPosition = "-10000px"), this.backgroundStyleMap = t;
  }
  render() {
    var e, s;
    const i = { backgroundColor: this.pageBackroundColor }, t = this.backgroundStyleMap;
    return f`<umb-ref-grid-block class="wysiwg"
      style=${bt(i)}
      standalone
      href=${((e = this.config) != null && e.showContentEdit ? (s = this.config) == null ? void 0 : s.editContentPath : void 0) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <umb-ufm-render
        slot="name"
        inline
        .markdown=${this.label}
        .value=${this.content}
      ></umb-ufm-render>
      ${this.unpublished ? f`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>` : ie}
      <umb-block-grid-areas-container
        slot="areas"
        style="${bt(t)}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }
};
ct = /* @__PURE__ */ new WeakSet();
Wt = async function(i) {
  if (!i)
    return;
  const t = {
    query: {
      mediaItemId: i
    }
  }, { data: e, error: s } = await ut.imageUrl(t);
  if (s)
    return console.error(s), "error";
  if (e !== void 0)
    return e;
};
m.styles = [
  pt,
  ht`
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
H([
  u({ attribute: !1 })
], m.prototype, "label", 2);
H([
  u({ type: String, reflect: !1 })
], m.prototype, "icon", 2);
H([
  u({ type: Boolean, reflect: !0 })
], m.prototype, "unpublished", 2);
H([
  j()
], m.prototype, "pageBackroundColor", 2);
H([
  j()
], m.prototype, "backgroundStyleMap", 2);
m = H([
  dt(he)
], m);
const de = m, hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get WysiwgBlockLayoutView() {
    return m;
  },
  default: de
}, Symbol.toStringTag, { value: "Module" }));
var pe = Object.defineProperty, ue = Object.getOwnPropertyDescriptor, Dt = (i) => {
  throw TypeError(i);
}, x = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? ue(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && pe(t, e, r), r;
}, gt = (i, t, e) => t.has(i) || Dt("Cannot " + e), st = (i, t, e) => (gt(i, t, "read from private field"), t.get(i)), At = (i, t, e) => t.has(i) ? Dt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(i) : t.set(i, e), ge = (i, t, e, s) => (gt(i, t, "write to private field"), t.set(i, e), e), St = (i, t, e) => (gt(i, t, "access private method"), e), P, G, jt, qt;
const fe = "wysiwg-cropped-image";
let _ = class extends Rt {
  constructor() {
    super(...arguments), At(this, G), this.value = "", this.mediaItem = null, this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._prevImgSrc = "", At(this, P);
  }
  render() {
    const i = St(this, G, qt).call(this), t = St(this, G, jt).call(this);
    return f` ${i} ${t} `;
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var i;
    super.disconnectedCallback(), (i = st(this, P)) == null || i.disconnect();
  }
  updated(i) {
    super.updated(i), i.has("mediaItem") && this.loadImage(), i.has("value") && this._prevImgSrc !== this.value && (this.dispatchEvent(new se()), this._prevImgSrc = this.value);
  }
  loadImage() {
    this.loading === "lazy" ? (ge(this, P, new IntersectionObserver((i) => {
      var t;
      i[0].isIntersecting && (this.generateImageUrl(i[0].boundingClientRect.width), (t = st(this, P)) == null || t.disconnect());
    })), st(this, P).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(i) {
    var a, h, d;
    if (!((a = this.mediaItem) != null && a.mediaKey))
      return;
    const t = ((h = this.mediaItem.selectedCropAlias) == null ? void 0 : h.toLowerCase()) ?? "", e = (d = this.mediaItem.crops) == null ? void 0 : d.find((c) => c.alias === t), s = e ? JSON.stringify(e) : "", r = this.mediaItem.focalPoint ? JSON.stringify(this.mediaItem.focalPoint) : "", n = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: t,
        width: i,
        selectedCrop: s,
        selectedFocalPoint: r
      }
    }, { data: o, error: l } = await ut.v2CropUrl(n);
    return this._isLoading = !1, l ? (console.error(l), "error") : o !== void 0 ? o : "no data";
  }
  async generateImageUrl(i) {
    await this.requestCropUrl(i).then((t) => {
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
P = /* @__PURE__ */ new WeakMap();
G = /* @__PURE__ */ new WeakSet();
jt = function() {
  if (this._isLoading)
    return f`<div id="loader"><uui-loader></uui-loader></div>`;
};
qt = function() {
  var i;
  try {
    return this.value ? f`<img
          id="figure-image"
          part="img"
          src="${this.value ?? ""}"
          alt="${((i = this.mediaItem) == null ? void 0 : i.mediaKey) ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : f`<div id="icon" part="img"></div>`;
  } catch (t) {
    console.error("wysiwg-image-crop.renderImageCrop error", t);
  }
};
_.styles = [
  pt,
  ht`
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
x([
  u({ type: String })
], _.prototype, "value", 2);
x([
  u({ type: Object })
], _.prototype, "mediaItem", 2);
x([
  u({ type: Number })
], _.prototype, "width", 2);
x([
  u()
], _.prototype, "icon", 2);
x([
  u()
], _.prototype, "loading", 2);
x([
  j()
], _.prototype, "_isLoading", 2);
_ = x([
  dt(fe)
], _);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, ft = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, mt = Symbol(), Ct = /* @__PURE__ */ new WeakMap();
let Kt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== mt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (ft && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Ct.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Ct.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const me = (i) => new Kt(typeof i == "string" ? i : i + "", void 0, mt), ye = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new Kt(e, i, mt);
}, ve = (i, t) => {
  if (ft) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = F.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, Et = ft ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return me(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: _e, defineProperty: $e, getOwnPropertyDescriptor: be, getOwnPropertyNames: we, getOwnPropertySymbols: Ae, getPrototypeOf: Se } = Object, A = globalThis, kt = A.trustedTypes, Ce = kt ? kt.emptyScript : "", rt = A.reactiveElementPolyfillSupport, R = (i, t) => i, X = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ce : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, yt = (i, t) => !_e(i, t), xt = { attribute: !0, type: String, converter: X, reflect: !1, hasChanged: yt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), A.litPropertyMetadata ?? (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class U extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = xt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && $e(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = be(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get() {
      return r == null ? void 0 : r.call(this);
    }, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? xt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = Se(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const e = this.properties, s = [...we(e), ...Ae(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(Et(r));
    } else t !== void 0 && e.push(Et(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ve(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$EC(t, e) {
    var n;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : X).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : X;
      this._$Em = r, this[r] = l.fromAttribute(e, o.type), this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    if (t !== void 0) {
      if (s ?? (s = this.constructor.getPropertyOptions(t)), !(s.hasChanged ?? yt)(this[t], e)) return;
      this.P(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, e, s) {
    this._$AL.has(t) || this._$AL.set(t, e), s.reflect === !0 && this._$Em !== t && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) o.wrapped !== !0 || this._$AL.has(n) || this[n] === void 0 || this.P(n, this[n], o);
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(e)) : this._$EU();
    } catch (r) {
      throw t = !1, this._$EU(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((e) => this._$EC(e, this[e]))), this._$EU();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
U.elementStyles = [], U.shadowRootOptions = { mode: "open" }, U[R("elementProperties")] = /* @__PURE__ */ new Map(), U[R("finalized")] = /* @__PURE__ */ new Map(), rt == null || rt({ ReactiveElement: U }), (A.reactiveElementVersions ?? (A.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, Y = L.trustedTypes, Pt = Y ? Y.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Vt = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, Jt = "?" + w, Ee = `<${Jt}>`, E = document, B = () => E.createComment(""), W = (i) => i === null || typeof i != "object" && typeof i != "function", vt = Array.isArray, ke = (i) => vt(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", ot = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ut = /-->/g, It = />/g, S = RegExp(`>|${ot}(?:([^\\s"'>=/]+)(${ot}*=${ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ot = /'/g, Mt = /"/g, Gt = /^(?:script|style|textarea|title)$/i, xe = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), O = xe(1), z = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), zt = /* @__PURE__ */ new WeakMap(), C = E.createTreeWalker(E, 129);
function Ft(i, t) {
  if (!vt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Pt !== void 0 ? Pt.createHTML(t) : t;
}
const Pe = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = N;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let h, d, c = -1, y = 0;
    for (; y < a.length && (o.lastIndex = y, d = o.exec(a), d !== null); ) y = o.lastIndex, o === N ? d[1] === "!--" ? o = Ut : d[1] !== void 0 ? o = It : d[2] !== void 0 ? (Gt.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = S) : d[3] !== void 0 && (o = S) : o === S ? d[0] === ">" ? (o = r ?? N, c = -1) : d[1] === void 0 ? c = -2 : (c = o.lastIndex - d[2].length, h = d[1], o = d[3] === void 0 ? S : d[3] === '"' ? Mt : Ot) : o === Mt || o === Ot ? o = S : o === Ut || o === It ? o = N : (o = S, r = void 0);
    const b = o === S && i[l + 1].startsWith("/>") ? " " : "";
    n += o === N ? a + Ee : c >= 0 ? (s.push(h), a.slice(0, c) + Vt + a.slice(c) + w + b) : a + w + (c === -2 ? l : b);
  }
  return [Ft(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class D {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [h, d] = Pe(t, e);
    if (this.el = D.createElement(h, s), C.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = C.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(Vt)) {
          const y = d[o++], b = r.getAttribute(c).split(w), V = /([.?@])?(.*)/.exec(y);
          a.push({ type: 1, index: n, name: V[2], strings: b, ctor: V[1] === "." ? Ie : V[1] === "?" ? Oe : V[1] === "@" ? Me : et }), r.removeAttribute(c);
        } else c.startsWith(w) && (a.push({ type: 6, index: n }), r.removeAttribute(c));
        if (Gt.test(r.tagName)) {
          const c = r.textContent.split(w), y = c.length - 1;
          if (y > 0) {
            r.textContent = Y ? Y.emptyScript : "";
            for (let b = 0; b < y; b++) r.append(c[b], B()), C.nextNode(), a.push({ type: 2, index: ++n });
            r.append(c[y], B());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Jt) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(w, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += w.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = E.createElement("template");
    return s.innerHTML = t, s;
  }
}
function T(i, t, e = i, s) {
  var o, l;
  if (t === z) return t;
  let r = s !== void 0 ? (o = e._$Co) == null ? void 0 : o[s] : e._$Cl;
  const n = W(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = T(i, r._$AS(i, t.values), r, s)), t;
}
class Ue {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? E).importNode(e, !0);
    C.currentNode = r;
    let n = C.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new q(n, n.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (h = new ze(n, this, t)), this._$AV.push(h), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = C.nextNode(), o++);
    }
    return C.currentNode = E, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class q {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = T(this, t, e), W(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== z && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ke(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && W(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = D.createElement(Ft(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new Ue(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = zt.get(t.strings);
    return e === void 0 && zt.set(t.strings, e = new D(t)), e;
  }
  k(t) {
    vt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new q(this.O(B()), this.O(B()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class et {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = T(this, t, e, 0), o = !W(t) || t !== this._$AH && t !== z, o && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = n[0], a = 0; a < n.length - 1; a++) h = T(this, l[s + a], e, a), h === z && (h = this._$AH[a]), o || (o = !W(h) || h !== this._$AH[a]), h === p ? t = p : t !== p && (t += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ie extends et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Oe extends et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Me extends et {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? p) === z) return;
    const s = this._$AH, r = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== p && (s === p || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ze {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    T(this, t);
  }
}
const nt = L.litHtmlPolyfillSupport;
nt == null || nt(D, q), (L.litHtmlVersions ?? (L.litHtmlVersions = [])).push("3.2.1");
const Te = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new q(t.insertBefore(B(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Z = class extends U {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Te(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return z;
  }
};
var Nt;
Z._$litElement$ = !0, Z.finalized = !0, (Nt = globalThis.litElementHydrateSupport) == null || Nt.call(globalThis, { LitElement: Z });
const at = globalThis.litElementPolyfillSupport;
at == null || at({ LitElement: Z });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ne = { attribute: !0, type: String, converter: X, reflect: !1, hasChanged: yt }, Re = (i = Ne, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), n.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, i);
    }, init(l) {
      return l !== void 0 && this.P(o, void 0, i), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, i);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function it(i) {
  return (t, e) => typeof e == "object" ? Re(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, o ? { ...s, wrapped: !0 } : s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Le(i) {
  return it({ ...i, state: !0, attribute: !1 });
}
var Be = Object.defineProperty, We = Object.getOwnPropertyDescriptor, Zt = (i) => {
  throw TypeError(i);
}, K = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? We(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && Be(t, e, r), r;
}, De = (i, t, e) => t.has(i) || Zt("Cannot " + e), je = (i, t, e) => t.has(i) ? Zt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(i) : t.set(i, e), tt = (i, t, e) => (De(i, t, "access private method"), e), M, Qt, Xt, _t;
const qe = "wysiwg-card-image";
let k = class extends Lt {
  constructor() {
    super(...arguments), je(this, M), this.name = "", this.fileExt = "", this.hasPreview = !1;
  }
  connectedCallback() {
    super.connectedCallback(), wt(this, "uui-symbol-folder"), wt(this, "uui-symbol-file");
  }
  queryPreviews(i) {
    this.hasPreview = i.composedPath()[0].assignedElements({
      flatten: !0
    }).length > 0;
  }
  renderMedia() {
    return this.hasPreview === !0 ? "" : this.fileExt === "" ? O`<uui-symbol-folder id="entity-symbol"></uui-symbol-folder>` : O`<uui-symbol-file
      id="entity-symbol"
      type="${this.fileExt}"></uui-symbol-file>`;
  }
  render() {
    return O` ${this.renderMedia()}
      <slot @slotchange=${this.queryPreviews}></slot>
      ${this.href ? tt(this, M, Xt).call(this) : tt(this, M, Qt).call(this)}
      <!-- Select border must be right after .open-part -->
      <div id="select-border"></div>

      <slot name="tag"></slot>
      <slot name="actions"></slot>`;
  }
};
M = /* @__PURE__ */ new WeakSet();
Qt = function() {
  return O`
      <button
        id="open-part"
        tabindex=${this.disabled ? p : "0"}
        @click=${this.handleOpenClick}
        @keydown=${this.handleOpenKeydown}>
        ${tt(this, M, _t).call(this)}
      </button>
    `;
};
Xt = function() {
  return O`
      <a
        id="open-part"
        tabindex=${this.disabled ? p : "0"}
        href=${J(this.disabled ? void 0 : this.href)}
        target=${J(this.target || void 0)}
        rel=${J(
    this.rel || J(
      this.target === "_blank" ? "noopener noreferrer" : void 0
    )
  )}>
        ${tt(this, M, _t).call(this)}
      </a>
    `;
};
_t = function() {
  return O`
      <div id="content" class="uui-text ellipsis">
        <span id="name" title="${this.name}">${this.name}</span>
        <small id="detail">${this.detail}<slot name="detail"></slot></small>
      </div>
    `;
};
k.styles = [
  ...Lt.styles,
  ye`
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
K([
  it({ type: String })
], k.prototype, "name", 2);
K([
  it({ type: String })
], k.prototype, "detail", 2);
K([
  it({ type: String, attribute: "file-ext" })
], k.prototype, "fileExt", 2);
K([
  Le()
], k.prototype, "hasPreview", 2);
k = K([
  He(qe)
], k);
var Ke = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, Yt = (i) => {
  throw TypeError(i);
}, $ = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Ve(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && Ke(t, e, r), r;
}, $t = (i, t, e) => t.has(i) || Yt("Cannot " + e), lt = (i, t, e) => ($t(i, t, "read from private field"), t.get(i)), Tt = (i, t, e) => t.has(i) ? Yt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(i) : t.set(i, e), Je = (i, t, e, s) => ($t(i, t, "write to private field"), t.set(i, e), e), Ht = (i, t, e) => ($t(i, t, "access private method"), e), I, Q, te, ee;
const Ge = "wysiwg-image-crop";
let g = class extends Rt {
  constructor() {
    super(...arguments), Tt(this, Q), this.cropAlias = "", this.width = 1200, this.icon = "icon-picture", this.loading = "lazy", this._isLoading = !0, this._imageUrl = "", Tt(this, I);
  }
  connectedCallback() {
    super.connectedCallback(), this.loadImage();
  }
  disconnectedCallback() {
    var i;
    super.disconnectedCallback(), (i = lt(this, I)) == null || i.disconnect();
  }
  updated(i) {
    super.updated(i), i.has("mediaKey") || i.has("cropAlias") ? this.loadImage() : i.has("_imageUrl");
  }
  loadImage() {
    this.loading === "lazy" ? (Je(this, I, new IntersectionObserver((i) => {
      var t;
      i[0].isIntersecting && (this.generateImageUrl(i[0].boundingClientRect.width), (t = lt(this, I)) == null || t.disconnect());
    })), lt(this, I).observe(this)) : this.generateImageUrl(this.width);
  }
  async requestCropUrl(i) {
    if (!this.mediaKey)
      return;
    const t = {
      query: {
        mediaItemId: this.mediaKey,
        cropAlias: this.cropAlias,
        width: i
      }
    }, { data: e, error: s } = await ut.cropUrl(t);
    return this._isLoading = !1, s ? (console.error(s), "error") : e !== void 0 ? e : "no data";
  }
  async generateImageUrl(i) {
    await this.requestCropUrl(i).then((t) => {
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
    const i = Ht(this, Q, ee).call(this), t = Ht(this, Q, te).call(this);
    return f` ${i} ${t} `;
  }
};
I = /* @__PURE__ */ new WeakMap();
Q = /* @__PURE__ */ new WeakSet();
te = function() {
  if (this._isLoading)
    return f`<div id="loader"><uui-loader></uui-loader></div>`;
};
ee = function() {
  try {
    return this._imageUrl ? f`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />` : f`<div id="icon" part="img"></div>`;
  } catch (i) {
    console.error("wysiwg-image-crop.renderImageCrop error", i);
  }
};
g.styles = [
  pt,
  ht`
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
$([
  u({ type: String })
], g.prototype, "mediaKey", 2);
$([
  u({ type: String })
], g.prototype, "alt", 2);
$([
  u({ type: String })
], g.prototype, "cropAlias", 2);
$([
  u({ type: Number })
], g.prototype, "width", 2);
$([
  u()
], g.prototype, "icon", 2);
$([
  u()
], g.prototype, "loading", 2);
$([
  j()
], g.prototype, "_isLoading", 2);
$([
  j()
], g.prototype, "_imageUrl", 2);
g = $([
  dt(Ge)
], g);
export {
  g as W,
  hi as b
};
//# sourceMappingURL=wysiwg-image-crop.element-DqvFlxl0.js.map
