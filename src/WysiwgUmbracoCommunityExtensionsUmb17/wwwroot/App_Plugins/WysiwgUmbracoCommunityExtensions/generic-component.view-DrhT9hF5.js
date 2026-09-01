import { unsafeHTML as l, html as h, css as y, state as m, property as c, customElement as f } from "@umbraco-cms/backoffice/external/lit";
import { W as a } from "./wysiwg-base-block-editor-custom.view-CCHW93dJ.js";
import { p as d } from "./sdk.gen-CBXr3l_Z.js";
import { UMB_PROPERTY_DATASET_CONTEXT as g } from "@umbraco-cms/backoffice/property";
import { UMB_WORKSPACE_CONTEXT as k } from "@umbraco-cms/backoffice/workspace";
var C = Object.defineProperty, w = Object.getOwnPropertyDescriptor, i = (e, t, s, n) => {
  for (var r = n > 1 ? void 0 : n ? w(t, s) : t, p = e.length - 1, u; p >= 0; p--)
    (u = e[p]) && (r = (n ? u(t, s, r) : u(r)) || r);
  return n && r && C(t, s, r), r;
};
const v = "wysiwg-generic-component-view";
let o = class extends a {
  constructor() {
    super(), this.selectedComponent = void 0, this.markup = "", this.consumeContext(g, (e) => {
      e && (this.culture = e.getVariantId().culture ?? "", this.culture ? this.getMarkup() : this.consumeContext(k, (t) => {
        if (t) {
          const s = t.languages;
          this.culture = s?.source.value.find((n) => n.isDefault)?.unique ?? "", this.getMarkup();
        }
      }));
    });
  }
  render() {
    const e = this.content?.componentPicker ?? [];
    return this.selectedComponent !== e && (this.selectedComponent = e, this.getMarkup()), h`${l(this.setEditorLink(this.markup))}`;
  }
  async getMarkup() {
    if (this.settings = this.getLayoutSettings(), !this.selectedComponent) {
      this.markup = "<em>[no component selected]</em>";
      return;
    }
    const t = { body: {
      data: {
        contentTypeKey: this.blockType?.contentElementTypeKey ?? "",
        // "89bb2397-1aac-417f-9e1c-7f3ac0884999",
        key: this.contentKey ?? "",
        //"744f4fd0-c0e1-4512-9422-16822b87ac75",
        values: [
          {
            value: this.selectedComponent,
            alias: "componentPicker"
          }
        ]
      },
      pageKey: this.documentUnique,
      // ?? "df06978c-4e12-4205-b020-ba3dccf1fb5a",
      culture: this.culture ?? ""
    } }, { data: s, error: n } = await d(t);
    n ? this.markup = `<em>[error fetching markup for ${this.selectedComponent}]</em>` : this.markup = s ? s.toString() : "<em>[no markup returned]</em>";
  }
};
o.styles = [
  a.baseStyles,
  y`
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
i([
  m()
], o.prototype, "selectedComponent", 2);
i([
  m()
], o.prototype, "culture", 2);
i([
  c({ attribute: !1 })
], o.prototype, "markup", 2);
i([
  c()
], o.prototype, "contentKey", 2);
i([
  c({ type: Object })
], o.prototype, "blockType", 2);
o = i([
  f(v)
], o);
const M = o;
export {
  o as WysiwgGenericComponentView,
  M as default
};
//# sourceMappingURL=generic-component.view-DrhT9hF5.js.map
