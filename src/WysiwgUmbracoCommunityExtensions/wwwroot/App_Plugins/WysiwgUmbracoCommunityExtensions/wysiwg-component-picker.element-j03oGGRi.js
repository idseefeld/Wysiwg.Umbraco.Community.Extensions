import { html as c, css as f, state as u, property as m, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as w } from "@umbraco-cms/backoffice/lit-element";
import { UUISelectElement as C } from "@umbraco-cms/backoffice/external/uui";
import { UmbFormControlMixin as g, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as E } from "@umbraco-cms/backoffice/validation";
import { UmbChangeEvent as b } from "@umbraco-cms/backoffice/event";
import { j as A } from "./sdk.gen-CBXr3l_Z.js";
var O = Object.defineProperty, P = Object.getOwnPropertyDescriptor, d = (e) => {
  throw TypeError(e);
}, a = (e, t, o, s) => {
  for (var r = s > 1 ? void 0 : s ? P(t, o) : t, i = e.length - 1, p; i >= 0; i--)
    (p = e[i]) && (r = (s ? p(t, o, r) : p(r)) || r);
  return s && r && O(t, o, r), r;
}, S = (e, t, o) => t.has(e) || d("Cannot " + o), V = (e, t, o) => t.has(e) ? d("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, o), h = (e, t, o) => (S(e, t, "access private method"), o), l, _, y;
const U = "wysiwg-component-picker";
let n = class extends g(w) {
  constructor() {
    super(...arguments), V(this, l), this._options = [{ value: "", name: "" }], this._selectedValue = "", this.mandatoryMessage = E, this.readonly = !1;
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
    const e = {}, { data: t, error: o } = await A(e);
    return t !== void 0 ? t : o ? (console.error(o), "error") : "no data";
  }
  firstUpdated() {
    this._selectedValue = this.value ?? "", this.getAllComponents(), this.shadowRoot?.querySelector("umb-input-dropdown-list") && this.addFormControlElement(this.shadowRoot.querySelector("umb-input-dropdown-list"));
  }
  render() {
    return c`${h(this, l, y).call(this)}`;
  }
};
l = /* @__PURE__ */ new WeakSet();
_ = function(e) {
  const t = e.target.value;
  this._selectedValue = t ?? "", this.value = this._selectedValue, this.dispatchEvent(new b());
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
  C.styles,
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
//# sourceMappingURL=wysiwg-component-picker.element-j03oGGRi.js.map
