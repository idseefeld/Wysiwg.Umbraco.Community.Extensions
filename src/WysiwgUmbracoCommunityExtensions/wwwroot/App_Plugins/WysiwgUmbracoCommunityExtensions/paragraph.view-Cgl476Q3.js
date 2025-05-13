import { UmbTextStyles as c } from "@umbraco-cms/backoffice/style";
import { unsafeHTML as d, html as f, css as x, customElement as u } from "@umbraco-cms/backoffice/external/lit";
import { W as k } from "./wysiwg-base-block-editor-custom.view-NTK5T3_I.js";
var z = Object.getOwnPropertyDescriptor, b = (o, i, t, g) => {
  for (var a = g > 1 ? void 0 : g ? z(i, t) : i, e = o.length - 1, s; e >= 0; e--)
    (s = o[e]) && (a = s(a) || a);
  return a;
};
const $ = "wysiwg-block-paragraph-view";
let l = class extends k {
  render() {
    var e, s, p, v, y;
    let o = { value: "" }, i = "";
    if ((e = this.datasetSettings) != null && e.length) {
      const w = this.layout, h = (s = this.datasetSettings.filter(
        (n) => (w == null ? void 0 : w.settingsKey) === n.key
      )[0]) == null ? void 0 : s.values, r = ((p = h.filter((n) => n.alias === "color")[0]) == null ? void 0 : p.value) ?? o;
      r != null && r.value && (i = `color: ${r == null ? void 0 : r.value};`);
      const m = (((v = h == null ? void 0 : h.find((n) => n.alias === "minHeight")) == null ? void 0 : v.value) ?? "0").toString();
      m && (i += `min-height: ${m};`);
    }
    i && (i = `style="${i}"`);
    var t = (y = this.content) == null ? void 0 : y.text, g = t == null ? void 0 : t.markup;
    const a = `<div class="paragraph" ${i}>${g}</div>`;
    return f`${d(a)}`;
  }
};
l.styles = [
  c,
  x`
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
l = b([
  u($)
], l);
const P = l;
export {
  l as WysiwgBlockParagraphView,
  P as default
};
//# sourceMappingURL=paragraph.view-Cgl476Q3.js.map
