import { html as c, css as _, state as f, property as m, customElement as v } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as w } from "@umbraco-cms/backoffice/lit-element";
import { UUISelectElement as g } from "@umbraco-cms/backoffice/external/uui";
import { UmbFormControlMixin as C, UMB_VALIDATION_EMPTY_LOCALIZATION_KEY as E } from "@umbraco-cms/backoffice/validation";
import { k as S } from "./sdk.gen-ZN_nSxDw.js";
var A = Object.defineProperty, P = Object.getOwnPropertyDescriptor, u = (t) => {
  throw TypeError(t);
}, s = (t, e, o, i) => {
  for (var r = i > 1 ? void 0 : i ? P(e, o) : e, l = t.length - 1, p; l >= 0; l--)
    (p = t[l]) && (r = (i ? p(e, o, r) : p(r)) || r);
  return i && r && A(e, o, r), r;
}, b = (t, e, o) => e.has(t) || u("Cannot " + o), O = (t, e, o) => e.has(t) ? u("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o), d = (t, e, o) => (b(t, e, "access private method"), o), a, h, y;
const $ = "wysiwg-component-picker";
let n = class extends C(w) {
  constructor() {
    super(), O(this, a), this._options = [{ value: "", name: "" }, { value: "/Components/ContactForm", name: "Contact Form" }], this.mandatoryMessage = E, this.readonly = !1;
  }
  //#region properties, states, ctor, methods
  //#region properties
  set config(t) {
    t && this.getAllComponents();
  }
  //#endregion
  //#endregion
  async components() {
    const t = {
      url: "/api/v1/wysiwg/all-components"
    }, { data: e, error: o } = await S(t);
    return e !== void 0 ? e : o ? (console.error(o), "error") : "no data";
  }
  async getAllComponents() {
    await this.components().then((t) => {
      if (t === "error") {
        this._options = [];
        return;
      } else if (t === "no data") {
        this._options = [];
        return;
      }
      this._options = [
        ...this._options
        // ...newOptions,
      ];
    });
  }
  firstUpdated() {
    this.addFormControlElement(this.shadowRoot.querySelector("wysiwg-component-picker")), this.shadowRoot?.querySelector("umb-input-dropdown-list") && this.addFormControlElement(this.shadowRoot.querySelector("umb-input-dropdown-list"));
  }
  render() {
    return c`${d(this, a, y).call(this)}`;
  }
};
a = /* @__PURE__ */ new WeakSet();
h = function(t) {
  const e = t.target.value;
  this.value = e ? { value: e.toString() } : void 0;
};
y = function() {
  const t = !this.readonly, e = "component-select";
  return this._options.length ? c`
        <uui-select
          label=${e}
          .disabled=${!t}
          .options=${this._options}
          @change=${d(this, a, h)}
          ?readonly=${this.readonly}
        ></uui-select>
      ` : c`<uui-select label=${e}></uui-select>`;
};
n.styles = [
  g.styles,
  _`
        uui-select {
          margin-top: 8px;
        }

        :host {
          display: inline;
        }
      `
];
s([
  f()
], n.prototype, "_options", 2);
s([
  m({ type: Boolean })
], n.prototype, "mandatory", 2);
s([
  m({ type: String })
], n.prototype, "mandatoryMessage", 2);
s([
  m({ type: Boolean, reflect: !0 })
], n.prototype, "readonly", 2);
n = s([
  v($)
], n);
const k = n;
export {
  n as WysiwgComponentPickerElement,
  k as default
};
//# sourceMappingURL=wysiwg-component-picker.element-BgjDFAup.js.map
