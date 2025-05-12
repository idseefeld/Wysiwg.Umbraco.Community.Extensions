import { UmbTextStyles as P } from "@umbraco-cms/backoffice/style";
import { html as y, nothing as E, property as $, state as c, customElement as w } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as T } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_EDITOR_UI_PICKER_MODAL as k } from "@umbraco-cms/backoffice/property-editor";
import { UMB_DATA_TYPE_WORKSPACE_CONTEXT as S } from "@umbraco-cms/backoffice/data-type";
import { umbBindToValidation as g } from "@umbraco-cms/backoffice/validation";
import { UMB_MODAL_MANAGER_CONTEXT as C } from "@umbraco-cms/backoffice/modal";
var O = Object.defineProperty, D = Object.getOwnPropertyDescriptor, U = (t) => {
  throw TypeError(t);
}, s = (t, r, e, d) => {
  for (var p = d > 1 ? void 0 : d ? D(r, e) : r, _ = t.length - 1, u; _ >= 0; _--)
    (u = t[_]) && (p = (d ? u(r, e, p) : u(p)) || p);
  return d && p && O(r, e, p), p;
}, m = (t, r, e) => r.has(t) || U("Cannot " + e), l = (t, r, e) => (m(t, r, "read from private field"), r.get(t)), f = (t, r, e) => r.has(t) ? U("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(t) : r.set(t, e), I = (t, r, e, d) => (m(t, r, "write to private field"), r.set(t, e), e), n = (t, r, e) => (m(t, r, "access private method"), e), o, a, v, h, A, b;
const M = "wysiwg-datatype-picker";
let i = class extends T {
  constructor() {
    super(), f(this, a), this.dataTypes = [], this._propertyEditorUiIcon = null, this._propertyEditorUiName = null, this._propertyEditorUiAlias = null, this._propertyEditorSchemaAlias = null, f(this, o), this.consumeContext(S, (t) => {
      I(this, o, t), n(this, a, v).call(this);
    });
  }
  render() {
    return y`
			<uui-box>
				${this._propertyEditorUiAlias && this._propertyEditorSchemaAlias ? n(this, a, b).call(this) : n(this, a, A).call(this)}
			</uui-box>
		`;
  }
};
o = /* @__PURE__ */ new WeakMap();
a = /* @__PURE__ */ new WeakSet();
v = function() {
  l(this, o) && (this.observe(l(this, o).propertyEditorUiAlias, (t) => {
    this._propertyEditorUiAlias = t;
  }), this.observe(l(this, o).propertyEditorSchemaAlias, (t) => {
    this._propertyEditorSchemaAlias = t;
  }), this.observe(l(this, o).propertyEditorUiName, (t) => {
    this._propertyEditorUiName = t;
  }), this.observe(l(this, o).propertyEditorUiIcon, (t) => {
    this._propertyEditorUiIcon = t;
  }));
};
h = async function() {
  var e;
  const r = await (await this.getContext(C)).open(this, k, {
    value: {
      selection: this._propertyEditorUiAlias ? [this._propertyEditorUiAlias] : []
    }
  }).onSubmit().catch(() => {
  });
  r && ((e = l(this, o)) == null || e.setPropertyEditorUiAlias(r.selection[0]));
};
A = function() {
  return y`
			<umb-property-layout
				data-mark="property:editorUiAlias"
				label="Property Editor"
				description=${this.localize.term("propertyEditorPicker_title")}>
				<uui-button
					slot="editor"
					id="btn-add"
					label=${this.localize.term("propertyEditorPicker_title")}
					look="placeholder"
					color="default"
					required
					${g(this)}
					@click=${n(this, a, h)}></uui-button>
			</umb-property-layout>
		`;
};
b = function() {
  return !this._propertyEditorUiAlias || !this._propertyEditorSchemaAlias ? E : y`
			<umb-property-layout
				data-mark="property:editorUiAlias"
				label="Property Editor"
				description=${this.localize.term("propertyEditorPicker_title")}>
				<umb-ref-property-editor-ui
					slot="editor"
					name=${this._propertyEditorUiName ?? ""}
					alias=${this._propertyEditorUiAlias}
					property-editor-schema-alias=${this._propertyEditorSchemaAlias}
					standalone
					@open=${n(this, a, h)}>
					${this._propertyEditorUiIcon ? y`<umb-icon name=${this._propertyEditorUiIcon} slot="icon"></umb-icon>` : E}
					<uui-action-bar slot="actions">
						<uui-button
							label=${this.localize.term("general_change")}
							@click=${n(this, a, h)}></uui-button>
					</uui-action-bar>
				</umb-ref-property-editor-ui>
			</umb-property-layout>
		`;
};
i.styles = [P];
s([
  $()
], i.prototype, "value", 2);
s([
  c()
], i.prototype, "dataTypes", 2);
s([
  c()
], i.prototype, "_propertyEditorUiIcon", 2);
s([
  c()
], i.prototype, "_propertyEditorUiName", 2);
s([
  c()
], i.prototype, "_propertyEditorUiAlias", 2);
s([
  c()
], i.prototype, "_propertyEditorSchemaAlias", 2);
i = s([
  w(M)
], i);
const G = i;
export {
  i as WysiwgDatatypePickerPropertyEditor,
  G as default
};
//# sourceMappingURL=wysiwg-datatype-picker.element-BKj-4eik.js.map
