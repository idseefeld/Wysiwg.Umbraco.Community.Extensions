import { unsafeHTML as l, html as y, css as h, state as a, property as m, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { W as u } from "./wysiwg-base-block-editor-custom.view-Cn6p_o0v.js";
import { p as f } from "./sdk.gen-CBXr3l_Z.js";
import { UMB_PROPERTY_DATASET_CONTEXT as g } from "@umbraco-cms/backoffice/property";
var k = Object.defineProperty, w = Object.getOwnPropertyDescriptor, i = (e, s, n, r) => {
  for (var o = r > 1 ? void 0 : r ? w(s, n) : s, p = e.length - 1, c; p >= 0; p--)
    (c = e[p]) && (o = (r ? c(s, n, o) : c(o)) || o);
  return r && o && k(s, n, o), o;
};
const C = "wysiwg-generic-component-view";
let t = class extends u {
  constructor() {
    super(), this.selectedComponent = void 0, this.markup = "", this.consumeContext(g, (e) => {
      e && (this.culture = e.getVariantId().culture ?? "", this.getMarkup());
    });
  }
  render() {
    const e = this.content?.componentPicker ?? [];
    return this.selectedComponent !== e && (this.selectedComponent = e, this.getMarkup()), y`${l(this.setEditorLink(this.markup))}`;
  }
  async getMarkup() {
    if (this.settings = this.getLayoutSettings(), !this.selectedComponent) {
      this.markup = "<em>[no component selected]</em>";
      return;
    }
    const s = { body: {
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
    } }, { data: n, error: r } = await f(s);
    r ? this.markup = `<em>[error fetching markup for ${this.selectedComponent}]</em>` : this.markup = n ? n.toString() : "<em>[no markup returned]</em>";
  }
};
t.styles = [
  u.baseStyles,
  h`
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
  a()
], t.prototype, "selectedComponent", 2);
i([
  a()
], t.prototype, "culture", 2);
i([
  m({ attribute: !1 })
], t.prototype, "markup", 2);
i([
  m()
], t.prototype, "contentKey", 2);
i([
  m({ type: Object })
], t.prototype, "blockType", 2);
t = i([
  d(C)
], t);
const _ = t;
export {
  t as WysiwgGenericComponentView,
  _ as default
};
//# sourceMappingURL=generic-component.view-C848YlHc.js.map
