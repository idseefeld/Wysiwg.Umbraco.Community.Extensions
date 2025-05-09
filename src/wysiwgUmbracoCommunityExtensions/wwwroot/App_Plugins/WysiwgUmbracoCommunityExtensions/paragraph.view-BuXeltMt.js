import { UmbTextStyles as v } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as y, html as m, css as c, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { W as f } from "./wysiwg-base-block-editor-custom.view-BP--8Rci.js";
var x = Object.getOwnPropertyDescriptor, u = (n, a, r, o) => {
  for (var i = o > 1 ? void 0 : o ? x(a, r) : a, e = n.length - 1, s; e >= 0; e--)
    (s = n[e]) && (i = s(i) || i);
  return i;
};
const k = "wysiwg-block-paragraph-view";
let g = class extends f {
  render() {
    var e, s, w, p;
    let n = { value: "" }, a = "";
    if ((e = this.datasetSettings) != null && e.length) {
      const l = this.layout, t = ((w = ((s = this.datasetSettings.filter(
        (h) => (l == null ? void 0 : l.settingsKey) === h.key
      )[0]) == null ? void 0 : s.values).filter((h) => h.alias === "color")[0]) == null ? void 0 : w.value) ?? n;
      t != null && t.value && (a = `color: ${t == null ? void 0 : t.value};`);
    }
    a && (a = `style="${a}"`);
    var r = (p = this.content) == null ? void 0 : p.text, o = r == null ? void 0 : r.markup;
    const i = `<div class="paragraph" ${a}>${o}</div>`;
    return m`${y(i)}`;
  }
};
g.styles = [
  v,
  c`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      .paragraph {
        font-size: var(--wysiwg-font-size-16);
        line-height: var(--wysiwg-line-height-24);
        text-shadow: var(--wysiwg-paragraph-text-shadow, none);
      }
      h2, h3{
        color: var(--wysiwg-paragraph-headline-color, inherit);
        text-shadow: var(--wysiwg-paragraph-headline-text-shadow, none);
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

      a{
        color: inherit;
        text-decoration: var(--wysiwg-link-text-decoration, underline);
      }

      a:hover{
        color: var(--wysiwg-link-hover-color, inherit);
      }
    `
];
g = u([
  d(k)
], g);
const E = g;
export {
  g as WysiwgBlockParagraphView,
  E as default
};
//# sourceMappingURL=paragraph.view-BuXeltMt.js.map
