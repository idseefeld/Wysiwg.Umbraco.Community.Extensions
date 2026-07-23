import { UMB_MEDIA_ITEM_REPOSITORY_ALIAS as j, UMB_IMAGE_CROPPER_EDITOR_MODAL as ee, UMB_MEDIA_PICKER_MODAL as te, UMB_MEDIA_ENTITY_TYPE as ie } from "@umbraco-cms/backoffice/media";
import { html as y, css as k, property as l, state as c, customElement as S, nothing as E, repeat as se } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as q } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_CONTEXT as ae } from "@umbraco-cms/backoffice/property";
import { UmbFormControlMixin as O, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as B } from "@umbraco-cms/backoffice/validation";
import { UUISelectElement as re } from "@umbraco-cms/backoffice/external/uui";
import { i as oe, j as ne } from "./sdk.gen-ZN_nSxDw.js";
import { UmbChangeEvent as g } from "@umbraco-cms/backoffice/event";
import { UmbId as U } from "@umbraco-cms/backoffice/id";
import { UMB_MODAL_MANAGER_CONTEXT as le, umbConfirmModal as de } from "@umbraco-cms/backoffice/modal";
import { UmbRepositoryItemsManager as pe } from "@umbraco-cms/backoffice/repository";
import { UmbModalRouteRegistrationController as he } from "@umbraco-cms/backoffice/router";
import { UmbSorterController as ce, UmbSorterResolvePlacementAsGrid as ue } from "@umbraco-cms/backoffice/sorter";
var me = Object.defineProperty, ye = Object.getOwnPropertyDescriptor, R = (e) => {
  throw TypeError(e);
}, d = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? ye(t, i) : t, r = e.length - 1, _; r >= 0; r--)
    (_ = e[r]) && (a = (s ? _(t, i, a) : _(a)) || a);
  return s && a && me(t, i, a), a;
}, T = (e, t, i) => t.has(e) || R("Cannot " + i), m = (e, t, i) => (T(e, t, "read from private field"), i ? i.call(e) : t.get(e)), f = (e, t, i) => t.has(e) ? R("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), x = (e, t, i, s) => (T(e, t, "write to private field"), t.set(e, i), i), u = (e, t, i) => (T(e, t, "access private method"), i), w, M, C, b, h, A, I, P, V, N, z, D, K, W, L, F, Y, G;
const _e = "wysiwg-input-rich-media";
let n = class extends O(q, void 0) {
  constructor() {
    super(), f(this, h), f(this, w, new ce(this, {
      getUniqueOfElement: (e) => e.id,
      getUniqueOfModel: (e) => e.key,
      identifier: "Umb.SorterIdentifier.InputRichMedia",
      itemSelector: "uui-card-media",
      containerSelector: ".container",
      resolvePlacement: ue,
      onChange: ({ model: e }) => {
        this.value = e, this.dispatchEvent(new g());
      }
    })), this.min = 0, this.minMessage = "This field need more items", this.max = 1 / 0, this.maxMessage = "This field exceeds the allowed amount of items", this.multiple = !1, f(this, M, !1), f(this, C, !1), this._cards = [], f(this, b, new pe(this, j)), f(this, I, (e) => this.allowedContentTypeIds && this.allowedContentTypeIds.length > 0 ? this.allowedContentTypeIds.includes(e.mediaType.unique) : !0), this.observe(m(this, b).items, () => {
      u(this, h, A).call(this);
    }), new he(this, ee).addAdditionalPath(":key").onSetup((e) => {
      const t = e.key;
      if (!t) return !1;
      const i = this.value?.find((s) => s.key === t);
      return i ? {
        data: {
          cropOptions: this.preselectedCrops,
          hideFocalPoint: !this.focalPointEnabled,
          key: t,
          unique: i.mediaKey,
          pickableFilter: m(this, I)
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
      this.value = this.value?.map((t) => {
        if (t.key !== e.key) return t;
        const i = this.focalPointEnabled ? e.focalPoint : null, s = e.crops, a = e.unique, r = a === t.mediaKey ? t.key : U.new();
        return { ...t, crops: s, mediaKey: a, focalPoint: i, key: r };
      }), this.dispatchEvent(new g());
    }).observeRouteBuilder((e) => {
      this._routeBuilder = e;
    }), this.addValidator(
      "valueMissing",
      () => this.requiredMessage ?? B,
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
  set value(e) {
    super.value = e, m(this, w).setModel(e), m(this, b).setUniques(e?.map((t) => t.mediaKey)), u(this, h, A).call(this);
  }
  get value() {
    return super.value;
  }
  set focalPointEnabled(e) {
    x(this, M, e);
  }
  get focalPointEnabled() {
    return m(this, M);
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
    return m(this, C);
  }
  set readonly(e) {
    x(this, C, e), m(this, C) ? m(this, w).disable() : m(this, w).enable();
  }
  getFormElement() {
  }
  //#endregion
  render() {
    return y`
    ${u(this, h, D).call(this)}
    <div class="container">${u(this, h, K).call(this)} ${u(this, h, W).call(this)}</div>
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
    this.value = i, this.dispatchEvent(new g());
  }
};
w = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakMap();
b = /* @__PURE__ */ new WeakMap();
h = /* @__PURE__ */ new WeakSet();
A = async function() {
  const e = m(this, b).getItems();
  if (!e.length) {
    this._cards = [];
    return;
  }
  const t = e.filter((s) => !this._cards.find((a) => a.unique === s.unique)), i = this._cards.filter((s) => !e.find((a) => s.unique === a.unique));
  t.length === 0 && i.length === 0 || (this._cards = this.value?.map((s) => {
    const a = e.find((r) => r.unique === s.mediaKey);
    return {
      unique: s.key,
      media: s.mediaKey,
      name: a?.name ?? "",
      icon: a?.mediaType?.icon,
      isTrashed: a?.isTrashed ?? !1
    };
  }) ?? []);
};
I = /* @__PURE__ */ new WeakMap();
P = function(e) {
  if (!e.length) return;
  const t = e.map((i) => ({
    key: U.new(),
    mediaKey: i,
    mediaTypeAlias: "",
    crops: [],
    focalPoint: null
  }));
  this.value = [...this.value ?? [], ...t], this.dispatchEvent(new g());
};
V = async function() {
  const i = await (await this.getContext(le))?.open(this, te, {
    data: {
      multiple: this.multiple,
      startNode: this.startNode,
      pickableFilter: m(this, I)
    },
    value: { selection: [] }
  })?.onSubmit().catch(() => null);
  if (!i) return;
  const s = i.selection.filter((a) => a !== null);
  u(this, h, P).call(this, s);
};
N = async function(e) {
  await de(this, {
    color: "danger",
    headline: `${this.localize.term("actions_remove")} ${e.name}?`,
    content: `${this.localize.term("defaultdialogs_confirmremove")} ${e.name}?`,
    confirmLabel: this.localize.term("actions_remove")
  }), this.value = this.value?.filter((t) => t.key !== e.unique), this.dispatchEvent(new g());
};
z = async function(e) {
  const i = e.detail.map((s) => s.unique);
  u(this, h, P).call(this, i);
};
D = function() {
  if (this.readonly) return E;
  if (!(this._cards && this._cards.length >= this.max))
    return y`<umb-dropzone ?multiple=${this.max > 1} @complete=${u(this, h, z)}></umb-dropzone>`;
};
K = function() {
  if (this._cards.length)
    return y`
    ${se(
      this._cards,
      (e) => e.unique,
      (e) => u(this, h, L).call(this, e)
    )}
  `;
};
W = function() {
  if (!(this._cards && this._cards.length && !this.multiple)) {
    if (this.readonly && this._cards.length > 0)
      return E;
    {
      const e = this.localize.term("general_choose", "Choose");
      return y`
      <uui-button
        id="btn-add"
        look="placeholder"
        @blur=${() => {
        this.pristine = !1, this.checkValidity();
      }}
        @click=${u(this, h, V)}
        label=${e}
        ?disabled=${this.readonly}>
        <uui-icon name="icon-add"></uui-icon>
        ${e}
      </uui-button>
    `;
    }
  }
};
L = function(e) {
  const t = this.value?.length ? this.value[0] : void 0;
  if (!e.unique || !t) return E;
  const i = this.readonly ? void 0 : this._routeBuilder?.({ key: e.unique });
  return y`
    <wysiwg-card-image id=${e.unique} name=${e.name} .href=${i} ?readonly=${this.readonly}>

      <wysiwg-cropped-image .mediaItem=${t} @change=${u(this, h, F)}></wysiwg-cropped-image>
      ${u(this, h, G).call(this, e)} ${u(this, h, Y).call(this, e)}

    </wysiwg-card-image>
  `;
};
F = function(e) {
  e?.target?.value?.length > 0 && this._updateValue({
    cropUrl: e?.target?.value
  });
};
Y = function(e) {
  return this.readonly ? E : y`
    <uui-action-bar slot="actions">
      <uui-button label=${this.localize.term("general_remove")} look="secondary" @click=${() => u(this, h, N).call(this, e)}>
        <uui-icon name="icon-trash"></uui-icon>
      </uui-button>
    </uui-action-bar>
  `;
};
G = function(e) {
  if (e.isTrashed)
    return y`
    <uui-tag size="s" slot="tag" color="danger">
      <umb-localize key="mediaPicker_trashed">Trashed</umb-localize>
    </uui-tag>
  `;
};
n.styles = [
  k`
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
d([
  l({ type: Boolean })
], n.prototype, "required", 2);
d([
  l({ type: String })
], n.prototype, "requiredMessage", 2);
d([
  l({ type: Number })
], n.prototype, "min", 2);
d([
  l({ type: String, attribute: "min-message" })
], n.prototype, "minMessage", 2);
d([
  l({ type: Number })
], n.prototype, "max", 2);
d([
  l({ type: String, attribute: "min-message" })
], n.prototype, "maxMessage", 2);
d([
  l({ type: Array })
], n.prototype, "value", 1);
d([
  l({ type: Array })
], n.prototype, "allowedContentTypeIds", 2);
d([
  l({ type: Object, attribute: !1 })
], n.prototype, "startNode", 2);
d([
  l({ type: Boolean })
], n.prototype, "multiple", 2);
d([
  l({ type: Array })
], n.prototype, "preselectedCrops", 2);
d([
  l({ type: Boolean })
], n.prototype, "focalPointEnabled", 1);
d([
  l()
], n.prototype, "alias", 1);
d([
  l()
], n.prototype, "variantId", 1);
d([
  l({ type: Boolean, reflect: !0 })
], n.prototype, "readonly", 1);
d([
  c()
], n.prototype, "_cards", 2);
d([
  c()
], n.prototype, "_routeBuilder", 2);
n = d([
  S(_e)
], n);
var fe = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, H = (e) => {
  throw TypeError(e);
}, p = (e, t, i, s) => {
  for (var a = s > 1 ? void 0 : s ? ge(t, i) : t, r = e.length - 1, _; r >= 0; r--)
    (_ = e[r]) && (a = (s ? _(t, i, a) : _(a)) || a);
  return s && a && fe(t, i, a), a;
}, ve = (e, t, i) => t.has(e) || H("Cannot " + i), we = (e, t, i) => t.has(e) ? H("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), $ = (e, t, i) => (ve(e, t, "access private method"), i), v, X, Z, J, Q;
const Ce = "wysiwg-image-and-crop-picker";
let o = class extends O(q) {
  //#endregion
  constructor() {
    super(), we(this, v), this.mandatoryMessage = B, this.readonly = !1, this._focalPointEnabled = !1, this._preselectedCrops = [], this._allowedMediaTypes = [], this._multiple = !1, this._min = 0, this._max = 1 / 0, this._selectedCropAlias = "", this._options = [], this._mediaTypes = [], this._imgSrc = "", this._prevImgSrc = "", this.consumeContext(ae, (e) => {
      this.observe(
        e?.alias,
        (t) => this._alias = t,
        "_observeAlias"
      ), this.observe(
        e?.variantId,
        (t) => this._variantId = t?.toString() || "invariant",
        "_observeVariantId"
      );
    });
  }
  //#region properties, states, ctor, methods
  //#region properties
  set config(e) {
    if (!e) return;
    if (this._allowedMediaTypes = e.getValueByAlias("filter")?.split(",") ?? [], this._allowedMediaTypes.length === 0 && this.getMediaTypes(), this._focalPointEnabled = !!e.getValueByAlias("enableLocalFocalPoint"), this._multiple = !!e.getValueByAlias("multiple"), this._preselectedCrops = e?.getValueByAlias("crops") ?? [], this._preselectedCrops.length > 0) {
      const s = this._preselectedCrops.find((r) => !!r.defaultCrop);
      this._selectedCropAlias = this.value?.[0]?.selectedCropAlias ?? s?.alias ?? "";
      const a = this._preselectedCrops.map((r) => ({
        name: r.label?.toString() ?? r.alias,
        value: r.alias,
        selected: r.alias === this._selectedCropAlias
      }));
      this._options = [
        { name: "", value: "" },
        ...a
      ];
    }
    this.getImageCropperCrops();
    const t = e.getValueByAlias("startNodeId") ?? "";
    this._startNode = t ? { unique: t, entityType: ie } : void 0;
    const i = e.getValueByAlias("validationLimit");
    this._min = i?.min ?? 0, this._max = i?.max ?? 1 / 0;
  }
  firstUpdated() {
    this.addFormControlElement(this.shadowRoot.querySelector("wysiwg-input-rich-media")), this.shadowRoot?.querySelector("umb-input-dropdown-list") && this.addFormControlElement(this.shadowRoot.querySelector("umb-input-dropdown-list"));
  }
  // override focus(options?: FocusOptions) {
  //   return this.shadowRoot?.querySelector<WysiwgInputRichMediaElement>("wysiwg-input-rich-media")?.focus();
  // }
  async getMediaTypes() {
    await this.apiMediaTypes().then((e) => {
      if (e === "error") {
        this._mediaTypes = [];
        return;
      } else if (e === "no data") {
        this._mediaTypes = [];
        return;
      }
      const t = e;
      this._mediaTypes = t;
      const i = this._mediaTypes?.find((s) => s.alias.toLowerCase() === "image");
      this._allowedMediaTypes = i?.key ? [i.key] : [];
    });
  }
  async apiMediaTypes() {
    const { data: e, error: t } = await oe();
    return t && console.error(t), e !== void 0 ? e : "no data";
  }
  async getImageCropperCrops(e) {
    this._selectedCropAlias || (this._selectedCropAlias = this.value?.[0]?.selectedCropAlias ?? ""), await this.crops(e).then((t) => {
      if (t === "error") {
        this._preselectedCrops = [];
        return;
      } else if (t === "no data") {
        this._preselectedCrops = [];
        return;
      }
      var s = t.map((a) => ({
        name: `[${a.label?.toString() ?? a.alias}]`,
        value: a.alias,
        selected: a.alias === this._selectedCropAlias
      }));
      this._options = [
        ...this._options,
        ...s
      ];
    });
  }
  async crops(e) {
    const t = {
      url: "/api/v1/wysiwg/crops",
      query: {
        mediaItemId: e ?? ""
      }
    }, { data: i, error: s } = await ne(t);
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
    this.value = i, this.dispatchEvent(new g());
  }
  render() {
    return y`
    <div id="container">
      <div id="left">
        ${$(this, v, J).call(this)}
        ${$(this, v, Q).call(this)}
      </div>
    </div>`;
  }
};
v = /* @__PURE__ */ new WeakSet();
X = function(e) {
  this._imgSrc !== this._prevImgSrc && (this._prevImgSrc = this._imgSrc);
  const t = e.target.value?.length === 0, i = e.target.value?.find((r) => !!r.mediaKey) ?? void 0;
  let s = t ? void 0 : i;
  const a = this.value?.[0]?.selectedCropAlias ?? this._selectedCropAlias;
  if (t)
    this._updateValue({
      selectedCropAlias: a
    }, !0);
  else {
    const r = s?.crops.length === 0 ? this._preselectedCrops : s?.crops;
    this._updateValue({
      key: s?.key,
      mediaKey: s?.mediaKey,
      mediaTypeAlias: s?.mediaTypeAlias,
      focalPoint: s?.focalPoint,
      crops: r,
      selectedCropAlias: a
    });
  }
};
Z = function(e) {
  const t = e.target.value;
  this._selectedCropAlias = t, this._updateValue({
    selectedCropAlias: this._selectedCropAlias
  });
};
J = function() {
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
      @change=${$(this, v, X)}
      ?readonly=${this.readonly}
    >
    </wysiwg-input-rich-media>
  `;
};
Q = function() {
  const e = !!this.value?.length && !!this.value[0]?.mediaKey, t = "crop-select";
  return this._options.length ? y`
      <uui-select
        label=${t}
        .disabled=${!e}
        .options=${this._options}
        @change=${$(this, v, Z)}
        ?readonly=${this.readonly}
      ></uui-select>
    ` : y`<uui-select label=${t}></uui-select>`;
};
o.styles = [
  re.styles,
  k`
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
p([
  l({ type: Boolean })
], o.prototype, "mandatory", 2);
p([
  l({ type: String })
], o.prototype, "mandatoryMessage", 2);
p([
  l({ type: Boolean, reflect: !0 })
], o.prototype, "readonly", 2);
p([
  c()
], o.prototype, "_startNode", 2);
p([
  c()
], o.prototype, "_focalPointEnabled", 2);
p([
  c()
], o.prototype, "_preselectedCrops", 2);
p([
  c()
], o.prototype, "_allowedMediaTypes", 2);
p([
  c()
], o.prototype, "_multiple", 2);
p([
  c()
], o.prototype, "_min", 2);
p([
  c()
], o.prototype, "_max", 2);
p([
  c()
], o.prototype, "_alias", 2);
p([
  c()
], o.prototype, "_variantId", 2);
p([
  c()
], o.prototype, "_selectedCropAlias", 2);
p([
  c()
], o.prototype, "_options", 2);
p([
  c()
], o.prototype, "_mediaTypes", 2);
p([
  c()
], o.prototype, "_imgSrc", 2);
p([
  c()
], o.prototype, "_prevImgSrc", 2);
o = p([
  S(Ce)
], o);
const Be = o;
export {
  o as WysiwgImageAndCropPickerElement,
  Be as default
};
//# sourceMappingURL=wysiwg-image-and-crop-picker.element-D02cs0Yx.js.map
