import { UmbTextStyles as m } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as v, html as y, css as f, customElement as c } from "@umbraco-cms/backoffice/external/lit";
import { W as d } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
var u = Object.getOwnPropertyDescriptor, x = (n, i, s, g) => {
  for (var a = g > 1 ? void 0 : g ? u(i, s) : i, e = n.length - 1, r; e >= 0; e--)
    (r = n[e]) && (a = r(a) || a);
  return a;
};
const b = "wysiwg-block-paragraph-view";
let l = class extends d {
  render() {
    var e, r, p, w;
    let n = { value: "" }, i = "";
    if ((e = this.datasetSettings) != null && e.length) {
      const o = this.layout, t = ((p = ((r = this.datasetSettings.filter(
        (h) => (o == null ? void 0 : o.settingsKey) === h.key
      )[0]) == null ? void 0 : r.values).filter((h) => h.alias === "color")[0]) == null ? void 0 : p.value) ?? n;
      t != null && t.value && (i = `color: ${t == null ? void 0 : t.value};`);
    }
    i && (i = `style="${i}"`);
    var s = (w = this.content) == null ? void 0 : w.text, g = s == null ? void 0 : s.markup;
    const a = `<div class="paragraph" ${i}>${g}</div>`;
    return y`${v(a)}`;
  }
};
l.styles = [
  m,
  f`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }

      h2 {
        font-size: var(--wysiwg-font-size-24, 24px);
        line-height: var(--wysiwg-line-height-28, 28px);
        margin: var(--wysiwg-headline-paragraph-2-margin, 0);
      }

      h3 {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-headline-paragraph-3-margin, 0);
      }

      p
      {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-p-paragraph-margin, 0);
        padding: var(--wysiwg-p-paragraph-padding, 0);
      }
    `
];
l = x([
  c(b)
], l);
const E = l;
export {
  l as WysiwgBlockParagraphView,
  E as default
};
//# sourceMappingURL=paragraph.view-ChR31KwU.js.map
