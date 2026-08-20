import { unsafeHTML as l, html as u, css as y, state as h, property as p, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { W as a } from "./wysiwg-base-block-editor-custom.view-Cn6p_o0v.js";
import { p as f } from "./sdk.gen-CBXr3l_Z.js";
var g = Object.defineProperty, k = Object.getOwnPropertyDescriptor, i = (t, n, s, r) => {
  for (var o = r > 1 ? void 0 : r ? k(n, s) : n, c = t.length - 1, m; c >= 0; c--)
    (m = t[c]) && (o = (r ? m(n, s, o) : m(o)) || o);
  return r && o && g(n, s, o), o;
};
const w = "wysiwg-generic-component-view";
let e = class extends a {
  constructor() {
    super(...arguments), this.selectedComponent = void 0, this.markup = "";
  }
  render() {
    const t = this.content?.componentPicker ?? [];
    return t.length && this.selectedComponent !== t && (this.selectedComponent = t, this.getMarkup()), u`${l(this.setEditorLink(this.markup))}`;
  }
  async getMarkup() {
    if (this.settings = this.getLayoutSettings(), this.selectedComponent = this.content?.componentPicker, !this.selectedComponent) {
      this.markup = "<em>[no component selected]</em>";
      return;
    }
    const n = { body: {
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
    } }, { data: s, error: r } = await f(n);
    r ? this.markup = `<em>[error fetching markup for ${this.selectedComponent}]</em>` : this.markup = s ? s.toString() : "<em>[no markup returned]</em>";
  }
};
e.styles = [
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
  h()
], e.prototype, "selectedComponent", 2);
i([
  p({ attribute: !1 })
], e.prototype, "markup", 2);
i([
  p()
], e.prototype, "contentKey", 2);
i([
  p()
], e.prototype, "culture", 2);
i([
  p({ type: Object })
], e.prototype, "blockType", 2);
e = i([
  d(w)
], e);
const P = e;
export {
  e as WysiwgGenericComponentView,
  P as default
};
//# sourceMappingURL=component.view-BaircXRm.js.map
