import { UMB_MEDIA_ENTITY_TYPE as E } from "@umbraco-cms/backoffice/media";
import { html as _, css as $, property as y, state as p, customElement as S } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as b } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_CONTEXT as P } from "@umbraco-cms/backoffice/property";
import { UmbPropertyValueChangeEvent as x } from "@umbraco-cms/backoffice/property-editor";
import { UmbFormControlMixin as M, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as B } from "@umbraco-cms/backoffice/validation";
import { UUISelectElement as N } from "@umbraco-cms/backoffice/external/uui";
import { W as g } from "./services.gen-mcYb1gDV.js";
var O = Object.defineProperty, U = Object.getOwnPropertyDescriptor, f = (e) => {
  throw TypeError(e);
}, r = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? U(t, s) : t, n = e.length - 1, l; n >= 0; n--)
    (l = e[n]) && (o = (i ? l(t, s, o) : l(o)) || o);
  return i && o && O(t, s, o), o;
}, q = (e, t, s) => t.has(e) || f("Cannot " + s), L = (e, t, s) => t.has(e) ? f("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, s), u = (e, t, s) => (q(e, t, "access private method"), s), h, v, C, w, A, T, I;
const K = "wysiwg-image-and-crop-picker";
let a = class extends M(b) {
  //#endregion
  constructor() {
    super(), L(this, h), this.mandatoryMessage = B, this.readonly = !1, this._focalPointEnabled = !1, this._preselectedCrops = [], this._allowedMediaTypes = [], this._multiple = !1, this._min = 0, this._max = 1 / 0, this._selectedCropAlias = "", this._options = [], this._mediaTypes = [], this._imgSrc = "", this._prevImgSrc = "", this.consumeContext(P, (e) => {
      this.observe(e.alias, (t) => this._alias = t), this.observe(e.variantId, (t) => this._variantId = (t == null ? void 0 : t.toString()) || "invariant");
    });
  }
  //#region properties, states, ctor, methods
  //#region properties
  set config(e) {
    var i, o, n;
    if (!e) return;
    if (this._allowedMediaTypes = ((i = e.getValueByAlias("filter")) == null ? void 0 : i.split(",")) ?? [], this._allowedMediaTypes.length === 0 && this.getMediaTypes(), this._focalPointEnabled = !!e.getValueByAlias("enableLocalFocalPoint"), this._multiple = !!e.getValueByAlias("multiple"), this._preselectedCrops = (e == null ? void 0 : e.getValueByAlias("crops")) ?? [], this._preselectedCrops.length > 0) {
      const l = this._preselectedCrops.find((d) => !!d.defaultCrop);
      this._selectedCropAlias = ((n = (o = this.value) == null ? void 0 : o[0]) == null ? void 0 : n.selectedCropAlias) ?? (l == null ? void 0 : l.alias) ?? "";
      const c = this._preselectedCrops.map((d) => {
        var m;
        return {
          name: ((m = d.label) == null ? void 0 : m.toString()) ?? d.alias,
          value: d.alias,
          selected: d.alias === this._selectedCropAlias
        };
      });
      this._options = [
        { name: "", value: "" },
        ...c
      ];
    }
    this.getImageCropperCrops();
    const t = e.getValueByAlias("startNodeId") ?? "";
    this._startNode = t ? { unique: t, entityType: E } : void 0;
    const s = e.getValueByAlias("validationLimit");
    this._min = (s == null ? void 0 : s.min) ?? 0, this._max = (s == null ? void 0 : s.max) ?? 1 / 0;
  }
  firstUpdated() {
    var t;
    this.addFormControlElement(this.shadowRoot.querySelector("umb-input-rich-media")), ((t = this.shadowRoot) == null ? void 0 : t.querySelector("umb-input-dropdown-list")) && this.addFormControlElement(this.shadowRoot.querySelector("umb-input-dropdown-list"));
  }
  focus(e) {
    var t, s;
    return console.log("focus(options) options = ", e), (s = (t = this.shadowRoot) == null ? void 0 : t.querySelector("umb-input-rich-media")) == null ? void 0 : s.focus();
  }
  async getMediaTypes() {
    await this.apiMediaTypes().then((e) => {
      var i;
      if (e === "error") {
        this._mediaTypes = [];
        return;
      } else if (e === "no data") {
        this._mediaTypes = [];
        return;
      }
      const t = e;
      this._mediaTypes = t;
      const s = (i = this._mediaTypes) == null ? void 0 : i.find((o) => o.alias.toLowerCase() === "image");
      this._allowedMediaTypes = s != null && s.key ? [s.key] : [];
    });
  }
  async apiMediaTypes() {
    const { data: e, error: t } = await g.mediaTypes();
    return t && console.error(t), e !== void 0 ? e : "no data";
  }
  async getImageCropperCrops(e) {
    var t, s;
    this._selectedCropAlias || (this._selectedCropAlias = ((s = (t = this.value) == null ? void 0 : t[0]) == null ? void 0 : s.selectedCropAlias) ?? ""), await this.crops(e).then((i) => {
      if (i === "error") {
        this._preselectedCrops = [];
        return;
      } else if (i === "no data") {
        this._preselectedCrops = [];
        return;
      }
      var n = i.map((l) => {
        var c;
        return {
          name: `[${((c = l.label) == null ? void 0 : c.toString()) ?? l.alias}]`,
          value: l.alias,
          selected: l.alias === this._selectedCropAlias
        };
      });
      this._options = [
        ...this._options,
        ...n
      ];
    });
  }
  async crops(e) {
    const t = {
      query: {
        mediaItemId: e ?? ""
      }
    }, { data: s, error: i } = await g.crops(t);
    return i ? (console.error(i), "error") : s !== void 0 ? s : "no data";
  }
  _updateValue(e, t = !1) {
    const s = [];
    if (!this.value || !this.value.length || t) {
      const i = {
        ...e
      };
      s.push(i);
    } else
      for (let i = 0; i < this.value.length; i++) {
        const o = {
          ...this.value[i],
          ...e
        };
        s.push(o);
      }
    this.value = s, this.dispatchEvent(new x());
  }
  render() {
    return _`
    <div id="container">
      <div id="left">
        ${u(this, h, T).call(this)}
      </div>
      <div id="right">
        ${u(this, h, A).call(this)}
        ${u(this, h, I).call(this)}
      </div>
    </div>`;
  }
};
h = /* @__PURE__ */ new WeakSet();
v = function(e) {
  var n, l, c, d;
  this._imgSrc !== this._prevImgSrc && (console.debug("imgSrc changed", this._imgSrc, this._prevImgSrc), this._prevImgSrc = this._imgSrc);
  const t = ((n = e.target.value) == null ? void 0 : n.length) === 0, s = ((l = e.target.value) == null ? void 0 : l.find((m) => !!m.mediaKey)) ?? void 0;
  let i = t ? void 0 : s;
  const o = ((d = (c = this.value) == null ? void 0 : c[0]) == null ? void 0 : d.selectedCropAlias) ?? this._selectedCropAlias;
  if (t)
    this._updateValue({
      selectedCropAlias: o
    }, !0);
  else {
    const m = (i == null ? void 0 : i.crops.length) === 0 ? this._preselectedCrops : i == null ? void 0 : i.crops;
    this._updateValue({
      key: i == null ? void 0 : i.key,
      mediaKey: i == null ? void 0 : i.mediaKey,
      mediaTypeAlias: i == null ? void 0 : i.mediaTypeAlias,
      focalPoint: i == null ? void 0 : i.focalPoint,
      crops: m,
      selectedCropAlias: o
    });
  }
};
C = function(e) {
  const t = e.target.value;
  this._selectedCropAlias = t, this._updateValue({
    selectedCropAlias: this._selectedCropAlias
  });
};
w = function(e) {
  var t, s, i, o;
  ((s = (t = e == null ? void 0 : e.target) == null ? void 0 : t.value) == null ? void 0 : s.length) > 0 && (console.log("onChangePreview", (i = e == null ? void 0 : e.target) == null ? void 0 : i.value), this._updateValue({
    cropUrl: (o = e == null ? void 0 : e.target) == null ? void 0 : o.value
  }));
};
A = function() {
  var t;
  if (!this.value || !this.value.length || !((t = this.value[0]) != null && t.mediaKey))
    return;
  const e = this.value[0];
  return _`<wysiwg-cropped-image .mediaItem=${e} @change=${u(this, h, w)}></wysiwg-cropped-image>`;
};
T = function() {
  return _`
    <umb-input-rich-media
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
      @change=${u(this, h, v)}
      ?readonly=${this.readonly}
    >
    </umb-input-rich-media>
  `;
};
I = function() {
  var s, i;
  const e = !!((s = this.value) != null && s.length) && !!((i = this.value[0]) != null && i.mediaKey), t = "crop-select";
  return this._options.length ? _`
      <uui-select
        label=${t}
        .disabled=${!e}
        .options=${this._options}
        @change=${u(this, h, C)}
        ?readonly=${this.readonly}
      ></uui-select>
    ` : _`<uui-select label=${t}></uui-select>`;
};
a.styles = [
  N.styles,
  $`
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
r([
  y({ type: Boolean })
], a.prototype, "mandatory", 2);
r([
  y({ type: String })
], a.prototype, "mandatoryMessage", 2);
r([
  y({ type: Boolean, reflect: !0 })
], a.prototype, "readonly", 2);
r([
  p()
], a.prototype, "_startNode", 2);
r([
  p()
], a.prototype, "_focalPointEnabled", 2);
r([
  p()
], a.prototype, "_preselectedCrops", 2);
r([
  p()
], a.prototype, "_allowedMediaTypes", 2);
r([
  p()
], a.prototype, "_multiple", 2);
r([
  p()
], a.prototype, "_min", 2);
r([
  p()
], a.prototype, "_max", 2);
r([
  p()
], a.prototype, "_alias", 2);
r([
  p()
], a.prototype, "_variantId", 2);
r([
  p()
], a.prototype, "_selectedCropAlias", 2);
r([
  p()
], a.prototype, "_options", 2);
r([
  p()
], a.prototype, "_mediaTypes", 2);
r([
  p()
], a.prototype, "_imgSrc", 2);
r([
  p()
], a.prototype, "_prevImgSrc", 2);
a = r([
  S(K)
], a);
export {
  a as WysiwgImageAndCropPickerElement,
  a as element
};
//# sourceMappingURL=wysiwg-image-and-crop-picker.element-BRNk7bK5.js.map
