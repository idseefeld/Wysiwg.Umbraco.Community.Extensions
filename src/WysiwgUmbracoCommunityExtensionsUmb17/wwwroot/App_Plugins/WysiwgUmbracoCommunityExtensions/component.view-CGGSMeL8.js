import { UmbTextStyles as l } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as c, html as a, css as p, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { W as f } from "./wysiwg-base-block-editor-custom.view-ChCFhrhJ.js";
var w = Object.getOwnPropertyDescriptor, g = (e, t, m, i) => {
  for (var n = i > 1 ? void 0 : i ? w(t, m) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = r(n) || n);
  return n;
};
const y = "wysiwg-generic-component-view";
let o = class extends f {
  render() {
    let e = this.content?.componentPicker[0]?.selectedValue;
    e || (e = "<em>[no component selected]</em>");
    const t = `<div class="component">${e}</div>`;
    return a`${c(t)}`;
  }
};
o.styles = [
  l,
  p`
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
o = g([
  d(y)
], o);
const h = o;
export {
  o as WysiwgGenericComponentView,
  h as default
};
//# sourceMappingURL=component.view-CGGSMeL8.js.map
