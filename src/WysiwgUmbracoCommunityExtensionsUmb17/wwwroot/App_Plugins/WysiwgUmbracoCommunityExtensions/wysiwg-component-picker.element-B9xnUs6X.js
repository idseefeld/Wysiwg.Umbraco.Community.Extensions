import { html as c, css as f, state as u, property as m, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as w } from "@umbraco-cms/backoffice/lit-element";
import { UUISelectElement as g } from "@umbraco-cms/backoffice/external/uui";
import { UmbFormControlMixin as C, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as E } from "@umbraco-cms/backoffice/validation";
import { UmbChangeEvent as V } from "@umbraco-cms/backoffice/event";
import { k as b } from "./sdk.gen-ZN_nSxDw.js";
var A = Object.defineProperty, O = Object.getOwnPropertyDescriptor, d = (e) => {
  throw TypeError(e);
}, a = (e, t, o, s) => {
  for (var r = s > 1 ? void 0 : s ? O(t, o) : t, i = e.length - 1, p; i >= 0; i--)
    (p = e[i]) && (r = (s ? p(t, o, r) : p(r)) || r);
  return s && r && A(t, o, r), r;
}, P = (e, t, o) => t.has(e) || d("Cannot " + o), S = (e, t, o) => t.has(e) ? d("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, o), h = (e, t, o) => (P(e, t, "access private method"), o), l, _, y;
const U = "wysiwg-component-picker";
let n = class extends C(w) {
  constructor() {
    super(), S(this, l), this._options = [{ value: "", name: "" }], this._selectedValue = "", this.mandatoryMessage = E, this.readonly = !1;
  }
  //#region properties, states, ctor, methods
  set config(e) {
  }
  //#endregion
  async getAllComponents() {
    await this.components().then((e) => {
      if (e === "error" || e === "no data")
        return;
      var o = e.map((s) => ({
        name: s.name,
        value: s.value,
        selected: s.value === this._selectedValue
      }));
      this._options = [
        ...this._options,
        ...o
      ];
    });
  }
  async components() {
    const e = {
      url: "/api/v1/wysiwg/all-components"
    }, { data: t, error: o } = await b(e);
    return t !== void 0 ? t : o ? (console.error(o), "error") : "no data";
  }
  firstUpdated() {
    this._selectedValue = this.value?.[0]?.selectedValue ?? "", this.getAllComponents(), this.shadowRoot?.querySelector("umb-input-dropdown-list") && this.addFormControlElement(this.shadowRoot.querySelector("umb-input-dropdown-list"));
  }
  render() {
    return c`${h(this, l, y).call(this)}`;
  }
};
l = /* @__PURE__ */ new WeakSet();
_ = function(e) {
  const t = e.target.value;
  this._selectedValue = t ?? "", this.value = [{ selectedValue: this._selectedValue }], this.dispatchEvent(new V());
};
y = function() {
  const e = !this.readonly, t = "component-select";
  return this._options?.length ? c`
        <uui-select
          label=${t}
          .disabled=${!e}
          .options=${this._options ?? []}
          @change=${h(this, l, _)}
          ?readonly=${this.readonly}
        ></uui-select>
      ` : c`<uui-select label=${t}></uui-select>`;
};
n.styles = [
  g.styles,
  f`
        uui-select {
          margin-top: 8px;
        }

        :host {
          display: inline;
        }
      `
];
a([
  u()
], n.prototype, "_options", 2);
a([
  u()
], n.prototype, "_selectedValue", 2);
a([
  m({ type: Boolean })
], n.prototype, "mandatory", 2);
a([
  m({ type: String })
], n.prototype, "mandatoryMessage", 2);
a([
  m({ type: Boolean, reflect: !0 })
], n.prototype, "readonly", 2);
n = a([
  v(U)
], n);
const L = n;
export {
  n as WysiwgComponentPickerElement,
  L as default
};
//# sourceMappingURL=wysiwg-component-picker.element-B9xnUs6X.js.map
