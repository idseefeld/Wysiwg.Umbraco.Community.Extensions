import { repeat as P, html as h, css as O, query as M, state as S, property as V, customElement as L } from "@umbraco-cms/backoffice/external/lit";
import { UmbTextStyles as R } from "@umbraco-cms/backoffice/style";
import { UmbLitElement as H } from "@umbraco-cms/backoffice/lit-element";
import { generateAlias as x } from "@umbraco-cms/backoffice/utils";
import { UmbSorterController as T } from "@umbraco-cms/backoffice/sorter";
import { UmbChangeEvent as g } from "@umbraco-cms/backoffice/event";
var F = Object.defineProperty, G = Object.getOwnPropertyDescriptor, A = (e) => {
  throw TypeError(e);
}, d = (e, t, a, l) => {
  for (var i = l > 1 ? void 0 : l ? G(t, a) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (i = (l ? r(t, a, i) : r(i)) || i);
  return l && i && F(t, a, i), i;
}, b = (e, t, a) => t.has(e) || A("Cannot " + a), E = (e, t, a) => (b(e, t, "read from private field"), a ? a.call(e) : t.get(e)), v = (e, t, a) => t.has(e) ? A("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), N = (e, t, a, l) => (b(e, t, "write to private field"), t.set(e, a), a), p = (e, t, a) => (b(e, t, "access private method"), a), f, m, o, I, $, z, q, k, U;
const B = "wysiwg-property-editor-ui-image-crops";
let u = class extends H {
  constructor() {
    super(...arguments), v(this, o), this._value = [], this.editCropAlias = "", v(this, f, ""), v(this, m, new T(this, {
      getUniqueOfElement: (e) => e.dataset.alias,
      getUniqueOfModel: (e) => e.alias,
      identifier: "Umb.SorterIdentifier.ImageCrops",
      itemSelector: ".crop",
      containerSelector: ".crops",
      onChange: ({ model: e }) => {
        const t = this._value;
        this._value = e, this.requestUpdate("_value", t), this.dispatchEvent(new g());
      }
    }));
  }
  set value(e) {
    this._value = e ?? [], E(this, m).setModel(this.value);
  }
  get value() {
    return this._value;
  }
  render() {
    return this.value || (this.value = []), h`
			<uui-form>
				<form @submit=${p(this, o, q)}>
					<div class="input">
            <uui-toggle pristine="" label-position="top" id="defaultCrop" name="defaultCrop" label="Default">
              <b>Default</b>
            </uui-toggle>
          </div>
					<div class="input">
						<uui-label for="label">Label</uui-label>
						<uui-input
							@input=${p(this, o, U)}
							label="Label"
							id="label"
							name="label"
							type="text"
							autocomplete="false"
							value=""></uui-input>
					</div>
					<div class="input">
						<uui-label for="alias">Alias</uui-label>
						<uui-input label="Alias" id="alias" name="alias" type="text" autocomplete="false" value=""></uui-input>
					</div>
					<div class="input">
						<uui-label for="width">Width</uui-label>
						<uui-input label="Width" id="width" name="width" type="number" autocomplete="false" value="" min="0">
							<span class="append" slot="append">px</span>
						</uui-input>
					</div>
					<div class="input">
						<uui-label for="height">Height</uui-label>
						<uui-input label="Height" id="height" name="height" type="number" autocomplete="false" value="" min="0">
							<span class="append" slot="append">px</span>
						</uui-input>
					</div>
					<div class="action-wrapper">${p(this, o, k).call(this)}</div>
				</form>
			</uui-form>
			<div class="crops">
				${P(
      this.value,
      (e) => e.alias,
      (e) => h`
						<div class="crop" data-alias="${e.alias}">
							<span class="crop-drag">+</span>
							<span><strong>${e.label}</strong> <em>(${e.alias})</em></span>
							<span class="crop-size">(${e.width} x ${e.height}px)</span>
              <span class="crop-default">${e.defaultCrop ? "default crop" : ""}</span>
							<div class="crop-actions">
								<uui-button
									label=${this.localize.term("general_edit")}
									color="default"
									@click=${() => p(this, o, $).call(this, e)}></uui-button>
								<uui-button
									label=${this.localize.term("general_remove")}
									color="danger"
									@click=${() => p(this, o, I).call(this, e.alias)}></uui-button>
							</div>
						</div>
					`
    )}
			</div>
		`;
  }
};
f = /* @__PURE__ */ new WeakMap();
m = /* @__PURE__ */ new WeakMap();
o = /* @__PURE__ */ new WeakSet();
I = function(e) {
  this.value = [...this.value.filter((t) => t.alias !== e)], this.dispatchEvent(new g());
};
$ = function(e) {
  var c;
  this.editCropAlias = e.alias;
  const t = (c = this.shadowRoot) == null ? void 0 : c.querySelector("form");
  if (!t) return;
  const a = t.querySelector("#label"), l = t.querySelector("#alias"), i = t.querySelector("#width"), s = t.querySelector("#height"), r = t.querySelector("#defaultCrop");
  !l || !i || !s || (a.value = e.label, l.value = e.alias, i.value = e.width.toString(), s.value = e.height.toString(), r.checked = e.defaultCrop);
};
z = function() {
  this.editCropAlias = "";
};
q = function(e) {
  var w;
  e.preventDefault();
  const t = e.target;
  if (!t || !t.checkValidity()) return;
  const a = new FormData(t), l = a.get("label"), i = a.get("alias"), s = a.get("width"), r = a.get("height"), c = !!a.get("defaultCrop");
  if (!l || !i || !s || !r) return;
  this.value || (this.value = []);
  const y = ((w = this.value.find((n) => n.defaultCrop)) == null ? void 0 : w.alias) ?? "", D = c === !0 && y !== "" && y !== i, _ = {
    label: l,
    alias: i,
    width: parseInt(s),
    height: parseInt(r),
    defaultCrop: c
  };
  if (this.editCropAlias) {
    const n = this.value.findIndex((W) => W.alias === this.editCropAlias);
    if (n === -1) return;
    const C = [...this.value];
    C[n] = _, this.value = [...C], this.editCropAlias = "";
  } else
    this.value = [...this.value, _];
  D && (this.value = [...this.value.map((n) => ({ ...n, defaultCrop: n.alias === i }))]), this.dispatchEvent(new g()), t.reset(), this._labelInput.focus();
};
k = function() {
  return this.editCropAlias ? h`<uui-button @click=${p(this, o, z)}>Cancel</uui-button>
					<uui-button look="secondary" type="submit" label="Save"></uui-button>` : h`<uui-button look="secondary" type="submit" label="Add"></uui-button>`;
};
U = function() {
  var i;
  const e = this._labelInput.value ?? "", t = x(e), a = (i = this.shadowRoot) == null ? void 0 : i.querySelector("#alias");
  if (!a) return;
  const l = x(E(this, f));
  (a.value === l || !a.value) && (a.value = t), N(this, f, e);
};
u.styles = [
  R,
  O`
			:host {
				display: block;
			}
			.crops {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-2);
				margin-top: var(--uui-size-space-4);
			}
			.crop {
				display: flex;
				align-items: center;
				background: var(--uui-color-background);
			}
			.crop-drag {
				cursor: grab;
				padding-inline: var(--uui-size-space-4);
				color: var(--uui-color-disabled-contrast);
				font-weight: bold;
			}
			.crop-size {
				font-size: 0.9em;
				padding-inline: var(--uui-size-space-4);
			}
      .crop-default {
        font-size: 0.9em;
				padding-inline: var(--uui-size-space-4);
        color: var(--uui-color-success-emphasis);
        size: 30px;
      }
			.crop-actions {
				display: flex;
				margin-left: auto;
			}
			form {
				display: flex;
				gap: var(--uui-size-space-2);
			}
			.input {
				display: flex;
				flex-direction: column;
			}
			.append {
				padding-inline: var(--uui-size-space-4);
				background: var(--uui-color-disabled);
				border-left: 1px solid var(--uui-color-border);
				color: var(--uui-color-disabled-contrast);
				font-size: 0.8em;
				display: flex;
				align-items: center;
			}
			.action-wrapper {
				display: flex;
				align-items: flex-end;
			}
		`
];
d([
  M("#label")
], u.prototype, "_labelInput", 2);
d([
  S()
], u.prototype, "_value", 2);
d([
  V({ type: Array })
], u.prototype, "value", 1);
d([
  S()
], u.prototype, "editCropAlias", 2);
u = d([
  L(B)
], u);
const j = u;
export {
  u as WysiwgPropertyEditorUIImageCropsElement,
  j as default
};
//# sourceMappingURL=wysiwg-image-crops.element-WzjeAO76.js.map
