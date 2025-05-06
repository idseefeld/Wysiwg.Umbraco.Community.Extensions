import { UMB_MEDIA_ITEM_REPOSITORY_ALIAS as ae, UMB_IMAGE_CROPPER_EDITOR_MODAL as re, UMB_MEDIA_PICKER_MODAL as oe, UMB_MEDIA_ENTITY_TYPE as ne } from "@umbraco-cms/backoffice/media";
import { html as y, nothing as P, repeat as le, css as B, property as d, state as c, customElement as U } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as R } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_CONTEXT as de } from "@umbraco-cms/backoffice/property";
import { UmbPropertyValueChangeEvent as pe } from "@umbraco-cms/backoffice/property-editor";
import { UmbFormControlMixin as N, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as z } from "@umbraco-cms/backoffice/validation";
import { UUISelectElement as he } from "@umbraco-cms/backoffice/external/uui";
import { W as q } from "./services.gen-B_ebHh4e.js";
import { UmbChangeEvent as A } from "@umbraco-cms/backoffice/event";
import { UmbId as K } from "@umbraco-cms/backoffice/id";
import { UMB_MODAL_MANAGER_CONTEXT as ce, umbConfirmModal as ue } from "@umbraco-cms/backoffice/modal";
import { UmbRepositoryItemsManager as me } from "@umbraco-cms/backoffice/repository";
import { UmbModalRouteRegistrationController as ye } from "@umbraco-cms/backoffice/router";
import { UmbSorterController as _e, UmbSorterResolvePlacementAsGrid as fe } from "@umbraco-cms/backoffice/sorter";
var ge = Object.defineProperty, ve = Object.getOwnPropertyDescriptor, W = (e) => {
  throw TypeError(e);
}, p = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? ve(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (a = (s ? o(t, i, a) : o(a)) || a);
  return s && a && ge(t, i, a), a;
}, x = (e, t, i) => t.has(e) || W("Cannot " + i), _ = (e, t, i) => (x(e, t, "read from private field"), i ? i.call(e) : t.get(e)), C = (e, t, i) => t.has(e) ? W("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), O = (e, t, i, s) => (x(e, t, "write to private field"), t.set(e, i), i), m = (e, t, i) => (x(e, t, "access private method"), i), $, E, I, M, u, S, T, k, D, L, F, V, Y, G, X, H, Z;
const we = "wysiwg-input-rich-media";
let n = class extends N(R, void 0) {
  constructor() {
    super(), C(this, u), C(this, $, new _e(this, {
      getUniqueOfElement: (e) => e.id,
      getUniqueOfModel: (e) => e.key,
      identifier: "Umb.SorterIdentifier.InputRichMedia",
      itemSelector: "uui-card-media",
      containerSelector: ".container",
      resolvePlacement: fe,
      onChange: ({ model: e }) => {
        this.value = e, this.dispatchEvent(new A());
      }
    })), this.min = 0, this.minMessage = "This field need more items", this.max = 1 / 0, this.maxMessage = "This field exceeds the allowed amount of items", this.multiple = !1, C(this, E, !1), C(this, I, !1), this._cards = [], C(this, M, new me(this, ae)), C(this, T, (e) => this.allowedContentTypeIds && this.allowedContentTypeIds.length > 0 ? this.allowedContentTypeIds.includes(e.mediaType.unique) : !0), this.observe(_(this, M).items, () => {
      m(this, u, S).call(this);
    }), new ye(this, re).addAdditionalPath(":key").onSetup((e) => {
      var s;
      const t = e.key;
      if (!t) return !1;
      const i = (s = this.value) == null ? void 0 : s.find((a) => a.key === t);
      return i ? {
        data: {
          cropOptions: this.preselectedCrops,
          hideFocalPoint: !this.focalPointEnabled,
          key: t,
          unique: i.mediaKey,
          pickableFilter: _(this, T)
        },
        value: {
          crops: i.crops ?? [],
          focalPoint: i.focalPoint ?? { left: 0.5, top: 0.5 },
          src: "",
          key: t,
          unique: i.mediaKey
        }
      } : !1;
    }).onSubmit((e) => {
      var t;
      this.value = (t = this.value) == null ? void 0 : t.map((i) => {
        if (i.key !== e.key) return i;
        const s = this.focalPointEnabled ? e.focalPoint : null, a = e.crops, r = e.unique, o = r === i.mediaKey ? i.key : K.new();
        return { ...i, crops: a, mediaKey: r, focalPoint: s, key: o };
      }), this.dispatchEvent(new A());
    }).observeRouteBuilder((e) => {
      this._routeBuilder = e;
    }), this.addValidator(
      "valueMissing",
      () => this.requiredMessage ?? z,
      () => !this.readonly && !!this.required && (!this.value || this.value.length === 0)
    ), this.addValidator(
      "rangeUnderflow",
      () => this.minMessage,
      () => {
        var e, t;
        return !this.readonly && // Only if min is set:
        !!this.min && // if the value is empty and not required, we should not validate the min:
        !(((e = this.value) == null ? void 0 : e.length) === 0 && this.required == !1) && // Validate the min:
        (((t = this.value) == null ? void 0 : t.length) ?? 0) < this.min;
      }
    ), this.addValidator(
      "rangeOverflow",
      () => this.maxMessage,
      () => {
        var e;
        return !this.readonly && !!this.value && !!this.max && ((e = this.value) == null ? void 0 : e.length) > this.max;
      }
    );
  }
  set value(e) {
    super.value = e, _(this, $).setModel(e), _(this, M).setUniques(e == null ? void 0 : e.map((t) => t.mediaKey)), m(this, u, S).call(this);
  }
  get value() {
    return super.value;
  }
  set focalPointEnabled(e) {
    O(this, E, e);
  }
  get focalPointEnabled() {
    return _(this, E);
  }
  /** @deprecated will be removed in v17 */
  set alias(e) {
  }
  get alias() {
  }
  /** @deprecated will be removed in v17 */
  set variantId(e) {
  }
  get variantId() {
  }
  get readonly() {
    return _(this, I);
  }
  set readonly(e) {
    O(this, I, e), _(this, I) ? _(this, $).disable() : _(this, $).enable();
  }
  getFormElement() {
  }
  //#endregion
  render() {
    return y`
    ${m(this, u, V).call(this)}
    <div class="container">${m(this, u, Y).call(this)} ${m(this, u, G).call(this)}</div>
  `;
  }
};
$ = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
u = /* @__PURE__ */ new WeakSet();
S = async function() {
  var s;
  const e = _(this, M).getItems();
  if (!e.length) {
    this._cards = [];
    return;
  }
  const t = e.filter((a) => !this._cards.find((r) => r.unique === a.unique)), i = this._cards.filter((a) => !e.find((r) => a.unique === r.unique));
  t.length === 0 && i.length === 0 || (this._cards = ((s = this.value) == null ? void 0 : s.map((a) => {
    var o;
    const r = e.find((f) => f.unique === a.mediaKey);
    return {
      unique: a.key,
      media: a.mediaKey,
      name: (r == null ? void 0 : r.name) ?? "",
      icon: (o = r == null ? void 0 : r.mediaType) == null ? void 0 : o.icon,
      isTrashed: (r == null ? void 0 : r.isTrashed) ?? !1
    };
  })) ?? []);
};
T = /* @__PURE__ */ new WeakMap();
k = function(e) {
  if (!e.length) return;
  const t = e.map((i) => ({
    key: K.new(),
    mediaKey: i,
    mediaTypeAlias: "",
    crops: [],
    focalPoint: null
  }));
  this.value = [...this.value ?? [], ...t], this.dispatchEvent(new A());
};
D = async function() {
  const e = await this.getContext(ce), t = e == null ? void 0 : e.open(this, oe, {
    data: {
      multiple: this.multiple,
      startNode: this.startNode,
      pickableFilter: _(this, T)
    },
    value: { selection: [] }
  }), i = await (t == null ? void 0 : t.onSubmit().catch(() => null));
  if (!i) return;
  const s = i.selection.filter((a) => a !== null);
  m(this, u, k).call(this, s);
};
L = async function(e) {
  var t;
  await ue(this, {
    color: "danger",
    headline: `${this.localize.term("actions_remove")} ${e.name}?`,
    content: `${this.localize.term("defaultdialogs_confirmremove")} ${e.name}?`,
    confirmLabel: this.localize.term("actions_remove")
  }), this.value = (t = this.value) == null ? void 0 : t.filter((i) => i.key !== e.unique), this.dispatchEvent(new A());
};
F = async function(e) {
  const i = e.detail.map((s) => s.unique);
  m(this, u, k).call(this, i);
};
V = function() {
  if (this.readonly) return P;
  if (!(this._cards && this._cards.length >= this.max))
    return y`<umb-dropzone ?multiple=${this.max > 1} @complete=${m(this, u, F)}></umb-dropzone>`;
};
Y = function() {
  if (this._cards.length)
    return y`
    ${le(
      this._cards,
      (e) => e.unique,
      (e) => m(this, u, X).call(this, e)
    )}
  `;
};
G = function() {
  if (!(this._cards && this._cards.length && !this.multiple))
    return this.readonly && this._cards.length > 0 ? P : y`
      <uui-button
        id="btn-add"
        look="placeholder"
        @blur=${() => {
      this.pristine = !1, this.checkValidity();
    }}
        @click=${m(this, u, D)}
        label=${this.localize.term("general_choose")}
        ?disabled=${this.readonly}>
        <uui-icon name="icon-add"></uui-icon>
        ${this.localize.term("general_choose")}
      </uui-button>
    `;
};
X = function(e) {
  var i;
  if (!e.unique) return P;
  const t = this.readonly || (i = this._routeBuilder) == null ? void 0 : i.call(this, { key: e.unique });
  return y`
    <uui-card-media id=${e.unique} name=${e.name} .href=${t} ?readonly=${this.readonly}>
      <umb-imaging-thumbnail
        unique=${e.media}
        alt=${e.name}
        icon=${e.icon ?? "icon-picture"}></umb-imaging-thumbnail>
      ${m(this, u, Z).call(this, e)} ${m(this, u, H).call(this, e)}
    </uui-card-media>
  `;
};
H = function(e) {
  return this.readonly ? P : y`
    <uui-action-bar slot="actions">
      <uui-button label=${this.localize.term("general_remove")} look="secondary" @click=${() => m(this, u, L).call(this, e)}>
        <uui-icon name="icon-trash"></uui-icon>
      </uui-button>
    </uui-action-bar>
  `;
};
Z = function(e) {
  if (e.isTrashed)
    return y`
    <uui-tag size="s" slot="tag" color="danger">
      <umb-localize key="mediaPicker_trashed">Trashed</umb-localize>
    </uui-tag>
  `;
};
n.styles = [
  B`
    :host {
      position: relative;
    }
    .container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-auto-rows: 150px;
      gap: var(--uui-size-space-5);
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
p([
  d({ type: Boolean })
], n.prototype, "required", 2);
p([
  d({ type: String })
], n.prototype, "requiredMessage", 2);
p([
  d({ type: Number })
], n.prototype, "min", 2);
p([
  d({ type: String, attribute: "min-message" })
], n.prototype, "minMessage", 2);
p([
  d({ type: Number })
], n.prototype, "max", 2);
p([
  d({ type: String, attribute: "min-message" })
], n.prototype, "maxMessage", 2);
p([
  d({ type: Array })
], n.prototype, "value", 1);
p([
  d({ type: Array })
], n.prototype, "allowedContentTypeIds", 2);
p([
  d({ type: Object, attribute: !1 })
], n.prototype, "startNode", 2);
p([
  d({ type: Boolean })
], n.prototype, "multiple", 2);
p([
  d({ type: Array })
], n.prototype, "preselectedCrops", 2);
p([
  d({ type: Boolean })
], n.prototype, "focalPointEnabled", 1);
p([
  d()
], n.prototype, "alias", 1);
p([
  d()
], n.prototype, "variantId", 1);
p([
  d({ type: Boolean, reflect: !0 })
], n.prototype, "readonly", 1);
p([
  c()
], n.prototype, "_cards", 2);
p([
  c()
], n.prototype, "_routeBuilder", 2);
n = p([
  U(we)
], n);
var Ce = Object.defineProperty, be = Object.getOwnPropertyDescriptor, J = (e) => {
  throw TypeError(e);
}, h = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? be(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (a = (s ? o(t, i, a) : o(a)) || a);
  return s && a && Ce(t, i, a), a;
}, $e = (e, t, i) => t.has(e) || J("Cannot " + i), Ie = (e, t, i) => t.has(e) ? J("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), b = (e, t, i) => ($e(e, t, "access private method"), i), v, Q, j, ee, te, ie, se;
const Me = "wysiwg-image-and-crop-picker";
let l = class extends N(R) {
  //#endregion
  constructor() {
    super(), Ie(this, v), this.mandatoryMessage = z, this.readonly = !1, this._focalPointEnabled = !1, this._preselectedCrops = [], this._allowedMediaTypes = [], this._multiple = !1, this._min = 0, this._max = 1 / 0, this._selectedCropAlias = "", this._options = [], this._mediaTypes = [], this._imgSrc = "", this._prevImgSrc = "", this.consumeContext(de, (e) => {
      this.observe(e.alias, (t) => this._alias = t), this.observe(e.variantId, (t) => this._variantId = (t == null ? void 0 : t.toString()) || "invariant");
    });
  }
  //#region properties, states, ctor, methods
  //#region properties
  set config(e) {
    var s, a, r;
    if (!e) return;
    if (this._allowedMediaTypes = ((s = e.getValueByAlias("filter")) == null ? void 0 : s.split(",")) ?? [], this._allowedMediaTypes.length === 0 && this.getMediaTypes(), this._focalPointEnabled = !!e.getValueByAlias("enableLocalFocalPoint"), this._multiple = !!e.getValueByAlias("multiple"), this._preselectedCrops = (e == null ? void 0 : e.getValueByAlias("crops")) ?? [], this._preselectedCrops.length > 0) {
      const o = this._preselectedCrops.find((g) => !!g.defaultCrop);
      this._selectedCropAlias = ((r = (a = this.value) == null ? void 0 : a[0]) == null ? void 0 : r.selectedCropAlias) ?? (o == null ? void 0 : o.alias) ?? "";
      const f = this._preselectedCrops.map((g) => {
        var w;
        return {
          name: ((w = g.label) == null ? void 0 : w.toString()) ?? g.alias,
          value: g.alias,
          selected: g.alias === this._selectedCropAlias
        };
      });
      this._options = [
        { name: "", value: "" },
        ...f
      ];
    }
    this.getImageCropperCrops();
    const t = e.getValueByAlias("startNodeId") ?? "";
    this._startNode = t ? { unique: t, entityType: ne } : void 0;
    const i = e.getValueByAlias("validationLimit");
    this._min = (i == null ? void 0 : i.min) ?? 0, this._max = (i == null ? void 0 : i.max) ?? 1 / 0;
  }
  firstUpdated() {
    var t;
    this.addFormControlElement(this.shadowRoot.querySelector("wysiwg-input-rich-media")), ((t = this.shadowRoot) == null ? void 0 : t.querySelector("umb-input-dropdown-list")) && this.addFormControlElement(this.shadowRoot.querySelector("umb-input-dropdown-list"));
  }
  focus(e) {
    var t, i;
    return console.log("focus(options) options = ", e), (i = (t = this.shadowRoot) == null ? void 0 : t.querySelector("wysiwg-input-rich-media")) == null ? void 0 : i.focus();
  }
  async getMediaTypes() {
    await this.apiMediaTypes().then((e) => {
      var s;
      if (e === "error") {
        this._mediaTypes = [];
        return;
      } else if (e === "no data") {
        this._mediaTypes = [];
        return;
      }
      const t = e;
      this._mediaTypes = t;
      const i = (s = this._mediaTypes) == null ? void 0 : s.find((a) => a.alias.toLowerCase() === "image");
      this._allowedMediaTypes = i != null && i.key ? [i.key] : [];
    });
  }
  async apiMediaTypes() {
    const { data: e, error: t } = await q.mediaTypes();
    return t && console.error(t), e !== void 0 ? e : "no data";
  }
  async getImageCropperCrops(e) {
    var t, i;
    this._selectedCropAlias || (this._selectedCropAlias = ((i = (t = this.value) == null ? void 0 : t[0]) == null ? void 0 : i.selectedCropAlias) ?? ""), await this.crops(e).then((s) => {
      if (s === "error") {
        this._preselectedCrops = [];
        return;
      } else if (s === "no data") {
        this._preselectedCrops = [];
        return;
      }
      var r = s.map((o) => {
        var f;
        return {
          name: `[${((f = o.label) == null ? void 0 : f.toString()) ?? o.alias}]`,
          value: o.alias,
          selected: o.alias === this._selectedCropAlias
        };
      });
      this._options = [
        ...this._options,
        ...r
      ];
    });
  }
  async crops(e) {
    const t = {
      query: {
        mediaItemId: e ?? ""
      }
    }, { data: i, error: s } = await q.crops(t);
    return s ? (console.error(s), "error") : i !== void 0 ? i : "no data";
  }
  _updateValue(e, t = !1) {
    const i = [];
    if (!this.value || !this.value.length || t) {
      const s = {
        ...e
      };
      i.push(s);
    } else
      for (let s = 0; s < this.value.length; s++) {
        const a = {
          ...this.value[s],
          ...e
        };
        i.push(a);
      }
    this.value = i, this.dispatchEvent(new pe());
  }
  render() {
    return y`
    <div id="container">
      <div id="left">
        ${b(this, v, ie).call(this)}
      </div>
      <div id="right">
        ${b(this, v, te).call(this)}
        ${b(this, v, se).call(this)}
      </div>
    </div>`;
  }
};
v = /* @__PURE__ */ new WeakSet();
Q = function(e) {
  var r, o, f, g;
  this._imgSrc !== this._prevImgSrc && (console.debug("imgSrc changed", this._imgSrc, this._prevImgSrc), this._prevImgSrc = this._imgSrc);
  const t = ((r = e.target.value) == null ? void 0 : r.length) === 0, i = ((o = e.target.value) == null ? void 0 : o.find((w) => !!w.mediaKey)) ?? void 0;
  let s = t ? void 0 : i;
  const a = ((g = (f = this.value) == null ? void 0 : f[0]) == null ? void 0 : g.selectedCropAlias) ?? this._selectedCropAlias;
  if (t)
    this._updateValue({
      selectedCropAlias: a
    }, !0);
  else {
    const w = (s == null ? void 0 : s.crops.length) === 0 ? this._preselectedCrops : s == null ? void 0 : s.crops;
    this._updateValue({
      key: s == null ? void 0 : s.key,
      mediaKey: s == null ? void 0 : s.mediaKey,
      mediaTypeAlias: s == null ? void 0 : s.mediaTypeAlias,
      focalPoint: s == null ? void 0 : s.focalPoint,
      crops: w,
      selectedCropAlias: a
    });
  }
};
j = function(e) {
  const t = e.target.value;
  this._selectedCropAlias = t, this._updateValue({
    selectedCropAlias: this._selectedCropAlias
  });
};
ee = function(e) {
  var t, i, s;
  ((i = (t = e == null ? void 0 : e.target) == null ? void 0 : t.value) == null ? void 0 : i.length) > 0 && this._updateValue({
    cropUrl: (s = e == null ? void 0 : e.target) == null ? void 0 : s.value
  });
};
te = function() {
  var t;
  if (!this.value || !this.value.length || !((t = this.value[0]) != null && t.mediaKey))
    return;
  const e = this.value[0];
  return y`<wysiwg-cropped-image .mediaItem=${e} @change=${b(this, v, ee)}></wysiwg-cropped-image>`;
};
ie = function() {
  return y`
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
      @change=${b(this, v, Q)}
      ?readonly=${this.readonly}
    >
    </wysiwg-input-rich-media>
  `;
};
se = function() {
  var i, s;
  const e = !!((i = this.value) != null && i.length) && !!((s = this.value[0]) != null && s.mediaKey), t = "crop-select";
  return this._options.length ? y`
      <uui-select
        label=${t}
        .disabled=${!e}
        .options=${this._options}
        @change=${b(this, v, j)}
        ?readonly=${this.readonly}
      ></uui-select>
    ` : y`<uui-select label=${t}></uui-select>`;
};
l.styles = [
  he.styles,
  B`
      uui-select {
        margin-top: 8px;
      }

      :host {
        display: inline;
      }

      #container {
        display: flex;
        flex-wrap: wrap;
        row-gap: 20px;
        column-gap: 20px;
        width: 100%;
        min-width: 150px;
        height: 100%;
      }

      #left, #right {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        max-width: 200px;
        min-width: 100px;
      }
      #left {
        margin-right: 20px;
      }
    `
];
h([
  d({ type: Boolean })
], l.prototype, "mandatory", 2);
h([
  d({ type: String })
], l.prototype, "mandatoryMessage", 2);
h([
  d({ type: Boolean, reflect: !0 })
], l.prototype, "readonly", 2);
h([
  c()
], l.prototype, "_startNode", 2);
h([
  c()
], l.prototype, "_focalPointEnabled", 2);
h([
  c()
], l.prototype, "_preselectedCrops", 2);
h([
  c()
], l.prototype, "_allowedMediaTypes", 2);
h([
  c()
], l.prototype, "_multiple", 2);
h([
  c()
], l.prototype, "_min", 2);
h([
  c()
], l.prototype, "_max", 2);
h([
  c()
], l.prototype, "_alias", 2);
h([
  c()
], l.prototype, "_variantId", 2);
h([
  c()
], l.prototype, "_selectedCropAlias", 2);
h([
  c()
], l.prototype, "_options", 2);
h([
  c()
], l.prototype, "_mediaTypes", 2);
h([
  c()
], l.prototype, "_imgSrc", 2);
h([
  c()
], l.prototype, "_prevImgSrc", 2);
l = h([
  U(Me)
], l);
export {
  l as WysiwgImageAndCropPickerElement,
  l as element
};
//# sourceMappingURL=wysiwg-image-and-crop-picker.element-Dko5HQsH.js.map
