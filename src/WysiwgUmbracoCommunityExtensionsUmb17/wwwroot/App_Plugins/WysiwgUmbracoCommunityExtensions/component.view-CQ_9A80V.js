import { unsafeHTML as u, html as y, css as h, state as a, property as m, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { W as l } from "./wysiwg-base-block-editor-custom.view-Cn6p_o0v.js";
import { p as g } from "./sdk.gen-CBXr3l_Z.js";
var f = Object.defineProperty, w = Object.getOwnPropertyDescriptor, n = (i, o, r, s) => {
  for (var t = s > 1 ? void 0 : s ? w(o, r) : o, p = i.length - 1, c; p >= 0; p--)
    (c = i[p]) && (t = (s ? c(o, r, t) : c(t)) || t);
  return s && t && f(o, r, t), t;
};
const k = "wysiwg-generic-component-view";
let e = class extends l {
  constructor() {
    super(...arguments), this.markup = "", this.selectedComponent = void 0;
  }
  render() {
    return this.getMarkup(), y`${u(this.setEditorLink(this.markup))}`;
  }
  async getMarkup() {
    if (this.settings = this.getLayoutSettings(), this.selectedComponent = this.content?.componentPicker[0]?.selectedValue, !this.selectedComponent) {
      this.markup = "<em>[no component selected]</em>";
      return;
    }
    const o = { body: {
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
    } }, { data: r, error: s } = await g(o);
    s ? this.markup = `<em>[error fetching markup for ${this.selectedComponent}]</em>` : this.markup = r?.toString() ?? "<em>[no markup returned]</em>";
  }
};
e.styles = [
  l.baseStyles,
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
n([
  a()
], e.prototype, "markup", 2);
n([
  a()
], e.prototype, "selectedComponent", 2);
n([
  m()
], e.prototype, "contentKey", 2);
n([
  m()
], e.prototype, "culture", 2);
n([
  m({ type: Object })
], e.prototype, "blockType", 2);
e = n([
  d(k)
], e);
const P = e;
export {
  e as WysiwgGenericComponentView,
  P as default
};
//# sourceMappingURL=component.view-CQ_9A80V.js.map
