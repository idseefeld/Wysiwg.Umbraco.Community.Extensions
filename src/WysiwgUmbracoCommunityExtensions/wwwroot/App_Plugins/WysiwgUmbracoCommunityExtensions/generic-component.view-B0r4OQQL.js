import { css as l, state as m, property as c, customElement as h } from "@umbraco-cms/backoffice/external/lit";
import { W as u } from "./wysiwg-base-block-editor-custom.view-CxUo8Q00.js";
import { p as g } from "./sdk.gen-CBXr3l_Z.js";
import { UMB_PROPERTY_DATASET_CONTEXT as y } from "@umbraco-cms/backoffice/property";
import { UMB_WORKSPACE_CONTEXT as f } from "@umbraco-cms/backoffice/workspace";
var d = Object.defineProperty, v = Object.getOwnPropertyDescriptor, n = (t, e, i, r) => {
  for (var s = r > 1 ? void 0 : r ? v(e, i) : e, p = t.length - 1, a; p >= 0; p--)
    (a = t[p]) && (s = (r ? a(e, i, s) : a(s)) || s);
  return r && s && d(e, i, s), s;
};
const w = "wysiwg-generic-component-view";
let o = class extends u {
  constructor() {
    super(), this.selectedComponent = void 0, this.previewImage = void 0, this.markup = "", this.consumeContext(y, (t) => {
      t && (this.culture = t.getVariantId().culture ?? "", this.culture ? this.getMarkup() : this.consumeContext(f, (e) => {
        if (e) {
          const i = e.languages;
          this.culture = i?.source.value.find((r) => r.isDefault)?.unique ?? "", this.getMarkup();
        }
      }));
    });
  }
  render() {
    const t = this.content, e = t?.componentPicker ?? [];
    return this.previewImage !== t?.previewImage && (this.previewImage = t?.previewImage ?? ""), this.selectedComponent !== e && (this.selectedComponent = e, this.getMarkup()), this.setEditorLink(this.markup);
  }
  async getMarkup() {
    if (!this.selectedComponent) {
      this.markup = "<em>[no component selected]</em>";
      return;
    }
    const e = { body: {
      data: {
        contentTypeKey: this.blockType?.contentElementTypeKey ?? "",
        key: this.contentKey ?? "",
        values: [
          {
            value: this.selectedComponent,
            alias: "componentPicker"
          },
          {
            value: this.previewImage,
            alias: "previewImage"
          }
        ]
      },
      pageKey: this.documentUnique,
      culture: this.culture ?? ""
    } }, { data: i, error: r } = await g(e);
    r ? this.markup = `<em>[error fetching markup for ${this.selectedComponent}]</em>` : this.markup = i ? i.toString() : "<em>[no markup returned]</em>";
  }
};
o.styles = [
  u.baseStyles,
  l`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
    `
];
n([
  m()
], o.prototype, "selectedComponent", 2);
n([
  m()
], o.prototype, "previewImage", 2);
n([
  m()
], o.prototype, "culture", 2);
n([
  c({ attribute: !1 })
], o.prototype, "markup", 2);
n([
  c()
], o.prototype, "contentKey", 2);
n([
  c({ type: Object })
], o.prototype, "blockType", 2);
o = n([
  h(w)
], o);
const P = o;
export {
  o as WysiwgGenericComponentView,
  P as default
};
//# sourceMappingURL=generic-component.view-B0r4OQQL.js.map
