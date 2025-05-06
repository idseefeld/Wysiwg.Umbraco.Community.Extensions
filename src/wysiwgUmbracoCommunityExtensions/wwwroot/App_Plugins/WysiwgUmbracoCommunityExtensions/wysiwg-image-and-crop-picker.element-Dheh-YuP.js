import { UMB_MEDIA_ITEM_REPOSITORY_ALIAS as ae, UMB_IMAGE_CROPPER_EDITOR_MODAL as re, UMB_MEDIA_PICKER_MODAL as oe, UMB_MEDIA_ENTITY_TYPE as ne } from "@umbraco-cms/backoffice/media";
import { html as _, nothing as P, repeat as le, css as B, property as h, state as u, customElement as U } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as R } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_CONTEXT as he } from "@umbraco-cms/backoffice/property";
import { UmbPropertyValueChangeEvent as N } from "@umbraco-cms/backoffice/property-editor";
import { UmbFormControlMixin as z, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as W } from "@umbraco-cms/backoffice/validation";
import { UUISelectElement as pe } from "@umbraco-cms/backoffice/external/uui";
import { W as q } from "./services.gen-B_ebHh4e.js";
import { UmbChangeEvent as E } from "@umbraco-cms/backoffice/event";
import { UmbId as D } from "@umbraco-cms/backoffice/id";
import { UMB_MODAL_MANAGER_CONTEXT as de, umbConfirmModal as ce } from "@umbraco-cms/backoffice/modal";
import { UmbRepositoryItemsManager as ue } from "@umbraco-cms/backoffice/repository";
import { UmbModalRouteRegistrationController as me } from "@umbraco-cms/backoffice/router";
import { UmbSorterController as ye, UmbSorterResolvePlacementAsGrid as _e } from "@umbraco-cms/backoffice/sorter";
var fe = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, K = (e) => {
  throw TypeError(e);
}, p = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? ge(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (a = (s ? o(t, i, a) : o(a)) || a);
  return s && a && fe(t, i, a), a;
}, x = (e, t, i) => t.has(e) || K("Cannot " + i), y = (e, t, i) => (x(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? K("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), O = (e, t, i, s) => (x(e, t, "write to private field"), t.set(e, i), i), m = (e, t, i) => (x(e, t, "access private method"), i), b, M, I, $, c, S, A, k, L, F, V, Y, G, X, H, Z, J, Q;
const ve = "wysiwg-input-rich-media";
let n = class extends z(R, void 0) {
  constructor() {
    super(), w(this, c), w(this, b, new ye(this, {
      getUniqueOfElement: (e) => e.id,
      getUniqueOfModel: (e) => e.key,
      identifier: "Umb.SorterIdentifier.InputRichMedia",
      itemSelector: "uui-card-media",
      containerSelector: ".container",
      resolvePlacement: _e,
      onChange: ({ model: e }) => {
        this.value = e, this.dispatchEvent(new E());
      }
    })), this.min = 0, this.minMessage = "This field need more items", this.max = 1 / 0, this.maxMessage = "This field exceeds the allowed amount of items", this.multiple = !1, w(this, M, !1), w(this, I, !1), this._cards = [], w(this, $, new ue(this, ae)), w(this, A, (e) => this.allowedContentTypeIds && this.allowedContentTypeIds.length > 0 ? this.allowedContentTypeIds.includes(e.mediaType.unique) : !0), this.observe(y(this, $).items, () => {
      m(this, c, S).call(this);
    }), new me(this, re).addAdditionalPath(":key").onSetup((e) => {
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
          pickableFilter: y(this, A)
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
        const s = this.focalPointEnabled ? e.focalPoint : null, a = e.crops, r = e.unique, o = r === i.mediaKey ? i.key : D.new();
        return { ...i, crops: a, mediaKey: r, focalPoint: s, key: o };
      }), this.dispatchEvent(new E());
    }).observeRouteBuilder((e) => {
      this._routeBuilder = e;
    }), this.addValidator(
      "valueMissing",
      () => this.requiredMessage ?? W,
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
    super.value = e, y(this, b).setModel(e), y(this, $).setUniques(e == null ? void 0 : e.map((t) => t.mediaKey)), m(this, c, S).call(this);
  }
  get value() {
    return super.value;
  }
  set focalPointEnabled(e) {
    O(this, M, e);
  }
  get focalPointEnabled() {
    return y(this, M);
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
    return y(this, I);
  }
  set readonly(e) {
    O(this, I, e), y(this, I) ? y(this, b).disable() : y(this, b).enable();
  }
  getFormElement() {
  }
  //#endregion
  render() {
    return _`
    ${m(this, c, Y).call(this)}
    <div class="container">${m(this, c, G).call(this)} ${m(this, c, X).call(this)}</div>
  `;
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
    this.value = i, this.dispatchEvent(new N());
  }
};
b = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
S = async function() {
  var s;
  const e = y(this, $).getItems();
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
A = /* @__PURE__ */ new WeakMap();
k = function(e) {
  if (!e.length) return;
  const t = e.map((i) => ({
    key: D.new(),
    mediaKey: i,
    mediaTypeAlias: "",
    crops: [],
    focalPoint: null
  }));
  this.value = [...this.value ?? [], ...t], this.dispatchEvent(new E());
};
L = async function() {
  const e = await this.getContext(de), t = e == null ? void 0 : e.open(this, oe, {
    data: {
      multiple: this.multiple,
      startNode: this.startNode,
      pickableFilter: y(this, A)
    },
    value: { selection: [] }
  }), i = await (t == null ? void 0 : t.onSubmit().catch(() => null));
  if (!i) return;
  const s = i.selection.filter((a) => a !== null);
  m(this, c, k).call(this, s);
};
F = async function(e) {
  var t;
  await ce(this, {
    color: "danger",
    headline: `${this.localize.term("actions_remove")} ${e.name}?`,
    content: `${this.localize.term("defaultdialogs_confirmremove")} ${e.name}?`,
    confirmLabel: this.localize.term("actions_remove")
  }), this.value = (t = this.value) == null ? void 0 : t.filter((i) => i.key !== e.unique), this.dispatchEvent(new E());
};
V = async function(e) {
  const i = e.detail.map((s) => s.unique);
  m(this, c, k).call(this, i);
};
Y = function() {
  if (this.readonly) return P;
  if (!(this._cards && this._cards.length >= this.max))
    return _`<umb-dropzone ?multiple=${this.max > 1} @complete=${m(this, c, V)}></umb-dropzone>`;
};
G = function() {
  if (this._cards.length)
    return _`
    ${le(
      this._cards,
      (e) => e.unique,
      (e) => m(this, c, H).call(this, e)
    )}
  `;
};
X = function() {
  if (!(this._cards && this._cards.length && !this.multiple))
    return this.readonly && this._cards.length > 0 ? P : _`
      <uui-button
        id="btn-add"
        look="placeholder"
        @blur=${() => {
      this.pristine = !1, this.checkValidity();
    }}
        @click=${m(this, c, L)}
        label=${this.localize.term("general_choose")}
        ?disabled=${this.readonly}>
        <uui-icon name="icon-add"></uui-icon>
        ${this.localize.term("general_choose")}
      </uui-button>
    `;
};
H = function(e) {
  var s, a;
  const t = (s = this.value) != null && s.length ? this.value[0] : void 0;
  if (!e.unique || !t) return P;
  const i = this.readonly || (a = this._routeBuilder) == null ? void 0 : a.call(this, { key: e.unique });
  return _`
    <wysiwg-card-image id=${e.unique} name=${e.name} .href=${i} ?readonly=${this.readonly}>

      <wysiwg-cropped-image .mediaItem=${t} @change=${m(this, c, Z)}></wysiwg-cropped-image>
      ${m(this, c, Q).call(this, e)} ${m(this, c, J).call(this, e)}

    </wysiwg-card-image>
  `;
};
Z = function(e) {
  var t, i, s;
  ((i = (t = e == null ? void 0 : e.target) == null ? void 0 : t.value) == null ? void 0 : i.length) > 0 && this._updateValue({
    cropUrl: (s = e == null ? void 0 : e.target) == null ? void 0 : s.value
  });
};
J = function(e) {
  return this.readonly ? P : _`
    <uui-action-bar slot="actions">
      <uui-button label=${this.localize.term("general_remove")} look="secondary" @click=${() => m(this, c, F).call(this, e)}>
        <uui-icon name="icon-trash"></uui-icon>
      </uui-button>
    </uui-action-bar>
  `;
};
Q = function(e) {
  if (e.isTrashed)
    return _`
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

    .container{
      min-width: 150px;
      min-height: 150px;
      display: block;
    }

    #btn-add {
      text-align: center;
      min-height: 150px;
      min-width: 150px;
      width: 100%;
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
  h({ type: Boolean })
], n.prototype, "required", 2);
p([
  h({ type: String })
], n.prototype, "requiredMessage", 2);
p([
  h({ type: Number })
], n.prototype, "min", 2);
p([
  h({ type: String, attribute: "min-message" })
], n.prototype, "minMessage", 2);
p([
  h({ type: Number })
], n.prototype, "max", 2);
p([
  h({ type: String, attribute: "min-message" })
], n.prototype, "maxMessage", 2);
p([
  h({ type: Array })
], n.prototype, "value", 1);
p([
  h({ type: Array })
], n.prototype, "allowedContentTypeIds", 2);
p([
  h({ type: Object, attribute: !1 })
], n.prototype, "startNode", 2);
p([
  h({ type: Boolean })
], n.prototype, "multiple", 2);
p([
  h({ type: Array })
], n.prototype, "preselectedCrops", 2);
p([
  h({ type: Boolean })
], n.prototype, "focalPointEnabled", 1);
p([
  h()
], n.prototype, "alias", 1);
p([
  h()
], n.prototype, "variantId", 1);
p([
  h({ type: Boolean, reflect: !0 })
], n.prototype, "readonly", 1);
p([
  u()
], n.prototype, "_cards", 2);
p([
  u()
], n.prototype, "_routeBuilder", 2);
n = p([
  U(ve)
], n);
var we = Object.defineProperty, Ce = Object.getOwnPropertyDescriptor, j = (e) => {
  throw TypeError(e);
}, d = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? Ce(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (a = (s ? o(t, i, a) : o(a)) || a);
  return s && a && we(t, i, a), a;
}, be = (e, t, i) => t.has(e) || j("Cannot " + i), Ie = (e, t, i) => t.has(e) ? j("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), T = (e, t, i) => (be(e, t, "access private method"), i), C, ee, te, ie, se;
const $e = "wysiwg-image-and-crop-picker";
let l = class extends z(R) {
  //#endregion
  constructor() {
    super(), Ie(this, C), this.mandatoryMessage = W, this.readonly = !1, this._focalPointEnabled = !1, this._preselectedCrops = [], this._allowedMediaTypes = [], this._multiple = !1, this._min = 0, this._max = 1 / 0, this._selectedCropAlias = "", this._options = [], this._mediaTypes = [], this._imgSrc = "", this._prevImgSrc = "", this.consumeContext(he, (e) => {
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
        var v;
        return {
          name: ((v = g.label) == null ? void 0 : v.toString()) ?? g.alias,
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
    this.value = i, this.dispatchEvent(new N());
  }
  render() {
    return _`
    <div id="container">
      <div id="left">
        ${T(this, C, ie).call(this)}
        ${T(this, C, se).call(this)}
      </div>
    </div>`;
  }
};
C = /* @__PURE__ */ new WeakSet();
ee = function(e) {
  var r, o, f, g;
  this._imgSrc !== this._prevImgSrc && (console.debug("imgSrc changed", this._imgSrc, this._prevImgSrc), this._prevImgSrc = this._imgSrc);
  const t = ((r = e.target.value) == null ? void 0 : r.length) === 0, i = ((o = e.target.value) == null ? void 0 : o.find((v) => !!v.mediaKey)) ?? void 0;
  let s = t ? void 0 : i;
  const a = ((g = (f = this.value) == null ? void 0 : f[0]) == null ? void 0 : g.selectedCropAlias) ?? this._selectedCropAlias;
  if (t)
    this._updateValue({
      selectedCropAlias: a
    }, !0);
  else {
    const v = (s == null ? void 0 : s.crops.length) === 0 ? this._preselectedCrops : s == null ? void 0 : s.crops;
    this._updateValue({
      key: s == null ? void 0 : s.key,
      mediaKey: s == null ? void 0 : s.mediaKey,
      mediaTypeAlias: s == null ? void 0 : s.mediaTypeAlias,
      focalPoint: s == null ? void 0 : s.focalPoint,
      crops: v,
      selectedCropAlias: a
    });
  }
};
te = function(e) {
  const t = e.target.value;
  this._selectedCropAlias = t, this._updateValue({
    selectedCropAlias: this._selectedCropAlias
  });
};
ie = function() {
  return _`
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
      @change=${T(this, C, ee)}
      ?readonly=${this.readonly}
    >
    </wysiwg-input-rich-media>
  `;
};
se = function() {
  var i, s;
  const e = !!((i = this.value) != null && i.length) && !!((s = this.value[0]) != null && s.mediaKey), t = "crop-select";
  return this._options.length ? _`
      <uui-select
        label=${t}
        .disabled=${!e}
        .options=${this._options}
        @change=${T(this, C, te)}
        ?readonly=${this.readonly}
      ></uui-select>
    ` : _`<uui-select label=${t}></uui-select>`;
};
l.styles = [
  pe.styles,
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
d([
  h({ type: Boolean })
], l.prototype, "mandatory", 2);
d([
  h({ type: String })
], l.prototype, "mandatoryMessage", 2);
d([
  h({ type: Boolean, reflect: !0 })
], l.prototype, "readonly", 2);
d([
  u()
], l.prototype, "_startNode", 2);
d([
  u()
], l.prototype, "_focalPointEnabled", 2);
d([
  u()
], l.prototype, "_preselectedCrops", 2);
d([
  u()
], l.prototype, "_allowedMediaTypes", 2);
d([
  u()
], l.prototype, "_multiple", 2);
d([
  u()
], l.prototype, "_min", 2);
d([
  u()
], l.prototype, "_max", 2);
d([
  u()
], l.prototype, "_alias", 2);
d([
  u()
], l.prototype, "_variantId", 2);
d([
  u()
], l.prototype, "_selectedCropAlias", 2);
d([
  u()
], l.prototype, "_options", 2);
d([
  u()
], l.prototype, "_mediaTypes", 2);
d([
  u()
], l.prototype, "_imgSrc", 2);
d([
  u()
], l.prototype, "_prevImgSrc", 2);
l = d([
  U($e)
], l);
export {
  l as WysiwgImageAndCropPickerElement,
  l as element
};
//# sourceMappingURL=wysiwg-image-and-crop-picker.element-Dheh-YuP.js.map
