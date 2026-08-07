import { UMB_MEDIA_ITEM_REPOSITORY_ALIAS as _t, UmbMediaPickerInputContext as yt, UMB_IMAGE_CROPPER_EDITOR_MODAL as gt, UMB_MEDIA_PICKER_MODAL as $t, UMB_MEDIA_ENTITY_TYPE as vt } from "@umbraco-cms/backoffice/media";
import { html as w, css as Ne, property as _, state as v, customElement as Re, nothing as F, repeat as bt } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as He } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_CONTEXT as wt } from "@umbraco-cms/backoffice/property";
import { UmbPropertyEditorUiInteractionMemoryManager as At } from "@umbraco-cms/backoffice/property-editor";
import { UmbFormControlMixin as qe, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as Be } from "@umbraco-cms/backoffice/validation";
import { UUICardElement as De, UUISelectElement as Et } from "@umbraco-cms/backoffice/external/uui";
import { i as Ct } from "./sdk.gen-CjQc6NVt.js";
import { UmbChangeEvent as T } from "@umbraco-cms/backoffice/event";
import { UmbId as Le } from "@umbraco-cms/backoffice/id";
import { UMB_MODAL_MANAGER_CONTEXT as St, umbConfirmModal as Mt } from "@umbraco-cms/backoffice/modal";
import { UmbRepositoryItemsManager as Pt } from "@umbraco-cms/backoffice/repository";
import { UmbModalRouteRegistrationController as xt } from "@umbraco-cms/backoffice/router";
import { UmbSorterController as It, UmbSorterResolvePlacementAsGrid as Ut } from "@umbraco-cms/backoffice/sorter";
import { UmbFileDropzoneItemStatus as Ot } from "@umbraco-cms/backoffice/dropzone";
import { UmbEntityInputInteractionMemoryManager as kt } from "@umbraco-cms/backoffice/entity";
var Tt = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, Ve = (t) => {
  throw TypeError(t);
}, y = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? zt(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && Tt(e, i, r), r;
}, fe = (t, e, i) => e.has(t) || Ve("Cannot " + i), $ = (t, e, i) => (fe(t, e, "read from private field"), i ? i.call(t) : e.get(t)), C = (t, e, i) => e.has(t) ? Ve("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), Ae = (t, e, i, s) => (fe(t, e, "write to private field"), e.set(t, i), i), b = (t, e, i) => (fe(t, e, "access private method"), i), D, ee, L, K, V, te, f, me, re, he, We, Ke, je, Fe, Ye, Ge, Ze, Je, Xe, Qe;
const Nt = "wysiwg-input-rich-media";
let p = class extends qe(He, void 0) {
  constructor() {
    super(), C(this, f), C(this, D, new It(this, {
      getUniqueOfElement: (t) => t.id,
      getUniqueOfModel: (t) => t.key,
      identifier: "Umb.SorterIdentifier.WysiwgInputRichMedia",
      itemSelector: "wysiwg-card-image",
      // Ensure this matches the custom element name for the card image component
      containerSelector: ".container",
      resolvePlacement: Ut,
      onChange: ({ model: t }) => {
        this.value = t, this.dispatchEvent(new T());
      }
    })), this.min = 0, this.minMessage = "This field need more items", this.max = 1 / 0, this.maxMessage = "This field exceeds the allowed amount of items", this.multiple = !1, C(this, ee, !1), C(this, L, !1), this._cards = [], C(this, K, new Pt(this, _t)), C(this, V, new yt(this)), C(this, te, new kt(
      this,
      $(this, V).interactionMemory
    )), C(this, re, (t) => this.allowedContentTypeIds && this.allowedContentTypeIds.length > 0 ? this.allowedContentTypeIds.includes(t.mediaType.unique) : !0), this.observe($(this, K).items, () => {
      b(this, f, me).call(this);
    }), new xt(this, gt).addAdditionalPath(":key").onSetup((t) => {
      const e = t.key;
      if (!e) return !1;
      const i = this.value?.find((s) => s.key === e);
      return i ? {
        data: {
          cropOptions: this.preselectedCrops,
          hideFocalPoint: !this.focalPointEnabled,
          key: e,
          unique: i.mediaKey,
          pickableFilter: $(this, re)
        },
        value: {
          crops: i.crops ?? [],
          focalPoint: i.focalPoint ?? { left: 0.5, top: 0.5 },
          src: "",
          key: e,
          unique: i.mediaKey
        }
      } : !1;
    }).onSubmit((t) => {
      this.value = this.value?.map((e) => {
        if (e.key !== t.key) return e;
        const i = this.focalPointEnabled ? t.focalPoint : null, s = t.crops, r = t.unique, o = r === e.mediaKey ? e.key : Le.new();
        return { ...e, crops: s, mediaKey: r, focalPoint: i, key: o };
      }), this.dispatchEvent(new T());
    }).observeRouteBuilder((t) => {
      this._routeBuilder = t;
    }), this.observe($(this, V).selection, (t) => {
      b(this, f, he).call(this, t);
    }), this.addValidator(
      "valueMissing",
      () => this.requiredMessage ?? Be,
      () => !this.readonly && !!this.required && (!this.value || this.value.length === 0)
    ), this.addValidator(
      "rangeUnderflow",
      () => this.minMessage,
      () => !this.readonly && // Only if min is set:
      !!this.min && // if the value is empty and not required, we should not validate the min:
      !(this.value?.length === 0 && this.required == !1) && // Validate the min:
      (this.value?.length ?? 0) < this.min
    ), this.addValidator(
      "rangeOverflow",
      () => this.maxMessage,
      () => !this.readonly && !!this.value && !!this.max && this.value?.length > this.max
    );
  }
  set value(t) {
    super.value = t, $(this, D).setModel(t), $(this, V).setSelection(t?.map((e) => e.mediaKey) ?? []), $(this, K).setUniques(t?.map((e) => e.mediaKey)), b(this, f, me).call(this);
  }
  get value() {
    return super.value;
  }
  set focalPointEnabled(t) {
    Ae(this, ee, t);
  }
  get focalPointEnabled() {
    return $(this, ee);
  }
  get readonly() {
    return $(this, L);
  }
  set readonly(t) {
    Ae(this, L, t), $(this, L) ? $(this, D).disable() : $(this, D).enable();
  }
  get interactionMemories() {
    return $(this, te).getMemories();
  }
  set interactionMemories(t) {
    $(this, te).setMemories(t);
  }
  getFormElement() {
  }
  render() {
    return w`
    ${b(this, f, Fe).call(this)}
    <div class="container">${b(this, f, Ye).call(this)} ${b(this, f, Ge).call(this)}</div>
  `;
  }
  _updateValue(t, e = !1) {
    const i = [];
    if (!this.value || !this.value.length || e) {
      const s = {
        ...t
      };
      i.push(s);
    } else
      for (let s = 0; s < this.value.length; s++) {
        const r = {
          ...this.value[s],
          ...t
        };
        i.push(r);
      }
    this.value = i, this.dispatchEvent(new T());
  }
};
D = /* @__PURE__ */ new WeakMap();
ee = /* @__PURE__ */ new WeakMap();
L = /* @__PURE__ */ new WeakMap();
K = /* @__PURE__ */ new WeakMap();
V = /* @__PURE__ */ new WeakMap();
te = /* @__PURE__ */ new WeakMap();
f = /* @__PURE__ */ new WeakSet();
me = async function() {
  const t = $(this, K).getItems();
  this._cards = this.value?.map((e) => {
    const i = t.find((s) => s.unique === e.mediaKey);
    return {
      unique: e.key,
      media: e.mediaKey,
      name: i?.name ?? "",
      icon: i?.mediaType?.icon,
      isTrashed: i?.isTrashed ?? !1,
      isLoading: !i
    };
  }) ?? [];
};
re = /* @__PURE__ */ new WeakMap();
he = function(t) {
  const e = t.filter((s) => !this.value?.some((r) => r.mediaKey === s));
  if (!e.length) return;
  const i = e.map((s) => ({
    key: Le.new(),
    mediaKey: s,
    mediaTypeAlias: "",
    crops: [],
    focalPoint: null
  }));
  this.value = [...this.value ?? [], ...i], this.dispatchEvent(new T());
};
We = async function() {
  const i = await (await this.getContext(St))?.open(this, $t, {
    data: {
      multiple: this.multiple,
      startNode: this.startNode,
      pickableFilter: $(this, re)
    },
    value: { selection: [] }
  })?.onSubmit().catch(() => null);
  if (!i) return;
  const s = i.selection.filter((r) => r !== null);
  b(this, f, he).call(this, s);
};
Ke = async function(t) {
  await Mt(this, {
    color: "danger",
    headline: `${this.localize.term("actions_remove")} ${t.name}?`,
    content: `${this.localize.term("defaultdialogs_confirmremove")} ${t.name}?`,
    confirmLabel: this.localize.term("actions_remove")
  }), this.value = this.value?.filter((e) => e.key !== t.unique), this.dispatchEvent(new T());
};
je = async function(t) {
  if (this.readonly) return;
  const e = t.items.filter((i) => i.status === Ot.COMPLETE).map((i) => i.unique);
  b(this, f, he).call(this, e);
};
Fe = function() {
  return this.readonly ? F : w`<umb-dropzone-media
			id="dropzone"
			?multiple=${this.multiple}
			.parentUnique=${this.startNode?.unique ?? null}
			@change=${b(this, f, je)}></umb-dropzone-media>`;
};
Ye = function() {
  if (this._cards.length)
    return w`
    ${bt(
      this._cards,
      (t) => t.unique,
      (t) => b(this, f, Ze).call(this, t)
    )}
  `;
};
Ge = function() {
  return this.readonly ? F : this.max === 1 && this._cards.length > 0 ? F : w`
			<uui-button
				id="btn-add"
				look="placeholder"
				@blur=${() => {
    this.pristine = !1, this.checkValidity();
  }}
				@click=${b(this, f, We)}
				label=${this.localize.term("general_choose")}
				?disabled=${this.readonly}>
				<uui-icon name="icon-add"></uui-icon>
				${this.localize.term("general_choose")}
			</uui-button>
		`;
};
Ze = function(t) {
  const e = this.value?.length ? this.value[0] : void 0;
  if (!t.unique || !e) return F;
  const i = this.readonly ? void 0 : this._routeBuilder?.({ key: t.unique });
  return w`
    <wysiwg-card-media id=${t.unique} title=${t.name} name=${t.name} .href=${i} ?readonly=${this.readonly}>

      <wysiwg-cropped-image
        .mediaItem=${e} @change=${b(this, f, Je)}></wysiwg-cropped-image>

      <!-- <umb-media-thumbnail
					.unique=${t.media}
					.alt=${t.name}
					.icon=${t.icon ?? "icon-picture"}
					.externalLoading=${t.isLoading ?? !1}></umb-media-thumbnail> -->

      ${b(this, f, Qe).call(this, t)} ${b(this, f, Xe).call(this, t)}

    </wysiwg-card-media>
  `;
};
Je = function(t) {
  t?.target?.value?.length > 0 && this._updateValue({
    cropUrl: t?.target?.value
  });
};
Xe = function(t) {
  return this.readonly ? F : w`
    <uui-action-bar slot="actions">
      <uui-button label=${this.localize.term("general_remove")} look="secondary" @click=${() => b(this, f, Ke).call(this, t)}>
        <uui-icon name="icon-trash"></uui-icon>
      </uui-button>
    </uui-action-bar>
  `;
};
Qe = function(t) {
  if (t.isTrashed)
    return w`
    <uui-tag size="s" slot="tag" color="danger">
      <umb-localize key="mediaPicker_trashed">Trashed</umb-localize>
    </uui-tag>
  `;
};
p.styles = [
  Ne`
			:host {
				position: relative;
				width: 100%;
				display: flex;
				flex-direction: column-reverse;
			}
			.container {
				display: grid;
				gap: var(--uui-size-space-5);
				grid-template-columns: repeat(auto-fill, minmax(var(--umb-card-medium-min-width), 1fr));
				grid-auto-rows: var(--umb-card-medium-min-width);
			}

			#btn-add {
				text-align: center;
				height: 100%;
			}

			uui-icon {
				display: block;
				margin: 0 auto;
			}

			uui-card-media umb-icon {
				font-size: var(--uui-size-8);
			}

			uui-card-media[drag-placeholder] {
				opacity: 0.2;
			}
			img {
				background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
				background-size: 10px 10px;
				background-repeat: repeat;
			}
  `
];
y([
  _({ type: Boolean })
], p.prototype, "required", 2);
y([
  _({ type: String })
], p.prototype, "requiredMessage", 2);
y([
  _({ type: Number })
], p.prototype, "min", 2);
y([
  _({ type: String, attribute: "min-message" })
], p.prototype, "minMessage", 2);
y([
  _({ type: Number })
], p.prototype, "max", 2);
y([
  _({ type: String, attribute: "min-message" })
], p.prototype, "maxMessage", 2);
y([
  _({ type: Array })
], p.prototype, "value", 1);
y([
  _({ type: Array })
], p.prototype, "allowedContentTypeIds", 2);
y([
  _({ type: Object, attribute: !1 })
], p.prototype, "startNode", 2);
y([
  _({ type: Boolean })
], p.prototype, "multiple", 2);
y([
  _({ type: Array })
], p.prototype, "preselectedCrops", 2);
y([
  _({ type: Boolean })
], p.prototype, "focalPointEnabled", 1);
y([
  _({ type: Boolean, reflect: !0 })
], p.prototype, "readonly", 1);
y([
  _({ type: Array, attribute: !1 })
], p.prototype, "interactionMemories", 1);
y([
  v()
], p.prototype, "_cards", 2);
y([
  v()
], p.prototype, "_routeBuilder", 2);
p = y([
  Re(Nt)
], p);
const ie = globalThis, _e = ie.ShadowRoot && (ie.ShadyCSS === void 0 || ie.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ye = /* @__PURE__ */ Symbol(), Ee = /* @__PURE__ */ new WeakMap();
let et = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== ye) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (_e && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = Ee.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Ee.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (t) => new et(typeof t == "string" ? t : t + "", void 0, ye), Ht = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[o + 1], t[0]);
  return new et(i, t, ye);
}, qt = (t, e) => {
  if (_e) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = ie.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, Ce = _e ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return Rt(i);
})(t) : t;
const { is: Bt, defineProperty: Dt, getOwnPropertyDescriptor: Lt, getOwnPropertyNames: Vt, getOwnPropertySymbols: Wt, getPrototypeOf: Kt } = Object, ce = globalThis, Se = ce.trustedTypes, jt = Se ? Se.emptyScript : "", Ft = ce.reactiveElementPolyfillSupport, j = (t, e) => t, oe = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? jt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, ge = (t, e) => !Bt(t, e), Me = { attribute: !0, type: String, converter: oe, reflect: !1, useDefault: !1, hasChanged: ge };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ce.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Me) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && Dt(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: o } = Lt(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Me;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const e = Kt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const i = this.properties, s = [...Vt(i), ...Wt(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) i.unshift(Ce(r));
    } else e !== void 0 && i.push(Ce(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return qt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : oe).toAttribute(i, s.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : oe;
      this._$Em = r;
      const l = n.fromAttribute(i, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), s ??= n.getPropertyOptions(e), !((s.hasChanged ?? ge)(o, i) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[j("elementProperties")] = /* @__PURE__ */ new Map(), k[j("finalized")] = /* @__PURE__ */ new Map(), Ft?.({ ReactiveElement: k }), (ce.reactiveElementVersions ??= []).push("2.1.2");
const $e = globalThis, Pe = (t) => t, ne = $e.trustedTypes, xe = ne ? ne.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, tt = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, it = "?" + S, Yt = `<${it}>`, O = document, Y = () => O.createComment(""), G = (t) => t === null || typeof t != "object" && typeof t != "function", ve = Array.isArray, Gt = (t) => ve(t) || typeof t?.[Symbol.iterator] == "function", ue = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ie = /-->/g, Ue = />/g, P = RegExp(`>|${ue}(?:([^\\s"'>=/]+)(${ue}*=${ue}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Oe = /'/g, ke = /"/g, st = /^(?:script|style|textarea|title)$/i, Zt = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), I = Zt(1), R = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), Te = /* @__PURE__ */ new WeakMap(), x = O.createTreeWalker(O, 129);
function rt(t, e) {
  if (!ve(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xe !== void 0 ? xe.createHTML(e) : e;
}
const Jt = (t, e) => {
  const i = t.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = B;
  for (let l = 0; l < i; l++) {
    const a = t[l];
    let u, g, h = -1, A = 0;
    for (; A < a.length && (n.lastIndex = A, g = n.exec(a), g !== null); ) A = n.lastIndex, n === B ? g[1] === "!--" ? n = Ie : g[1] !== void 0 ? n = Ue : g[2] !== void 0 ? (st.test(g[2]) && (r = RegExp("</" + g[2], "g")), n = P) : g[3] !== void 0 && (n = P) : n === P ? g[0] === ">" ? (n = r ?? B, h = -1) : g[1] === void 0 ? h = -2 : (h = n.lastIndex - g[2].length, u = g[1], n = g[3] === void 0 ? P : g[3] === '"' ? ke : Oe) : n === ke || n === Oe ? n = P : n === Ie || n === Ue ? n = B : (n = P, r = void 0);
    const E = n === P && t[l + 1].startsWith("/>") ? " " : "";
    o += n === B ? a + Yt : h >= 0 ? (s.push(u), a.slice(0, h) + tt + a.slice(h) + S + E) : a + S + (h === -2 ? l : E);
  }
  return [rt(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Z {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = e.length - 1, a = this.parts, [u, g] = Jt(e, i);
    if (this.el = Z.createElement(u, s), x.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = x.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(tt)) {
          const A = g[n++], E = r.getAttribute(h).split(S), Q = /([.?@])?(.*)/.exec(A);
          a.push({ type: 1, index: o, name: Q[2], strings: E, ctor: Q[1] === "." ? Qt : Q[1] === "?" ? ei : Q[1] === "@" ? ti : de }), r.removeAttribute(h);
        } else h.startsWith(S) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (st.test(r.tagName)) {
          const h = r.textContent.split(S), A = h.length - 1;
          if (A > 0) {
            r.textContent = ne ? ne.emptyScript : "";
            for (let E = 0; E < A; E++) r.append(h[E], Y()), x.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[A], Y());
          }
        }
      } else if (r.nodeType === 8) if (r.data === it) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(S, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += S.length - 1;
      }
      o++;
    }
  }
  static createElement(e, i) {
    const s = O.createElement("template");
    return s.innerHTML = e, s;
  }
}
function H(t, e, i = t, s) {
  if (e === R) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const o = G(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = H(t, r._$AS(t, e.values), r, s)), e;
}
class Xt {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: s } = this._$AD, r = (e?.creationScope ?? O).importNode(i, !0);
    x.currentNode = r;
    let o = x.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let u;
        a.type === 2 ? u = new X(o, o.nextSibling, this, e) : a.type === 1 ? u = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (u = new ii(o, this, e)), this._$AV.push(u), a = s[++l];
      }
      n !== a?.index && (o = x.nextNode(), n++);
    }
    return x.currentNode = O, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class X {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = H(this, e, i), G(e) ? e === c || e == null || e === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : e !== this._$AH && e !== R && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Gt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== c && G(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Z.createElement(rt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const o = new Xt(r, this), n = o.u(this.options);
      o.p(i), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = Te.get(e.strings);
    return i === void 0 && Te.set(e.strings, i = new Z(e)), i;
  }
  k(e) {
    ve(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const o of e) r === i.length ? i.push(s = new X(this.O(Y()), this.O(Y()), this, this.options)) : s = i[r], s._$AI(o), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = Pe(e).nextSibling;
      Pe(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class de {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, r, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(e, i = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = H(this, e, i, 0), n = !G(e) || e !== this._$AH && e !== R, n && (this._$AH = e);
    else {
      const l = e;
      let a, u;
      for (e = o[0], a = 0; a < o.length - 1; a++) u = H(this, l[s + a], i, a), u === R && (u = this._$AH[a]), n ||= !G(u) || u !== this._$AH[a], u === c ? e = c : e !== c && (e += (u ?? "") + o[a + 1]), this._$AH[a] = u;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Qt extends de {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === c ? void 0 : e;
  }
}
class ei extends de {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== c);
  }
}
class ti extends de {
  constructor(e, i, s, r, o) {
    super(e, i, s, r, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = H(this, e, i, 0) ?? c) === R) return;
    const s = this._$AH, r = e === c && s !== c || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ii {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    H(this, e);
  }
}
const si = $e.litHtmlPolyfillSupport;
si?.(Z, X), ($e.litHtmlVersions ??= []).push("3.3.3");
const ri = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = i?.renderBefore ?? null;
    s._$litPart$ = r = new X(e.insertBefore(Y(), o), o, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
const be = globalThis;
class se extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ri(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return R;
  }
}
se._$litElement$ = !0, se.finalized = !0, be.litElementHydrateSupport?.({ LitElement: se });
const oi = be.litElementPolyfillSupport;
oi?.({ LitElement: se });
(be.litElementVersions ??= []).push("4.2.2");
const ni = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
const ai = { attribute: !0, type: String, converter: oe, reflect: !1, hasChanged: ge }, li = (t = ai, e, i) => {
  const { kind: s, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), s === "accessor") {
    const { name: n } = i;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(n, a, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, t, l), l;
    } };
  }
  if (s === "setter") {
    const { name: n } = i;
    return function(l) {
      const a = this[n];
      e.call(this, l), this.requestUpdate(n, a, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function pe(t) {
  return (e, i) => typeof i == "object" ? li(t, e, i) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(t, e, i);
}
function ot(t) {
  return pe({ ...t, state: !0, attribute: !1 });
}
const W = (t) => t ?? c;
var hi = Object.defineProperty, ci = Object.getOwnPropertyDescriptor, nt = (t) => {
  throw TypeError(t);
}, q = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ci(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && hi(e, i, r), r;
}, di = (t, e, i) => e.has(t) || nt("Cannot " + i), pi = (t, e, i) => e.has(t) ? nt("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), ae = (t, e, i) => (di(t, e, "access private method"), i), z, at, lt, we;
const ui = "wysiwg-card-media";
let M = class extends De {
  constructor() {
    super(...arguments), pi(this, z), this.name = "", this.fileExt = "", this._iconSlotHasContent = !1, this._iconSlotChanged = (t) => {
      this._iconSlotHasContent = t.target.assignedNodes({ flatten: !0 }).length > 0;
    }, this.hasPreview = !1;
  }
  queryPreviews(t) {
    this.hasPreview = t.composedPath()[0].assignedElements({
      flatten: !0
    }).length > 0;
  }
  renderMedia() {
    return this.hasPreview === !0 ? "" : this.fileExt === "" ? I`<uui-symbol-folder id="entity-symbol"></uui-symbol-folder>` : I`<uui-symbol-file
      id="entity-symbol"
      type="${this.fileExt}"></uui-symbol-file>`;
  }
  render() {
    return I` ${this.renderMedia()}
      <slot @slotchange=${this.queryPreviews}></slot>
      ${this.href ? ae(this, z, lt).call(this) : ae(this, z, at).call(this)}
      <!-- Select border must be right after .open-part -->
      <div id="select-border"></div>
      ${this.selectable ? this.renderCheckbox() : c}
      <slot name="tag"></slot>
      <slot name="actions"></slot>`;
  }
};
z = /* @__PURE__ */ new WeakSet();
at = function() {
  const t = this.disabled ? void 0 : this.selectOnly ? -1 : 0;
  return I`
      <button
        id="open-part"
        tabindex=${W(t)}
        @click=${this.handleOpenClick}
        @keydown=${this.handleOpenKeydown}>
        ${ae(this, z, we).call(this)}
      </button>
    `;
};
lt = function() {
  const t = this.disabled ? void 0 : this.selectOnly ? -1 : 0, e = this.target === "_blank" ? "noopener noreferrer" : void 0;
  return I`
      <a
        id="open-part"
        tabindex=${W(t)}
        href=${W(this.disabled ? void 0 : this.href)}
        target=${W(this.target || void 0)}
        rel=${W(this.rel || e)}>
        ${ae(this, z, we).call(this)}
      </a>
    `;
};
we = function() {
  return I`
      <div id="content" class="uui-text">
        <span id="name" title="${this.name}">
          ${this.hasChildren ? I`<uui-symbol-expand aria-hidden="true"></uui-symbol-expand>` : c}
          <slot
            name="icon"
            id="icon"
            style=${this._iconSlotHasContent ? "" : "display: none;"}
            @slotchange=${this._iconSlotChanged}></slot
          ><span class="label">${this.name}</span>
        </span>
        <small id="detail">${this.detail}<slot name="detail"></slot></small>
      </div>
    `;
};
M.styles = [
  ...De.styles,
  Ht`
      #entity-symbol {
        align-self: center;
        width: 60%;
        margin-bottom: var(--uui-size-layout-1);
        padding: var(--uui-size-space-6);
      }

      slot:not([name]) {
        display: block;
        overflow: clip;
        border-radius: calc(var(--uui-border-radius-2) - 1px);
      }

      slot[name='tag'] {
        position: absolute;
        bottom: var(--uui-size-2);
        right: var(--uui-size-4);
        display: flex;
        justify-content: right;
        z-index: 2;
      }

      slot[name='actions'] {
        position: absolute;
        top: var(--uui-size-space-3);
        right: var(--uui-size-space-3);
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
        object-fit: cover;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      #open-part {
        position: absolute;
        z-index: 1;
        inset: 0;
        margin-bottom: 0;
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
        display: flex;
        align-items: center;
        gap: var(--uui-size-space-1);
      }

      #open-part #name .label {
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
        flex-direction: column;
        font-family: inherit;
        box-sizing: border-box;
        text-align: left;
        word-break: break-word;
        padding-top: var(--uui-size-space-3);
      }

      #content::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        border-top: 1px solid var(--uui-color-divider);
        border-radius: 0 0 calc(var(--uui-border-radius-2) - 1px)
          calc(var(--uui-border-radius-2) - 1px);
        background-color: var(--uui-color-surface);
        pointer-events: none;
        opacity: 0.96;
      }

      #icon {
        display: inline-flex;
        margin-right: var(--uui-size-1);
      }

      #detail {
        opacity: 0.6;
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

      :host([active]) {
        background-color: var(--uui-color-surface);
      }

      :host([active]) #content::before {
        background-color: var(--uui-color-current);
        bottom: -1px;
      }

      /*
      #info-icon {
        margin-right: var(--uui-size-2);
        display: flex;
        height: var(--uui-size-8);
      }
      */
    `
];
q([
  pe({ type: String })
], M.prototype, "name", 2);
q([
  pe({ type: String })
], M.prototype, "detail", 2);
q([
  pe({ type: String, attribute: "file-ext" })
], M.prototype, "fileExt", 2);
q([
  ot()
], M.prototype, "_iconSlotHasContent", 2);
q([
  ot()
], M.prototype, "hasPreview", 2);
M = q([
  ni(ui)
], M);
var mi = Object.defineProperty, fi = Object.getOwnPropertyDescriptor, ht = (t) => {
  throw TypeError(t);
}, m = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? fi(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && mi(e, i, r), r;
}, ct = (t, e, i) => e.has(t) || ht("Cannot " + i), le = (t, e, i) => (ct(t, e, "read from private field"), i ? i.call(t) : e.get(t)), ze = (t, e, i) => e.has(t) ? ht("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), J = (t, e, i) => (ct(t, e, "access private method"), i), N, U, dt, pt, ut, mt, ft;
const _i = "wysiwg-image-and-crop-picker";
let d = class extends qe(He) {
  //#endregion
  constructor() {
    super(), ze(this, U), this.mandatoryMessage = Be, this.readonly = !1, this._focalPointEnabled = !1, this._preselectedCrops = [], this._multiple = !1, this._min = 0, this._max = 1, this._interactionMemories = [], ze(this, N, new At(this, {
      memoryUniquePrefix: "UmbMediaPicker"
    })), this._selectedCropAlias = "", this._options = [], this._imgSrc = "", this._prevImgSrc = "", this.consumeContext(wt, (t) => {
      this.observe(t?.alias, (e) => this._alias = e), this.observe(t?.variantId, (e) => this._variantId = e?.toString() || "invariant");
    }), this.observe(le(this, N).memoriesForPropertyEditor, (t) => {
      this._interactionMemories = t ?? [];
    });
  }
  //#region properties, states, ctor, methods
  //#region properties
  set config(t) {
    if (le(this, N).setPropertyEditorConfig(t), !t) return;
    if (this._allowedMediaTypes = t.getValueByAlias("filter")?.split(",") ?? void 0, this._focalPointEnabled = !!t.getValueByAlias("enableLocalFocalPoint"), this._preselectedCrops = t?.getValueByAlias("crops") ?? [], this._preselectedCrops.length > 0) {
      const i = this._preselectedCrops.find((r) => !!r.defaultCrop);
      this._selectedCropAlias = this.value?.[0]?.selectedCropAlias ?? i?.alias ?? "";
      const s = this._preselectedCrops.map((r) => ({
        name: r.label?.toString() ?? r.alias,
        value: r.alias,
        selected: r.alias === this._selectedCropAlias
      }));
      this._options = [
        { name: "", value: "" },
        ...s
      ];
    }
    this.getImageCropperCrops();
    const e = t.getValueByAlias("startNodeId") ?? "";
    this._startNode = e ? { unique: e, entityType: vt } : void 0;
  }
  firstUpdated() {
    this.addFormControlElement(this.shadowRoot.querySelector("wysiwg-input-rich-media")), this.shadowRoot?.querySelector("umb-input-dropdown-list") && this.addFormControlElement(this.shadowRoot.querySelector("umb-input-dropdown-list"));
  }
  focus(t) {
    return this.shadowRoot?.querySelector("wysiwg-input-rich-media")?.focus();
  }
  async getImageCropperCrops(t) {
    this._selectedCropAlias || (this._selectedCropAlias = this.value?.[0]?.selectedCropAlias ?? ""), await this.crops(t).then((e) => {
      if (e === "error") {
        this._preselectedCrops = [];
        return;
      } else if (e === "no data") {
        this._preselectedCrops = [];
        return;
      }
      var s = e.map((r) => ({
        name: `[${r.label?.toString() ?? r.alias}]`,
        value: r.alias,
        selected: r.alias === this._selectedCropAlias
      }));
      this._options = [
        ...this._options,
        ...s
      ];
    });
  }
  async crops(t) {
    const e = {
      url: "/api/v1/wysiwg/crops",
      query: {
        mediaItemId: t ?? ""
      }
    }, { data: i, error: s } = await Ct(e);
    return s ? (console.error(s), "error") : i !== void 0 ? i : "no data";
  }
  _updateValue(t, e = !1) {
    const i = [];
    if (!this.value || !this.value.length || e) {
      const s = {
        ...t
      };
      i.push(s);
    } else
      for (let s = 0; s < this.value.length; s++) {
        const r = {
          ...this.value[s],
          ...t
        };
        i.push(r);
      }
    this.value = i, this.dispatchEvent(new T());
  }
  render() {
    return w`
      ${J(this, U, ft).call(this)}
      ${J(this, U, mt).call(this)}
    `;
  }
};
N = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakSet();
dt = function(t) {
  this._imgSrc !== this._prevImgSrc && (this._prevImgSrc = this._imgSrc);
  const e = t.target.value?.length === 0, i = t.target.value?.find((o) => !!o.mediaKey) ?? void 0;
  let s = e ? void 0 : i;
  const r = this.value?.[0]?.selectedCropAlias ?? this._selectedCropAlias;
  if (e)
    this._updateValue({
      selectedCropAlias: r
    }, !0);
  else {
    const o = s?.crops.length === 0 ? this._preselectedCrops : s?.crops;
    this._updateValue({
      key: s?.key,
      mediaKey: s?.mediaKey,
      mediaTypeAlias: s?.mediaTypeAlias,
      focalPoint: s?.focalPoint,
      crops: o,
      selectedCropAlias: r
    });
  }
};
pt = function(t) {
  const e = t.target.value;
  this._selectedCropAlias = e, this._updateValue({
    selectedCropAlias: this._selectedCropAlias
  });
};
ut = async function(t) {
  const i = t.target.interactionMemories;
  i && i.length > 0 ? await le(this, N).saveMemoriesForPropertyEditor(i) : await le(this, N).deleteMemoriesForPropertyEditor();
};
mt = function() {
  return w`
    <wysiwg-input-rich-media
      .alias=${this._alias}
      .allowedContentTypeIds=${this._allowedMediaTypes}
      .focalPointEnabled=${this._focalPointEnabled}
      .value=${this.value ?? []}
      .max=${this._max}
      .min=${this._min}
      .preselectedCrops=${this._preselectedCrops}
      .startNode=${this._startNode}
      .variantId=${this._variantId}
      .required=${this.mandatory}
      .requiredMessage=${this.mandatoryMessage}
      ?multiple=${this._multiple}
      @change=${J(this, U, dt)}
      ?readonly=${this.readonly}
			.interactionMemories=${this._interactionMemories}
			@interaction-memories-change=${J(this, U, ut)}>
    </wysiwg-input-rich-media>
  `;
};
ft = function() {
  const t = !!this.value?.length && !!this.value[0]?.mediaKey, e = "crop-select";
  return this._options.length ? w`
      <uui-select
        label=${e}
        .disabled=${!t}
        .options=${this._options}
        @change=${J(this, U, pt)}
        ?readonly=${this.readonly}
      ></uui-select>
    ` : w`<uui-select label=${e}></uui-select>`;
};
d.styles = [
  Et.styles,
  Ne`
      uui-select {
        margin-bottom: 8px;
        width: 100%;
      }
    `
];
m([
  _({ type: Boolean })
], d.prototype, "mandatory", 2);
m([
  _({ type: String })
], d.prototype, "mandatoryMessage", 2);
m([
  _({ type: Boolean, reflect: !0 })
], d.prototype, "readonly", 2);
m([
  v()
], d.prototype, "_startNode", 2);
m([
  v()
], d.prototype, "_focalPointEnabled", 2);
m([
  v()
], d.prototype, "_preselectedCrops", 2);
m([
  v()
], d.prototype, "_allowedMediaTypes", 2);
m([
  v()
], d.prototype, "_multiple", 2);
m([
  v()
], d.prototype, "_min", 2);
m([
  v()
], d.prototype, "_max", 2);
m([
  v()
], d.prototype, "_alias", 2);
m([
  v()
], d.prototype, "_variantId", 2);
m([
  v()
], d.prototype, "_interactionMemories", 2);
m([
  v()
], d.prototype, "_selectedCropAlias", 2);
m([
  v()
], d.prototype, "_options", 2);
m([
  v()
], d.prototype, "_imgSrc", 2);
m([
  v()
], d.prototype, "_prevImgSrc", 2);
d = m([
  Re(_i)
], d);
const zi = d;
export {
  d as WysiwgImageAndCropPickerElement,
  zi as default
};
//# sourceMappingURL=wysiwg-image-and-crop-picker.element-DCtIrIlc.js.map
